import { useState, useEffect, useRef } from "react";
import axios from "axios"; // Import axios
import { Stations } from "../station/getStation";



const api = import.meta.env.VITE_API;



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
  id: string;
  distance: number; // in meters
  stationId: string;
  stationNameId: string;
  waitingCount: number;
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
  stationData:Stations[],
  userLocation: Location | null
): ClosestStation | null {
  const [closestStation, setClosestStation] = useState<ClosestStation | null>(
    null
  );
  const prevLocationRef = useRef<Location | null>(null);

  useEffect(() => {
    if (
      userLocation &&
      stationData &&
      Object.keys(stationData).length > 0 &&
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
  const [userWaiting, setUserWaiting] = useState(false);
  useEffect(() => {
    // Function to decrement waiting count
    const decrementWaitingCount = () => {
      if (userWaiting && closestStation) {
        axios.patch(`${api}/updateWaiting/${closestStation.stationId}`, {
          waiting: closestStation.waitingCount - 1
        })
          .then((response) => {
            console.log("Updated before unload", response.data);
          })
          .catch((error) => {
            console.error("Error updating before unload:", error);
          });
      }
    };

    // Add event listener for beforeunload
    window.addEventListener('beforeunload', decrementWaitingCount);

    // Your existing effect logic
    if (closestStation && closestStation.distance <= 900 && !userWaiting) {
      let dateTime = new Date().toISOString();
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
          return axios.patch(`${api}/updateWaiting/${closestStation.stationId}`, {
            waiting: closestStation.waitingCount + 1
          });
        })
        .then((response) => {
          console.log('Updated', response.data);
          setUserWaiting(true);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    else if (closestStation && userWaiting && closestStation.distance >= 900) {
      axios.patch(`${api}/updateWaiting/${closestStation.stationId}`, {
        waiting: closestStation.waitingCount - 1
      })
        .then((response) => {
          console.log("Updated", response.data);
          setUserWaiting(false);
        })
        .catch((error) => {
          console.error("Error updating:", error);
        });
    }
    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', decrementWaitingCount);
      // Also decrement count when component unmounts if user is still waiting
      decrementWaitingCount();
    };
  }, [closestStation, userWaiting]);

  return closestStation;
}

export default useNearestStation;