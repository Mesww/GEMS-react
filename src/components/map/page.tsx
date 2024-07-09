import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

function Map() {
  const [center, setCenter] = useState({
    lat: 0,
    lng: 0,
  });
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAHprdF-rZKc98_eI15rpU6l2-yhG7HKM4",
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation is not available");
    }
  }, []);

  const onLoad = React.useCallback(function callback(map: any) {
    // Optional: Do something when map is loaded
    console.log("Map loaded:", map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: any) {
    // Optional: Do something when map is unmounted
    console.log("Map unmounted:", map);
  }, []);

  if (loadError) {
    return <div>Error loading Google Maps API: {loadError.message}</div>;
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Marker for current position */}
      <Marker position={center} />
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
}

export default React.memo(Map);
