import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchesQueryOptions, useUpdateSearchMutation, useCreateSearchMutation } from "./searches";
import { profileQueryOptions, syncDeletionStateToStore } from "./profile";
import { useAppStore, getDefaultSearchName, hydrateOnboardingFromSearch } from "@/lib/store";
import type { Search } from "@/lib/store";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { useHasSession } from "./useHasSession";


/**
 * Hydrates the zustand store from Supabase on mount and pushes per-search
 * changes back to the DB via a debounced auto-save.
 *
 * Hybrid model:
 *  - DB is the durable source of truth (persistence across devices).
 *  - Zustand remains the in-memory editing buffer (no rewrite of components).
 *  - On hydration: DB rows overwrite local state once.
 *  - On subsequent local changes: debounced patch flushed to DB.
 *  - First sign-in after onboarding: the onboarding answers are persisted as
 *    the account's first Search.
 */
export function useDbSync() {
  const hasSession = useHasSession();
  const searchesQ = useQuery({ ...searchesQueryOptions(), enabled: hasSession, retry: false });
  const profileQ = useQuery({ ...profileQueryOptions(), enabled: hasSession, retry: false });
  const updateMutation = useUpdateSearchMutation();
  const createMutation = useCreateSearchMutation();


  const hydratedRef = useRef(false);
  const handoffRef = useRef(false);
  const lastSyncedRef = useRef<Map<string, string>>(new Map());


  // 1) Hydration: replace zustand state with DB data once both queries resolve.
  useEffect(() => {
    if (hydratedRef.current) return;
    if (!searchesQ.data || !profileQ.data) return;
    const rows = searchesQ.data as Search[];
    const profile = profileQ.data;
    const active =
      rows.find((s) => s.status !== "archived") ?? rows[0] ?? null;

    // Replace state without going through individual setters.
    useAppStore.setState({
      user: profile
        ? {
            id: profile.id,
            email: profile.email,
            emailVerified: profile.emailVerified,
            phone: profile.phone,
            phoneVerified: profile.phoneVerified,
            timezone: profile.timezone,
            plan: profile.plan as any,
            billingCycle: profile.billingCycle as any,
            trialActive: profile.trialActive,
            trialStartedAt: profile.trialStartedAt,
            trialEndsAt: profile.trialEndsAt,
            moveOut: profile.moveOut,
            referralCode: profile.referralCode,
            isAffiliate: profile.isAffiliate,
            completedAt: profile.completedAt,
            hasPassword: profile.hasPassword,
            deletionRequestedAt: profile.deletionRequestedAt,
            deletionScheduledAt: profile.deletionScheduledAt,
            subscriptionCanceledAt: profile.subscriptionCanceledAt,
            subscriptionPeriodEnd: profile.subscriptionPeriodEnd,
          }
        : null,
      searches: rows,
      activeSearchId: active?.id ?? null,
    });
    // Load the active search into the live editing buffer so the first local
    // edit can't push stale/blank values (notably a default city) onto it.
    if (active && useOnboardingStore.getState().editingSearchId !== "draft") {
      hydrateOnboardingFromSearch(active);
    }
    // Seed sync cache so we don't echo hydrated rows back to DB.
    const cache = new Map<string, string>();
    for (const s of rows) cache.set(s.id, serializePatch(s));
    lastSyncedRef.current = cache;
    hydratedRef.current = true;
    // The account already owns searches, so the onboarding answers were
    // already handed off — never re-insert them later.
    if (rows.length > 0) useOnboardingStore.getState().setHandoffCompleted(true);
  }, [searchesQ.data, profileQ.data]);

  // 1a) Keep deletion / subscription state fresh after hydration: any later
  // profile refetch (mutation invalidation, tab focus, other device) mirrors
  // onto the store so UI reading the store doesn't need a page reload.
  useEffect(() => {
    if (!profileQ.data) return;
    syncDeletionStateToStore(profileQ.data as any);
  }, [profileQ.data]);

  // 1b) Onboarding handoff: the account has no searches yet, but the browser
  // still holds the onboarding answers — persist them as the first Search.
  useEffect(() => {
    if (handoffRef.current) return;
    if (!searchesQ.data || !profileQ.data) return;
    if ((searchesQ.data as Search[]).length > 0) return;

    const o = useOnboardingStore.getState();
    if (!o.city) return;
    // One-time per account: once the answers have been persisted (or the user
    // has deleted searches), an empty list must stay empty.
    if (o.handoffCompleted) return;
    if (useAppStore.getState().deletedSearchIds.length > 0) {
      useOnboardingStore.getState().setHandoffCompleted(true);
      return;
    }

    handoffRef.current = true;
    useOnboardingStore.getState().setHandoffCompleted(true);
    createMutation.mutate({
      name: getDefaultSearchName(o.city, []),
      cityId: o.city,
      budget: o.budget,
      moveIn: o.moveIn,
      bedrooms: o.bedrooms,
      bathrooms: o.bathrooms,
      rentProtection: o.rentProtection,
      includeBrokerFee: o.includeBrokerFee,
      neighborhoods: o.neighborhoods,
      amenities: o.amenities,
      transit: o.transit,
      commute: o.commute,
      alertChannel: "email",
      frequency: o.frequency,
    });
    // Re-hydrate from the DB once the insert lands.
    hydratedRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchesQ.data, profileQ.data]);



  // 1c) Reconcile searches that were created locally but never persisted
  // (non-uuid ids). Without a real row id, saved/disliked listings can't be
  // attached to them. Adopt a matching DB row, or insert one.
  const reconciledRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (!searchesQ.data) return;
    const rows = searchesQ.data as Search[];
    const tombstones = new Set(useAppStore.getState().deletedSearchIds);
    const locals = useAppStore
      .getState()
      .searches.filter((s) => !isUuid(s.id) && !tombstones.has(s.id));
    for (const local of locals) {
      const match = rows.find(
        (r) => r.name.trim().toLowerCase() === local.name.trim().toLowerCase(),
      );
      if (match) {
        useAppStore.getState().adoptServerSearch(local.id, match);
        continue;
      }
      if (reconciledRef.current.has(local.id)) continue;
      reconciledRef.current.add(local.id);
      createMutation.mutate({
        name: local.name,
        cityId: local.cityId,
        status: local.status,
        budget: local.budget,
        moveIn: local.moveIn,
        bedrooms: local.bedrooms,
        bathrooms: local.bathrooms,
        rentProtection: local.rentProtection,
        includeBrokerFee: local.includeBrokerFee,
        neighborhoods: local.neighborhoods,
        amenities: local.amenities,
        transit: local.transit,
        commute: local.commute,
        alertChannel: local.alertChannel,
        frequency: local.frequency,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchesQ.data, hydratedRef.current]);

  // 2) Debounced auto-save on local search changes.
  useEffect(() => {
    if (!hydratedRef.current) return;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const unsub = useAppStore.subscribe((state, prev) => {
      if (state.searches === prev.searches) return;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => flushDirtySearches(), 800);
    });

    const flushDirtySearches = () => {
      const current = useAppStore.getState().searches;
      const cache = lastSyncedRef.current;
      for (const s of current) {
        // skip non-uuid local ids (created before DB sync); the createSearch
        // mutation path is responsible for inserting those.
        if (!isUuid(s.id)) continue;
        const sig = serializePatch(s);
        if (cache.get(s.id) === sig) continue;
        cache.set(s.id, sig);
        updateMutation.mutate({
          id: s.id,
          patch: toPatch(s),
        });
      }
    };

    return () => {
      unsub();
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydratedRef.current]);

  return {
    isHydrating:
      hasSession && !hydratedRef.current && (searchesQ.isLoading || profileQ.isLoading),

    error: searchesQ.error ?? profileQ.error,
  };
}

function isUuid(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function toPatch(s: Search) {
  return {
    name: s.name,
    cityId: s.cityId,
    status: s.status,
    budget: s.budget,
    moveIn: s.moveIn,
    bedrooms: s.bedrooms,
    bathrooms: s.bathrooms,
    rentProtection: s.rentProtection,
    includeBrokerFee: s.includeBrokerFee,
    neighborhoods: s.neighborhoods,
    amenities: s.amenities,
    transit: s.transit,
    commute: s.commute,
    alertChannel: s.alertChannel,
    frequency: s.frequency,
  };
}

function serializePatch(s: Search) {
  return JSON.stringify(toPatch(s));
}
