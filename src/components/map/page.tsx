import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import MapComponant from "./mapComponent";
import Navbar from "../navbar/navbar";
import ClosestBus from "../calulateDistance/userAndBusDistance";
import { useWebSocketData } from "../../containers/getGemsDataWebsocket/getGemsWebsocket";
import useUserLocation from "../../containers/userLocation/getUserLocation";

interface TrackerData {
  server_time: string;
  tracker_time: string;
  direction: number;
  position: string;
  speed: number;
}

interface WebSocketMessage {
  status: string;
  data: {
    [key: string]: TrackerData;
  };
}

const Mappage = () => {
  // get userlocation ===================================================
  const location = useUserLocation();

// รับข้อมูลจาก websocket  ================================================
const { messages } = useWebSocketData() as {
  messages: WebSocketMessage | null;
};


const data = useMemo(() => {
  return messages && messages.status === "ok" ? messages.data : null;
}, [messages]);
  const [cookies, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();
  const handleSignout = () => {
    setCookie("token", "");
    if (cookies.token) {
      navigate("/map", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  
  return (
    <>
      <ClosestBus userLocation={location} busData={data} />
      <Navbar />
      <MapComponant />
    </>
  );
};
export default Mappage;
