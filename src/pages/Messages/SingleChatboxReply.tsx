import dayjs from "dayjs";
import { IonAvatar, IonText } from "@ionic/react";
import Avatar from "../../components/Avatar";
import "./SingleChatboxReply.css";

interface ContactsProps {
  messages: any[];
  currentUser: any;
}

const SingleChatboxReply: React.FC<ContactsProps> = ({
  messages,
  currentUser,
}) => {
  const currentUserId = currentUser?.id;

  const messageBody = messages?.map((message: any) => ({
    id: message?.message_data?.id,
    message: message?.message_data?.content,
    date: dayjs(message?.message_data?.timestamp).format("M/D/YYYY h:mm A"),
    url: message?.participant_data?.avatar_url,
    name: `${message?.participant_data?.first_name} ${message?.participant_data?.last_name}`,
    userId: message?.participant_data?.user_id,
    read_status: message?.participant?.read_status,
    user: message?.participant_data,
  }));

  return (
    <div className="chat-container">
      <ul className="chat-list">
        {messageBody?.map((msg, i) => (
          <li
            className={`chat-message ${currentUserId === msg.userId ? "sent" : "received"
              }`}
            key={i}
          >
            {currentUserId !== msg.userId && (
              <IonAvatar className="message-avatar">
                <Avatar data={msg.user} size={40} />
              </IonAvatar>
            )}
            <div
              className={`message-bubble ${currentUserId === msg.userId ? "sent-bubble" : "received-bubble"
                }`}
            >
              <IonText className="message-sender">
                {msg?.name || "Anonymous"}
              </IonText>
              <IonText className="message-text">{msg?.message}</IonText>
              <IonText className="message-time">{msg?.date}</IonText>
            </div>
            {currentUserId === msg.userId && (
              <IonAvatar className="user-message-avatar">
                <Avatar data={msg.user} size={40} />
              </IonAvatar>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SingleChatboxReply;
