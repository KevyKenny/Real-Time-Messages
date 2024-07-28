import React, { useState } from "react";
import {
  IonTextarea,
  IonButton,
  IonIcon,
  IonCol,
  IonRow,
  IonGrid,
  IonItem,
} from "@ionic/react";
import { sendOutline } from "ionicons/icons";
import "./ChatBox.css"

interface ContactsProps {
  handleSendMessage: any;
}

const ChatboxContent: React.FC<ContactsProps> = ({ handleSendMessage }) => {
  const [content, setContent] = useState<string>();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleSendMessage(content);
    setContent("");
  };

  return (
    <>
      <div className="mi_text">
        <form className="" onSubmit={handleSubmit}>
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
                    onIonChange={(e) => setContent(e.target.value!)}
                    required
                  />
                </IonItem>
              </IonCol>
              <IonCol size="auto">
                <IonButton type="submit">
                  Send {""}
                  <IonIcon
                    className="message-send-button"
                    icon={sendOutline}
                    onClick={handleSendMessage}
                    style={{ marginLeft: 5 }}
                  />
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </form>
      </div>
    </>
  );
};

export default ChatboxContent;
