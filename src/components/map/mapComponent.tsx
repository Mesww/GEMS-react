import {
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  useMap,
} from "@vis.gl/react-google-maps";
import { useWebSocketData } from "../../containers/getGemsDataWebsocket/getGemsWebsocket";
import { useCallback, useMemo, useState, useEffect } from "react";
import React from "react";
import useUserLocation from "../../containers/userLocation/getUserLocation";
import StationMarker from "./stationmarker";

const MAPID = import.meta.env.VITE_MAPID;

interface TrackerData {
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

interface SelectedMarker {
  key: string;
  value: TrackerData;
}

const MapComponant: React.FC<{
  selectedRoute?: string | null;
}> = ({selectedRoute}) => {
  // set center
  const [center, setCenter] = useState({
    lat: 20.045116568504863,
    lng: 99.89429994369891,
  });

  ///////////// test polyline component ///////////////////////
  const PolylineComponent: React.FC<{ path: google.maps.LatLngLiteral[], color: string }> = ({ path, color }) => {
    const map = useMap();
    
    useEffect(() => {
      if (map && window.google) {
        const polyline = new window.google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: color,
          strokeOpacity: 1.0,
          strokeWeight: 2
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
  const [polylinePath, setPolylinePath] = useState<google.maps.LatLngLiteral[]>([]);
  //////////////////////////////////////////////////////

  
  // ตำแหน่งของผู้ใช้งาน  ================================================
  const [isOpen, setIsOpen] = useState(true);
  const location = useUserLocation();
  const userMarker = useMemo(() => {
    if (location && location.lat && location.lng && window.google && window.google.maps) {
      return (
        <>
          <Marker
            key="user-location"
            position={{ lat: location.lat, lng: location.lng }}
            title="Your Location"
            onClick={() =>{ setIsOpen(true);
              
            }}
            icon={{
              url: "src/assets/userIcon.png",
              scaledSize: window.google.maps.Size ? new window.google.maps.Size(22, 20) : null,
              origin: window.google.maps.Point ? new window.google.maps.Point(0, 0) : null,
              anchor: window.google.maps.Point ? new window.google.maps.Point(11, 10) : null,
            }}
          />
          {isOpen && (
            <InfoWindow
              position={{ lat: location.lat, lng: location.lng }}
              onCloseClick={() => setIsOpen(false)}
              headerContent={`คุณอยู่ตรงนี้`}
            >
            </InfoWindow>
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
    if (route === "route1") {
      setPolylinePath([
        { lat: 20.056827830306144, lng: 99.89670851208996 },
        { lat: 20.056742312402697, lng: 99.8970043823257 },
        { lat: 20.0577150547823, lng: 99.89761130151125 },
        { lat: 20.0586120601622, lng: 99.89848592455553 },
        { lat: 20.058914924636895, lng: 99.89921801827631 },
        { lat: 20.058975055240403, lng: 99.89959846725915 },
        { lat: 20.05894993133784, lng: 99.8995978410036 },
        { lat: 20.059135213443966, lng: 99.89957508230256 },
        { lat: 20.059053196629556, lng: 99.89894446358944 },
        { lat: 20.058856163350583, lng: 99.89844149570618 },
        { lat: 20.058474806867487, lng: 99.89790920721362 },
        { lat: 20.058193025421982, lng: 99.89757539878777 },
        { lat: 20.057718611652746, lng: 99.89725525753603 },
        { lat: 20.056361310585658, lng: 99.89648334906207 },
        { lat: 20.055550425855966, lng: 99.89640452735394 },
        { lat: 20.055196865503554, lng: 99.89626099025027 },
        { lat: 20.055074011667784, lng: 99.895948401836 },
        { lat: 20.05505004517504, lng: 99.89531364983505 },
        { lat: 20.054660981120556, lng: 99.89434945668442 },
        { lat: 20.054505173718226, lng: 99.89380082814272 },
        { lat: 20.054207331752398, lng: 99.89329883611695 },
        { lat: 20.05375836425334, lng: 99.89279054510705 },
        { lat: 20.053299062091174, lng: 99.89251903103539 },
        { lat: 20.0526313693443, lng: 99.89233663979584 },
        { lat: 20.0522105917245, lng: 99.89210597123726 },
        { lat: 20.05152745064552, lng: 99.89154842617923 },
        { lat: 20.05078272198504, lng: 99.89116151763503 },
        { lat: 20.050476276641145, lng: 99.89108186020535 },
        { lat: 20.049446474862005, lng: 99.89113496372559 },
        { lat: 20.04817722110509, lng: 99.89183329790087 },
        { lat: 20.047964761322348, lng: 99.8920056824143 },
        { lat: 20.048019848871615, lng: 99.8923665551482 },
        { lat: 20.047871531409264, lng: 99.8929304188605 },
        { lat: 20.048211433692966, lng: 99.89304365405584 },
        { lat: 20.048152104480717, lng: 99.89328724258705 },
        { lat: 20.047939404530872, lng: 99.89314405610828 },
        { lat: 20.048002968295382, lng: 99.89298166313792 },
        { lat: 20.047871601713496, lng: 99.89293204240089 },
        { lat: 20.047498693044755, lng: 99.89316660807269 },
        { lat: 20.04723726894392, lng: 99.89317213312215 },
        { lat: 20.047249981599496, lng: 99.8930368055573 },
        { lat: 20.047638513775457, lng: 99.89274397454324 },
        { lat: 20.047956333200364, lng: 99.89266277768512 },
        { lat: 20.048028371591414, lng: 99.89228385940898 },
        { lat: 20.047977519481964, lng: 99.89200869277408 },
        { lat: 20.047604462212576, lng: 99.89216179161215 },
        { lat: 20.047163985921276, lng: 99.89216816999088 },
        { lat: 20.046702534230064, lng: 99.89203101355717 },
        { lat: 20.045311039647707, lng: 99.89132523838916 },
        { lat: 20.044771509844256, lng: 99.89131194450728 },
        { lat: 20.044222066472077, lng: 99.89151535066452 },
        { lat: 20.044096593160802, lng: 99.8929627490329 },
        { lat: 20.043710960546935, lng: 99.89380854580065 },
        { lat: 20.043659015341778, lng: 99.89424694376414 },
        { lat: 20.043877255324205, lng: 99.89488298493029 },
        { lat: 20.04390480304582, lng: 99.89539722897106 },
        { lat: 20.043464081678604, lng: 99.89613701865746 },
        { lat: 20.043484037151675, lng: 99.89630436442438 },
        { lat: 20.043557868977523, lng: 99.89640752442632 },
        { lat: 20.043305892098065, lng: 99.89665160441974 },
        { lat: 20.043084153477906, lng: 99.89664355649681 },
        { lat: 20.04298084518365, lng: 99.89629486926216 },
        { lat: 20.04319502562304, lng: 99.89551166608892 },
        { lat: 20.04345078064068, lng: 99.8950664195687 },
        { lat: 20.04338904684179, lng: 99.89490414571003 },
        { lat: 20.04355968726478, lng: 99.89444470809084 },
        { lat: 20.04366292318145, lng: 99.89423111721764 },
        { lat: 20.04372782800256, lng: 99.89380993332385 },
        { lat: 20.04409227178188, lng: 99.8929280487642 },
        { lat: 20.044229352947074, lng: 99.89152538057482 },
        { lat: 20.04419968917274, lng: 99.89136637067165 },
        { lat: 20.044561740649094, lng: 99.89122446181945 },
        { lat: 20.04495083265439, lng: 99.8911682902627 },
        { lat: 20.045640357194614, lng: 99.89134278070324 },
        { lat: 20.045981314951963, lng: 99.89149531219658 },
        { lat: 20.046503354062022, lng: 99.89191825691869 }
      ]);
    } else if (route === "route2") {
      setPolylinePath([
        { lat: 20.056827830306144, lng: 99.89670851208996 },
        { lat: 20.056742312402697, lng: 99.8970043823257 },
        { lat: 20.0577150547823, lng: 99.89761130151125 },
        { lat: 20.0586120601622, lng: 99.89848592455553 },
        { lat: 20.058914924636895, lng: 99.89921801827631 },
        { lat: 20.058975055240403, lng: 99.89959846725915 },
        { lat: 20.05894993133784, lng: 99.8995978410036 },
        { lat: 20.059135213443966, lng: 99.89957508230256 },
        { lat: 20.059053196629556, lng: 99.89894446358944 },
        { lat: 20.058856163350583, lng: 99.89844149570618 },
        { lat: 20.058474806867487, lng: 99.89790920721362 },
        { lat: 20.058193025421982, lng: 99.89757539878777 },
        { lat: 20.057718611652746, lng: 99.89725525753603 },
        { lat: 20.056361310585658, lng: 99.89648334906207 },
        { lat: 20.055550425855966, lng: 99.89640452735394 },
        { lat: 20.055196865503554, lng: 99.89626099025027 },
        { lat: 20.055074011667784, lng: 99.895948401836 },
        { lat: 20.05505004517504, lng: 99.89531364983505 },
        { lat: 20.054660981120556, lng: 99.89434945668442 },
        { lat: 20.054505173718226, lng: 99.89380082814272 },
        { lat: 20.054207331752398, lng: 99.89329883611695 },
        { lat: 20.05375836425334, lng: 99.89279054510705 },
        { lat: 20.053299062091174, lng: 99.89251903103539 },
        { lat: 20.0526313693443, lng: 99.89233663979584 },
        { lat: 20.0522105917245, lng: 99.89210597123726 },
        { lat: 20.05152745064552, lng: 99.89154842617923 },
        { lat: 20.05078272198504, lng: 99.89116151763503 },
        { lat: 20.050476276641145, lng: 99.89108186020535 },
        { lat: 20.049446474862005, lng: 99.89113496372559 },
        { lat: 20.04817722110509, lng: 99.89183329790087 },
        { lat: 20.047964761322348, lng: 99.8920056824143 },
        { lat: 20.048019848871615, lng: 99.8923665551482 },
        { lat: 20.047871531409264, lng: 99.8929304188605 },
        { lat: 20.048211433692966, lng: 99.89304365405584 },
        { lat: 20.048152104480717, lng: 99.89328724258705 },
        { lat: 20.047939404530872, lng: 99.89314405610828 },
        { lat: 20.048002968295382, lng: 99.89298166313792 },
        { lat: 20.047871601713496, lng: 99.89293204240089 },
        { lat: 20.047498693044755, lng: 99.89316660807269 },
        { lat: 20.04723726894392, lng: 99.89317213312215 },
        { lat: 20.047249981599496, lng: 99.8930368055573 },
        { lat: 20.047638513775457, lng: 99.89274397454324 },
        { lat: 20.047956333200364, lng: 99.89266277768512 },
        { lat: 20.048028371591414, lng: 99.89228385940898 },
        { lat: 20.047977519481964, lng: 99.89200869277408 },
        { lat: 20.047604462212576, lng: 99.89216179161215 },
        { lat: 20.047163985921276, lng: 99.89216816999088 },
        { lat: 20.046702534230064, lng: 99.89203101355717 },
        { lat: 20.045311039647707, lng: 99.89132523838916 },
        { lat: 20.044771509844256, lng: 99.89131194450728 },
        { lat: 20.044222066472077, lng: 99.89151535066452 },
        { lat: 20.043885355284342, lng: 99.89167304912345 },
        { lat: 20.043660523572242, lng: 99.89169545903627 },
        { lat: 20.04320579073703, lng: 99.89194156277586 },
        { lat: 20.042601607374383, lng: 99.89212240167018 },
        { lat: 20.042344860741558, lng: 99.89224341454559 },
        { lat: 20.04208681015675, lng: 99.8924625946845 },
        { lat: 20.04190160816688, lng: 99.8926859728798 },
        { lat: 20.041783178248043, lng: 99.8929769927545 },
        { lat: 20.041749161580967, lng: 99.89316206568381 },
        { lat: 20.04158921808012, lng: 99.89322394054608 },
        { lat: 20.04151438389079, lng: 99.89379481929895 },
        { lat: 20.041450240035243, lng: 99.89399016971291 },
        { lat: 20.041370060437195, lng: 99.89411155232426 },
        { lat: 20.041354023691703, lng: 99.89429362670992 },
        { lat: 20.04122590811834, lng: 99.89457164635367 },
        { lat: 20.041354419836154, lng: 99.89428196815005 },
        { lat: 20.041377099179023, lng: 99.89410226005263 },
        { lat: 20.041467812432614, lng: 99.89394401011529 },
        { lat: 20.04151568915441, lng: 99.89378039549612 },
        { lat: 20.041598843558276, lng: 99.89321981400404 },
        { lat: 20.041750030699315, lng: 99.8931661699565 },
        { lat: 20.041800425762027, lng: 99.89294354652536 },
        { lat: 20.041906257073514, lng: 99.89268605455905 },
        { lat: 20.042077602359004, lng: 99.89247684211927 },
        { lat: 20.042372416803207, lng: 99.89223276013826 },
        { lat: 20.04321653797254, lng: 99.89193503562666 },
        { lat: 20.043632298028662, lng: 99.89171241306644 },
        { lat: 20.0438628576861, lng: 99.89152541655358 },
        { lat: 20.044565869578015, lng: 99.89122500919825 },
        { lat: 20.044979102806305, lng: 99.89117941127842 },
        { lat: 20.045205878896144, lng: 99.89121428041935 },
        { lat: 20.045659431356, lng: 99.8913510747675 },
        { lat: 20.045974393650344, lng: 99.89150395945991 },
        { lat: 20.04648589681255, lng: 99.89191165978927 }
      ]);
    } else {
      setPolylinePath([]);
    }
  }, []);
  /////////////////////////////////////////////////////////

  /////////////// test polyline path selected route ///////
  useEffect(() => {
    updatePolylinePath(selectedRoute || "");
  }, [selectedRoute, updatePolylinePath]);
  /////////////////////////////////////////////////////////

  // Keep this useMemo for other markers ตำแหน่งรถเจม
  const markers = useMemo(() => {
    if (!data) return null;
    return Object.entries(data).map(([key, value]) => {
      if (value && value.position) {
        const [lat, lng] = value.position.split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          return (
            <React.Fragment key={key}>
              <Marker
                position={{ lat, lng }}
                title={`รถเจมหมายเลข: ${key}`}
                onClick={() => handleMarkerClick(key, value)}
                icon={{
                  url: "src/assets/Bus.svg",
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
  }, [data, handleMarkerClick, selectedMarker, handleInfoWindowClose]);



  // station markers mock ==================================================================================================
  const stationmarkers1 = {
    status: "ok",
    data: {
      "1": { position: "20.058752, 99.898396" },
      "2": { position: "20.057039, 99.896930" },
      "3": { position: "20.054683, 99.894515" },
      "4": { position: "20.052544, 99.892316" },
      "5": { position: "20.050816843021277, 99.89121969349162" },
      "6": { position: "20.049137353450433, 99.891250485570452" },
      "7": { position: "20.048193, 99.893221" },
      "8": { position: "20.047264832318994, 99.89314563095694" },
      "9": { position: "20.045503, 99.891442" },
      "10": { position: "20.043881444753783, 99.89348617576454" },
      "11": { position: "20.043919609786567, 99.89490923095694" },
      "12": { position: "20.043311336533844, 99.89529707515575" },
      "13": { position: "20.043845538331563, 99.8934754469289" },
      "14": { position: "20.045659393241642, 99.89133178188165" },
      "15": { position: "20.049391118491396, 99.89111283095696" },
      "16": { position: "20.05083048583872, 99.89115650886787" },
      "17": { position: "20.052689636083315, 99.89234180090831" },
      "18": { position: "20.05473222049373, 99.89448019896511" },
      "19": { position: "20.056897650552507, 99.89711855304603" },
      "20": { position: "20.05806378447924, 99.89787541746388" },
      "21": { position: "20.058966957817436, 99.8995173298247" }
    },
  };
  const urlMarker1 = "src/assets/station1.png";
  const stationmarkers2 = {
    status: "ok",
    data: {
      "1": { position: "20.058752, 99.898396" },
      "2": { position: "20.057039, 99.896930" },
      "3": { position: "20.054683, 99.894515" },
      "4": { position: "20.052544, 99.892316" },
      "5": { position: "20.050816843021277, 99.89121969349162" },
      "6": { position: "20.049137353450433, 99.891250485570452" },
      "7": { position: "20.048193, 99.893221" },
      "8": { position: "20.047264832318994, 99.89314563095694" },
      "9": { position: "20.045503, 99.891442" },
      "10": { position: "20.043881444753783, 99.89348617576454" },
      "11": { position: "20.043845538331563, 99.8934754469289" },
      "12": { position: "20.041244, 99.894427" },
      "13": { position: "20.045659393241642, 99.89133178188165" },
      "14": { position: "20.049391118491396, 99.89111283095696" },
      "15": { position: "20.05083048583872, 99.89115650886787" },
      "16": { position: "20.052689636083315, 99.89234180090831" },
      "17": { position: "20.05473222049373, 99.89448019896511" },
      "18": { position: "20.056897650552507, 99.89711855304603" },
      "19": { position: "20.05806378447924, 99.89787541746388" },
      "20": { position: "20.058966957817436, 99.8995173298247" }
    },
  };
  const urlMarker2 = "src/assets/station2.png";

  // ==================================================================================================

  // interface SelectedMarker ==================================================================================================
  interface SelectedstationMarker {
    key: string;
    value: TrackerstatioData;
  }
  interface TrackerstatioData {
    position: string;
  }
  // ==================================================================================================

  // set selected station markers=================================================================================================
  const [selectedstationMarker, setselectedstationMarker] =
    useState<SelectedstationMarker | null>(null);
  // ==================================================================================================


  return (
    <>
      <APIProvider apiKey={""}>
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
        {selectedRoute === "route1" ?
         <StationMarker
          position={stationmarkers1}
          selectedMarker={selectedstationMarker}
          setSelectedMarker={setselectedstationMarker}
          setCenter={setCenter} 
          urlMarker={urlMarker1}        />:
        <StationMarker
          position={stationmarkers2}
          selectedMarker={selectedstationMarker}
          setSelectedMarker={setselectedstationMarker}
          setCenter={setCenter} 
          urlMarker={urlMarker2}        />}

        <PolylineComponent
          path={polylinePath}
          color={selectedRoute === "route1" ? "#FFD700" : "#FF0000"} 
        />
      </APIProvider>
    </>
  );
};

export default MapComponant;
