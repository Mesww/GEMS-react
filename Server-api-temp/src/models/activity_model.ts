import mongoose, { Collection } from "mongoose";

interface activities {
    email: string;
    location: string;
    stationMarker: string;
    time: Date;
    route: string;
    destinationMarker: string;
  }

const activitySchema = new mongoose.Schema(
    {
      email: { type: String, required: false},
      location: { type: String, required: true },
      stationMarker: { type: String, required: true },
      time: { type: Date, required: false },
      route: { type: String, required: true },
      destinationMarker: { type: String, required: false },
    },
    { collection: "activities" }
  );

  interface activityDocument extends mongoose.Document {
    email: string;
    location: string;
    stationMarker: string;
    time: Date;
    route: string;
    destinationMarker: string;
    set(x: activities): this; // Define `set` as an instance method
  }

  const Activity = mongoose.model<activityDocument>("activity", activitySchema);

  // Extend the model with the `set` method
Activity.prototype.set = function (x: activities) {
    this.studentid = x.email;
    this.location = x.location;
    this.stationMarker = x.stationMarker;
    this.time = x.time;
    this.route = x.route;
    this.destinationMarker = x.destinationMarker;
    return this.save(); // Save the document to the database
  };

  const activity = new Activity();
//todo.set({ title: "Some title", description: "Some description" });
export default Activity;
export { Activity };