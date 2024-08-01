import mongoose, { Schema } from 'mongoose';

export interface Feedback {
    description: string;
    createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
    description: { type: String, required: true },
    createdAt: { type: Date, required: true }
});

export default mongoose.model<Feedback>('Feedback', FeedbackSchema);

