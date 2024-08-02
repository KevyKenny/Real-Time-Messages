import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonRouter,
  IonList
} from "@ionic/react";
import "./Messages.css";
import useStore from "../stores/useStore";
import { useState, useEffect } from "react";
import ListCardItem from "./Messages/ListCardItem";

const Messages: React.FC = () => {
  const [presentToast] = useIonToast();
  const navigation = useIonRouter();
  const [selectedChat, setSelectedChat] = useState<any>({});

  const {
    fetchAllChats,
    chats,
    realTimeMessages,
  } = useStore((state: any) => ({
    fetchAllChats: state.fetchAllChats,
    chats: state.chats,
    profile: state.profile,
    realTimeMessages: state.realTimeMessages,
  }));

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllChats();
      await realTimeMessages(parseInt(selectedChat?.id));
    };
    fetchData();
  }, [fetchAllChats, realTimeMessages, selectedChat]);

  const handleChatSelect = async (chat: any) => {
    setSelectedChat(chat);
    navigation.push(`/message/${chat?.id}`);
  };

  const singleUserContent = chats?.map((chat: any) => ({
    id: chat.chat_data.id,
    img: chat?.participant_data?.avatar_url,
    name: `${chat.chat_data.first_name} ${chat.chat_data.last_name} `,
    meta: chat.message_data.content,
    user_data: chat?.participant_data,
    chatId: chat.chat_data.id,
    timestamp: chat.message_data.timestamp
  }));

  return (
    <IonPage id="messages">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Messages</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Messages</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="inbox_user_list ion-padding">
          <IonList>
            {singleUserContent &&
              singleUserContent.map((conversation: any) => (
                <ListCardItem
                  key={conversation.id}
                  id={conversation.id}
                  avatar={conversation.img}
                  user_data={conversation.user_data}
                  title={conversation.name}
                  subtext={conversation.meta.split(' ').length > 6
                    ? `${conversation.meta.split(' ').slice(0, 6).join(' ')}...`
                    : conversation.meta
                  }
                  timestamp={conversation?.timestamp}
                  onClick={() => {
                    handleChatSelect(conversation);
                    setSelectedChat(conversation);
                  }}
                  onMarkAsRead={() => console.log("mark as read")}
                  onDelete={() => console.log("delete")}
                  active={selectedChat === conversation}
                />
              ))
            }
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Messages;
