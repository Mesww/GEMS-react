import React, { useCallback,  useState } from "react";
import { Marker, InfoWindow } from "@vis.gl/react-google-maps";
import "./style.sass";
import { BusData,ClosestBusResult,useCloseststation } from "../../containers/calulateDistance/calculateDistance";
import {   Stations } from "../../interfaces/station.interface";
import { AxiosResponse } from "axios";

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
    } |null>
  >;
  setStation: React.Dispatch<React.SetStateAction<AxiosResponse<Stations[], any> | null>>;
  urlMarker: string;
}> = ({
  position,
  selectedMarker,
  setSelectedMarker,
  setCenter,
  urlMarker,
  busData
}) => {
  const [closestBus, setClosestBus] = useState<ClosestBusResult | null>(null);
  const [stationSelected, setStationSelected] = useState<Stations | null >(null);
  
  // handle marker click
  const handleMarkerClick = useCallback(
    (key: string, value: Stations) => {
      const [lat, lng] = value.position.split(",").map(Number);
      console.log(`Marker ${key} clicked`, value);
      if (setSelectedMarker) {
        setSelectedMarker({ key, value });
      }
      setCenter({ lat, lng });
      useCloseststation(value, busData, setClosestBus);
      setStationSelected(value) ;
    },
    [setSelectedMarker, setCenter,setStationSelected,useCloseststation,stationSelected,busData,closestBus]
  );
  
  // handle infowindow close
  const handleInfoWindowClose = useCallback(() => {
  if (setSelectedMarker  ) {
      setSelectedMarker(null);
    }
    setStationSelected(null);
  }, [setSelectedMarker,setStationSelected]);


  if (!position) return null;

  return (
    <>
      {position.map((station, index) => {
        if (station && station.position) {
          // console.log(`station: ${station.id} ${station.position} ${station.statusBus?.busInfo.busId}`);
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
                  label={{text:station.id,className: 'marker-label',
                    color: 'white',}}
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
                        {/* <p>คนที่รอในขณะนี้: {station.waitingLength} คน</p> */}
                        {closestBus.busId !== null && closestBus.distance !== null && closestBus.distance <=100 ? <p>มีรถgemsหมายเลข {closestBus.busId} อยู่ใกล้เคียงในระยะ {closestBus.distance?.toFixed(0)} เมตร</p>:"ไม่มีรถในระยะ"}
                         {/* {station.direction.arrival!== undefined ? <p>(for Debugging)รถจะหันมาในทิศ {station.direction.arrival[0]} , {station.direction.arrival[1]}  </p> : null}
                         {station.direction.approaching!== undefined ? <p>(for Debugging)รถจะมาถึงในทิศ {station.direction.approaching[0]} , {station.direction.approaching[1]}  </p> : null}
                         {station.direction.departure!== undefined ? <p>(for Debugging)รถจะออกจากป้ายในทิศ {station.direction.departure[0]} , {station.direction.departure[1]}  </p> : null} */}
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
