import mongoose, { Schema, Document } from 'mongoose';
import {  userSchema } from './users.model';
import { Station } from '../interface/station.interface';

const StationSchema: Schema = new Schema({
  id: { type: String, required: true },
  position: { type: String, required: true },
  waiting:{ type: [userSchema], default: []},
  route: { type: String, required: true },
  direction: { type: Object, required: true },
  statusBus: { type: Object,default: null },
});

export default mongoose.model<Station>('Station', StationSchema);