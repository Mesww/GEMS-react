import {
  APIProvider,
  InfoWindow,
  Map,
  Marker,
} from "@vis.gl/react-google-maps";
import { useWebSocketData } from "../../containers/getGemsDataWebsocket/getGemsWebsocket";
import { useCallback, useMemo, useState } from "react";
import React from "react";
import useUserLocation from "../../containers/userLocation/getUserLocation";

const MAPID = import.meta.env.VITE_MAPID;

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

interface SelectedMarker {
  key: string;
  value: TrackerData;
}

const MapComponant = () => {
  // set center
  const [center, setCenter] = useState({
    lat: 20.045116568504863,
    lng: 99.89429994369891,
  });

  // รับข้อมูลจาก websocket  ================================================
  const { messages } = useWebSocketData() as {
    messages: WebSocketMessage | null;
  };
  const data = useMemo(() => {
    return messages && messages.status === "ok" ? messages.data : null;
  }, [messages]);

  // ตำแหน่งของผู้ใช้งาน  ================================================
  const location = useUserLocation();


  
  // markers รถเจม ==================================================================================================
  // เซ็ท marker ที่เลือก
  const [selectedMarker, setSelectedMarker] = useState<SelectedMarker | null>(
    null
  );

  // handle คลิก markers
  const handleMarkerClick = useCallback((key: string, value: TrackerData) => {
    const [lat, lng] = value.position.split(",").map(Number);
    console.log(`Marker ${key} clicked`, value);
    setSelectedMarker({ key, value });
    setCenter({ lat, lng });
  }, []);

  // handle ปิด infowindow
  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  // Keep this useMemo for other markers ตำแหน่งรถเจม
  const markers = useMemo(() => {
    if (!data) return null;
    return Object.entries(data).map(([key, value]) => {
      if (value && value.position) {
        const [lat, lng] = value.position.split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          return (
            <React.Fragment key={key}>
              <Marker
                position={{ lat, lng }}
                title={`รถเจมหมายเลข: ${key}`}
                onClick={() => handleMarkerClick(key, value)}
                icon={{
                  url: "src/assets/Bus.svg",
                  scaledSize: new window.google.maps.Size(64, 36), // Adjusted size as needed
                  origin: new window.google.maps.Point(0, 0), // The origin point of the icon image (usually top-left)
                  anchor: new window.google.maps.Point(32, 18), // The anchor point of the icon image (center bottom for 64x36)
                  rotation: value.direction, // Set the rotation based on direction
                }}
              />
              {selectedMarker && selectedMarker.key === key && (
                <InfoWindow
                  position={{ lat: lat, lng: lng }}
                  onCloseClick={handleInfoWindowClose}
                  headerContent={`รถเจมหมายเลข ${key}`}
                >
                  <div>
                    <p>ความเร็ว: {value.speed} km/h</p>
                  </div>
                </InfoWindow>
              )}
            </React.Fragment>
          );
        }
      }
      return null;
    });
  }, [data, handleMarkerClick, selectedMarker, handleInfoWindowClose]);


  return (
    <>
      <APIProvider apiKey={""}>
        <Map
          style={{ width: "100%", height: "100vh" }}
          defaultZoom={15}
          defaultCenter={center}
          mapId={MAPID}
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
