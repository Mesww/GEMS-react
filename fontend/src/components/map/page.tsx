import { useCookies } from "react-cookie";
import MapComponant from "./mapComponent";
import Navbar from "../navbar/navbar";
import InfoDialog from "../infoDialog/infoDialog";
import { useEffect, useState } from "react";
import { fetchStations, Stations } from "../../containers/station/getStation";
import { AxiosResponse } from "axios";
const Mappage = () => {
  const [, setCookie] = useCookies(["token"]);
 
  // set select route
  const [selectRotue, setselectRotue] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

    // fetch station markers  ==================================================================================================
    const [stations, setStations] = useState<AxiosResponse<Stations[]> | null>(null);
    const [loading, setLoading] = useState(true);
    
    useState(() => {   
      fetchStations(setStations, setLoading);
      console.log(stations);
    });
  
    console.log(loading);

  return (
    <>
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
      <MapComponant selectedRoute={selectRotue} stations={stations} />
    </>
  );
};
export default Mappage;
