import { IonText } from "@ionic/react";
import "./Heading.css";

interface ComponentProps {
  title?: string;
  subtitle?: string;
}

const Heading: React.FC<ComponentProps> = ({ title, subtitle }) => {
  return (
    <div className="heading-container">
      <IonText color="dark">
        <p className="heading-subtitle">{subtitle}</p>
      </IonText>
      <IonText color="primary">
        <h1 className="heading-title">{title}</h1>
      </IonText>
    </div>
  );
};

export default Heading;
