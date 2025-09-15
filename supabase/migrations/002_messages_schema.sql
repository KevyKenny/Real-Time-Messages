-- Messages schema for Real-Time-Messages app
-- Tables: messages, message_participants
-- RPCs: get_messages(p_entity_id), fetch_all_chats()

-- Helper: current_user_id() to map auth.uid() -> public.users.id
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS BIGINT AS $$
DECLARE
  v_user_id BIGINT;
BEGIN
  SELECT u.id INTO v_user_id
  FROM public.users u
  WHERE u.uuid = auth.uid();
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  entity_id BIGINT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('user', 'group')),
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Participants table
CREATE TABLE IF NOT EXISTS public.message_participants (
  id BIGSERIAL PRIMARY KEY,
  message_id BIGINT NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  participant_type TEXT NOT NULL CHECK (participant_type IN ('sender','recipient')),
  read_status BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
-- CREATE INDEX IF NOT EXISTS idx_messages_entity ON public.messages(entity_type, entity_id);
-- CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
-- CREATE INDEX IF NOT EXISTS idx_participants_message ON public.message_participants(message_id);
-- CREATE INDEX IF NOT EXISTS idx_participants_user ON public.message_participants(user_id);

-- RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_participants ENABLE ROW LEVEL SECURITY;

-- Simple policies to allow app usage
-- You may tighten these later as needed.
CREATE POLICY "Allow read messages for authenticated" ON public.messages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert messages for authenticated" ON public.messages
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow read participants for authenticated" ON public.message_participants
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert participants for authenticated" ON public.message_participants
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow update read_status by owner" ON public.message_participants
  FOR UPDATE TO authenticated
  USING (user_id = public.current_user_id())
  WITH CHECK (user_id = public.current_user_id());

-- RPC: get_messages(p_entity_id)
-- Returns rows with message_data and participant_data objects as expected by the frontend
CREATE OR REPLACE FUNCTION public.get_messages(p_entity_id BIGINT)
RETURNS TABLE (
  message_data JSONB,
  participant_data JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    jsonb_build_object(
      'id', m.id,
      'content', m.content,
      'timestamp', m.created_at
    ) AS message_data,
    jsonb_build_object(
      'user_id', mp.user_id,
      'first_name', u.first_name,
      'last_name', u.last_name,
      'avatar_url', u.avatar_url,
      'read_status', mp.read_status
    ) AS participant_data
  FROM public.messages m
  JOIN public.message_participants mp ON mp.message_id = m.id
  JOIN public.users u ON u.id = mp.user_id
  WHERE m.entity_type = 'user'
    AND m.entity_id = p_entity_id
  ORDER BY m.created_at ASC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- RPC: fetch_all_chats()
-- Returns latest message per conversation with chat_data, message_data, participant_data
CREATE OR REPLACE FUNCTION public.fetch_all_chats()
RETURNS TABLE (
  chat_data JSONB,
  message_data JSONB,
  participant_data JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH last_per_chat AS (
    SELECT DISTINCT ON (m.entity_id)
      m.id,
      m.entity_id,
      m.content,
      m.created_at
    FROM public.messages m
    WHERE m.entity_type = 'user'
    ORDER BY m.entity_id, m.created_at DESC
  )
  SELECT
    jsonb_build_object(
      'id', u.id,
      'first_name', u.first_name,
      'last_name', u.last_name
    ) AS chat_data,
    jsonb_build_object(
      'id', lpc.id,
      'content', lpc.content,
      'timestamp', lpc.created_at
    ) AS message_data,
    jsonb_build_object(
      'user_id', u.id,
      'first_name', u.first_name,
      'last_name', u.last_name,
      'avatar_url', u.avatar_url
    ) AS participant_data
  FROM last_per_chat lpc
  JOIN public.users u ON u.id = lpc.entity_id
  ORDER BY lpc.created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Grants
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.message_participants TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.messages_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.message_participants_id_seq TO authenticated;

