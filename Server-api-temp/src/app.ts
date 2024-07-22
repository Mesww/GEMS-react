import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router } from "./routes/routes";
import { authroute } from "./routes/authroutes";
import { logger } from './middle/log';
import http from 'http';
import WebSocket from 'ws';
import axios from 'axios';
import cors from 'cors'; 
dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const FONTENDURL = process.env.FONTENDURL || "http://localhost:5173";
console.log("Fontendurl : "+FONTENDURL);
// Configure CORS to allow requests from your frontend origin
app.use(cors({
  origin: FONTENDURL,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
   // Allow cookies to be sent
}));

const mongoDBUrl = process.env.MONGODB_URL;
console.log(mongoDBUrl);



if (!mongoDBUrl) {
  throw new Error("MONGODB_URL environment variable is not set!");
}

mongoose.connect(mongoDBUrl)
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.error(`Error details: ${err}`));

// ? middleware log
app.use(logger);

app.use("/", router);
app.use("/users", authroute);

const PORT = process.env.PORT || 4444;




// =========================================================
// สร้าง HTTP server
const server = http.createServer(app);
// สร้าง WebSocket server
const wss = new WebSocket.Server({ server });
const BEARER_TOKEN = 'k3wbpy57L4pVQC';
// กำหนด WebSocket logic
wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected')

  const fetchAndSendData = async () => {
    try {
      // เปลี่ยน URL นี้เป็น API ที่คุณต้องการ fetch
      const response = await axios.get('https://www.ppgps171.com/mobile/api/mfutransit',{
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`
        }
      });
      ws.send(JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // เริ่ม polling ทันทีที่ client เชื่อมต่อ
  fetchAndSendData();
  const intervalId = setInterval(fetchAndSendData, 5000); // ทุก 5 วินาที

  ws.on('message', (message: string) => {
    console.log('Received message:', message);
    // จัดการกับข้อความที่ได้รับจาก client ตามต้องการ
  });
  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(intervalId);
  });
});
// ======================================================


// ใช้ server.listen แทน app.listen
server.listen(PORT, () => {
  console.log(`Server is rocking at ${PORT}`);
});

