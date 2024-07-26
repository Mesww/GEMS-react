import { useState, useEffect } from "react";
import { StationData } from "../../interfaces/station.interface";
import haversine from "haversine-distance";
interface BusInfo {
  _id: string;
  direction: number;
  position: string;
  server_time: string;
  speed: number;
  tracker_time: string;
}
export interface BusData {
  [key: string]: BusInfo;
}

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
  stationLocation: StationData | null,
  busData: BusData | null,
  stationDiarction: number[]
): ClosestBusResult => {
  const [closestBus, setClosestBus] = useState<ClosestBusResult>({
    busId: null,
    distance: null,
    busInfo: null,
    eta: null,
  });

  useEffect(() => {
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
        console.log(`busid:${busId} \t busLocation : ${busLat} ${busLng} \t distance : ${distance} m`);
        if (
          distance < minDistance &&
          busInfo.direction >= stationDiarction[0] &&
          busInfo.direction <= stationDiarction[1]
        ) {
          minDistance = distance;
          closestBusId = busId;
          closestBusInfo = busInfo;
          console.log(`closestBusId : ${closestBusId}`);
          // Calculate ETA
          if (busInfo.speed > 0) {
            // Convert speed from km/h to km/min
            const speedKmPerMin = busInfo.speed / 60;
            // Calculate ETA in minutes
            eta = (distance / 1000) / speedKmPerMin;
          } else {
            eta = 0; // Bus is not moving
          }
        }else{
          console.log(`not found`);
        }
      }
      if (closestBusInfo === null) {
        return;
      }
      
      let hasLeftStation = false;


      // console.log(Object.entries(busData)[0][1].position);
      const [busLat, busLng] = closestBusInfo.position.split(",").map(Number);
      console.log(`minDistance : ${minDistance} m`);

      // bearing is calulated degree from station to bus 
        const bearing = calculateBearing(stationLocation.lat, stationLocation.lng, busLat,busLng);
        if (bearing >0 &&  bearing <= stationDiarction[1]) {
          console.log(`bearing : ${bearing}`);
           hasLeftStation = closestBusInfo 
      ? hasBusLeftStation(closestBusInfo, stationLocation)
      : false;
        }
    
      console.log(`hasLeft: ${hasLeftStation}`);

      setClosestBus({
        busId: closestBusId,
        distance: minDistance,
        busInfo: closestBusInfo,
        eta: eta,
      });
    }
  }, [stationLocation, busData]);

  return closestBus;
};

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
const DISTANCE_THRESHOLD = 0.5;
const hasBusLeftStation = (
  busLocation: BusInfo,
  stationLocation: { lat: number; lng: number }
): boolean => {
  const [busLat, busLng] = busLocation.position.split(",").map(Number);
  const distance = haversine(
   {"lat": busLat,
    "lng":busLng,},
    stationLocation
  );
  return distance > DISTANCE_THRESHOLD;
};

const calculateBearing = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  return (θ * 180 / Math.PI + 360) % 360;
};

export default useClosestBus;
