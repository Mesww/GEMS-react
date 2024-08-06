import { useState, useEffect } from "react";
import { Stations } from "../../interfaces/station.interface";
import haversine from "haversine-distance";
import { BusData, BusInfo } from "../../interfaces/bus.interface";

export interface ClosestBusResult {
  busId: string | null;
  distance: number | null;
  busInfo: BusInfo | null;
  eta: number | null; // Estimated Time of Arrival in minutes
}

const useClosestBus = (
  userLocation: google.maps.LatLngLiteral | null,
  busData: BusData | null
): ClosestBusResult => {
  const [closestBus, setClosestBus] = useState<ClosestBusResult>({
    busId: null,
    distance: null,
    busInfo: null,
    eta: null,
  });
  useEffect(() => {
    if (userLocation && busData) {
      let minDistance = Infinity;
      let closestBusId = null;
      let closestBusInfo = null;
      let eta = null;
      // console.log(`userLocation : ${userLocation.lat} ${userLocation.lng}`);
      for (const [busId, busInfo] of Object.entries(busData)) {
        const [busLat, busLng] = busInfo.position.split(",").map(Number);
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          busLat,
          busLng
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestBusId = busId;
          closestBusInfo = busInfo;

          // Calculate ETA
          if (busInfo.speed > 0) {
            // Convert speed from km/h to km/min
            const speedKmPerMin = busInfo.speed / 60;
            // Calculate ETA in minutes
            eta = distance / speedKmPerMin;
          } else {
            eta = null; // Bus is not moving
          }
        }
      }

      setClosestBus({
        busId: closestBusId,
        distance: minDistance,
        busInfo: closestBusInfo,
        eta: eta,
      });
    }
  }, [userLocation, busData]);

  return closestBus;
};

// find bus that closest station ==================================================================================================

export const useCloseststation = (
  stationSelected: Stations | null,
  busData: BusData | null,
  setClosestBus: React.Dispatch<React.SetStateAction<ClosestBusResult | null>>
) => {
  if (!stationSelected || !busData) {
    console.log(`no station selected`);
    return;
  }
  console.log(
    `stationSelected : ${stationSelected.id} ${stationSelected.position}`
  );
  const [lat, lng] = stationSelected.position.split(",").map(Number);
  const stationLocation = { lat, lng };

  if (stationLocation && busData) {
    let minDistance = Infinity;
    let closestBusId = null;
    let closestBusInfo = null;
    let eta = null;
    for (const [busId, busInfo] of Object.entries(busData)) {
      const [busLat, busLng] = busInfo.position.split(",").map(Number);
      console.log(`busLocation : ${busLat} ${busLng}`);
      const distance = haversine(stationLocation, {
        lat: busLat,
        lng: busLng,
      });
      console.log(
        `busid:${busId} \t busLocation : ${busLat} ${busLng} \t distance : ${distance} m`
      );

      // const extractStationName = (
      //   incomingStation: string | null | undefined
      // ): string => {
      //   if (incomingStation === null || incomingStation === undefined) {
      //     return "";
      //   }
      //   const parts = incomingStation.split(" - ");
      //   return parts.length > 1 ? parts[1] : incomingStation;
      // };

      if (
        distance < minDistance &&
        findApproaching({ stationSelected, closestBus: { busId, distance, busInfo, eta } }) !== null
        // extractStationName(busInfo.incomingStation) === stationSelected.name||
        // extractStationName(busInfo.currentStation) === stationSelected.name
      ) {
        minDistance = distance;
        closestBusId = busId;
        closestBusInfo = busInfo;
        // console.log(`incoming ${ extractStationName(busInfo.incomingStation)}`);
        // Calculate ETA
        if (busInfo.speed > 0) {
          // Convert speed from km/h to km/min
          const speedKmPerMin = busInfo.speed / 60;
          // Calculate ETA in minutes
          eta = distance / 1000 / speedKmPerMin;
        } else {
          eta = null; // Bus is not moving
        }
      } else {
        console.log(`not found`);
      }
    }

    setClosestBus({
      busId: closestBusId,
      distance: minDistance,
      busInfo: closestBusInfo,
      eta: eta,
    });
  }
};

export function findApproaching(data: {
  stationSelected: Stations | null;
  closestBus: ClosestBusResult | null;
}): ClosestBusResult | null {
  if (
    data.stationSelected === null ||
    data.closestBus === null ||
    data.closestBus.busInfo === null
  ) {
    return null;
  }
  console.log(`closestBusId : ${data.closestBus.busId}`);

  const [stationlat, stationlng] = data.stationSelected.position
    .split(",")
    .map(Number);
  const [busLat, busLng] = data.closestBus.busInfo.position
    .split(",")
    .map(Number);
  const bearing = calculateBearing(stationlat, stationlng, busLat, busLng);
  if (bearing === null) {
    return null;
  }
  console.log(`bearing : ${bearing}`);

  if (
    data.stationSelected.direction.approaching !== undefined &&
    bearing < data.stationSelected.direction.approaching[1] &&
    bearing > data.stationSelected.direction.approaching[0]
  ) {
    return data.closestBus;
  }
  return null;
}

export function findLeft(data: {
  stationSelected: Stations | null;
  closestBus: ClosestBusResult | null;
}): ClosestBusResult | null {
  if (
    data.stationSelected === null ||
    data.closestBus === null ||
    data.closestBus.busInfo === null
  ) {
    return null;
  }
  const [stationlat, stationlng] = data.stationSelected.position
    .split(",")
    .map(Number);
  const [busLat, busLng] = data.closestBus.busInfo.position
    .split(",")
    .map(Number);
  const bearing = calculateBearing(stationlat, stationlng, busLat, busLng);
  console.log(bearing);
  if (
    data.stationSelected.direction.departure !== undefined &&
    bearing < data.stationSelected.direction.departure[1] &&
    bearing > data.stationSelected.direction.departure[0]
  ) {
    return data.closestBus;
  }
  return null;
}
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

const calculateBearing = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  return ((θ * 180) / Math.PI + 360) % 360;
};

export default useClosestBus;
