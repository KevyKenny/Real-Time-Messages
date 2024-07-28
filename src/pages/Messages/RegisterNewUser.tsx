import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import useStore from "../../stores/useStore";
import {
    IonButton,
    IonContent,
    IonInput,
    IonLabel,
    IonPage,
    IonRouterLink,
    IonText,
    IonIcon
} from "@ionic/react";
import "./Auth.css";
import { eyeOff, eye } from "ionicons/icons";
import Logo from "../../components/Logo";

const RegisterNewUser: React.FC = () => {
    const { profile, authenticated, signupWithEmail } = useStore(
        (state: any) => ({
            profile: state.profile,
            authenticated: state.authenticated,
            signupWithEmail: state.signupWithEmail,
        })
    );

    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (authenticated && !profile) {
            history.replace("/register-new-user");
        }
        if (authenticated && profile) {
            history.replace("/home");
        }
    }, [authenticated, history]);

    const registerWithEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await signupWithEmail(email, password);
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <div id="auth-container" className="login">
                    <div className="input-wrapper">
                        <Logo />
                        <form onSubmit={registerWithEmail}>
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
                                <IonLabel position="stacked" color="medium">
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
                                <IonLabel position="stacked" color="medium">
                                    Confirm Password
                                </IonLabel>
                                <IonInput
                                    fill="outline"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                                    className="custom-input ion-margin-bottom"
                                >
                                    <IonIcon
                                        className="password-visibility"
                                        icon={showConfirmPassword ? eyeOff : eye}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    />
                                </IonInput>
                            </div>
                            <div className="auth-footer">
                                <div style={{ marginTop: 20 }}>
                                    <IonButton
                                        color="primary"
                                        expand="block"
                                        shape="round"
                                        type="submit"
                                        disabled={!email || !password}
                                    >
                                        CREATE ACCOUNT
                                    </IonButton>
                                    <div className="ion-padding ion-text-center ion-margin-bottom">
                                        <IonText color="medium">
                                            Already have an account?{" "}
                                            <IonRouterLink href="/login">Login</IonRouterLink>
                                        </IonText>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default RegisterNewUser;
