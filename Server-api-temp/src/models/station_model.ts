import mongoose, { Schema, Document } from 'mongoose';
import {  userSchema } from './users.model';
import { Station } from '../interface/station.interface';


const statusBusSchema = new mongoose.Schema({
  busStatus: { type: String, enum: ['approaching', 'departure'], required: true },
  busInfo: {
    busId: { type: String, required: true },
    distance: { type: Number, required: true },
    busInfo: { type: Object, required: true },
    eta: { type: Number, required: true },
  },
}, { _id: false });


const StationSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true, default: "" },
  position: { type: String, default: "" },
  waiting: { type: [userSchema], default: [] },
  route: { type: String, required: true },
  direction: { type: Object, default: {} },
  statusBus: { type: statusBusSchema, default: null },
});


export default mongoose.model<Station>('Station', StationSchema);