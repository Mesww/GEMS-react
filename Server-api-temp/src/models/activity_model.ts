import mongoose, { Collection } from "mongoose";

interface activities {
    studentid: string;
    location: string;
    marker: string;
    time: string;
    route: string;
  }

const activitySchema = new mongoose.Schema(
    {
      studentid: { type: String, required: false},
      location: { type: String, required: true },
      marker: { type: String, required: true },
      time: { type: String, required: false },
      route: { type: String, required: true },
    },
    { collection: "activities" }
  );

  interface activityDocument extends mongoose.Document {
    studentid: string;
    location: string;
    marker: string;
    time: string;
    route: string;
    set(x: activities): this; // Define `set` as an instance method
  }

  const Activity = mongoose.model<activityDocument>("activity", activitySchema);

  // Extend the model with the `set` method
Activity.prototype.set = function (x: activities) {
    this.studentid = x.studentid;
    this.location = x.location;
    this.marker = x.marker;
    this.time = x.time;
    this.route = x.route;
    return this.save(); // Save the document to the database
  };

  const activity = new Activity();
//todo.set({ title: "Some title", description: "Some description" });
export default Activity;
export { Activity };