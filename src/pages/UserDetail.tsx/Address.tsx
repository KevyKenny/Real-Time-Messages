import {
  IonChip,
  IonLabel,
  IonText,
} from "@ionic/react";
import { chipColor } from "../../helpers";
import "./UserDetails.css";

interface AddressProps {
  data: any;
}

const Address: React.FC<AddressProps> = ({ data }) => {
  return (
    <>
      <div className="flex-row">
        <div className="detail-address">
          <IonText color="dark">
            <h4>{data?.street_address?.replace("null ", "")}</h4>
          </IonText>
          <IonText color="medium">
            {data?.city}, {data?.country}{" "}
          </IonText>
        </div>
        <div>
          <IonChip>
            <IonLabel color={chipColor("graduate")}>{"graduate"}</IonLabel>
          </IonChip>
        </div>
      </div>
    </>
  );
};

export default Address;
