import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonFooter,
    IonGrid,
    IonHeader,
    IonIcon,
    IonItem,
    IonList,
    IonPage,
    IonRow,
    IonTextarea,
    IonTitle,
    IonToolbar,
    useIonToast,
} from "@ionic/react";
import useStore from "../../stores/useStore";
import SingleChatboxReply from "./SingleChatboxReply";
import { sendOutline } from "ionicons/icons";

const ChatBoxxx: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [presentToast] = useIonToast();
    const [content, setContent] = useState<string>('');
    const [chat, setChat] = useState<any>();
    const {
        createMessage,
        profile,
        getMessages,
        messages,
        realTimeMessages,
        fetchAllChats,
        chats,
    } = useStore((state: any) => ({
        createMessage: state.createMessage,
        profile: state.profile,
        getMessages: state.getMessages,
        messages: state.messages,
        realTimeMessages: state.realTimeMessages,
        fetchAllChats: state.fetchAllChats,
        chats: state.chats,
    }));

    const matchingChat = chats.find(
        (chat: any) => (chat as
            {
                chat_data:
                { id: number }
            }).chat_data.id === parseInt(id)
    );

    useEffect(() => {
        const fetchData = async () => {
            await realTimeMessages(parseInt(id));
            await fetchAllChats();
            if (id) {
                setChat(matchingChat);
                await getMessages(parseInt(id));
            }
        };
        fetchData();
    }, [id, realTimeMessages, getMessages, fetchAllChats, matchingChat]);

    const handleSendMessage = async (messageText: string) => {
        if (!id) {
            presentToast({
                message: "You can't initiate outside a chat. Please try again later.",
                duration: 2000,
                color: "danger",
            });
            return;
        }

        const messagePayload = {
            content: messageText,
            entity_id: parseInt(id),
            entity_type: "user",
            is_public: true,
            user_id: profile.id,
        }

        const res = await createMessage(messagePayload);
        if (res) {
            await getMessages(parseInt(id));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSendMessage(content);
        setContent("");
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="messages" />
                    </IonButtons>
                    <div className="chat-header-container">
                        <IonTitle className="chat-header">
                            {chat?.chat_data?.first_name}{" "}{chat?.chat_data?.last_name}
                        </IonTitle>
                    </div>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {/* <div className="inbox-chatting-box">
                    <IonList className="chatting_content">
                        <SingleChatboxReply messages={messages} currentUser={profile} />
                    </IonList>
                </div> */}
                <>
                    <div className="messages-segement-section">
                        <div className="mi_text">
                            <div className="inbox_chatting_box">
                                <IonList className="chatting_content">
                                    <SingleChatboxReply
                                        messages={messages}
                                        currentUser={profile}
                                    />
                                </IonList>
                            </div>
                        </div>
                    </div>
                </>
            </IonContent>
            <IonFooter>
                <IonToolbar>
                    <div className="chatbox-content-container">
                        <div className="mi_text">
                            <form onSubmit={handleSubmit}>
                                <IonGrid>
                                    <IonRow>
                                        <IonCol>
                                            <IonItem>
                                                <IonTextarea
                                                    rows={1}
                                                    autoGrow
                                                    placeholder="Type your message here..."
                                                    className="form-control"
                                                    value={content}
                                                    onIonInput={(e) => setContent(e.detail.value!)}
                                                    required
                                                />
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="auto">
                                            <IonButton type="submit">
                                                Send
                                                <IonIcon
                                                    className="message-send-button"
                                                    icon={sendOutline}
                                                    style={{ marginLeft: 5 }}
                                                />
                                            </IonButton>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </form>
                        </div>
                    </div>
                </IonToolbar>
            </IonFooter>
        </IonPage >
    );
};

export default ChatBoxxx;

