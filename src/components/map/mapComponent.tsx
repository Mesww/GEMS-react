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
import StationMarker from "./stationmarker";

const MAPID = import.meta.env.VITE_MAPID;

interface TrackerData {
  server_time: string;
  tracker_time: string;
  direction: number;
  position: string;
  speed: number;
}

export interface WebSocketMessage {
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

  // station markers mock ==================================================================================================
  const stationmarkers1 = {
    status: "ok",
    data: {
      "1": { position: "20.058752, 99.898396" },
      "2": { position: "20.057039, 99.896930" },
      "3": { position: "20.054683, 99.894515" },
      "4": { position: "20.052544, 99.892316" },
      "5": { position: "20.050816843021277, 99.89121969349162" },
      "6": { position: "20.049137353450433, 99.891250485570452" },
      "7": { position: "20.048193, 99.893221" },
      "8": { position: "20.047264832318994, 99.89314563095694" },
      "9": { position: "20.045503, 99.891442" },
      "10": { position: "20.043881444753783, 99.89348617576454" },
      "11": { position: "20.043919609786567, 99.89490923095694" },
      "12": { position: "20.043311336533844, 99.89529707515575" },
      "13": { position: "20.043845538331563, 99.8934754469289" },
      "14": { position: "20.045659393241642, 99.89133178188165" },
      "15": { position: "20.049391118491396, 99.89111283095696" },
      "16": { position: "20.05083048583872, 99.89115650886787" },
      "17": { position: "20.052689636083315, 99.89234180090831" },
      "18": { position: "20.05473222049373, 99.89448019896511" },
      "19": { position: "20.056897650552507, 99.89711855304603" },
      "20": { position: "20.05806378447924, 99.89787541746388" },
      "21": { position: "20.058966957817436, 99.8995173298247" }
    },
  };
  // ==================================================================================================

  // interface SelectedMarker ==================================================================================================
  interface SelectedstationMarker {
    key: string;
    value: TrackerstatioData;
  }
  interface TrackerstatioData {
    position: string;
  }
  // ==================================================================================================

  // set selected station markers=================================================================================================
  const [selectedstationMarker, setselectedstationMarker] =
    useState<SelectedstationMarker | null>(null);
  // ==================================================================================================



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

        {/* station markers */}
        <StationMarker
          position={stationmarkers1}
          selectedMarker={selectedstationMarker}
          setSelectedMarker={setselectedstationMarker}
          setCenter={setCenter}
        />
      </APIProvider>
    </>
  );
};

export default MapComponant;
