import mongoose, { Schema, Document, Model  } from 'mongoose';

export interface Polyline extends Document {
  name: String;
  color: String;
  path: [];
}

const PolylineSchema: Schema = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  path: { type: Array, required: true }
});

// Use generic type parameter <Polyline> to ensure correct typings
const PolylineModel: Model<Polyline> = mongoose.model<Polyline>('Polyline', PolylineSchema);

export default PolylineModel;