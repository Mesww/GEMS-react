import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import MapComponant from './mapComponent';
import Navbar from '../navbar/navbar';



const Mappage = ()=>{
    const [cookies, setCookie] = useCookies(['token']);
    const navigate = useNavigate();
    const handleSignout = () => {
        setCookie('token', '');
        if (cookies.token) {
          navigate('/map', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      };
 

    return <>
    <Navbar/>
    <MapComponant/>
    </>
}
export default Mappage;