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

interface BusInfo {
  direction: number;
  position: string;
  server_time: string;
  speed: number;
  tracker_time: string;
}

interface ClosestBusData {
  busId: string | null;
  distance: number | null;
  busInfo: BusInfo | null;
  eta: number | null;
}

interface StationToStationInputProps {
    selectedMarker: SelectedMarker | null;
    closestStation: Station | null;
    closestBusData: ClosestBusData | null;
}

interface StationToStationResult {
  stationToStationDistance: number;
  busToBusStopDistance: number;
  etaTime: number;
}

const calculateStationToStation = ({ selectedMarker, closestStation, closestBusData }: StationToStationInputProps): StationToStationResult | null => {
  if (!selectedMarker || !closestStation) {
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
    return R * c; // Distance in meters
  };

  const [selectedLat, selectedLng] = selectedMarker.value.position.split(', ').map(Number);

  const stationToStationDistance = calculateDistance(selectedLat, selectedLng, closestStation.lat, closestStation.lng);

  let busToBusStopDistance = 0;
  let etaTime = 0;

  if (closestBusData && closestBusData.busId !== null && closestBusData.busInfo !== null) {
    const [busLat, busLng] = closestBusData.busInfo.position.split(',').map(Number);
    busToBusStopDistance = calculateDistance(selectedLat, selectedLng, busLat, busLng);
    
    // Calculate ETA time in minutes
    if (closestBusData.busInfo.speed > 0) {
      const busSpeedMps = closestBusData.busInfo.speed * (1000 / 3600); // Convert km/h to m/s
      const etaMinutes = busToBusStopDistance / busSpeedMps / 60; // Calculate minutes
      etaTime = Math.ceil(etaMinutes); // Round up to the nearest minute
    
      // Ensure minimum ETA is 1 minute
      if (etaTime < 1) {
        etaTime = 1;
      }
    } else {
      // If speed is 0 or negative, we can't calculate ETA
      etaTime = Infinity;
    }
  }

  return {
    stationToStationDistance,
    busToBusStopDistance,
    etaTime
  };
};

export default calculateStationToStation;