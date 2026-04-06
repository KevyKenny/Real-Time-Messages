import useStore from "./stores/useStore";
import { Redirect, Route, Switch } from "react-router-dom";
import {
  IonApp,
  IonLoading,
  IonRouterOutlet,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useEffect } from "react";
import Login from "./pages/Login";
import Tabs from "./navigation/Tabs";
import ChatBox from "./pages/Messages/ChatBox";
import UsertDetail from "./pages/UserDetail.tsx";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "./App.css";
/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import RegisterNewUser from "./pages/Messages/RegisterNewUser";
import RegisterUserDetails from "./pages/Messages/RegisterUserDetails";

setupIonicReact();

const App: React.FC = () => {
  const { authenticated, authHydrated, profile, getUser } = useStore((state: any) => ({
    authenticated: state.authenticated,
    authHydrated: state.authHydrated,
    profile: state.profile,
    getUser: state.getUser,
  }));

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (!authHydrated) {
    return (
      <IonApp>
        <IonLoading isOpen message="Loading..." />
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Switch>
            <Route
              path="/login"
              exact
              render={() =>
                authenticated ? (
                  <Redirect to={profile ? "/home" : "/register-new-user"} />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/register"
              exact
              render={() => (authenticated ? <Redirect to="/home" /> : <RegisterNewUser />)}
            />
            <Route
              path="/register-new-user"
              exact
              render={() => (authenticated ? <RegisterUserDetails /> : <Redirect to="/login" />)}
            />
            <Route
              path="/message/:id"
              exact
              render={() => (authenticated ? <ChatBox /> : <Redirect to="/login" />)}
            />
            <Route
              path="/user-details/:id"
              exact
              render={() => (authenticated ? <UsertDetail /> : <Redirect to="/login" />)}
            />
            <Route exact path="/dashboard" render={() => <Redirect to="/home" />} />
            <Route
              path="/"
              render={() => (authenticated ? <Tabs authenticated={authenticated} /> : <Redirect to="/login" />)}
            />
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
