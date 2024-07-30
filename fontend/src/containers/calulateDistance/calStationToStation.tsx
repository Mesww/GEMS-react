import React from 'react';
import { TrackerData } from '../../components/map/stationmarker';

interface Station {
  id: string;
  lat: number;
  lng: number;
  stationId: string;
  stationNameId: string;
  waitingCount: number;
}

interface SelectedMarker {
    key: string;
    value: TrackerData;
}

interface StationToStationComponentProps {
    selectedMarker: SelectedMarker | null;
    closestStation: Station | null;
  }

  const StationToStationComponent: React.FC<StationToStationComponentProps> = ({ selectedMarker, closestStation }) => {
    if (!selectedMarker && !closestStation) {
      return null;
    }

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371000; // Radius of the Earth in meters
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c; // Distance in kilometers
    };

    const [selectedLat, selectedLng] = selectedMarker?.value?.position?.split(', ').map(Number) || [];

    const distance = closestStation ? calculateDistance(selectedLat, selectedLng, closestStation.lat, closestStation.lng) : 0;

    return distance;
  };

  export default StationToStationComponent;