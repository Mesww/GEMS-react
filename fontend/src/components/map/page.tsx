import { useCookies } from "react-cookie";
import MapComponant from "./mapComponent";
import Navbar from "../navbar/navbar";
import InfoDialog from "../infoDialog/infoDialog";
import { useState } from "react";
import { fetchStations, Stations } from "../../containers/station/getStation";
import { AxiosResponse } from "axios";
import { Polylines } from "../../interfaces/polylines.interface";
import { fetchPolylines } from "../../containers/polyline/getPolyline";
import Loading from "../loading/loading";
const Mappage = () => {
  const [, setCookie] = useCookies(["token"]);
 
  // set select route
  const [selectRotue, setselectRotue] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

    // fetch station markers  ==================================================================================================
    const [stations, setStations] = useState<AxiosResponse<Stations[]> | null>(null);
    // fetch polylines ==================================================================================================
    const [polylines, setPolylines] = useState<AxiosResponse<Polylines[]> | null>(null);
    const [loading, setLoading] = useState(true);
    

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
      />
      <Navbar 
      activeContent={selectRotue}
      setActiveContent={setselectRotue} 
      setCookie={setCookie}
      setinfoIsVisible={setIsVisible}
      />
      <MapComponant selectedRoute={selectRotue} stations={stations} polylines={polylines} />
    </>
  );
};
export default Mappage;
