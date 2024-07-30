import { ClosestBusResult } from "../containers/calulateDistance/calculateDistance";

export interface Stations {
    _id: string;
    id: string;
    position: string;
    waitingLength: number;
    route: string;
    direction: Stationdirection;
    statusBus: StationBusstatus | null;

  }
  export interface Stationdirection {
    arrival: number[];
    approaching?:  number[];
    departure?: number[];
  }

  export interface StationData {
    lat: number;
    lng: number;
  }

  export interface StationBusstatus {
    busStatus: busStatus;
    busInfo: ClosestBusResult;
}
export enum busStatus{
    approaching="approaching" ,
    departure = "departure"
}