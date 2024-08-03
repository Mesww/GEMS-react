import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router } from "./routes/routes";
import { authroute } from "./routes/authroutes";
import { logger } from "./middle/log";
import http from "http";
import cors from "cors";
import cron from "node-cron";
import { cleanStationWaitingLists } from "./service/cleanStation";
import { setupWebSocket } from "./websocket";


dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const FONTENDURL = process.env.FONTENDURL || "http://localhost:5173";
console.log("Fontendurl : " + FONTENDURL);

app.use(
  cors({
    origin: [FONTENDURL, "http://localhost:5173"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

const mongoDBUrl = process.env.MONGODB_URL;
console.log(mongoDBUrl);

if (!mongoDBUrl) {
  throw new Error("MONGODB_URL environment variable is not set!");
}

mongoose
  .connect(mongoDBUrl)
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.error(`Error details: ${err}`));

// Middleware log
app.use(logger);
app.use("/", router);
app.use("/users", authroute);

const PORT = process.env.PORT || 4444;

// Create HTTP server
const server = http.createServer(app);

// Set up WebSocket server
setupWebSocket(server); // Call the setup function

// Schedule the task to run every 1 minute
cron.schedule("* * * * *", async () => {
  console.log("Running station waiting list cleanup");
  await cleanStationWaitingLists();
});

// Use server.listen instead of app.listen
server.listen(PORT, () => {
  console.log(`Server is rocking at ${PORT}`);
});