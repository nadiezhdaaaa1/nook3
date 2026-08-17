import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  dbRowToSearch,
  searchIdSchema,
  searchInputSchema,
  toDbRow,
  toUpdatePatch,
  updateInputSchema,
} from "@/lib/searches.shared";

export const listSearches = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("searches")
      .select("*")
      // legacy rows only: archiving no longer exists as a product concept
      .neq("status", "archived")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(dbRowToSearch);
  });

export const createSearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => searchInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const row = { ...toDbRow(data), user_id: context.userId };
    const { data: inserted, error } = await context.supabase
      .from("searches")
      .insert(row)
      .select("*")
      .single();
    if (error) {
      if (error.code === "23505") throw new Error("A search with that name already exists.");
      throw new Error(error.message);
    }
    return dbRowToSearch(inserted);
  });

export const updateSearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updateInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const patch = toUpdatePatch(data.patch);
    const { data: updated, error } = await context.supabase
      .from("searches")
      .update(patch as never)
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .select("*")
      .single();
    if (error) {
      if (error.code === "23505") throw new Error("A search with that name already exists.");
      throw new Error(error.message);
    }
    return dbRowToSearch(updated);
  });

export const deleteSearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => searchIdSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("searches")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const duplicateSearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => searchIdSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: src, error: fetchErr } = await context.supabase
      .from("searches")
      .select("*")
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .single();
    if (fetchErr || !src) throw new Error("Search not found");
    const { id: _id, created_at: _c, updated_at: _u, ...rest } = src as any;
    const copyName = `${(src as any).name} copy`.slice(0, 50);
    const { data: inserted, error } = await context.supabase
      .from("searches")
      .insert({ ...rest, name: copyName, status: "active" })
      .select("*")
      .single();
    if (error) {
      if (error.code === "23505") throw new Error("A copy already exists. Rename it first.");
      throw new Error(error.message);
    }
    return dbRowToSearch(inserted);
  });
