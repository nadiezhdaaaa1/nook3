import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchesQueryOptions, useUpdateSearchMutation, useCreateSearchMutation } from "./searches";
import { profileQueryOptions } from "./profile";
import { useAppStore, getDefaultSearchName } from "@/lib/store";
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
          }
        : null,
      searches: rows,
      activeSearchId:
        rows.find((s) => s.status !== "archived")?.id ?? rows[0]?.id ?? null,
    });
    // Seed sync cache so we don't echo hydrated rows back to DB.
    const cache = new Map<string, string>();
    for (const s of rows) cache.set(s.id, serializePatch(s));
    lastSyncedRef.current = cache;
    hydratedRef.current = true;
  }, [searchesQ.data, profileQ.data]);

  // 1b) Onboarding handoff: the account has no searches yet, but the browser
  // still holds the onboarding answers — persist them as the first Search.
  useEffect(() => {
    if (handoffRef.current) return;
    if (!searchesQ.data || !profileQ.data) return;
    if ((searchesQ.data as Search[]).length > 0) return;

    const o = useOnboardingStore.getState();
    if (!o.city) return;

    handoffRef.current = true;
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
