import { useState, useEffect } from 'react';

interface BusInfo {
  direction: number;
  position: string;
  server_time: string;
  speed: number;
  tracker_time: string;
}

interface BusData {
  [key: string]: BusInfo;
}

interface ClosestBusResult {
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

      for (const [busId, busInfo] of Object.entries(busData)) {
        const [busLat, busLng] = busInfo.position.split(',').map(Number);
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

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

export default useClosestBus;