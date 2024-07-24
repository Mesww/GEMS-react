import StationModel, { Station } from './../models/station_model';
import express, { Request, Response } from "express";
import Activity from "../models/activity_model";
import { getStations } from "../controllers/station_controllers";
import { getPolylines } from "../controllers/polyline_controller";
import { ObjectId } from 'mongodb';


const router = express.Router();


// Post request to add a Activity
router.post("/activity", async (req: Request, res: Response) => {
  try {
    // Validate incoming data (optional but recommended)
    const { studentid, location, marker, time,route } = req.body; // Destructure body properties
    // Create a new Todo instance using the validated data
    const newActivity = new Activity({ studentid, location, marker, time,route });
    // Save the new Todo to the database
    await newActivity.save();
    // Respond with success and the created Todo
    return res.status(201).json({ data: newActivity }); // Use status 201 for created entities
  } catch (error) {
    console.error("Error adding Activity:", error);
    return res.status(500).json({ error: "Internal server error." }); // Handle errors gracefully
  }
});




//Get request
router.get("/", async (req: Request, res: Response) => {
  try {
   
    res.status(200).json({
      data: "Hello",
    });
  } catch (err) {
    console.log("Error something" + err)
  }
});


// get station
router.get('/getStation', getStations);


// get polyline
router.get('/getPolyline', getPolylines);



interface UpdateWaitingRequest extends Request {
  params: {
    id: string;
  };
  body: {
    waiting: number;
  };
}


router.patch('/updateWaiting/:id', async (req: UpdateWaitingRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { waiting } = req.body;

    if (waiting === undefined) {
      return res.status(400).json({ message: 'Waiting value is required' });
    }

    const updatedStation: Station | null = await StationModel.findByIdAndUpdate(
      new ObjectId(id),
      { waiting },
      { new: true, runValidators: true }
    );

    if (!updatedStation) {
      return res.status(404).json({ message: 'Station not found' });
    }

    res.json(updatedStation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
});


export default router;
export { router }