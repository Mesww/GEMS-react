import React from "react";
import { AigenSchedule,DepartionPerRoutes,headerTime } from "../../../interfaces/schedule.interface";
import "./style.sass";
import DepartionPerRoutesTable from "../Table/DepartionPerRoutesTable";
const Summary:React.FC<{}> = ({}) => {
  // ? Dummy data => replace with real data
  const aigendata:DepartionPerRoutes[] = [
    {
      route: "Route 1",
      amountofDeparture: Array(14).fill('') // 14 time slots initially empty
  },
  {
      route: "Route 2",
      amountofDeparture: Array(14).fill('') // 14 time slots initially empty
  }
  ];
    return (
      <div className="overflow-x-auto w-full p-14 ">
        <DepartionPerRoutesTable aigendata={aigendata}/>
        </div>
      );
}
export default Summary;