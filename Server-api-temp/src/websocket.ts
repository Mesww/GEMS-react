import WebSocket from "ws";
import axios from "axios";
import { getStationDataFromDatabase } from "./controllers/station_controllers";
import Station from "./models/station_model";
import { IncomingMessage } from "http";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import { findUserById } from "./service/user.service";


dotenv.config();

const BEARER_TOKEN = process.env.BEARER_TOKEN;
const JWT_SECRET = process.env.TOKEN_KEY || "kimandfamily";

interface AuthenticatedWebSocket extends WebSocket {
  isAuthenticated?: boolean;
  userId?: string;
  roles?: string;
}

interface TokenPayload {
  id: string;
  roles: string;
}

export const setupWebSocket = (server: any) => {
  const wss = new WebSocket.Server({ noServer: true });

  server.on('upgrade', async function upgrade(request: IncomingMessage, socket: any, head: Buffer) {
    const protocols = request.headers['sec-websocket-protocol'];
    const token = protocols ? protocols.split(',')[0].trim() : null;

    if (!token) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    try {
      const verified = jwt.verify(token, JWT_SECRET) as TokenPayload;
      if (!verified) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      const user = await findUserById(verified.id);
      if (!user) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, function done(ws: AuthenticatedWebSocket) {
        ws.isAuthenticated = true;
        ws.userId = user.id;
        ws.roles = user.role;
        wss.emit('connection', ws, request);
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
    }
  });

  wss.on('connection', (ws: AuthenticatedWebSocket, request: IncomingMessage) => {
    console.log(`New connection established. Authenticated: ${ws.isAuthenticated}, User ID: ${ws.userId}`);
    
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const pathname = url.pathname;

    if (pathname === "/busws") {
      handleBusWsConnection(ws);
    } else if (pathname === "/stationws") {
      if (ws.roles === "ADMIN") {
        handleStationWsConnection(ws);
      } else {
        ws.close(1008, "Forbidden: Admins only");
      }
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
