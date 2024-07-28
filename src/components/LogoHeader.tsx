import useStore from "../stores/useStore";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonAvatar,
} from "@ionic/react";
import { notificationsOutline } from "ionicons/icons";
import Avatar from "./Avatar";
import "./LogoHeader.css";
import Logo from "./Logo";

const LogoHeader: React.FC = () => {
  const profile = useStore((state: any) => state.profile);

  return (
    <IonHeader>
      <IonToolbar>
        <div className="logo-container">
          <Logo align="left" width="90%" />
          {/* <IonImg src={logoPath} alt="SnapMarket" /> */}
        </div>
        <IonButtons slot="end">
          <div className="button-with-badge">
            <IonButton
              routerLink={"/my-profile"}
              color="tertiary"
              className="button-without-padding"
            >
              <IonIcon slot="icon-only" icon={notificationsOutline} />
            </IonButton>
            {/* {notifications.unreadCount > 0 && (
              <IonBadge className="badge-container">
                {notifications.unreadCount}
              </IonBadge>
            )} */}
          </div>

          <IonButton routerLink={"/my-profile"} color="tertiary">
            {profile?.avatar_url ? (
              <IonAvatar
                style={{ width: "30px", height: "30px", marginRight: 7 }}
              >
                <img alt="avatar" src={profile?.avatar_url} />
              </IonAvatar>
            ) : (
              <Avatar data={profile} size={50} />
            )}
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default LogoHeader;
