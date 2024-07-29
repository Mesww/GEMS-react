import React, { useCallback, useState } from "react";
import { Marker, InfoWindow } from "@vis.gl/react-google-maps";
import { BusData,findApproaching, findLeft, useCloseststation } from "../../containers/calulateDistance/calculateDistance";
import {  Stations } from "../../interfaces/station.interface";

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


  const [stationSelected, setStationSelected] = useState<Stations | null >(null);
  
  const closestBus = useCloseststation(stationSelected, busData);

  // handle marker click
  const handleMarkerClick = useCallback(
    (key: string, value: Stations) => {
      const [lat, lng] = value.position.split(",").map(Number);
      console.log(`Marker ${key} clicked`, value);
      if (setSelectedMarker) {
        setSelectedMarker({ key, value });
      }
      setCenter({ lat, lng });
      setStationSelected(value); // Update selected station
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
                        { closestBus.busId !== null && findApproaching({stationSelected:station,closestBus:closestBus}) !== null && findApproaching({stationSelected:station,closestBus:closestBus})?.eta !== null ? <p>รถหมายเลข {findApproaching({stationSelected:station,closestBus:closestBus})?.busId } กำลังจะมาถึงจะถึงภายใน {findApproaching({stationSelected:station,closestBus:closestBus})?.eta?.toFixed(2) } นาที </p> : findLeft({stationSelected:station,closestBus:closestBus}) !== null ? <p>รถหมายเลข : {findLeft({stationSelected:station,closestBus:closestBus})?.busId} กำลังออก</p> : <p>ยังไม่มีรถที่จะเข้าหรือออกจากป้าย</p>}
                        {closestBus.busId !== null && findApproaching({stationSelected:station,closestBus:closestBus}) !== null ?<p>รถ GEMS จะถึงภายใน  {findApproaching({stationSelected:station,closestBus:closestBus})?.distance?.toFixed() } เมตร</p>:null }
                         {station.direction.arrival!== undefined ? <p>(for Debugging)รถจะหันมาในทิศ {station.direction.arrival[0]} , {station.direction.arrival[1]}  </p> : null}
                         {station.direction.approaching!== undefined ? <p>(for Debugging)รถจะมาถึงในทิศ {station.direction.approaching[0]} , {station.direction.approaching[1]}  </p> : null}
                         {station.direction.departure!== undefined ? <p>(for Debugging)รถจะออกจากป้ายในทิศ {station.direction.departure[0]} , {station.direction.departure[1]}  </p> : null}
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
