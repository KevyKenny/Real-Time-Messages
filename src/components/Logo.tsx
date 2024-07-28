import React, { useEffect, useState } from "react";
import { IonImg } from "@ionic/react";
import logoLightBg from "../assets/logo_on_light.png";
import logoDarkBg from "../assets/logo_on_dark.png";
import "./Logo.css";

interface LogoProps {
  align?: string | "center" | "left" | "right";
  width?: string;
}

const Logo: React.FC<LogoProps> = ({ align, width }) => {
  const [isDark, setIsDark] = useState(false);
  const [logo, setLogo] = useState(isDark ? logoDarkBg : logoLightBg);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(prefersDark.matches);
  }, []);

  useEffect(() => {
    if (isDark) {
      setLogo(logoDarkBg);
    } else {
      setLogo(logoLightBg);
    }
  }, [isDark]);

  return (
    <div
      id="logo"
      style={{
        width: width || "100%",
        justifyContent: `${align === "left"
          ? "flex-start"
          : align === "right"
            ? "flex-end"
            : "center"
          }`,
      }}
    >
      <IonImg src={logo} alt="Kenny Real Time Message" />
    </div>
  );
};

export default Logo;
