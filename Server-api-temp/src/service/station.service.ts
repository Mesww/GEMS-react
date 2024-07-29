import { BusData, BusInfo, ClosestBusResult } from "../interface/bus.interface";
import { busStatus, StationBusstatus } from "../interface/station.interface";
import { interface_User } from "../interface/user.interface";
import Station from "../models/station_model";
import haversine from "haversine-distance";
export async function addUserToStation(
  stationId: string,
  user: interface_User
) {
  try {
    const station = await Station.findById(stationId);
    if (station) {
      if (!station.waiting) {
        station.waiting = [];
      }
      station.waiting.push(user);
      await station.save();
      console.log("User added to the waiting list successfully.");
      return {
        status: "Success",
        message: "User added to the waiting list successfully.",
      };
    } else {
      console.log("Station not found.");
      return { status: "Error", message: "Station not found." };
    }
  } catch (error) {
    console.error("Error adding user to the waiting list:", error);
    return {
      status: "Error",
      message: "Error adding user to the waiting list.",
    };
  }
}
export async function findClosestStation(busData:BusData) {
  try {
    const stations = await Station.find();
    if (!stations.length) {
      throw new Error("No stations found.");
    }
    if (!busData) {
      throw new Error("No bus data found.");
    }

    for (const station of stations) {
      const [lat, lng] = station.position.split(",").map(Number);
      const stationLocation = { lat, lng };

      let approaching = null;
      let departure = null;

      let minDistance = Infinity;
      const maxDistance = 50;

      for (const [busId, busInfo] of Object.entries(busData)) {
        const [busLat, busLng] = busInfo.position.split(",").map(Number);
        const busLocation = { lat: busLat, lng: busLng };
        const distance = haversine(stationLocation, busLocation);

        if (distance < maxDistance && distance < minDistance && busInfo.speed > 0) {
          const speed = busInfo.speed / 60;
          const eta = (distance / 1000) / speed;
          const bearing = calculateBearing(lat, lng, busLat, busLng);

          const isApproaching = station.direction.arrival[0] <= bearing && bearing <= station.direction.arrival[1];
          const isDeparture = station.direction.departure[0] <= bearing && bearing <= station.direction.departure[1];

          if (isApproaching) {
            approaching = { busId, distance, busInfo, eta };
            departure = null;
            minDistance = distance;
          } else if (isDeparture) {
            departure = { busId, distance, busInfo, eta };
            approaching = null;
            minDistance = distance;
          }
        }
      }

      if (approaching) {
        station.statusBus = { busStatus: busStatus.approaching, busInfo: approaching };
        console.log(`Station ${station.id} - closest approaching busId: ${approaching.busId}, distance: ${approaching.distance.toFixed(0)}, eta: ${approaching.eta}`);
      } else if (departure) {
        station.statusBus = { busStatus: busStatus.departure, busInfo: departure };
        console.log(`Station ${station.id} - closest departing busId: ${departure.busId}, distance: ${departure.distance.toFixed(0)}, eta: ${departure.eta}`);
      } else {
        station.statusBus = null;
        console.log(`Station ${station.id} - No approaching or departing buses within range.`);
      }

      await station.save();
    }
  } catch (error) {
    console.error("Error finding closest station:", error);
  }
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
