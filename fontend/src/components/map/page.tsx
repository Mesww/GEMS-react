import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import MapComponent from "./mapComponent";
import Navbar from "../navbar/navbar";
import InfoDialog from "../infoDialog/infoDialog";
import { fetchStations, Stations } from "../../containers/station/getStation";
import { AxiosResponse } from "axios";
import { SelectedMarker } from "./stationmarker";

const Mappage = () => {
  const [, setCookie] = useCookies(["token"]);
  const [selectRoute, setSelectRoute] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [stations, setStations] = useState<AxiosResponse<Stations[]> | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedstationMarker, setselectedstationMarker] = useState<SelectedMarker | null>(null);

  useEffect(() => {   
    fetchStations(setStations, setLoading);
  }, []);

  return (
    <>
      <InfoDialog 
        isVisible={isVisible}
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
      />
    </>
  );
};

export default Mappage;