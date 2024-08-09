import  React, { useEffect, useMemo, useState} from "react";
import MapComponent from "./mapComponent";
import Navbar from "../navbar/navbar";
import InfoDialog from "../infoDialog/infoDialog";
import { fetchStations } from "../../containers/station/getStation";
import { AxiosResponse } from "axios";
import { Polylines } from "../../interfaces/polylines.interface";
import { fetchPolylines } from "../../containers/polyline/getPolyline";
import Loading from "../loading/loading";
import { SelectedMarker } from "./stationmarker";
import { Stations } from "../../interfaces/station.interface";
import FeedbackDialog from "../feedbackDialog/feedBackDialog";
import Cookies from 'js-cookie';
import InfostaionDialog from '../stationinfoDialog/stationinfoDialog';

const Mappage:React.FC<
  {

  }
> = ({}) => {
  const [selectRoute, setSelectRoute] = useState<string | null>("route1");
  const [isVisible, setIsVisible] = useState(false);
  const [stations, setStations] = useState<AxiosResponse<Stations[]> | null>(null);
  const [loading, setLoading] = useState(true);
    // set center
    const [center, setCenter] = useState<{lat:number,lng:number}|null>({
      lat: 20.045116568504863,
      lng: 99.89429994369891,
    });
    const [shouldResetCenter, setShouldResetCenter] = useState(false);
    // fetch polylines ==================================================================================================
    const [polylines, setPolylines] = useState<AxiosResponse<Polylines[]> | null>(null);
    const [selectedstationMarker, setselectedstationMarker] = useState<SelectedMarker | null>(null);

    useState(() => {   
      fetchStations(setStations, setLoading);
      fetchPolylines(setPolylines, setLoading);  
      console.log(stations);
      console.log(polylines?.data);
    });
  
    // console.log(loading);


    // Feedback Dialog =================================================================================================
    const [showFeedback, setShowFeedback] = useState(false);
    useEffect(() => {
        const hasSubmittedFeedback = Cookies.get('isSubmitted') === 'true';
        if (!hasSubmittedFeedback) {
            const timer = setTimeout(() => {
                setShowFeedback(true);
            }, 5 * 60 * 1000); // 5 minutes in milliseconds

            return () => clearTimeout(timer);
        }
    }, []);
    const handleCloseFeedback = () => {
        setShowFeedback(false);
    };

    const filteredStations = useMemo(() => {
      if (!stations || !stations.data) return [];
      return stations.data.filter((station: { route: string }) => {
        if (selectRoute === "route1") {
          return station.route === "route 1&2" || station.route === "route 1";
        } else if (selectRoute === "route2") {
          return station.route === "route 2" || station.route === "route 1&2";
        } else {
          return true; // This will include all stations if no route is selected
        }
      });
    }, [stations, selectRoute]);

  return (
    <>
     <FeedbackDialog isVisible={showFeedback} onClose={handleCloseFeedback} />


      {loading && <Loading/>}

      <InfoDialog isVisible={isVisible}
      setinfoIsVisible={setIsVisible}
      stations={stations}
      selectedMarker={selectedstationMarker}
      setSelectedMarker={setselectedstationMarker}
      setCenter={setCenter}
      setShouldResetCenter={setShouldResetCenter}
      shouldResetCenter={shouldResetCenter}
      center={center}
      selectedRoute={selectRoute}
      />

      {!loading && <InfostaionDialog selectRoue={selectRoute} fillteredstation={filteredStations} isVisible={selectRoute !== null}/>}

      <Navbar 
        activeContent={selectRoute}
        setActiveContent={setSelectRoute} 
        setinfoIsVisible={setIsVisible}
      />
      <MapComponent 
        selectedRoute={selectRoute} 
        setStations={setStations}
        stations={stations}
        selectedstationMarker={selectedstationMarker}
        setselectedstationMarker={setselectedstationMarker}
        polylines={polylines}
        center={center}
        setCenter={setCenter}
        setShouldResetCenter={setShouldResetCenter}
        shouldResetCenter={shouldResetCenter}
        setLoading={setLoading}
      />
    
    </>
  );
};

export default Mappage;