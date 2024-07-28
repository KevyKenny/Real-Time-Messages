import useStore from "../stores/useStore";
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import "./MyProfile.css";

const MyProfile: React.FC = () => {
  const navigation = useIonRouter();

  const { profile, logout } = useStore((state: any) => ({
    profile: state.profile,
    logout: state.logout,
  }));

  const handleLogout = async () => {
    await logout();
    navigation.push("/login", "forward", "replace");
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="profile-container">
          <IonAvatar className="profile-avatar">
            <img
              src={profile?.avatar_url || "https://via.placeholder.com/150"}
              alt="Avatar"
            />
          </IonAvatar>
          <h2 className="profile-name">
            {profile?.first_name} {profile?.last_name}
          </h2>
          <div className="profile-details">
            <IonItem>
              <IonLabel>Email: {profile?.email || "user@example.com"}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Phone: {profile?.phone || "user@example.com"}</IonLabel>
            </IonItem>
            {/* Add more user details as needed */}
          </div>
          <div className="profile-button">
            <IonButton expand="block" color="primary" onClick={handleLogout}>
              <IonIcon slot="start" icon={logOutOutline} />
              Logout
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyProfile;
