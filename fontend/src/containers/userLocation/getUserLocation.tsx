import { useState, useEffect } from 'react';

interface UserLocation {
  lat: number;
  lng: number;
}

const useUserLocation = (): UserLocation | null => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
     
      const options = {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0
      };


      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          console.log("User location updated:", position.coords);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
        options
      );

      return () => {
        navigator.geolocation.clearWatch(watchId); // หยุดการติดตามตำแหน่งเมื่อคอมโพเนนท์ถูกถอดออก
      };
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return userLocation;
};

export default useUserLocation;
