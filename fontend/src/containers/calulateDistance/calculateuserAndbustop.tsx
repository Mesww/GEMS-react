import { useState, useEffect, useRef } from "react";
import axios from "axios"; // Import axios
import { Stations } from "../../interfaces/station.interface";
import { getUserinfo } from "../login/Login";
import { useCookies } from "react-cookie";

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

interface UserInfo {
  // Define the structure of your user info here
  id: string;
  name: string;
  email: string;
  role: string;
  // Add other relevant fields
}

interface ClosestStation extends Station {
  id: string;
  distance: number; // in meters
  stationId: string;
  stationNameId: string;
  waitingCount: number;
  route: string
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

  // get user info ===================================
  const [cookie] = useCookies(["token"]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  useEffect(() => {
    console.log("useEffect for fetching user info is running");
  
    const fetchUserInfo = async () => {
      console.log("fetchUserInfo function started");
      try {
        console.log("Attempting to fetch user info with token:", cookie.token);
        const info:any = await getUserinfo(cookie.token);
        console.log("User info fetched successfully:", info);
        setUserInfo(info);
        console.log("User info set in state");
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo(); 
    console.log("useEffect cleanup");
    return () => {
      console.log("useEffect cleanup function called");
    };
  }, [cookie.token]);
  // =======================================================


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
        const waitingCount = data.waitingLength;
        const route = data.route;
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          lat,
          lng,
          
        );

        if (distance < minDistance) {
          minDistance = distance;
          closest = { id, lat, lng, distance, stationId, stationNameId, waitingCount ,route};
        }
      });

      setClosestStation(closest);
      prevLocationRef.current = userLocation;
    }
  }, [userLocation, stationData]);

  // Effect เพื่อตรวจสอบและส่งคำขอเมื่อระยะทาง <= 25 เมตร

  useEffect(() => {
    if (closestStation && closestStation.distance <= 30 && userInfo) {
      let dateTime = new Date().toISOString();
      axios
        .post(`${api}/activity`, {
          email: userInfo.email,
          location: `${closestStation.lat}, ${closestStation.lng}`,
          marker: closestStation.stationNameId,
          time: dateTime,
          route: closestStation.route,
        })
        .then(async (response) => {
          console.log("Activity posted successfully:", response.data);
          // add user to station
          return await axios.post(`${api}/addusertoStaion`, {
            id: closestStation.stationId,
            name: userInfo.name,
            email: userInfo.email,
            role: userInfo.role
          }, {
            headers: { "x-auth-token": cookie.token }
          });
        })
        .then((response) => {
          console.log('addusertoStaion', response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [closestStation, userInfo]);

  return closestStation;
}

export default useNearestStation;