import mongoose, { Schema, Document } from 'mongoose';

export interface Station extends Document {
  id: string;
  position: string;
  waiting: number;
  route: string;
}

const StationSchema: Schema = new Schema({
  id: { type: String, required: true },
  position: { type: String, required: true },
  waiting: { type: Number, default: 0 },
  route: { type: String, required: true }
});

export default mongoose.model<Station>('Station', StationSchema);