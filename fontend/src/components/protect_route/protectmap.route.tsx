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
  const [userRole, setUserRole] = useState<{ email: string; name: string; role: string } | null>(null);
  const [isAuthen, setIsAuthen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (cookies.token) {
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
        }
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

  if (!isAuthen) {
    return <Navigate to="/" replace />;
  }

  if (!userRole || !userRole.role) {
    return <Navigate to="/" replace />;
  }

  const matchRoles = !requireRoles.length || requireRoles.includes(userRole.role);
  if (!matchRoles) {
    return <Navigate to="/403" replace />;
  }
  

  return <>{children}</>;
};

export default ProtectmapRoute;
