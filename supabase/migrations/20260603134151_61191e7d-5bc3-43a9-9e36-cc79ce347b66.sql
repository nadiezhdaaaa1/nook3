-- =========================================================
-- Wren AI Chat: conversations + messages
-- =========================================================

-- 1) wren_conversations -----------------------------------
CREATE TABLE public.wren_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'New chat',
  scope_type text NOT NULL DEFAULT 'general'
    CHECK (scope_type IN ('general','search','listing','compare')),
  scope_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  search_id uuid REFERENCES public.searches(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wren_conversations TO authenticated;
GRANT ALL ON public.wren_conversations TO service_role;

ALTER TABLE public.wren_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wren_conv_select_own" ON public.wren_conversations
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "wren_conv_insert_own" ON public.wren_conversations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wren_conv_update_own" ON public.wren_conversations
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "wren_conv_delete_own" ON public.wren_conversations
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_wren_conv_user ON public.wren_conversations(user_id, updated_at DESC);
CREATE INDEX idx_wren_conv_search ON public.wren_conversations(search_id) WHERE search_id IS NOT NULL;

CREATE TRIGGER trg_wren_conv_updated_at
  BEFORE UPDATE ON public.wren_conversations
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 2) wren_messages ----------------------------------------
CREATE TABLE public.wren_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.wren_conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant','tool','system')),
  content text NOT NULL DEFAULT '',
  tool_calls jsonb,
  tool_results jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wren_messages TO authenticated;
GRANT ALL ON public.wren_messages TO service_role;

ALTER TABLE public.wren_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wren_msg_select_own" ON public.wren_messages
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "wren_msg_insert_own" ON public.wren_messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wren_msg_update_own" ON public.wren_messages
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "wren_msg_delete_own" ON public.wren_messages
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_wren_msg_conv ON public.wren_messages(conversation_id, created_at);
CREATE INDEX idx_wren_msg_user ON public.wren_messages(user_id, created_at DESC);