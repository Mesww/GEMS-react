import React from 'react';
import Sidebar from './sidebar';
import Mappage from '../map/page';


const Dashboard: React.FC = () => {
  return (
    <div className="h-0">
    <div className="flex h-screen">
        <Sidebar />
    
      {/* Map Section */}
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="w-full h-full bg-white rounded-xl overflow-hidden border-8 border-yellow-300">
          {/* <img src="path_to_map_image.jpg" alt="Map" className="object-cover w-full h-full" /> */}
          <Mappage />
          <div className="absolute top-10 right-10 bg-white p-2 rounded-md shadow-md">
            <ul>
              <li className="text-red-500">จำนวนคนทั้งหมด 15 คน</li>
              <li className="text-green-500">จำนวนคน 6 ถึง 10 คน</li>
              <li className="text-yellow-500">จำนวนคน 0 ถึง 5 คน</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Dashboard;
