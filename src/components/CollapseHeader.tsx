import React from "react";
import "./CollapseHeader.css";
import { IonHeader, IonGrid, IonRow } from "@ionic/react";

interface headerProps {
  renderToolbar: any;
  renderActions: any;
}

const CollapseHeader: React.FC<headerProps> = ({
  renderToolbar,
  renderActions,
}) => {
  return (
    <div>
      <div className="collapse-header">
        <IonHeader>{renderToolbar()}</IonHeader>
        <IonGrid>
          <IonRow>{renderActions()}</IonRow>
        </IonGrid>
      </div>
    </div>
  );
};

export default CollapseHeader;
