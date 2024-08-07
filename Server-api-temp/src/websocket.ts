import WebSocket from "ws";
import axios from "axios";
import { getStationDataFromDatabase } from "./controllers/station_controllers";
import Station from "./models/station_model";
import { IncomingMessage } from "http";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

dotenv.config();

const BEARER_TOKEN = process.env.BEARER_TOKEN;
const JWT_SECRET = process.env.TOKEN_KEY || "kimandfamily";

export const setupWebSocket = (server: any) => {
  const wss = new WebSocket.Server({ noServer: true });

  server.on('upgrade', function upgrade(request: IncomingMessage, socket: any, head: Buffer) {
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    try {
      const verified = jwt.verify(token, JWT_SECRET);
      if (!verified) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
    }
  });

  wss.on("connection", async (ws: WebSocket, request: IncomingMessage) => {
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const pathname = url.pathname;

    if (pathname === "/busws") {
      handleBusWsConnection(ws);
    } else if (pathname === "/stationws") {
      handleStationWsConnection(ws);
    } else {
      ws.close(1008, "Invalid endpoint");
    }
  });
};

const handleBusWsConnection = (ws: WebSocket) => {
  console.log("Client connected to /busws");
  let busData = {};

  const fetchAndSendData = async () => {
    try {
      const response = await axios.get(
        "https://www.ppgps171.com/mobile/api/mfutransit",
        {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        }
      );
      busData = response.data;
      ws.send(JSON.stringify(busData));
    } catch (error) {
      console.error("Error fetching bus data:", error);
    }
  };

  fetchAndSendData();
  const intervalId = setInterval(fetchAndSendData, 5000);

  ws.on("message", (message) => {
    console.log("Received message on /busws:", message);
  });

  ws.on("close", () => {
    console.log("Client disconnected from /busws");
    clearInterval(intervalId);
  });
};

const handleStationWsConnection = (ws: WebSocket) => {
  console.log("Client connected to /stationws");

  const sendStationData = async () => {
    try {
      const stationData = await getStationDataFromDatabase();
      ws.send(JSON.stringify(stationData));
    } catch (error) {
      console.error("Error fetching station data:", error);
    }
  };

  sendStationData();

  const changeStream = Station.watch();

  changeStream.on('change', async (change: any) => {
    console.log('Detected change in stations collection');
    await sendStationData();
  });

  ws.on("message", (message) => {
    console.log("Received message on /stationws:", message);
  });

  ws.on("close", () => {
    console.log("Client disconnected from /stationws");
    changeStream.close();
  });
};
