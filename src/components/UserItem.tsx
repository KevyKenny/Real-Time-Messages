import {
  IonChip,
  IonCol,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
  IonText,
} from "@ionic/react";
import "./Heading.css";
import { registeredOn } from "../helpers";
import Avatar from "./Avatar";
import "./UserItem.css"
import { locationOutline } from "ionicons/icons";

interface ComponentProps {
  user?: any;
}

const UserItem: React.FC<ComponentProps> = ({ user }) => {
  return (
    <div id="appt-list-card" className="well" key={user?.id}>
      <div>
        <IonItem
          lines="full"
          routerLink={`/user-details/${user?.id}`}
        >
          <>
            <div>
              <IonRow>
                <IonCol size="12">
                  {" "}
                  <IonText color="medium" style={{ fontSize: 12 }}>
                    {registeredOn(user?.created_at)}{" "}
                  </IonText>
                </IonCol>
                <IonCol size="12">
                  <h5>
                    {user?.first_name.replace(
                      "null ",
                      ""
                    )}{" "}
                    {user?.last_name.replace(
                      "null ",
                      ""
                    )}
                  </h5>
                </IonCol>
              </IonRow>
            </div>
          </>
        </IonItem>
        <IonItem lines="full">
          <IonChip>
            <IonIcon icon={locationOutline} size="small" />
            <IonLabel>
              {`${user?.street_address}, ${user?.city}, ${user?.country}`}
            </IonLabel>
          </IonChip>
          {/* <span slot="end" className="meta-data">
            <IonChip>
              <IonLabel>
                {user?.online_status}
              </IonLabel>
            </IonChip>
          </span> */}
        </IonItem>
      </div>
    </div>
  );
};

export default UserItem;
