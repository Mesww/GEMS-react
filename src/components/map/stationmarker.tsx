import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Marker, InfoWindow } from "@vis.gl/react-google-maps";
import { useWebSocketData } from "../../containers/getGemsDataWebsocket/getGemsWebsocket";
import {  ClosestBusResult, StationData, useCloseststation } from "../../containers/calulateDistance/calculateDistance";
import { WebSocketMessage } from "./mapComponent";

interface TrackerData {
  position: string;
}

interface FetchData {
  status: string;
  data: {
    [key: string]: TrackerData;
  };
}

interface SelectedMarker {
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
  position: FetchData;
  selectedMarker: SelectedMarker | null;
  setSelectedMarker?: (marker: SelectedMarker | null) => void;
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

  if (!position.data) return null;

  return (
    <>
     {Object.entries(position.data).map(([key, value]) => {
        if (value && value.position) {
          const [lat, lng] = value.position.split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lng) && window.google && window.google.maps) {
            return (
              <React.Fragment key={key}>
                <Marker
                  position={{ lat, lng }}
                  title={`ป้ายหมายเลข: ${key}`}
                  onClick={() => handleMarkerClick(key, value)}
                  icon={{
                    url: urlMarker,
                    scaledSize: window.google.maps.Size ? new window.google.maps.Size(54, 54) : null,
                    origin: window.google.maps.Point ? new window.google.maps.Point(0, 0) : null,
                    anchor: window.google.maps.Point ? new window.google.maps.Point(27, 27) : null,
                  }}
                  // icon={iconMarker}
                />
                {closestBus && selectedMarker && selectedMarker.key === key && (
                  <InfoWindow
                    position={{ lat, lng }}
                    onCloseClick={handleInfoWindowClose}
                    headerContent={`ป้ายหมายเลข ${key}`}
                  >
                    <div>
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
