import React, { useEffect, useState } from 'react';
import {  Navigate } from 'react-router-dom';
import Loading from '../loading/loading';
import { getUserinfo } from '../../containers/login/Login';

interface ProtectRouteProps {
  children: React.ReactNode;
  requireRoles?: string[];
  cookies:{
    token?: any;
}
}

const ProtectloginRoute: React.FC<ProtectRouteProps> = ({ children = [],cookies }) => {
  const [isAuthen, setIsAuthen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<{ email: string; name: string; role: string } | null>(null);
  useEffect(() => {
    const fetchUserRole = async () => {
      if (cookies.token && cookies.token !== undefined && cookies.token !== 'undefined') {
        try {
          const userInfo = await getUserinfo(cookies.token);
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
  }, [cookies.token]);

  if (isLoading) {
    return <Loading/>; // Or any other loading indicator
  }

  if (isAuthen && userRole) {
    if (userRole.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/map" replace />;
  }

  return <>{children}</>;
};

export default ProtectloginRoute;
