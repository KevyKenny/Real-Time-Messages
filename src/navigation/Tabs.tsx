import React from "react";
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import { homeOutline, chatboxOutline } from "ionicons/icons";
import AllUser from "../pages/AllUsers";
import Messages from "../pages/Messages";
import MyProfile from "../pages/MyProfile";
import PrivateRoute from "../PrivateRoute";
import Login from "../pages/Login";

const Tabs: React.FC<{ authenticated: boolean }> = ({ authenticated }) => (
    <IonTabs>
        <IonRouterOutlet>
            <Route path="/login" exact component={Login} />
            <PrivateRoute
                path="/home"
                exact
                authenticated={true}
                redirectPath="/login"
                component={AllUser}
            />
            <PrivateRoute
                path="/messages"
                authenticated={true}
                redirectPath="/login"
                component={Messages}
            />
            <PrivateRoute
                path="/my-profile"
                authenticated={true}
                redirectPath="/login"
                component={MyProfile}
            />
            <Route exact path="/">
                <Redirect to="/home" />
            </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
                <IonIcon aria-hidden="true" icon={homeOutline} />
                <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="messages" href="/messages">
                <IonIcon aria-hidden="true" icon={chatboxOutline} />
                <IonLabel>Chats</IonLabel>
            </IonTabButton>
        </IonTabBar>
    </IonTabs>
);

export default Tabs;
