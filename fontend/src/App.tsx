import "./App.sass";
import "./components/login/page";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login/page";
import Map from "./components/map/page";
import ProtectmapRoute from "./components/protect_route/protectmap.route";
import ProtectloginRoute from "./components/protect_route/protectlogin.route";
import { useCookies } from "react-cookie";
import { Dashboard,Table } from '../src/components/admin/pages';


function App() {
  const [cookies, setCookie] = useCookies(["token"]);
  // ! Dummy data
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
        <ProtectloginRoute cookies={cookies}>
          <Login setCookie={setCookie} />
        </ProtectloginRoute>
        }></Route>
        <Route
          path="/map"
          element={
            <ProtectmapRoute cookies={cookies} setCookie={setCookie}  requireRoles={["ADMIN", "USER"]}>
              <Map setCookies={setCookie} />
            </ProtectmapRoute>
          }
        ></Route>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectmapRoute cookies={cookies} setCookie={setCookie}   requireRoles={["ADMIN"]}>
              <Dashboard setCookies={setCookie} />
            </ProtectmapRoute>
          }
        ></Route>
        <Route
          path="/admin/mark-pin"
          element={
            <ProtectmapRoute cookies={cookies} setCookie={setCookie}   requireRoles={["ADMIN"]}   >
              <Table setCookies={setCookie}/>
            </ProtectmapRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
