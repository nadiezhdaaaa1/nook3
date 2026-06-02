import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchesQueryOptions, useUpdateSearchMutation } from "./searches";
import { profileQueryOptions } from "./profile";
import { useAppStore } from "@/lib/store";
import type { Search } from "@/lib/store";

/**
 * Hydrates the zustand store from Supabase on mount and pushes per-search
 * changes back to the DB via a debounced auto-save.
 *
 * Hybrid model:
 *  - DB is the durable source of truth (persistence across devices).
 *  - Zustand remains the in-memory editing buffer (no rewrite of components).
 *  - On hydration: DB rows overwrite local state once.
 *  - On subsequent local changes: debounced patch flushed to DB.
 */
export function useDbSync() {
  const searchesQ = useQuery(searchesQueryOptions());
  const profileQ = useQuery(profileQueryOptions());
  const updateMutation = useUpdateSearchMutation();

  const hydratedRef = useRef(false);
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
    isHydrating: !hydratedRef.current && (searchesQ.isLoading || profileQ.isLoading),
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
