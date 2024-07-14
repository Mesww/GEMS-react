import และใช้ได้เลย 

import useClosestBus from "../../containers/calulateDistance/calculateDistance";


<!-- ตัวอย่าง -->
ใช้ 2 parameter 
const closestBusData = useClosestBus(Location, busData);

    มี busId, distance, busInfo.speed, eta(เวลาประมาณ)


 <div>
      {closestBusData.busId ? (
        <div>
          <p>Closest bus ID: {closestBusData.busId}</p>
          <p>Distance: {closestBusData.distance?.toFixed(2)} km</p>
          <p>Speed: {closestBusData.busInfo?.speed} km/h</p>
          {closestBusData.eta && closestBusData.eta > 0 ? (
            <p>ETA: {closestBusData.eta.toFixed(2)} minutes</p>
          ) : (
            <p>ETA: Unable to calculate at this time or bus is not moving</p>
          )}
        </div>
      ) : (
        <p>No bus data available.</p>
      )}
    </div>