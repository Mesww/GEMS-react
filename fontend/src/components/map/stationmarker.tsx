import React, { useCallback, useMemo, useState } from "react";
import { Marker, InfoWindow } from "@vis.gl/react-google-maps";
import { useWebSocketData } from "../../containers/getGemsDataWebsocket/getGemsWebsocket";
import {  StationData, useCloseststation } from "../../containers/calulateDistance/calculateDistance";
import { WebSocketMessage } from "./mapComponent";
import { Stations } from "../../containers/station/getStation.tsx";

export interface TrackerData {
  _id: string;
  position: string;
  
}

// interface FetchData {
//   status: string;
//   data: {
//     [key: string]: TrackerData;
//   };
// }

export interface SelectedMarker {
  key: string;
  value: TrackerData;
}

// export interface IconMarker {
//   url: string;
//   scaledSize?: google.maps.Size;
//   origin?: google.maps.Point;
//   anchor?: google.maps.Point;
// }

const StationMarker: React.FC<{
  position: Stations[]; 
  selectedMarker: SelectedMarker | null;
  setSelectedMarker: (marker: SelectedMarker | null) => void;
  setCenter: React.Dispatch<
    React.SetStateAction<{
      lat: number;
      lng: number;
    }>
  
  >;
  urlMarker: string;
}> = ({ position, selectedMarker, setSelectedMarker, setCenter,urlMarker }) => {
  const [stationLocation, setStationLocation] = useState<StationData | null>(null);

  // Receive data from websocket
  const { messages } = useWebSocketData() as {
    messages: WebSocketMessage | null;
  };

  const data = useMemo(() => {
    return messages && messages.status === "ok" ? messages.data : null;
  }, [messages]);

  // Call useCloseststation hook with the station location
  const closestBus = useCloseststation(stationLocation, data);

  // handle marker click
  const handleMarkerClick = useCallback((key: string, value: TrackerData) => {
    const [lat, lng] = value.position.split(",").map(Number);
    console.log(`Marker ${key} clicked`, value);
    if (setSelectedMarker) {
      setSelectedMarker({ key, value });
    }
    setCenter({ lat, lng });
    setStationLocation({ lat, lng }); // Update station location
  }, [setSelectedMarker, setCenter]);

  // handle infowindow close
  const handleInfoWindowClose = useCallback(() => {
    if (setSelectedMarker) {
      setSelectedMarker(null);
    }
  }, [setSelectedMarker]);

  if (!position) return null;

  return (
    <>
    {position.map((station, index) => {
      if (station && station.position && window.google) {
        const [lat, lng] = station.position.split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lng) && window.google && window.google.maps) {
          return (
            <React.Fragment key={index}>
              <Marker
                position={{ lat, lng }}
                title={`ป้ายหมายเลข: ${station.id}`}
                onClick={() => handleMarkerClick(station.id, station)}
                label={station.id}
                icon={{
                  url: urlMarker,
                  scaledSize: window.google.maps.Size ? new window.google.maps.Size(54, 54) : null,
                  origin: window.google.maps.Point ? new window.google.maps.Point(0, 0) : null,
                  anchor: window.google.maps.Point ? new window.google.maps.Point(27, 27) : null,
                }}
              />
                {closestBus && selectedMarker && selectedMarker.value._id === station._id && (
                  <InfoWindow
                    position={{ lat, lng }}
                    onCloseClick={handleInfoWindowClose}
                    headerContent={`ป้ายหมายเลข ${station.id}`}
                  >
                    <div>
                      <p>คนที่รอในขณะนี้: {station.waitingLength} คน</p>
                      <p>รถ GEMS หมายเลข {closestBus.busId} จะถึงภายในอีก { closestBus.eta !== null ? closestBus.eta.toFixed(2) : "?" } นาที</p>
                    </div>
                  </InfoWindow>
                )}
              </React.Fragment>
            );
          }else{
            console.log("window.google.maps not found...");
          }
        }
        return null;
      })}
    </>
  );
};

export default StationMarker;
