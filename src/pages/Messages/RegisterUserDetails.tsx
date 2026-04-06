import {
    IonButton,
    IonCol,
    IonContent,
    IonGrid,
    IonInput,
    IonLabel,
    IonPage,
    IonRow,
    IonText,
    useIonToast,
} from "@ionic/react";
import "../Auth.css";
import { useRef, useState } from "react";
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
    const [presentToast] = useIonToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user, createNewUser, uploadAvatarFile, loading } = useStore(
        (state: any) => ({
            user: state.user,
            createNewUser: state.createNewUser,
            uploadAvatarFile: state.uploadAvatarFile,
            loading: state.loading,
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
    const [avatarPreview, setAvatarPreview] = useState<string>("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

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
            let avatarUrl = data.avatar_url || "";

            if (avatarFile) {
                const uploadResponse = await uploadAvatarFile(avatarFile);
                if (uploadResponse?.error) {
                    presentToast({
                        message: uploadResponse.error.message || "Avatar upload failed.",
                        duration: 2500,
                        color: "danger",
                    });
                    return;
                }
                avatarUrl = uploadResponse.data.publicUrl;
            }

            const payload = {
                ...data,
                avatar_url: avatarUrl,
                uuid: user?.id,
                email: user.email,
            };
            const res = await createNewUser(payload);
            if (res) {
                history.push("/home");
            }
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        setAvatarFile(file);
        const localPreview = URL.createObjectURL(file);
        setAvatarPreview(localPreview);
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
                                <IonRow className="ion-justify-content-center ion-margin-bottom">
                                    <IonCol size="6" className="ion-text-center">
                                        <img
                                            src={
                                                avatarPreview ||
                                                data.avatar_url ||
                                                "https://ionicframework.com/docs/img/demos/avatar.svg"
                                            }
                                            alt="Avatar preview"
                                            style={{
                                                width: 96,
                                                height: 96,
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                marginBottom: 8,
                                            }}
                                        />
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            style={{ display: "none" }}
                                            aria-label="Upload avatar"
                                        />
                                        <IonButton
                                            size="small"
                                            fill="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={loading}
                                        >
                                            Upload Avatar
                                        </IonButton>
                                    </IonCol>
                                </IonRow>
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
                                            disabled={loading}
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
