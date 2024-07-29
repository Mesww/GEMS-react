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
export async function findClosestStation(busData: BusData) {
  try {
    const stations = await Station.find();
    if (!stations) {
      console.log("No stations found.");
      throw new Error("No stations found.");
    }
    // console.log(busData);
    if (!busData) {
      console.log("No bus data found.");
      throw new Error("No bus data found.");
    }
    stations.forEach(async (station) => {
      const approaching:ClosestBusResult ={
        busId: null,
        distance: null,
        busInfo: null,
        eta: null,
      };
      const departure:ClosestBusResult ={
        busId: null,
        distance: null,
        busInfo: null,
        eta: null,
      };
      const [lat, lng] = station.position.split(",").map(Number);
      const stationLocation = { lat, lng };
      let minDistance = Infinity;
      const maxDistance = 50;
      let closestBusId = null;
      let closestBusInfo = null;
      let eta = null;
      for (const [busId, busInfo] of Object.entries(busData)) {
        const [busLat, busLng] = busInfo.position.split(",").map(Number);
        const busLocation = { lat: busLat, lng: busLng };
        const distance = haversine(stationLocation, busLocation);
        if (
          (distance < maxDistance &&
            distance < minDistance &&
            busInfo.direction >= station.direction.arrival[0]) ||
          busInfo.direction <= station.direction.arrival[1]
            && busInfo.speed > 0 
        ) {
          minDistance = distance;
          closestBusId = busId;
          closestBusInfo = busInfo;
          const speed = busInfo.speed/60;
          eta = (distance/1000) / speed;
        }
      }

      
      if (minDistance !== Infinity && closestBusId !== null && closestBusInfo !== null && eta !== null && minDistance < maxDistance) {
        const [busLat, busLng] = closestBusInfo.position.split(",").map(Number);
        const bearing = calculateBearing(lat, lng, busLat ,busLng);
        let isApproaching = station.direction.arrival[0] <= bearing && bearing <= station.direction.arrival[1];
        let isDeparture = station.direction.departure[0] <= bearing && bearing <= station.direction.departure[1];
        
        if (isApproaching) {
          isDeparture = false;
          departure.busId = null;
          departure.distance = null;
          departure.busInfo = null;
          departure.eta = null;
          approaching.busId = closestBusId;
          approaching.distance = minDistance;
          approaching.busInfo = closestBusInfo;
          approaching.eta = eta;
          console.log(`Station ${station.id} Bearing: ${bearing}`);
        console.log(`Station ${station.id} - isApproaching: ${isApproaching}, isDeparture: ${isDeparture}`);

          console.log(`closestBusId : ${approaching.busId} Distance : ${approaching.distance.toFixed(0)} ETA : ${approaching.eta}`);
          console.log(busStatus.approaching);
          station.statusBus = {busStatus:busStatus.approaching,busInfo: approaching};
        }else if(isDeparture){
          isApproaching = false;
          approaching.busId = null;
          approaching.distance = null;
          approaching.busInfo = null;
          approaching.eta = null;
          departure.busId = closestBusId;
          departure.distance = minDistance;
          departure.busInfo = closestBusInfo;
          departure.eta = eta;
          console.log(`Station ${station.id} Bearing: ${bearing}`);
          console.log(`Station ${station.id} - isApproaching: ${isApproaching}, isDeparture: ${isDeparture}`);
          console.log(busStatus.departure);
          console.log(`closestBusId : ${approaching.busId} Distance : ${approaching.distance} ETA : ${approaching.eta}`);
          station.statusBus = {busStatus:busStatus.departure,busInfo: departure};
        }else{
          station.statusBus = null;
        }
        await station.save();
      }
    
    });
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
