import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { useWebSocketData } from "../../containers/getGemsDataWebsocket/getGemsWebsocket";
import { useEffect, useMemo, useState } from "react";

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



const MapComponant = () => {
  const [center, setCenter] = useState({
    lat: 20.058851,
    lng: 99.899769,
  });
  
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
              <AdvancedMarker
                key={key}
                position={{ lat, lng }}
                title={`Tracker ${key}`}
                
              />
            );
          }
        }
        return null;
      });
    }, [data]);




  return (
    <>
      <APIProvider apiKey={""}>
        <Map
          style={{ width: "100%", height: "100vh" }}
          defaultZoom={13}
          defaultCenter={{ lat: 20.058851, lng: 99.899769 }}
          mapId={"af4f705e9a1cc81f"}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        />
        {/* markerรถเจม */}
        {markers} 
      </APIProvider>
    </>
  );
};

export default MapComponant;