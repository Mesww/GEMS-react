import express, { Request, Response } from "express";
import { Todo } from "../models/user_model"; // Assuming "user_model" is your file with the Todo model
import Activity from "../models/activity_model";

const router = express.Router();

// Post request to add a todo
router.post("/add", async (req: Request, res: Response) => {
  try {
    // Validate incoming data (optional but recommended)
    const { title, description } = req.body; // Destructure body properties

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required." });
    }
    // Create a new Todo instance using the validated data
    const newTodo = new Todo({ title, description  });
    // Save the new Todo to the database
    await newTodo.save();
    // Respond with success and the created Todo
    return res.status(201).json({ data: newTodo }); // Use status 201 for created entities
  } catch (error) {
    console.error("Error adding todo:", error);
    return res.status(500).json({ error: "Internal server error." }); // Handle errors gracefully
  }
});

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
    const dataItem = await Todo.find({});

    res.status(200).json({
      data: dataItem,
    });

  } catch (err) {
    console.log("Error something" + err)
  }
});


//Delete Request
router.delete("/delete", async (req: Request, res: Response) => {

  const filter = {
    _id: req.body._id,
  }
  const dataItem = await Todo.deleteOne(filter).then((data: any) => res.json({
    data: data
  })
  ).catch((error: any) => {
    return res.send(error);
  });


});


//Update Request
router.put("/update", async (req: Request, res: Response) => {

  const filter = {
    _id: req.body._id,
  }

  const updatedData = {
    $set: {
      title: req.body.title
      , description: req.body.description
    }
  };

  const dataItem = await Todo.updateOne(filter, updatedData, {
    new: true
  }).then((data: any) => res.json({
    data: data
  })
  ).catch((error: any) => {
    return res.send(error);
  });


})





export default router;
export { router }