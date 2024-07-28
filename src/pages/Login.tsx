import useStore from "../stores/useStore";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonPage,
  IonRouterLink,
  IonText,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { useEffect, useState } from "react";
import Logo from "../components/Logo";
import "./Auth.css";
import { eyeOff, eye } from "ionicons/icons";

//Password project:  KennymaN15!%Sithole

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [isDark, setIsDark] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(prefersDark.matches);
  }, []);

  const { loginWithEmail, authenticated, profile, getUser } = useStore(
    (state: any) => ({
      loginWithEmail: state.loginWithEmail,
      authenticated: state.authenticated,
      profile: state.profile,
      getUser: state.getUser,
    })
  );

  const [presentToast] = useIonToast();

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (authenticated && !profile) {
      navigation.push("/register-new-user", "forward", "replace");
    }
    if (profile) {
      navigation.push("/home", "forward", "replace");
    }
  }, [profile]);

  const handleLoginWithEmail = async () => {
    if (!email || !password) {
      presentToast({
        message: "Please enter your email and password",
        duration: 2000,
        color: "danger",
      });
      return;
    }

    const res = await loginWithEmail(email, password);
    if (res?.error) {
      presentToast({
        message: res.error,
        duration: 2000,
        color: "danger",
      });
    } else {
      await getUser();
      navigation.push("/home", "forward", "replace");
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div id="auth-container" className="login">
          <div className="input-wrapper">
            <Logo />
            <div className="section">
              <IonLabel position="stacked" color="dark">
                Email
              </IonLabel>
              <IonInput
                fill="outline"
                type="email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value! as string)}
                className="custom-input ion-margin-bottom"
              />
              <IonLabel position="stacked" color="dark">
                Password
              </IonLabel>
              <IonInput
                fill="outline"
                type={showPassword ? "text" : "password"}
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
                className="custom-input ion-margin-bottom"
              >
                <IonIcon
                  className="password-visibility"
                  icon={showPassword ? eyeOff : eye}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </IonInput>
              <div className="ion-padding-top">
                <IonButton
                  color="primary"
                  expand="block"
                  onClick={() => handleLoginWithEmail()}
                >
                  LOGIN
                </IonButton>
              </div>
            </div>
            <div className="ion-padding">
              <div className="ion-text-center ion-margin-bottom">
                <IonText color="medium">
                  Don't have an account?{" "}
                  <IonRouterLink href="/register" routerDirection="forward">
                    Register
                  </IonRouterLink>
                </IonText>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
