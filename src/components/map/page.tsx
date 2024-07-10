import React, { useEffect, useState, useCallback, useMemo } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { useWebSocketData } from "../../containers/webSocketGems";

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

  //เซ็ทตรงกลางแมพ
  const [center, setCenter] = useState({
    lat: 20.058851,
    lng: 99.899769,
  });


   //โหลดแมพ ================================================
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "",
  });
    const onLoad = useCallback((map: google.maps.Map) => {
      console.log("Map loaded:", map);
    }, []);
  
    const onUnmount = useCallback((map: google.maps.Map) => {
      console.log("Map unmounted:", map);
    }, []);


  // รับข้อมูลจาก websocket  ================================================
  const { messages } = useWebSocketData() as { messages: WebSocketMessage | null };
  const data = useMemo(() => {
    return messages && messages.status === "ok" ? messages.data : null;
  }, [messages]);




  // ตำแหน่งของผู้ใช้งาน  ================================================
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("User location obtained:", position.coords);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    console.log("User location state:", userLocation);
    if (userLocation) {
      setCenter(userLocation);
    }
  }, [userLocation]);





  // Keep this useMemo for other markers ตำแหน่งรถเจม
  const markers = useMemo(() => {
    if (!data) return null;
    return Object.entries(data).map(([key, value]) => {
      if (value && value.position) {
        const [lat, lng] = value.position.split(',').map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          return (
            <MarkerF
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
      {userLocation && (
        <MarkerF
          position={userLocation}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          }}
          title="Your Location"
        />
      )}
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
}



export default React.memo(Map);