import React, { useState, useEffect } from 'react';
import "./style.sass";


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

interface ClosestBusProps {
  userLocation: google.maps.LatLngLiteral | null;
  busData: BusData | null;
}

interface ClosestBusResult {
  busId: string | null;
  distance: number | null;
  busInfo: BusInfo | null;
  eta: number | null; // Estimated Time of Arrival in minutes
}

const ClosestBus: React.FC<ClosestBusProps> = ({ userLocation, busData }) => {
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

  return (
    <>
    {closestBus.busId ? (
      <nav className="box fixed top-5 z-50 rounded-xl p-5">
        <p>รถเจมที่ใกล้ที่สุด หมายเลข: {closestBus.busId}</p>
        <p>ระยะทาง: {closestBus.distance?.toFixed(2)} km</p>
        <p>ความเร็ว: {closestBus.busInfo?.speed} km/h</p>
        {closestBus.eta && closestBus.eta > 0 ? (
          <p>จะถึงประมาณ: {closestBus.eta.toFixed(2)} นาที</p>
        ) : (
          <p>จะถึงประมาณ: เกิดปัญหา ไม่สามารถบอกเวลาได้ในขณะนี้ หรือ รถไม่ขยับ</p>
        )}
      </nav>
    ) : (
      <nav className=" box fixed top-5 left-10 z-50 rounded-full">No bus data available.</nav>
    )}
  </>
  );
};

export default ClosestBus;
