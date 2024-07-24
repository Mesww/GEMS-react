import React, { useMemo, useState } from "react";
import useClosestBus from "../../containers/calulateDistance/calculateDistance";
import useUserLocation from "../../containers/userLocation/getUserLocation";
import { useWebSocketData } from "../../containers/getGemsDataWebsocket/getGemsWebsocket";
import gemlogo from "../../assets/Screenshot_2567-07-10_at_12.04.25-removebg.png";
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

const InfoDialog = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // ตำแหน่งของผู้ใช้งาน  ================================================
  const location = useUserLocation();

  // รับข้อมูลจาก websocket  ================================================
  const { messages } = useWebSocketData() as {
    messages: WebSocketMessage | null;
  };
  const data = useMemo(() => {
    return messages && messages.status === "ok" ? messages.data : null;
  }, [messages]);

  const closestBusData = useClosestBus(location, data);
  

  return (
    <>
      {/* Show button */}
      <button
        className={`fixed bottom-24 right-4 z-50 bg-blue-500 text-white rounded-full p-2 transition-all duration-300 ease-in-out ${
          isVisible ? "scale-0" : "scale-100"
        }`}
        onClick={toggleVisibility}
      >
        แสดงข้อมูลรถ
      </button>

      {/* Dialog */}
      <div
        className={`fixed bottom-24 left-0 right-0 z-50 flex justify-center transition-all duration-300 ease-in-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        }`}
      >
        <div className="bg-white rounded-xl shadow-lg py-6 px-10 h-60 w-96 relative">
          <div className="title flex justify-between justify-center item-center">
            <p className="flex ">
              <img src={gemlogo} alt="logo" className="w-10" />
              Gem {closestBusData.busId}
            </p>
            {closestBusData.eta && closestBusData.eta > 0 ? (
              <span className="pl-8">
                รถจะถึงในอีก {closestBusData.eta.toFixed(2)} นาที
              </span>
            ) : (
              <span className="pl-4">รถจะถึงในอีก ? นาที</span>
            )}
          </div>

          <div className="divider">
            <div className="border-t border-gray-300"></div>
          </div>

          <div className="currentLocation flex justify-center item-center">
            <div className="w-60 h-10 mt-2 shadow-lg bg-stone-400 flex items-center justify-start pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-white font-semibold pl-9">
                ตำแหน่งของคุณ
              </span>
            </div>
          </div>

          <div className="between flex items-center pl-8">
            <div className="h-10 border-l border-black"></div>
          </div>

          <div className="destination subtitle flex justify-center items-center">
            <div className="w-60 h-10 shadow-lg bg-stone-400 flex items-center justify-start pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
              <span className="text-white font-semibold pl-8">Destination</span>
            </div>
          </div>

          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={toggleVisibility}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default InfoDialog;