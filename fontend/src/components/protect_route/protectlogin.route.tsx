import { useCookies } from 'react-cookie';
import React, { useEffect, useState } from 'react';
import {  Navigate } from 'react-router-dom';
import Loading from '../loading/loading';

interface ProtectRouteProps {
  children: React.ReactNode;
  requireRoles?: string[];
}

const ProtectmapRoute: React.FC<ProtectRouteProps> = ({ children = [] }) => {
  const [cookies,] = useCookies(['token']);
  const [isAuthen, setIsAuthen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (cookies.token && cookies.token !== undefined && cookies.token !== 'undefined') {
       setIsAuthen(true);
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

  if (isAuthen) {
    return <Navigate to="/map" replace />;
  }

  return <>{children}</>;
};

export default ProtectmapRoute;
