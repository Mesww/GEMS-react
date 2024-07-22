import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import MapComponant from "./mapComponent";
import Navbar from "../navbar/navbar";
import InfoDialog from "../infoDialog/infoDialog";
import { useState } from "react";
const Mappage = () => {
  const [cookies, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();
  const handleSignout = () => {
    setCookie("token", "");
    if (cookies.token) {
      navigate("/map", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };
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
