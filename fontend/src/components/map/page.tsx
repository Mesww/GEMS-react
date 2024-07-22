import { useCookies } from "react-cookie";
import MapComponant from "./mapComponent";
import Navbar from "../navbar/navbar";
import InfoDialog from "../infoDialog/infoDialog";
import { useState } from "react";
const Mappage = () => {
  const [, setCookie] = useCookies(["token"]);
 
  // set select route
  const [selectRotue, setselectRotue] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <InfoDialog isVisible={isVisible}
      setinfoIsVisible={setIsVisible}
      />
      <Navbar 
      activeContent={selectRotue}
      setActiveContent={setselectRotue} 
      setCookie={setCookie}
      setinfoIsVisible={setIsVisible}
      />
      <MapComponant selectedRoute={selectRotue} />
    </>
  );
};
export default Mappage;
