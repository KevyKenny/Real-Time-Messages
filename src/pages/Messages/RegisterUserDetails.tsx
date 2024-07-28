import {
    IonButton,
    IonCol,
    IonContent,
    IonGrid,
    IonInput,
    IonLabel,
    IonPage,
    IonRouterLink,
    IonRow,
    IonText,
    IonThumbnail,
} from "@ionic/react";
import { mdiCamera } from "@mdi/js";
// import Icon from "@mdi/react";
import "../Auth.css";
import { useState } from "react";
import useStore from "../../stores/useStore";
import { useHistory } from "react-router";
import Logo from "../../components/Logo";


type FormData = {
    avatar_url: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    street_address: string;
    city: string;
    country: string;
};

const RegisterUserDetails: React.FC = () => {
    const { user, createNewUser } = useStore(
        (state: any) => ({
            user: state.user,
            createNewUser: state.createNewUser,
        })
    );
    const history = useHistory();
    const INITIAL_FORM_DATA: FormData = {
        avatar_url: "",
        first_name: "",
        last_name: "",
        phone: "",
        city: "",
        street_address: "",
        country: "",
        email: "",
    };

    const [data, setData] = useState<FormData>(INITIAL_FORM_DATA);
    const [error, setError] = useState<string | null>(null);

    const updateFields = (fields: any) => {
        setData((prev) => ({ ...prev, ...fields }));
    };
    const validateForm = (data: FormData): boolean => {
        const {
            first_name,
            last_name,
            phone,
            street_address,
            city,
            country,
        } = data;

        if (
            !first_name ||
            !last_name ||
            !phone ||
            !street_address ||
            !city ||
            !country
        ) {
            return false;
        }

        return true;
    };

    const handleFinish = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm(data)) {
            setError("Please fill in all required fields.");
            return;
        } else {
            setError(null);
            const payload = {
                ...data,
                uuid: user?.id,
                email: user.email,
            };
            const res = await createNewUser(payload);
            if (res) {
                history.push("/home");
            }
        }
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <div id="auth-container" className="login">
                    <div className="input-wrapper">
                        <Logo />
                        <form onSubmit={handleFinish}>
                            <IonText color="medium" className="ion-text-center">
                                <h3>Your Profile Details</h3>
                            </IonText>
                            {error && <IonText color="danger">{error}</IonText>}
                            <div className="section">
                                {/* <IonRow className="ion-justify-content-center profile-avatar">
                                <IonCol size="6">
                                    <IonThumbnail>
                                        <img
                                            src={
                                                data.avatar_url
                                                    ? data.avatar_url
                                                    : "https://ionicframework.com/docs/img/demos/avatar.svg"
                                            }
                                            alt="avatar"
                                            width="100%"
                                        />
                                    </IonThumbnail>
                                    <div className="camera-button">
                                        <IonButton
                                            size="small"
                                            shape="round"
                                            onClick={() => console.log("Take picture")}
                                        >
                                             <Icon path={mdiCamera} size={1} color="#fff" /> 
                                        </IonButton>
                                    </div>
                                </IonCol>
                            </IonRow> */}
                                <div className="section">
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol>
                                                <IonLabel position="stacked" color="dark">
                                                    First Name<span style={{ color: "red" }}>*</span>
                                                </IonLabel>
                                                <IonInput
                                                    value={data.first_name}
                                                    onIonChange={(e) => updateFields({ first_name: e.detail.value! })}
                                                    className="custom-input"
                                                    fill="outline"
                                                />
                                            </IonCol>
                                            <IonCol>
                                                <IonLabel position="stacked" color="dark">
                                                    Last Name<span style={{ color: "red" }}>*</span>
                                                </IonLabel>
                                                <IonInput
                                                    fill="outline"
                                                    value={data.last_name}
                                                    onIonChange={(e) => updateFields({ last_name: e.detail.value! })}
                                                    className="custom-input"
                                                />
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>

                                    <IonLabel position="stacked" color="dark">
                                        Phone <span style={{ color: "red" }}>*</span>
                                    </IonLabel>
                                    <IonInput
                                        fill="outline"
                                        value={data.phone}
                                        onIonChange={(e) => updateFields({ phone: e.detail.value! })}
                                        className="custom-input ion-margin-bottom"
                                    />
                                    <IonLabel position="stacked" color="dark">
                                        Street Address <span style={{ color: "red" }}>*</span>
                                    </IonLabel>
                                    <IonInput
                                        fill="outline"
                                        value={data.street_address}
                                        onIonChange={(e) => updateFields({ street_address: e.detail.value! })}
                                        className="custom-input ion-margin-bottom"
                                    />
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol>
                                                <IonLabel position="stacked" color="dark">
                                                    City <span style={{ color: "red" }}>*</span>
                                                </IonLabel>
                                                <IonInput
                                                    fill="outline"
                                                    value={data.city}
                                                    onIonChange={(e) => updateFields({ city: e.detail.value! })}
                                                    className="custom-input ion-margin-bottom"
                                                />
                                            </IonCol>
                                            <IonCol>
                                                <IonLabel position="stacked" color="dark">
                                                    Country <span style={{ color: "red" }}>*</span>
                                                </IonLabel>
                                                <IonInput
                                                    fill="outline"
                                                    value={data.country}
                                                    onIonChange={(e) => updateFields({ country: e.detail.value! })}
                                                    className="custom-input ion-margin-bottom"
                                                />
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </div>
                                <div className="auth-footer">
                                    <div style={{ marginTop: 20 }}>
                                        <IonButton
                                            color="primary"
                                            expand="block"
                                            shape="round"
                                            type="submit"
                                        >
                                            Finish
                                        </IonButton>
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

export default RegisterUserDetails;
