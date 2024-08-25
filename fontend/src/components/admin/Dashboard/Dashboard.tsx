import React from "react";
import MapAdminComponent from "../MapAdmin/mapAdminComponent";

const Dashboard: React.FC<{}> = () => {
 
  return (
    <div className="flex-1 flex justify-center items-center p-4">
      <div className="w-full h-full bg-white rounded-xl overflow-hidden border-8 border-yellow-300">
        <MapAdminComponent />
        <div className="absolute top-10 right-10 bg-white p-2 rounded-md shadow-md">
          <ul>
            <li className="flex items-center space-x-2">
              <img
                src="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                alt="Red icon"
                className="w-6 h-6"
              />
              <span className="text-red-500">จำนวน 10 คนขึ้นไป</span>
            </li>
            <li className="flex items-center space-x-2">
              <img
                src="http://maps.google.com/mapfiles/ms/icons/orange-dot.png"
                alt="Orange icon"
                className="w-6 h-6"
              />
              <span className="text-orange-400">จำนวน 5 คนขึ้นไป</span>
            </li>
            <li className="flex items-center space-x-2">
              <img
                src="http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                alt="Yellow icon"
                className="w-6 h-6"
              />
              <span className="text-yellow-500">จำนวน 1 คนขึ้นไป</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
