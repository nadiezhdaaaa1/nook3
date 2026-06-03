import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };
type JsonObject = { [k: string]: JsonValue };

const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

const scopeSchema = z.object({
  type: z.enum(["general", "search", "listing", "compare"]).default("general"),
  data: z.record(z.string(), jsonValueSchema).default({}),
  searchId: z.string().uuid().optional().nullable(),
});

export type WrenScope = z.infer<typeof scopeSchema>;

export type WrenConversationRow = {
  id: string;
  title: string;
  scopeType: "general" | "search" | "listing" | "compare";
  scopeData: JsonObject;
  searchId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WrenMessageRow = {
  id: string;
  role: "user" | "assistant" | "tool" | "system";
  content: string;
  toolCalls: JsonValue | null;
  toolResults: JsonValue | null;
  createdAt: string;
};

/* ---------- list conversations ---------- */
export const listConversations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("wren_conversations")
      .select("id, title, scope_type, scope_data, search_id, created_at, updated_at")
      .order("updated_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    const rows: WrenConversationRow[] = (data ?? []).map((r) => ({
      id: r.id,
      title: r.title,
      scopeType: r.scope_type as WrenConversationRow["scopeType"],
      scopeData: (r.scope_data as JsonObject | null) ?? {},
      searchId: r.search_id,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
    return rows;
  });

/* ---------- create conversation ---------- */
export const createConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        title: z.string().min(1).max(200).default("New chat"),
        scope: scopeSchema.default({ type: "general", data: {} }),
      })
      .parse(input),
  )
  .handler(async ({ data, context }): Promise<WrenConversationRow> => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("wren_conversations")
      .insert({
        user_id: userId,
        title: data.title,
        scope_type: data.scope.type,
        scope_data: data.scope.data,
        search_id: data.scope.searchId ?? null,
      })
      .select("id, title, scope_type, scope_data, search_id, created_at, updated_at")
      .single();
    if (error || !row) throw new Error(error?.message ?? "Failed to create conversation");
    return {
      id: row.id,
      title: row.title,
      scopeType: row.scope_type as WrenConversationRow["scopeType"],
      scopeData: (row.scope_data as Record<string, unknown>) ?? {},
      searchId: row.search_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  });

/* ---------- get messages for conversation ---------- */
export const getMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ conversationId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }): Promise<WrenMessageRow[]> => {
    const { supabase } = context;
    const { data: rows, error } = await supabase
      .from("wren_messages")
      .select("id, role, content, tool_calls, tool_results, created_at")
      .eq("conversation_id", data.conversationId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r) => ({
      id: r.id,
      role: r.role as WrenMessageRow["role"],
      content: r.content,
      toolCalls: r.tool_calls,
      toolResults: r.tool_results,
      createdAt: r.created_at,
    }));
  });

/* ---------- delete conversation ---------- */
export const deleteConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ conversationId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase
      .from("wren_conversations")
      .delete()
      .eq("id", data.conversationId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/* ---------- update title ---------- */
export const renameConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        conversationId: z.string().uuid(),
        title: z.string().min(1).max(200),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase
      .from("wren_conversations")
      .update({ title: data.title })
      .eq("id", data.conversationId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
