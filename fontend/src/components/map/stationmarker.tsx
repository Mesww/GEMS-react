import React, { useCallback, useMemo, useState } from "react";
import { Marker, InfoWindow } from "@vis.gl/react-google-maps";
import { useWebSocketData } from "../../containers/getGemsDataWebsocket/getGemsWebsocket";
import { BusData, useCloseststation } from "../../containers/calulateDistance/calculateDistance";
import { WebSocketMessage } from "./mapComponent";
import { StationData, Stations } from "../../interfaces/station.interface";

export interface TrackerData {
  _id: string;
  position: string;
}

export interface SelectedMarker {
  key: string;
  value: TrackerData;
}

const StationMarker: React.FC<{
  position: Stations[];
  busData: BusData | null;
  selectedMarker: SelectedMarker | null;
  setSelectedMarker: (marker: SelectedMarker | null) => void;
  setCenter: React.Dispatch<
    React.SetStateAction<{
      lat: number;
      lng: number;
    }>
  >;
  urlMarker: string;
}> = ({
  position,
  selectedMarker,
  setSelectedMarker,
  setCenter,
  urlMarker,
  busData
}) => {
  const [stationLocation, setStationLocation] = useState<StationData | null>(
    null
  );
  const [stationDiarction, setStationDirection] = useState<number[]>([]);

  // Receive data from websocket
  const { messages } = useWebSocketData() as {
    messages: WebSocketMessage | null;
  };

  // const data = useMemo(() => {
  //   return messages && messages.status === "ok" ? messages.data : null;
  // }, [messages]);

  

  // Call useCloseststation hook with the station location
  const closestBus = useCloseststation(stationLocation, busData,stationDiarction);

  // handle marker click
  const handleMarkerClick = useCallback(
    (key: string, value: Stations) => {
      const [lat, lng] = value.position.split(",").map(Number);
      console.log(`Marker ${key} clicked`, value);
      if (setSelectedMarker) {
        setSelectedMarker({ key, value });
      }
      setCenter({ lat, lng });
      setStationLocation({ lat, lng }); // Update station location
      setStationDirection(value.direction.arrival); // Update station direction
    },
    [setSelectedMarker, setCenter]
  );

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
        if (station && station.position) {
          const [lat, lng] = station.position.split(",").map(Number);
          if (
            !isNaN(lat) &&
            !isNaN(lng) &&
            window.google &&
            window.google.maps
          ) {
            return (
              <React.Fragment key={index}>
                <Marker
                  position={{ lat, lng }}
                  title={`ป้ายหมายเลข: ${station.id}`}
                  onClick={() => handleMarkerClick(station.id, station)}
                  label={station.id}
                  icon={{
                    url: urlMarker,
                    scaledSize: window.google.maps.Size
                      ? new window.google.maps.Size(54, 54)
                      : null,
                    origin: window.google.maps.Point
                      ? new window.google.maps.Point(0, 0)
                      : null,
                    anchor: window.google.maps.Point
                      ? new window.google.maps.Point(27, 27)
                      : null,
                  }}
                />
                {closestBus &&
                  selectedMarker &&
                  selectedMarker.value._id === station._id && (
                    <InfoWindow
                      position={{ lat, lng }}
                      onCloseClick={handleInfoWindowClose}
                      headerContent={`ป้ายหมายเลข ${station.id}`}
                    >
                      <div>
                        <p>คนที่รอในขณะนี้: {station.waiting} คน</p>
                        <p>
                          รถ GEMS หมายเลข {closestBus.busId} จะถึงภายในอีก{" "}
                          {closestBus.eta !== null
                            ? closestBus.eta.toFixed(2)
                            : "?"}{" "}
                          นาที
                        </p>
                        <p>รถ GEMS หมายเลข {closestBus.busId} จะถึงภายใน {closestBus.distance?.toFixed(0)} เมตร</p>
                         {station.direction.arrival!== undefined ? <p>รถจะมาถึงในทิศ {station.direction.arrival[0]} , {station.direction.arrival[1]}  </p> : null}
                      </div>
                    </InfoWindow>
                  )}
              </React.Fragment>
            );
          } else {
            console.log("window.google.maps not found...");
          }
        }
        return null;
      })}
    </>
  );
};

export default StationMarker;
