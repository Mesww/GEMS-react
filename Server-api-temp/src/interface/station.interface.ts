import mongoose, { Document } from 'mongoose';
import { interface_User} from './user.interface';

export interface Station extends Document {
    id: string;
    position: string;
    waiting: interface_User[];
    route: string;
    direction: Stationdirection;
  }
export interface Stationdirection {
    arrival: number[];
}