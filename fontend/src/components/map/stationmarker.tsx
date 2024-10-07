import React, { useCallback, useEffect, useState } from "react";
import { Marker, InfoWindow } from "@vis.gl/react-google-maps";
import "./style.sass";
import {
  ClosestBusResult,
  useCloseststation,
} from "../../containers/calulateDistance/calculateDistance";
import { Stations } from "../../interfaces/station.interface";
import { AxiosResponse } from "axios";
import { BusData } from "../../interfaces/bus.interface";
import { useTranslation } from "react-i18next";

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
    } | null>
  >;
  setStation: React.Dispatch<
    React.SetStateAction<AxiosResponse<Stations[], any> | null>
  >;
  urlMarker: string;
}> = ({
  position,
  selectedMarker,
  setSelectedMarker,
  setCenter,
  urlMarker,
  busData,
}) => {
  const [closestBus, setClosestBus] = useState<ClosestBusResult | null>(null);
  const [stationSelected, setStationSelected] = useState<Stations | null>(null);

  // handle marker click
  const handleMarkerClick = useCallback(
    (key: string, value: Stations) => {
      const [lat, lng] = value.position.split(",").map(Number);
      console.log(`Marker ${key} clicked`, value);
      if (setSelectedMarker) {
        setSelectedMarker({ key, value });
      }
      setCenter({ lat, lng });
      // useCloseststation(value, busData, setClosestBus);
      // console.log(`closestBus: ${closestBus?.busId} ${closestBus?.distance}`);
      setStationSelected(value);
    },
    [
      setSelectedMarker,
      setCenter,
      setStationSelected,
      useCloseststation,
      stationSelected,
      busData,
      closestBus,
    ]
  );

  // useEffect to run useCloseststation when busData or stationSelected changes
  useEffect(() => {
    if (stationSelected && busData) {
      useCloseststation(stationSelected, busData, setClosestBus);
    }
  }, [busData, stationSelected]);

  // handle infowindow close
  const handleInfoWindowClose = useCallback(() => {
    if (setSelectedMarker) {
      setSelectedMarker(null);
    }
    setStationSelected(null);
  }, [setSelectedMarker, setStationSelected]);

  if (!position) return null;

  const { t } = useTranslation(); // Import the i18n configuration for language translation

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
            window.google.maps &&
            window.google.maps.Size
          ) {
            return (
              <React.Fragment key={index}>
                <Marker
                  position={{ lat, lng }}
                  title={t("navbar.stationMarker.markerTitle", {
                    stationId: station.id,
                  })}
                  onClick={() => handleMarkerClick(station.id, station)}
                  label={{
                    text: station.id,
                    className: "marker-label",
                    color: "white",
                  }}
                  icon={{
                    url: urlMarker
                      ? `http://maps.google.com/mapfiles/ms/icons/${urlMarker}-dot.png`
                      : "",
                    labelOrigin: new google.maps.Point(15, -10),
                  }}
                  animation={
                    selectedMarker?.value._id == station._id
                      ? window.google.maps.Animation.BOUNCE
                      : null
                  }
                />

                {selectedMarker && selectedMarker.value._id === station._id && (
                  <InfoWindow
                    position={{ lat, lng }}
                    onCloseClick={handleInfoWindowClose}
                    headerContent={t("navbar.stationMarker.infoWindowHeader", {
                      stationId: station.id,
                      stationName: station.name,
                    })}
                    pixelOffset={[0, -45]}
                  >
                    <div>
                      <p>
                        {t("navbar.stationMarker.waitingPassengers", {
                          waitingLength: station.waitingLength,
                        })}
                      </p>

                      {closestBus &&
                      closestBus.distance !== Infinity &&
                      closestBus.distance &&
                      closestBus.distance <= 100 ? (
                        <p>
                          {t("navbar.stationMarker.nearbyBus", {
                            busId: closestBus.busId,
                            distance: closestBus.distance.toFixed(0),
                          })}
                        </p>
                      ) : (
                        <p>{t("navbar.stationMarker.noBus")}</p>
                      )}

                      {/* {station.direction.arrival!== undefined ? <p>(for Debugging)รถจะหันมาในทิศ {station.direction.arrival[0]} , {station.direction.arrival[1]}  </p> : null}
                        {station.direction.approaching!== undefined ? <p>(for Debugging)รถจะมาถึงในทิศ {station.direction.approaching[0]} , {station.direction.approaching[1]}  </p> : null}
                         {station.direction.departure!== undefined ? <p>(for Debugging)รถจะออกจากป้ายในทิศ {station.direction.departure[0]} , {station.direction.departure[1]}  </p> : null} 
                          */}
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
