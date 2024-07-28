import supabase from "../../supabase-client";

const messageSlice = (set: any, get: any) => ({
    messages: [],
    loading: false,
    error: null,
    chats: [],

    fetchAllChats: async () => {
        let { data: chats, error } = await supabase.rpc("fetch_all_chats");
        if (error) {
            console.error(error);
            set({ error });
            set({ loading: false });
            return null;
        }
        set({ loading: false });
        set({ chats: chats });
        return chats;
    },
    realTimeMessages: async (chatId: number) => {
        supabase
            .channel("table-db-changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "messages",
                },
                (payload: any) => {
                    if (chatId === payload.new.entity_id) {
                        get().getMessages(payload.new.entity_id);
                    }
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "message_participants",
                },
                () => {
                    // TODO: Update messages notification count
                    get().fetchAllChats();
                }
            )
            .subscribe();
    },
    getMessages: async (p_entity_id: number) => {
        let { data: messages, error } = await supabase.rpc(
            "get_messages",
            {
                p_entity_id,
            }
        );
        if (error) {
            console.error(error);
            set({ error });
            set({ loading: false });
            return null;
        }
        set({ loading: false });
        set({ messages: messages });
        return messages;
    },
    createMessage: async (payload: any) => {
        set({ loading: true });
        const messagePayload = {
            content: payload.content,
            entity_id: payload.entity_id,
            entity_type: payload.entity_type,
            is_public: payload.is_public
        };
        const { data: newMessage, error: newMessageError } = await supabase
            .from("messages")
            .insert(messagePayload)
            .select()
            .single();

        if (newMessageError) {
            set({ error: newMessageError });
            set({ loading: false });
            console.error("Error inserting message:", newMessageError);
            return newMessageError;
        }
        const participantPayload = {
            user_id: payload.user_id,
            read_status: false,
            participant_type: "sender",
            message_id: newMessage?.id,
        };
        const { data: newParticipant, error: newParticipantError } = await supabase
            .from("message_participants")
            .insert(participantPayload)
            .select()
            .single();

        if (newParticipantError) {
            set({ error: newParticipantError });
            set({ loading: false });
            console.error("Error creating participant", newParticipantError);
            return newParticipantError;
        }
        get().fetchAllChats();
        get().getMessages(payload.entity_id);
        set({ loading: false });
        return newParticipant;
    },
});

export default messageSlice;
