import mongoose, { Schema, Document } from 'mongoose';
import { interface_User } from './users.model';

export interface Station extends Document {
  id: string;
  position: string;
  waiting: interface_User[];
  route: string;
}

const StationSchema: Schema = new Schema({
  id: { type: String, required: true },
  position: { type: String, required: true },
  waiting: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  route: { type: String, required: true }
});

export default mongoose.model<Station>('Station', StationSchema);