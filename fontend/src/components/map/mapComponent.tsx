import {
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  useMap,
  // ,
  // AdvancedMarker
} from "@vis.gl/react-google-maps";
import { useWebSocketData } from "../../containers/getGemsDataWebsocket/getGemsWebsocket";
import { useCallback, useMemo, useState, useEffect } from "react";
import React from "react";
import useUserLocation from "../../containers/userLocation/getUserLocation";
import StationMarker, { SelectedMarker } from "./stationmarker";
import {  Stations } from "../../containers/station/getStation";
import { AxiosResponse } from "axios";
import { Polylines } from "../../interfaces/polylines.interface";

const MAPID = import.meta.env.VITE_MAPID || "";
const MAPAPIKEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const busIcon = "/Bus.svg";
const userIcon = "/userIcon.png";

console.log(MAPAPIKEY);
interface TrackerData {
  _id: string;
  server_time: string;
  tracker_time: string;
  direction: number;
  position: string;
  speed: number;
}

export interface WebSocketMessage {
  status: string;
  data: {
    [key: string]: TrackerData;
  };
}

const MapComponant: React.FC<{
  stations: AxiosResponse<Stations[], any> | null;
  selectedRoute?: string | null;
  polylines:AxiosResponse<Polylines[], any> | null;
  selectedstationMarker: SelectedMarker | null;
  setselectedstationMarker: React.Dispatch<
    React.SetStateAction<SelectedMarker | null>
  >;
}> = ({ polylines,selectedRoute, stations, selectedstationMarker, setselectedstationMarker }) => {
  // set center
  const [center, setCenter] = useState({
    lat: 20.045116568504863,
    lng: 99.89429994369891,
  });

  ///////////// test polyline component ///////////////////////
  const PolylineComponent: React.FC<{
    path: google.maps.LatLngLiteral[];
    color: string;
  }> = ({ path, color }) => {
    const map = useMap();

    useEffect(() => {
      if (map && window.google) {
        const polyline = new window.google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: color,
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });

        polyline.setMap(map);

        return () => {
          polyline.setMap(null);
        };
      }
    }, [map, path, color]);

    return null;
  };
  //////////////////////////////////////////////////////////////

  // รับข้อมูลจาก websocket  ================================================
  const { messages } = useWebSocketData() as {
    messages: WebSocketMessage | null;
  };
  const data = useMemo(() => {
    return messages && messages.status === "ok" ? messages.data : null;
  }, [messages]);

  ////////// test polyline state ///////////////////////
  const [polylinePath, setPolylinePath] = useState<google.maps.LatLngLiteral[]>(
    []
  );
  //////////////////////////////////////////////////////

  // ตำแหน่งของผู้ใช้งาน  ================================================
  const [isOpen, setIsOpen] = useState(false);
  const location = useUserLocation();

  const userMarker = useMemo(() => {
    if (
      location &&
      location.lat &&
      location.lng &&
      window.google &&
      window.google.maps
    ) {
      return (
        <>
          <Marker
            key="user-location"
            position={{ lat: location.lat, lng: location.lng }}
            title="Your Location"
            onClick={() => {
              setIsOpen(true);
            }}
            icon={{
              url: userIcon,
              scaledSize: window.google.maps.Size
                ? new window.google.maps.Size(22, 20)
                : null,
              origin: window.google.maps.Point
                ? new window.google.maps.Point(0, 0)
                : null,
              anchor: window.google.maps.Point
                ? new window.google.maps.Point(11, 10)
                : null,
            }}
          />
          {isOpen && (
            <InfoWindow
              position={{ lat: location.lat, lng: location.lng }}
              onCloseClick={() => setIsOpen(false)}
              headerContent={`คุณอยู่ตรงนี้`}
            ></InfoWindow>
          )}
        </>
      );
    }
    return null;
  }, [location, isOpen]);

  // markers รถเจม ==================================================================================================
  // เซ็ท marker ที่เลือก
  const [selectedMarker, setSelectedMarker] = useState<SelectedMarker | null>(
    null
  );
  // handle คลิก markers
  const handleMarkerClick = useCallback((key: string, value: TrackerData) => {
    const [lat, lng] = value.position.split(",").map(Number);
    console.log(`Marker ${key} clicked`, value);
    setSelectedMarker({ key, value });
    setCenter({ lat, lng });
  }, []);

  // handle ปิด infowindow
  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);


  ////////////// test polyline path ///////////////////////
  const updatePolylinePath = useCallback((route: string) => {
  
    if (!polylines?.data ){
        return setPolylinePath([]);
      }
      const polylineSelected = polylines.data
      .filter((polyline) => polyline.name === route)
      .flatMap((polyline) => polyline.path);
      setPolylinePath(polylineSelected);
    }, [polylines]);
  /////////////////////////////////////////////////////////




  /////////////// test polyline path selected route ///////
  useEffect(() => {
    updatePolylinePath(selectedRoute || "");
  }, [selectedRoute, updatePolylinePath]);
  /////////////////////////////////////////////////////////



  // Keep this useMemo for other markers ตำแหน่งรถเจม
  const markers = useMemo(() => {
    if (!data) return null;
    let filteredData = Object.entries(data);
    if (selectedRoute === "route1") {
      filteredData = filteredData.filter(
        ([key]) =>
          key === "01" ||
          key === "02" ||
          key === "03" ||
          key === "04" ||
          key === "05" ||
          key === "07" ||
          key === "09" ||
          key === "10" ||
          key === "11" ||
          key === "12" ||
          key === "13" ||
          key === "14" ||
          key === "15"
      );
    }

    if (selectedRoute === "route2") {
      filteredData = filteredData.filter(
        ([key]) => key === "06" || key === "08" || key === "16"
      );
    }

    return filteredData.map(([key, value]) => {
      if (value && value.position && window.google.maps) {
        const [lat, lng] = value.position.split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lng) && window.google.maps.Size) {
          return (
            <React.Fragment key={key}>
              <Marker
                position={{ lat, lng }}
                title={`รถเจมหมายเลข: ${key}`}
                onClick={() => handleMarkerClick(key, value)}
                icon={{
                  url: busIcon,
                  scaledSize: new window.google.maps.Size(64, 36), // Adjusted size as needed
                  origin: new window.google.maps.Point(0, 0), // The origin point of the icon image (usually top-left)
                  anchor: new window.google.maps.Point(32, 18), // The anchor point of the icon image (center bottom for 64x36)
                  rotation: value.direction, // Set the rotation based on direction
                }}
              />
              {selectedMarker && selectedMarker.key === key && (
                <InfoWindow
                  position={{ lat: lat, lng: lng }}
                  onCloseClick={handleInfoWindowClose}
                  headerContent={`รถเจมหมายเลข ${key}`}
                >
                  <div>
                    <p>ความเร็ว: {value.speed} km/h</p>
                  </div>
                </InfoWindow>
              )}
            </React.Fragment>
          );
        }
      }
      return null;
    });
  }, [
    data,
    handleMarkerClick,
    selectedMarker,
    handleInfoWindowClose,
    selectedRoute,
  ]);

  const filteredStations = useMemo(() => {
    if (!stations || !stations.data) return [];
    return stations.data.filter((station: { route: string }) => {
      if (selectedRoute === "route1") {
        return station.route === "route 1&2" || station.route === "route 1";
      } else if (selectedRoute === "route2") {
        return station.route === "route 2" || station.route === "route 1&2";
      } else {
        return true; // This will include all stations if no route is selected
      }
    });
  }, [stations, selectedRoute]);

  const urlMarker1 = "/station1.png";

  const urlMarker2 = "/station2.png";

  // ==================================================================================================

  // interface SelectedMarker ==================================================================================================

  // ==================================================================================================

  // set selected station markers=================================================================================================
  // const [selectedstationMarker, setselectedstationMarker] =
  //   useState<SelectedMarker | null>(null);
  // ==================================================================================================

  return (
    <>
      <APIProvider apiKey={MAPAPIKEY} libraries={["places"]}>
        <Map
          style={{ width: "100%", height: "100vh" }}
          defaultZoom={15}
          defaultCenter={center}
          mapId={MAPID}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        />

        {/* markerรถเจม */}
        {markers}

        {/* marker ผู้ใช้งาน */}
        {userMarker}

        {/* station markers */}

        {selectedRoute === "route1" ? (
          <StationMarker
            position={filteredStations}
            selectedMarker={selectedstationMarker}
            setSelectedMarker={setselectedstationMarker}
            setCenter={setCenter}
            urlMarker={urlMarker1}
          />
        ) : (
          <StationMarker
            position={filteredStations}
            selectedMarker={selectedstationMarker}
            setSelectedMarker={setselectedstationMarker}
            setCenter={setCenter}
            urlMarker={urlMarker2}
          />
        )}
        <PolylineComponent
          path={polylinePath}
          color={selectedRoute === "route1" ? "#8b090c" : "#e2b644"}
        />
      </APIProvider>
    </>
  );
};

export default MapComponant;
