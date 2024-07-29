import gemlogo from "/Screenshot_2567-07-10_at_12.04.25-removebg.png";
import "./style.sass";
import { useState } from "react";
import Swal from 'sweetalert2'
import 'animate.css';
import * as React from 'react';
// export const [activeContent, setActiveContent] = useState(null);
const Navbar: React.FC<{
  activeContent: any;
  setActiveContent: React.Dispatch<React.SetStateAction<string | null>>;
  setCookie: any;
  setinfoIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ activeContent, setActiveContent, setCookie,setinfoIsVisible }) => {
  const [isAnimating, setIsAnimating] = useState(false);


  const handleLogoClick = () => {
    setIsAnimating((prevState) => !prevState);
  };

  const handleContentClick = (contentId: any) => {
    setActiveContent((prevContentId) =>
      prevContentId === contentId ? null : contentId
    );
  };

  const handleSignout = async () =>  {
    const { isConfirmed}= await  Swal.fire({
        title: 'Logout!',
        text: 'Are you sure?',
        icon: 'warning',
        confirmButtonText: 'Confirmed',
        confirmButtonColor: '#8b090c',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#e2b644',
        background: '#f9f4d4',
        reverseButtons: true,
        showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `
          }
      })
      if (isConfirmed) {
        setCookie("token", "");
        setActiveContent(null);
      }
  };

  const toggleVisibility = () => {
    setinfoIsVisible((prev) => !prev);
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
          onClick={() => handleSignout()}
        >
          logout
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
          1
        </div>
        <div
          className={`content  ${activeContent === "route2" ? "selected" : ""}`}
          onClick={() => handleContentClick("route2")}
        >
          2
        </div>
      </div>

 

    </nav>

    

  );
};

export default Navbar;
