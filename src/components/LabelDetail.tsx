import React from "react";
import "./LabelDetail.css";
import { IonText } from "@ionic/react";

interface labelDetailProps {
  label: string;
  detail: string;
}

const LabelDetail: React.FC<labelDetailProps> = ({ label, detail }) => {
  return (
    <div className="label-detail">
      <IonText color="medium">{label}</IonText>
      <IonText color="dark">{detail}</IonText>
    </div>
  );
};

export default LabelDetail;
