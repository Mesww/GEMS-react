"use client";
import { MarkerF } from "@react-google-maps/api";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { useState, useMemo, useEffect } from "react";
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


export default function Maptest() {
  //เซ็ทตรงกลางแมพ
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
    <APIProvider apiKey={""} onLoad={() => console.log("Maps API has loaded.")}>
      <Map
        style={{ width: "100%", height: "100vh" }}
        defaultZoom={13}
        mapId={'af4f705e9a1cc81f'}
        defaultCenter={{ lat: 20.058851, lng: 99.899769 }}
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log(
            "camera changed:",
            ev.detail.center,
            "zoom:",
            ev.detail.zoom
          )
        }
      >
       {markers}
      </Map>
    </APIProvider>
  );
}
