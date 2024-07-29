export interface BusInfo {
    direction: number;
    position: string;
    server_time: string;
    speed: number;
    tracker_time: string;
  }
export interface BusData {
    [key: string]: BusInfo;
}
export interface ClosestBusResult {
    busId: string | null;
    distance: number | null;
    busInfo: BusInfo | null;
    eta: number | null; // Estimated Time of Arrival in minutes
  }