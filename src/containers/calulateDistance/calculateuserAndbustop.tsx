import { useState, useEffect, useRef } from "react";
import axios from "axios"; // Import axios

const api = import.meta.env.VITE_API;

interface StationData {
  _id: string;
  id:string;
  position: string;
  waiting: number;
}

interface Station {
  id: string;
  lat: number;
  lng: number;
}

interface Location {
  lat: number;
  lng: number;
}

interface ClosestStation extends Station {
  _id: string;
  id:string;
  distance: number; // in meters
}

function parsePosition(position: string): [number, number] {
  const [lat, lng] = position
    .split(",")
    .map((coord) => parseFloat(coord.trim()));
  return [lat, lng];
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

function useNearestStation(
  stationData: { [key: string]: StationData },
  userLocation: Location | null
): ClosestStation | null {
  const [closestStation, setClosestStation] = useState<ClosestStation | null>(
    null
  );
  const prevLocationRef = useRef<Location | null>(null);

  useEffect(() => {
    if (
      userLocation &&
      stationData && // Add this check
      Object.keys(stationData).length > 0 && // Ensure stationData is not empty
      (!prevLocationRef.current ||
        userLocation.lat !== prevLocationRef.current.lat ||
        userLocation.lng !== prevLocationRef.current.lng)
    ) {
      let closest: ClosestStation | null = null;
      let minDistance = Infinity;

      Object.entries(stationData).forEach(([id, data]) => {
        const [lat, lng] = parsePosition(data.position);
        const stationId = data._id;
        const stationNameId = data.id;
        const waitingCount = data.waiting;
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          lat,
          lng,
          
        );

        if (distance < minDistance) {
          minDistance = distance;
          closest = { id, lat, lng, distance, stationId, stationNameId, waitingCount};
        }
      });

      setClosestStation(closest);
      prevLocationRef.current = userLocation;
    }
  }, [userLocation, stationData]);

  // Effect เพื่อตรวจสอบและส่งคำขอเมื่อระยะทาง <= 25 เมตร
  useEffect(() => {
    if (closestStation && closestStation.distance <= 900) {
      let dateTime = new Date();
      axios
        .post(`${api}/activity`, {
          studentid: "test",
          location: `${closestStation.lat}, ${closestStation.lng}`,
          marker: closestStation.stationNameId,
          time: dateTime,
          route: "test",
        })
        .then((response) => {
          console.log("Activity posted successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error posting activity:", error);
        });
        
      axios.patch(`${api}/updateWaiting/${closestStation.stationId}`,{
        waiting: closestStation.waitingCount + 1
      }).then((response) => {
        console.log('Updated' , response.data);
      }).catch((error) => {
        console.log("Error updating" + error);
      })
        
    }
  }, [closestStation]);

  return closestStation;
}

export default useNearestStation;
