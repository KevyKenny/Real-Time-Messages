import React from "react";
import { IonIcon, IonItem, IonLabel, IonText } from "@ionic/react";

interface SectionHeaderProps {
  label: string;
  iconSrc: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ label, iconSrc }) => {
  return (
    <IonItem slot="header">
      <IonLabel color="primary">
        <div className="flex-align-center" style={{ fontSize: 16 }}>
          <span style={{ marginRight: 5 }}>
            <IonIcon aria-hidden="true" icon={iconSrc} />
          </span>

          <IonText color="dark">{label}</IonText>
        </div>
      </IonLabel>
    </IonItem>
  );
};

export default SectionHeader;
