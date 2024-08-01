import "./App.sass";
import "./components/login/page";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login/page";
import Map from "./components/map/page";
import ProtectmapRoute from "./components/protect_route/protectmap.route";
import ProtectloginRoute from "./components/protect_route/protectlogin.route";
import Dashboard from "./components/admin/Dashboard";
import Table from "./components/admin/Table";

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
        <Route
          path="/admin/dashboard"
          element={
            <ProtectmapRoute requireRoles={["ADMIN", "USER"]}>
              <Dashboard />
            </ProtectmapRoute>
          }
        ></Route>
        <Route
          path="/admin/table"
          element={
            <ProtectmapRoute requireRoles={["ADMIN", "USER"]}>
              <Table />
            </ProtectmapRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
