export interface Stations {
    _id: string;
    id: string;
    position: string;
    waiting: number;
    route: string;
    direction: Stationdirection;
  }
  export interface Stationdirection {
    arrival: number[];
  }

  export interface StationData {
    lat: number;
    lng: number;
  }