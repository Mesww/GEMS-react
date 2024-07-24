import mongoose, { Schema, Document } from 'mongoose';

export interface Polyline extends Document {
  name: string;
  color: string;
  path: [];
}

const PolylineSchema: Schema = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  path: { type: Array, required: true }
});

export default mongoose.model('Polyline', PolylineSchema);