import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar/sidebar';
import { Cookie, CookieSetOptions } from "universal-cookie";

const Adminlayout:React.FC<{
    setCookies: (name: "token", value: Cookie, options?: CookieSetOptions) => void;
}> = ({setCookies}) => {
    return (
        <div className="h-0">
      <div className="flex h-screen">
      <Sidebar setCookies={setCookies} />
      <Outlet/>
      </div>
      </div>
    );
};
export default Adminlayout;