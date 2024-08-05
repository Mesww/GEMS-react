import React, { useEffect, useState } from 'react';
import {  Navigate} from 'react-router-dom';
import { getUserinfo } from '../../containers/login/Login';
import Loading from '../loading/loading';
import Swal from 'sweetalert2';
import { Cookie, CookieSetOptions } from 'universal-cookie';

interface ProtectRouteProps {
  children: React.ReactNode;
  requireRoles?: string[];
  cookies:{
    token?: any;
}
setCookie: (name: "token", value: Cookie, options?: CookieSetOptions) => void
}

const ProtectmapRoute: React.FC<ProtectRouteProps> =  ({ children, requireRoles = [],cookies,setCookie }) => {
  const [userRole, setUserRole] = useState<{ email: string; name: string; role: string } | null>(null);
  const [isAuthen, setIsAuthen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
  console.log(`isAuthen : ${isAuthen}`);
  if (!isAuthen) {
    return <Navigate to="/" replace />;
  }
  console.log(`userRole : ${userRole}`);
  if (!userRole || !userRole.role) {
    return <Navigate to="/" replace />;
  }

  const matchRoles = !requireRoles.length || requireRoles.includes(userRole.role);
  console.log(matchRoles);
  if (!matchRoles) {

     Swal.fire({
      title: 'Permission denied',
      text: 'You do not have permission to access this page',
      icon: 'error',
      allowOutsideClick: false,
      confirmButtonText: 'OK',}).then(()=>{
        setCookie("token","");
          return <Navigate to="/" replace />;
      });
  }
  

  return <>{children}</>;
};



export default ProtectmapRoute;
