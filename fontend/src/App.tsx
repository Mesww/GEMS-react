import "./App.sass";
import "./components/login/page";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./components/login/page";
import Map from "./components/map/page";
import ProtectmapRoute from "./components/protect_route/protectmap.route";
import ProtectloginRoute from "./components/protect_route/protectlogin.route";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
        <ProtectloginRoute>
          <Login />
        </ProtectloginRoute>
        }></Route>
        <Route
          path="/map"
          element={
            <ProtectmapRoute requireRoles={["ADMIN", "USER"]}>
              <Map />
            </ProtectmapRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
