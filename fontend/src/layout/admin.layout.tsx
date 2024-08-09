import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar/sidebar';

const Adminlayout:React.FC<{
}> = ({}) => {
    return (
        <div className="h-0">
      <div className="flex h-screen">
      <Sidebar  />
      <Outlet/>
      </div>
      </div>
    );
};
export default Adminlayout;