import logo from "../../assets/Screenshot_2567-07-10_at_12.04.25-removebg.png";
import mfulogo from '../../assets/Mae-Fah-Luang-University-2-768x779.png';
import googlelogo from "../../assets/googlelogo.png";
import "./style.sass";
import { getUserinfo, sencodetobackend } from '../../containers/login/Login';
import { Link ,Navigate,useNavigate} from 'react-router-dom';
import {  useGoogleLogin} from '@react-oauth/google';
import { useCookies } from "react-cookie";
// import { Button,TouchableHighlight,View,Icon,Text } from "react-native";
const Login = () => { 
    const [cookies, setCookie] = useCookies(['token']);
    const navigate = useNavigate();
    const login = async (codeResponse: { code: string; })=>{
       const token = await sencodetobackend(codeResponse.code);
        setCookie("token",token);
        // get role from user info 
        const userInfo = await getUserinfo(token);
        
        if (userInfo.role=== null ) {
           return console.error("Database error");
        }

        console.log("Role : ",userInfo.role);
        
        switch (userInfo.role) {
            case "USER":
                navigate('/map',{replace:true})
                break;
                case "ADMIN":
                navigate('/map',{replace:true})
                break;
            default:
                break;
        }
    }

    const auth = useGoogleLogin({
        onSuccess: codeResponse => login(codeResponse),
        onError: () => {
          console.log('Login Failed');
        },
        flow: 'auth-code',
      }
    );
 
    return <>
        <div className=" grid md:grid-cols-3 grid-rows-3  w-screen h-screen ">
            <div className="flex ml-5 mt-5 items-center h-14">
                <img src={mfulogo} alt="mfulogo" className="w-14 h-14" />
                <h1 className="texthighlightcolor">MFU</h1>
            </div>
            <div className="md:col-start-2 row-start-2  md:justify-self-center self-center">
                <h1 className=" text-center mb-4 textcolor text-3xl font-bold ">GEMS</h1>
                <img src={logo} alt="mfu-logo" className=" lg:w-96 md:w-80 w-64 mb-5 mx-auto" />
               <div className="flex justify-center googlebutton h-14 items-center rounded-full" onClick={auth}>
                      <img src={googlelogo} alt="googlelogo" width={20}  />
                      <p className=" text-white ml-2"> Sign in</p>
               </div>
                           {/* <GoogleLogin onSuccess={responseMessage} onError={errorMessage} /> */}
            </div>
        </div>
    </>
}
export default Login;