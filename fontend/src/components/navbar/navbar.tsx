import gemlogo from "/Screenshot_2567-07-10_at_12.04.25-removebg.png";
import "./style.sass";
import { useState } from "react";
import 'animate.css';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

// export const [activeContent, setActiveContent] = useState(null);

const Navbar: React.FC<{
  activeContent: any;
  setActiveContent: React.Dispatch<React.SetStateAction<string | null>>;
  setinfoIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setsettingIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setsettingIsVisible,activeContent, setActiveContent, setinfoIsVisible }) => {
  const [isAnimating, setIsAnimating] = useState(true);


  const handleLogoClick = () => {
    setIsAnimating((prevState) => !prevState);
  };

  const handleContentClick = (contentId: any) => {
    setActiveContent((prevContentId) =>
      prevContentId === contentId ? prevContentId : contentId
    );
  };

  const {t} = useTranslation();

  

  const toggleVisibility = () => {
    setinfoIsVisible((prev) => !prev);
  };

  const toggleVisibilitySetting = () => {
    setsettingIsVisible((prev) => !prev);
  };
  

  return (
    <nav
      className={`navbar fixed bottom-5 left-0 rounded-full right-0 z-50 ${
        isAnimating ? "" : "navbar-close"
      }`}
    >
      <div className="px-10 flex items-center h-14 navbar-wrapper ">
        <div
          className={`content ${
            activeContent === "content1" ? "selected" : ""
          }  material-icons`}
          onClick={() => toggleVisibilitySetting()}
        >
          settings
        </div>
        <div
          className={`content ${
            activeContent === "content2" ? "selected" : ""
          } material-icons `}
          onClick={() => toggleVisibility()}
        >
         travel_explore
        </div>
  
        <img
          src={gemlogo}
          alt="logo"
          className={` logo w-20 ${isAnimating ? "spin" : ""}`}
          onClick={handleLogoClick}
        />
        <div
          className={`content  ${
            activeContent === "route1" ? "selected" : ""
          } `}
          onClick={() => handleContentClick("route1")}
        >
         {t('navbar.route.route1')}
        </div>
        <div
          className={`content  ${activeContent === "route2" ? "selected" : ""} `}
          onClick={() => handleContentClick("route2")}
        >
          {t('navbar.route.route2')}
        </div>
      </div>

 

    </nav>

    

  );
};

export default Navbar;
