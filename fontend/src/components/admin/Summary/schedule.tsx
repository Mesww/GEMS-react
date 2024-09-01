import React from "react";
import { DepartionPerRoutes, StudentPerStations } from "../../../interfaces/schedule.interface";
import "./style.sass";
import DepartionPerRoutesTable from "../Table/DepartionPerRoutesTable";
import StudentPerStationsTable from "../Table/StudentPerStation";
const Summary:React.FC<{}> = ({}) => {
  // ? Dummy data => replace with real data
  const aigendataDepartion:DepartionPerRoutes[] = [
    {
      route: "Route 1",
      amountofDeparture: Array(14).fill('') // 14 time slots initially empty
  },
  {
      route: "Route 2",
      amountofDeparture: Array(14).fill('') // 14 time slots initially empty
  }
  ];
  const aigendataStudent: StudentPerStations[] = [
    { station: "Station 1  (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 2  (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 3  (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 4  (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 5  (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 6  (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 7  (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 8  (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 9  (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 10 (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 11 (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 12 (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 13 (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 14 (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 15 (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 16 (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 17 (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 18 (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 19 (Route 1)", amountofStudent: Array(14).fill('') },
    { station: "Station 21 (Route 1)", amountofStudent: Array(14).fill('') }
];

    return (
      <div className="w-full flex flex-col items-center justify-center min-h-screen overflow-x-auto">
        <div className=" max-w-7xl min-w-44 space-y-4 ">
          <DepartionPerRoutesTable aigendata={aigendataDepartion} />
          <StudentPerStationsTable aigendata={aigendataStudent} />
        </div>
    </div>
      );
}
export default Summary; 