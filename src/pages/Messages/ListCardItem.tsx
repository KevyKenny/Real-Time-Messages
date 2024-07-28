import { useRef } from "react";
import {
    IonBadge,
    IonItem,
    IonText,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    useIonAlert,
    IonAvatar,
} from "@ionic/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Avatar from "../../components/Avatar";
import "./ListCardItem.css";

interface ContainerProps {
    id: number;
    title: string;
    timestamp?: string;
    datestamp?: string;
    subtext?: string;
    avatar?: any;
    count?: number;
    status?: string;
    active: boolean;
    onClick?: () => void;
    onMarkAsRead: any;
    onDelete: any;
    user_data: any;
}

dayjs.extend(relativeTime);

const ListCardItem: React.FC<ContainerProps> = ({
    id,
    title,
    timestamp,
    datestamp,
    subtext,
    avatar,
    count,
    status,
    active,
    onClick,
    onMarkAsRead,
    onDelete,
    user_data
}) => {
    const [presentAlert] = useIonAlert();
    const itemSlidingRef = useRef<HTMLIonItemSlidingElement>(null);

    const handleOptionClose = () => {
        if (itemSlidingRef.current) {
            itemSlidingRef.current.closeOpened();
        }
    };

    const handleMarkAsRead = (id: number, status: boolean) => {
        const readStatus = status ? false : true;
        onMarkAsRead(id, readStatus);
        handleOptionClose();
    };
    const handleDelete = () => {
        presentAlert({
            header: "Are you sure?",
            message: "Are you sure you want to delete this notification?",
            buttons: [
                {
                    text: "Cancel",
                    role: "cancel",
                    handler: () => {
                        handleOptionClose();
                    },
                },
                {
                    text: "OK",
                    role: "confirm",
                    handler: () => {
                        onDelete(id);
                        handleOptionClose();
                    },
                },
            ],
        });
    };
    return (
        <>
            <IonItemSliding ref={itemSlidingRef}>
                <IonItem
                    className={`list-card-container ${active ? "active" : ""} `}
                    onClick={onClick}
                    lines="none"
                >
                    <div style={{ width: "100%" }}>
                        <div>
                            <div className="flex-row">
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    {avatar ? (
                                        <IonAvatar>
                                            <img src={avatar} alt={user_data.first_name} />
                                        </IonAvatar>
                                    ) : (
                                        <Avatar data={user_data} size={50} />
                                    )}
                                    <div>
                                        <IonText color="dark">
                                            <h3 style={{ marginLeft: 5 }}>{title}</h3>
                                        </IonText>
                                        <div>
                                            {subtext && (
                                                <div style={{ marginTop: 5, marginLeft: 5 }}>
                                                    <IonText color="medium">{subtext}</IonText>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <>
                                        {timestamp && (
                                            <IonText>
                                                <p className="timestamp">
                                                    {dayjs(timestamp).fromNow()}
                                                </p>
                                            </IonText>
                                        )}
                                        {datestamp && (
                                            <IonText>
                                                <p className="timestamp">
                                                    {dayjs(datestamp).format("MM/DD/YYYY")}
                                                </p>
                                            </IonText>
                                        )}
                                    </>
                                </div>
                            </div>
                            <div className="flex-row">
                                <div>
                                    {count && (
                                        <div>
                                            <IonBadge color="secondary">2</IonBadge>
                                        </div>
                                    )}
                                    {status && (
                                        <div>
                                            <IonBadge
                                                color={status === "Public" ? "light" : "tertiary"}
                                            >
                                                {status}
                                            </IonBadge>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </IonItem>
                <IonItemOptions>
                    <IonItemOption
                        color="tertiary"
                        onClick={() => handleMarkAsRead(id, active)}
                    >
                        {active ? "Mark as Unread" : "Mark as Read"}
                    </IonItemOption>
                    <IonItemOption color="danger" onClick={handleDelete}>
                        Delete
                    </IonItemOption>
                </IonItemOptions>
            </IonItemSliding>
        </>
    );
};

export default ListCardItem;
