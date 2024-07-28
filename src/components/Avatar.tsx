import React from "react";
import "./Avatar.css";

interface AvatarProps {
  data: any;
  size: number;
}

const Avatar: React.FC<AvatarProps> = ({ data, size }) => {
  const [initials, setInitials] = React.useState("");

  React.useEffect(() => {
    if (data && data.first_name && data.last_name) {
      setInitials(data.first_name[0] + data.last_name[0]);
    }
  }, [data]);

  if (!data) {
    return null;
  }

  return (
    <>
      {data?.avatar_url ? (
        <div
          className="avatar"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: `${size / 2}px`,
            overflow: "hidden",
            marginRight: 7,
          }}
        >
          <img
            alt="avatar"
            src={data?.avatar_url}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ) : (
        <div
          className="avatar"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: `${size / 2}px`,
            backgroundColor: "#2f5fef",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 7,
          }}
        >
          <span
            style={{
              fontSize: `${size / 2}px`,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {initials}
          </span>
        </div>
      )}
    </>
  );
};

export default Avatar;
