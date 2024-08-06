export interface BusInfo {
    _id:string;
    direction: number;
    position: string;
    server_time: string;
    speed: number;
    tracker_time: string;
    currentStation: string;
    incomingStation: string;
    incomingEta: string;
  }
export interface BusData {
    [key: string]: BusInfo;
  }