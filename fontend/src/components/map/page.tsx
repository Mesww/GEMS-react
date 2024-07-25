import { useState } from "react";
import { useCookies } from "react-cookie";
import MapComponent from "./mapComponent";
import Navbar from "../navbar/navbar";
import InfoDialog from "../infoDialog/infoDialog";
import { fetchStations, Stations } from "../../containers/station/getStation";
import { AxiosResponse } from "axios";
import { Polylines } from "../../interfaces/polylines.interface";
import { fetchPolylines } from "../../containers/polyline/getPolyline";
import Loading from "../loading/loading";
import { SelectedMarker } from "./stationmarker";

const Mappage = () => {
  const [, setCookie] = useCookies(["token"]);
  const [selectRoute, setSelectRoute] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [stations, setStations] = useState<AxiosResponse<Stations[]> | null>(null);
  const [loading, setLoading] = useState(true);

    // fetch polylines ==================================================================================================
    const [polylines, setPolylines] = useState<AxiosResponse<Polylines[]> | null>(null);
    const [selectedstationMarker, setselectedstationMarker] = useState<SelectedMarker | null>(null);

    useState(() => {   
      fetchStations(setStations, setLoading);
      fetchPolylines(setPolylines, setLoading);  
      console.log(stations);
      console.log(polylines?.data);
    });
  
    console.log(loading);

  return (
    <>
      {loading && <Loading/>}
      <InfoDialog isVisible={isVisible}
      setinfoIsVisible={setIsVisible}
      stations={stations}
      selectedMarker={selectedstationMarker}
      />
      <Navbar 
        activeContent={selectRoute}
        setActiveContent={setSelectRoute} 
        setCookie={setCookie}
        setinfoIsVisible={setIsVisible}
      />
      <MapComponent 
        selectedRoute={selectRoute} 
        stations={stations}
        selectedstationMarker={selectedstationMarker}
        setselectedstationMarker={setselectedstationMarker}
        polylines={polylines}
      />
    </>
  );
};

export default Mappage;