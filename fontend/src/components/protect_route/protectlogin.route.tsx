import { useCookies } from 'react-cookie';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route } from 'react-router-dom';
import { getUserinfo } from '../../containers/login/Login';

interface ProtectRouteProps {
  children: React.ReactNode;
  requireRoles?: string[];
}

const ProtectmapRoute: React.FC<ProtectRouteProps> = ({ children, requireRoles = [] }) => {
  const [cookies, setCookie] = useCookies(['token']);
  const [isAuthen, setIsAuthen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (cookies.token) {
       setIsAuthen(true);
      } else {
        setIsAuthen(false);
      }
      setIsLoading(false);
    };

    fetchUserRole();
  }, [cookies.token]);

  if (isLoading) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  if (isAuthen) {
    return <Navigate to="/map" replace />;
  }

  return <>{children}</>;
};

export default ProtectmapRoute;
