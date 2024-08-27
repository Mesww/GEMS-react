import React, { useEffect, useState } from 'react';
import {  Navigate } from 'react-router-dom';
import Loading from '../loading/loading';
import { getUserinfo } from '../../containers/login/Login';
import Cookies from 'js-cookie';
interface ProtectRouteProps {
  children: React.ReactNode;
  requireRoles?: string[];

}

const ProtectloginRoute: React.FC<ProtectRouteProps> = ({ children = []}) => {
  const [isAuthen, setIsAuthen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<{ email: string; name: string; role: string } | null>(null);
  
  useEffect(() => {
    const fetchUserRole = async () => {
      if (Cookies.get("token") && Cookies.get("token") !== undefined && Cookies.get("token") !== 'undefined') {
        try {
          const userInfo = await getUserinfo(Cookies.get("token"));
          if (userInfo && userInfo.role) {
            setIsAuthen(true);
            setUserRole(userInfo);
          } else {
            setIsAuthen(false);
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
          setIsAuthen(false);
          setIsLoading(false);
        }
      } else {
        setIsAuthen(false);
      }
      setIsLoading(false);
    };

    fetchUserRole();
  }, [Cookies.get("token")]);

  if (isLoading) {
    return <Loading/>; // Or any other loading indicator
  }

  if (isAuthen && userRole) {
    if (userRole.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/map" replace />;
  }else{
    Cookies.remove("token");
  }

  return <>{children}</>;
};

export default ProtectloginRoute;
