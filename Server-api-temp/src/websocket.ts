import WebSocket from "ws";
import axios from "axios";
import { getStationDataFromDatabase } from "./controllers/station_controllers";
import Station from "./models/station_model";

const BEARER_TOKEN = "k3wbpy57L4pVQC";

export const setupWebSocket = (server: any) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", async (ws, req) => {
    if (req.url === "/busws") {
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

      await fetchAndSendData();
      const intervalId = setInterval(fetchAndSendData, 5000);

      ws.on("message", (message) => {
        console.log("Received message on /busws:", message);
      });

      ws.on("close", () => {
        console.log("Client disconnected from /busws");
        clearInterval(intervalId);
      });
    } else if (req.url === "/stationws") {
      console.log("Client connected to /stationws");

      const sendStationData = async () => {
        try {
          const stationData = await getStationDataFromDatabase();
          ws.send(JSON.stringify(stationData));
        } catch (error) {
          console.error("Error fetching station data:", error);
        }
      };

      await sendStationData();

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
    }
  });
};
