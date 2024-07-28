import { useCallback, useEffect } from "react";
import useStore from "../stores/useStore";
import {
  IonButton,
  IonContent,
  IonList,
  IonPage,
} from "@ionic/react";
import UserItem from "../components/UserItem";
import "./AllUsers.css";
import LogoHeader from "../components/LogoHeader";
import Heading from "../components/Heading";

const AllUsers: React.FC = () => {
  const { profile, getUsers, users } = useStore(
    (state: any) => ({
      profile: state.profile,
      getUsers: state.getUsers,
      users: state.users,
    })
  );

  const fetchData = useCallback(() => {
    if (profile?.id) {
      getUsers(profile?.id);
    }
  }, [getUsers, profile]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <IonPage>
      <LogoHeader />
      <IonContent fullscreen>
        <Heading
          title={`Hello, ${profile?.first_name}`}
          subtitle="My Dashboard"
        />
        {users.length > 0 ? (
          <div>
            <IonList className="ion-padding">
              {users.map((user: any) => (
                <UserItem key={user.id} user={user} />
              ))}
            </IonList>
          </div>
        ) : (
          <>
            <div>No Users found</div>
            <IonButton onClick={() => console.log("Yo yo")}>Default</IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AllUsers;
