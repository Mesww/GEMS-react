import React from "react";
import { Stations } from "../../interfaces/station.interface";
import "./style.sass";
const InfostaionDialog: React.FC<{
  isVisible: boolean;
  fillteredstation: Stations[] | null;
  selectRoue: string | null;
}> = ({ fillteredstation, isVisible,selectRoue }) => {
//   console.log(selectRoue);

  return (
    isVisible && (
      <div
        className={`fixed top-4 right-4 text-center  z-50 flex justify-center info ${selectRoue === "route1" ? "info-route1" : "info-route2"} transition-all duration-300 ease-in-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        }`}
      >
        <div>
          {fillteredstation !== null && fillteredstation !== undefined
            ? <div>
              <div  className="flex justify-center "><h1 className={`mr-2 start`} >ต้นทาง </h1> <h1> {fillteredstation[0].name}</h1></div>
              <h1 className="">ถึง</h1>
              <div  className="flex justify-center " ><h1 className={`mr-2 end`} >ปลายทาง</h1> <h1> {fillteredstation[fillteredstation.length - 1].name}</h1></div>
            </div>
            : null}
        </div>
      </div>
    )
  );
};

export default InfostaionDialog;
