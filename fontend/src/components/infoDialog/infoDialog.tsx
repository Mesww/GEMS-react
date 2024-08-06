import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useClosestBus, {
  
} from "../../containers/calulateDistance/calculateDistance";
import useUserLocation from "../../containers/userLocation/getUserLocation";
import { useWebSocketData } from "../../containers/getGemsDataWebsocket/getGemsWebsocket";
import gemlogo from "/Screenshot_2567-07-10_at_12.04.25-removebg.png";
import { AxiosResponse } from "axios";
import useNearestStation from "../../containers/calulateDistance/calculateuserAndbustop";
import { SelectedMarker } from "../map/stationmarker";
import { Stations } from "../../interfaces/station.interface";
import StationToStationComponent from "../../containers/calulateDistance/calStationToStation";
import { BusInfo } from "../../interfaces/bus.interface";

interface WebSocketMessage {
  status: string;
  data: {
    [key: string]: BusInfo;
  };
}

const InfoDialog: React.FC<{
  isVisible: boolean;
  setinfoIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  stations: AxiosResponse<Stations[], any> | null;
  selectedMarker: SelectedMarker | null;
  setSelectedMarker: React.Dispatch<
    React.SetStateAction<SelectedMarker | null>
  >;
  setCenter:React.Dispatch<React.SetStateAction<{
    lat: number;
    lng: number;
}|null>>
center: {
  lat: number;
  lng: number;
} | null
shouldResetCenter: boolean;
setShouldResetCenter: React.Dispatch<React.SetStateAction<boolean>>
selectedRoute: string | null;

}> = ({
  isVisible,
  setinfoIsVisible,
  stations,
  selectedMarker,
  setSelectedMarker,
  setCenter,
  center,
  setShouldResetCenter,
  shouldResetCenter,
  selectedRoute
}) => {
  const toggleVisibility = () => {
    setinfoIsVisible((prev) => !prev);
  };

  const [isSearch, setIssearching] = useState<boolean>(false);

  const toggleSearch = () => {
    setIssearching((prev) => !prev);
  };

  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Close the search overlay if a click is detected outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        setIssearching(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  let stationMarkers: Stations[] = [];

  // ตำแหน่งของผู้ใช้งาน  ================================================
  const location = useUserLocation();

  // รับข้อมูลจาก websocket  ================================================
  const { messages } = useWebSocketData() as {
    messages: WebSocketMessage | null;
  };
  const data = useMemo(() => {
    return messages && messages.status === "ok" ? messages.data : null;
  }, [messages]);

  // ClostestStation =========================================================
  // station markers mock ==================================================================================================

  if (stations?.data !== undefined) {
    stationMarkers = stations?.data;
    0;
  }

//ป้ายที่ใกล้กับเราที่สุด
const closestStation = useNearestStation(stationMarkers, location,selectedRoute, selectedMarker); 


  //นำป้ายใกล้กับเรามาหา รถบัสที่ใกล้ที่สุด
  const closestBusData = useClosestBus(closestStation, data);

  // ระยะห่างระหว่างป้ายที่เราเลือกกับป้ายที่ใกล้เราที่สุด
  const [stationToStation, setStationToStation] = useState(0);

  const calETA = useCallback((distance: number) => {
    const speedMeterPerSecond = (30 * 1000) / 3600;
    const timeInSeconds = distance / speedMeterPerSecond;
    const timeInMinutes = timeInSeconds / 60;
    const roundedMinutes = Math.round(timeInMinutes * 2) / 2;
    const minutes = Math.floor(roundedMinutes);
    const seconds = Math.round((roundedMinutes % 1) * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")} นาที`;
  }, []);

  const eta = useMemo(() => {
    return stationToStation > 0 ? calETA(stationToStation) : "? นาที";
  }, [stationToStation, calETA]);

  useEffect(() => {
    if (selectedMarker) {
      const result = StationToStationComponent({
        selectedMarker,
        closestStation,
      });
      if (typeof result === "number") {
        setStationToStation(result);
        console.log("StationToStation", result);
      }
    }
  }, [selectedMarker, closestStation]);

  // Search functionality =========================================
  const [searchQuery, setSearchQuery] = useState("");
  const filteredStations = useMemo(() => {
    return stationMarkers.filter((station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, stationMarkers]);

  const handleStationClick = (station: Stations) => {
    setSelectedMarker({
      key: station.id,
      value: {
        _id: `${station.id}`,
        position: station.position,
      },
    });
    // Close the dialog
    setIssearching(false);
    const [lat, lng] = station.position.split(",").map(Number);
    setCenter({
      lat: lat,
      lng: lng
    });
    setShouldResetCenter(true);
  };
  useEffect(() => {
    if (shouldResetCenter && center) {
      // This will run after the component has re-rendered with the new center
      const timer = setTimeout(() => {
        setCenter(null);
        setShouldResetCenter(false);
      }, 0);
  
      // Cleanup the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [center, shouldResetCenter]);
  return (
    <>
      {/* Dialog */}
      <div
        className={`fixed bottom-24 left-0 right-0 z-50  transition-all duration-300 ease-in-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        }`}
      >
        <div className="card flex justify-center">
          <div className="bg-white  rounded-xl shadow-lg py-6 px-10 h-60 w-96 relative">
            <div className="title flex justify-between item-center text-sm">
              <p className="flex ">
                <img src={gemlogo} alt="logo" className="w-10" />
                Gem {closestBusData.busId}
              </p>
              {closestBusData.eta && closestBusData.eta > 0 ? (
                <span>
                  รถจะถึงป้ายคุณในอีก {closestBusData.eta.toFixed(2)} นาที
                </span>
              ) : (
                <span>รถจะถึงป้ายคุณในอีก ? นาที</span>
              )}
            </div>

            <div className="divider">
              <div className="border-t border-gray-300"></div>
            </div>

            <div className="currentLocation flex justify-center item-center pt-2">
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
                <span className="text-white font-semibold pl-2">
                  {/* station ======================================================================================= */}
                  {
                    <p>
                      {" "}
                      {closestStation
                        ? `ป้ายที่ใกล้คุณ ${
                            closestStation.stationNameId
                          } ${closestStation.distance.toFixed(0)} เมตร`
                        : "กำลังหาตำแหน่งของคุณ"}
                    </p>
                  }
                </span>
              </div>
            </div>

            <div className="between flex items-center pl-8">
              <div className="h-16 border-l border-black"></div>
              <div className="pl-2">
                {selectedMarker ? (
                  <div className="flex-col">
                    <div>
                      <span className="text-black">
                        ห่างประมาณ {stationToStation.toFixed(0)} เมตร
                      </span>
                    </div>
                    <div>
                      <span>ใช้เวลาประมาณ {eta}</span>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div
              className="destination select-none subtitle flex justify-center items-center"
              onClick={toggleSearch}
            >
              <div className="w-60 h-10 shadow-lg bg-stone-400 flex items-center justify-start pl-3">
                <div className="material-icons select-none text-red-600">
                  search
                </div>
                {selectedMarker ? (
                  <span className="text-white font-semibold pl-2">
                    ป้ายหมายเลข {selectedMarker.key}
                  </span>
                ) : (
                  <span className="text-white font-semibold pl-2">
                    โปรดเลือกป้ายที่จะไป
                  </span>
                )}
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
            {/* Search Overlay */}
            {isSearch && (
              <div
                className={`fixed inset-0 h-12 z-70 flex items-center justify-center search-overlay ${isSearch ? 'active' : ''}`}
              >
                <div
                  ref={overlayRef}
                  className={`bg-white rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-y-auto search-container ${isSearch ? 'active' : ''}`}
                >
                  <input
                    type="text"
                    placeholder="ค้นหาป้าย"
                    className="w-full h-10 mb-4 shadow-lg border border-gray-300 rounded-lg pl-3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="stationList">
                    {filteredStations.map((station) => (
                      <div
                        key={station._id}
                        className="stationItem flex items-center justify-between pl-3 py-1 border-b border-gray-200 cursor-pointer"
                        onClick={() => handleStationClick(station)}
                      >
                        <span className="text-black">{station.name}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg"
                    onClick={toggleSearch}
                  >
                    ปิด
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoDialog;
