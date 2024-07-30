import mongoose, { Document } from 'mongoose';
import { interface_User} from './user.interface';
import { ClosestBusResult } from './bus.interface';

export interface Station extends Document {
    id: string;
    position: string;
    waiting: interface_User[];
    route: string;
    direction: Stationdirection;
    statusBus: StationBusstatus | null;
  }
export interface Stationdirection {
    arrival: number[];
    approaching:number[];
    departure:number[];
}
export interface StationBusstatus {
    busStatus: busStatus;
    busInfo: ClosestBusResult;
}
export enum busStatus{
    approaching="approaching" ,
    departure = "departure"
}