import useStore from "../stores/useStore";
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonInput,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonRouter,
} from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import "./MyProfile.css";

const MyProfile: React.FC = () => {
  const navigation = useIonRouter();
  const [presentToast] = useIonToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    street_address: "",
    city: "",
    country: "",
  });

  const { profile, logout, updateProfile, uploadProfileAvatar, loading } = useStore((state: any) => ({
    profile: state.profile,
    logout: state.logout,
    updateProfile: state.updateProfile,
    uploadProfileAvatar: state.uploadProfileAvatar,
    loading: state.loading,
  }));

  useEffect(() => {
    setFormData({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      phone: profile?.phone || "",
      street_address: profile?.street_address || "",
      city: profile?.city || "",
      country: profile?.country || "",
    });
  }, [profile]);

  const handleLogout = async () => {
    await logout();
    navigation.push("/login", "forward", "replace");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    const response = await updateProfile(formData);
    if (response?.error) {
      presentToast({
        message: response.error.message || "Unable to update profile.",
        duration: 2500,
        color: "danger",
      });
      return;
    }

    setIsEditing(false);
    presentToast({
      message: "Profile updated successfully.",
      duration: 2000,
      color: "success",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      phone: profile?.phone || "",
      street_address: profile?.street_address || "",
      city: profile?.city || "",
      country: profile?.country || "",
    });
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const response = await uploadProfileAvatar(file);
    if (response?.error) {
      presentToast({
        message: response.error.message || "Avatar upload failed.",
        duration: 2500,
        color: "danger",
      });
      return;
    }

    presentToast({
      message: "Avatar updated successfully.",
      duration: 2000,
      color: "success",
    });
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="profile-file-input"
            aria-label="Upload profile avatar"
          />
          <IonButton
            fill="outline"
            size="small"
            className="profile-avatar-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            Change Avatar
          </IonButton>
          <h2 className="profile-name">
            {profile?.first_name} {profile?.last_name}
          </h2>
          <div className="profile-details">
            <IonItem>
              <IonLabel>Email: {profile?.email || "user@example.com"}</IonLabel>
            </IonItem>
            <IonItem>
              {isEditing ? (
                <IonInput
                  label="Phone"
                  labelPlacement="stacked"
                  value={formData.phone}
                  onIonInput={(e) =>
                    handleInputChange("phone", (e.detail.value || "") as string)
                  }
                />
              ) : (
                <IonLabel>Phone: {profile?.phone || "-"}</IonLabel>
              )}
            </IonItem>
            <IonItem>
              {isEditing ? (
                <IonInput
                  label="First Name"
                  labelPlacement="stacked"
                  value={formData.first_name}
                  onIonInput={(e) =>
                    handleInputChange(
                      "first_name",
                      (e.detail.value || "") as string
                    )
                  }
                />
              ) : (
                <IonLabel>First Name: {profile?.first_name || "-"}</IonLabel>
              )}
            </IonItem>
            <IonItem>
              {isEditing ? (
                <IonInput
                  label="Last Name"
                  labelPlacement="stacked"
                  value={formData.last_name}
                  onIonInput={(e) =>
                    handleInputChange(
                      "last_name",
                      (e.detail.value || "") as string
                    )
                  }
                />
              ) : (
                <IonLabel>Last Name: {profile?.last_name || "-"}</IonLabel>
              )}
            </IonItem>
            <IonItem>
              {isEditing ? (
                <IonInput
                  label="Street Address"
                  labelPlacement="stacked"
                  value={formData.street_address}
                  onIonInput={(e) =>
                    handleInputChange(
                      "street_address",
                      (e.detail.value || "") as string
                    )
                  }
                />
              ) : (
                <IonLabel>
                  Street Address: {profile?.street_address || "-"}
                </IonLabel>
              )}
            </IonItem>
            <IonItem>
              {isEditing ? (
                <IonInput
                  label="City"
                  labelPlacement="stacked"
                  value={formData.city}
                  onIonInput={(e) =>
                    handleInputChange("city", (e.detail.value || "") as string)
                  }
                />
              ) : (
                <IonLabel>City: {profile?.city || "-"}</IonLabel>
              )}
            </IonItem>
            <IonItem>
              {isEditing ? (
                <IonInput
                  label="Country"
                  labelPlacement="stacked"
                  value={formData.country}
                  onIonInput={(e) =>
                    handleInputChange("country", (e.detail.value || "") as string)
                  }
                />
              ) : (
                <IonLabel>Country: {profile?.country || "-"}</IonLabel>
              )}
            </IonItem>
          </div>
          <div className="profile-actions">
            {isEditing ? (
              <>
                <IonButton onClick={handleSaveProfile} disabled={loading}>
                  Save
                </IonButton>
                <IonButton
                  fill="outline"
                  color="medium"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancel
                </IonButton>
              </>
            ) : (
              <IonButton onClick={() => setIsEditing(true)}>Edit Profile</IonButton>
            )}
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
