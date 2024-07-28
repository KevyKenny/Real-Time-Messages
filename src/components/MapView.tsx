import React from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import useStore from "../stores/useStore";

interface mapProps {
  width: string;
  height: string;
  centerLat?: number;
  centerLng?: number;
  defaultZoom: number;
  markerData?: any;
  isDraggable?: boolean;
  setIsDragged?: any;
  setAddressPayload?: any;
  addressPayload?: any;
}

const MapView: React.FC<mapProps> = ({
  width,
  height,
  centerLat,
  centerLng,
  defaultZoom,
  isDraggable = false,
  setIsDragged,
  setAddressPayload,
  addressPayload,
  markerData,
}) => {
  const [map, setMap] = React.useState(null);
  const [markerPosition, setMarkerPosition] = React.useState({
    lat: centerLat,
    lng: centerLng,
  });

  // Use useEffect to update the marker position when the centerLat and centerLng change
  React.useEffect(() => {
    setMarkerPosition({
      lat: centerLat,
      lng: centerLng,
    });
  }, [centerLat, centerLng]);

  const containerStyle = {
    width: width,
    height: height,
  };

  const center = React.useMemo(() => {
    return {
      lat: centerLat,
      lng: centerLng,
    };
  }, [centerLat, centerLng]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API || "",
    libraries: ["geometry", "drawing"],
  });

  const onLoad = React.useCallback(function callback(map: any) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center as any}
      zoom={defaultZoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <MarkerF
        position={markerPosition as any}
      />
    </GoogleMap>
  ) : (
    <></>
  );
};

export default MapView;
