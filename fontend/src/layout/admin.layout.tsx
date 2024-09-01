import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar/sidebar';
import Cookies from "js-cookie";
import { getUserinfo } from '../containers/login/Login';
import { User } from '../interfaces/user.interface';

const Adminlayout:React.FC<{
}> = ({}) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfos = await getUserinfo(Cookies.get("token"));
      if (userInfos.role !== null) {
        setUserInfo(userInfos);
      }
    };

    fetchUserInfo();
  }, []);
    return (
      <div className="h-0" >
        <div className="flex h-screen" style={ {backgroundColor: "#E2B644"} }>
          <Sidebar userInfo={userInfo} />
          <Outlet/>
        </div>
      </div>
    );
};
export default Adminlayout;