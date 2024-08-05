import React from "react";
import MapAdminComponent from "../MapAdmin/mapAdminComponent";


const Dashboard: React.FC<{
 
}> = () => {
  return (
   
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="w-full h-full bg-white rounded-xl overflow-hidden border-8 border-yellow-300">
          <MapAdminComponent />
          <div className="absolute top-10 right-10 bg-white p-2 rounded-md shadow-md">
            <ul>
              <li className="text-red-500">จำนวนคนมากกว่า 10 คน</li>
              <li className="text-orange-400">จำนวนคนมากกว่า 5 คน</li>
              <li className="text-yellow-500">จำนวนคนมากกว่า 1 คน</li>
            </ul>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
