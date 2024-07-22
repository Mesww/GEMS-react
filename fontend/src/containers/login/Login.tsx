import axios from "axios";
import { jwtDecode } from 'jwt-decode';
const VITE_API = import.meta.env.VITE_API || "http://localhost:8886" 

export const sencodetobackend = async (code: string) => {
//   console.log("code : ", code);
  try {
    const response = await axios.post(
      `${VITE_API}/users/signin`,
      {
        code: code,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to send code to backend:", error);
  }
};

export const getUserinfo = async function (token?:string) {
    if (!token) {
        return {"role":null}
    }
    try {
        const response = await axios.get(
            `${VITE_API}/users/getUser`,
           {headers:{"x-auth-token":token}}
          );
        const user = jwtDecode<{
            email: string;
            name: string;
            role: string;
        }>(response.data);
        console.log(user);
        
        
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }

}