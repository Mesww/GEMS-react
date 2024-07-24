import axios from "axios";
import { jwtDecode } from "jwt-decode";
export interface Token{
  id:string,
  sub:string,
  iat:string
}

export async function auth(code: string) {
    const CLIENT_ID = process.env.CLIENT_ID;
    const SECRET_ID = process.env.SECRET_ID;
    const REDIRECTURL = process.env.REDIRECTURL;
    
  // console.log("Authorization Code : ", code);

  const response = await axios.post("https://oauth2.googleapis.com/token", {
    code,
    client_id: CLIENT_ID,
    client_secret: SECRET_ID,
    redirect_uri: "postmessage",
    grant_type: "authorization_code",
  });
  
  const accessToken = response.data.access_token;
  console.log("Access Token:", accessToken);

  // Fetch user details using the access token
  const userResponse = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  
  const userDetails = userResponse.data;
  console.log("User Details:", userDetails);

  return userDetails;
}

export function parseJwt(token: string) {
  var jsonPayload = jwtDecode<Token>(token);
  return jsonPayload;
}