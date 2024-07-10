import React, { useEffect, useState, useCallback, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useWebSocketData } from "../../containers/webSocketGems"; // Import the hook

interface TrackerData {
  server_time: string;
  tracker_time: string;
  direction: number;
  position: string;
  speed: number;
}


interface WebSocketMessage {
  status: string;
  data: {
    [key: string]: TrackerData;
  };
}

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "100vh",
};

function Map() {
  const [center, setCenter] = useState({
    lat: 20.058851,
    lng: 99.899769,
  });
  const { messages } = useWebSocketData() as unknown as { messages: WebSocketMessage | null };

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAHprdF-rZKc98_eI15rpU6l2-yhG7HKM4",
  });

  // Use useMemo to derive data from messages
  const data = useMemo(() => {
    return messages && messages.status === "ok" ? messages.data : null;
  }, [messages]);

  // Update center when data changes
  // useEffect(() => {
  //   if (data) {
  //     const firstTracker = Object.values(data)[0];
  //     if (firstTracker && firstTracker.position) {
  //       const [lat, lng] = firstTracker.position.split(',').map(Number);
  //       setCenter({ lat, lng });
  //     }
  //   }
  // }, [data]);

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log("Map loaded:", map);
  }, []);

  const onUnmount = useCallback((map: google.maps.Map) => {
    console.log("Map unmounted:", map);
  }, []);

  // Memoize markers to prevent unnecessary re-renders
  const markers = useMemo(() => {
    if (!data) return null;
    return Object.entries(data).map(([key, value]) => {
      if (value && value.position) {
        const [lat, lng] = value.position.split(',').map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          return (
            <Marker
              key={key}
              position={{ lat, lng }}
              title={`Tracker ${key}`}
              label={key}
            />
          );
        }
      }
      return null;
    });
  }, [data]);

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
      {markers}
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
}

export default React.memo(Map);