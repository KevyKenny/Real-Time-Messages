import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useStore from "../../stores/useStore";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonBadge,
  useIonToast,
  IonAlert,
  IonList,
  IonToggle,
} from "@ionic/react";
import {
  locationOutline,
  peopleOutline,
} from "ionicons/icons";
import SectionHeader from "../../components/SectionHeader";
import Address from "./Address";
import "./UserDetails.css";
import Contacts from "./Contacts";
import ChatBoxContent from "../Messages/ChatBoxContent";
import SingleChatboxReply from "../Messages/SingleChatboxReply";

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [presentToast] = useIonToast();
  const [showAlert, setShowAlert] = useState(false);
  const [segment, setSegment] = useState("details");
  const [isPublic, setIsPublic] = useState(false);

  const handleToggleClick = () => {
    if (!isPublic) {
      setShowAlert(true);
    } else {
      setIsPublic(!isPublic);
    }
  };

  const handleConfirmClick = () => {
    setIsPublic(!isPublic);
    setShowAlert(false);
  };

  const {
    getUserById,
    selectedUser,
    createMessage,
    profile,
    getMessages,
    messages,
    realTimeMessages,
  } = useStore((state: any) => ({
    getUserById: state.getUserById,
    selectedUser: state.selectedUser as any,
    createMessage: state.createMessage,
    profile: state.profile,
    getMessages: state.getMessages,
    messages: state.messages,
    realTimeMessages: state.realTimeMessages,
  }));

  useEffect(() => {
    const fetchData = async () => {
      await getUserById(parseInt(id));
      await realTimeMessages(parseInt(id));
      await getMessages(parseInt(id));
    };
    fetchData();
  }, [getUserById, id, getMessages]);

  const renderToolbar = () => {
    return (
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="dashboard" />
          </IonButtons>
          {selectedUser?.first_name} {" "} {selectedUser?.last_name}
          <IonButtons slot="end">
            <div className="ion-margin-end">
              {segment === "messages" && (
                <>
                  <IonToggle
                    id="present-alert"
                    checked={isPublic}
                    onClick={handleToggleClick}
                  >
                    Public
                  </IonToggle>
                  <IonAlert
                    isOpen={showAlert}
                    header="Are you sure?"
                    message="Make this chat public?"
                    buttons={[
                      {
                        text: "Cancel",
                        role: "cancel",
                        handler: () => {
                          setShowAlert(false);
                        },
                      },
                      {
                        text: "Confirm",
                        role: "confirm",
                        handler: handleConfirmClick,
                      },
                    ]}
                    onDidDismiss={() => setShowAlert(false)}
                  ></IonAlert>
                </>
              )}
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader >
    );
  };
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
      is_public: isPublic,
      user_id: profile.id,
    }

    const res = await createMessage(messagePayload);
    if (res) {
      await getMessages(parseInt(id));
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader>{renderToolbar()}</IonHeader>
        <div className="section">
          <IonSegment value={segment} color="primary">
            <IonSegmentButton
              value="details"
              onClick={() => setSegment("details")}
            >
              <IonLabel>User Details</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton
              value="messages"
              onClick={() => setSegment("messages")}
            >
              <div className="flex-align-center">
                <IonLabel style={{ marginRight: 7 }}>Messages</IonLabel>{" "}
                {messages?.length > 0 && (
                  <IonBadge color="danger">{messages?.length}</IonBadge>
                )}
              </div>
            </IonSegmentButton>
          </IonSegment>
        </div>

        <div className="segment-section">
          {segment === "details" && (
            <div className="details-segement-section">
              <div>
                <SectionHeader label="Address" iconSrc={locationOutline} />
                <Address data={selectedUser} />
              </div>
              <div className="ion-margin-top">
                <SectionHeader label="Contacts" iconSrc={peopleOutline} />
                <Contacts data={selectedUser} />
              </div>
            </div>
          )}

          {segment === "messages" && (
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
                <ChatBoxContent handleSendMessage={handleSendMessage} />
              </div>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserDetail;
