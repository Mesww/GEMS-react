import "./App.sass";
import "./components/login/page";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login/page";
import Map from "./components/map/page";
import ProtectmapRoute from "./components/protect_route/protectmap.route";
import ProtectloginRoute from "./components/protect_route/protectlogin.route";
import createAdminRoutes from "./components/admin/pages";
import Adminlayout from "./layout/admin.layout";
function App() {
  const adminRoutes = createAdminRoutes();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectloginRoute>
              <Login  />
            </ProtectloginRoute>
          }
        ></Route>
        <Route
          path="/map"
          element={
            <ProtectmapRoute
              requireRoles={["ADMIN", "USER"]}
            >
              <Map />
            </ProtectmapRoute>
          }
        ></Route>

<Route
          path="/admin/*"
          element={
            <ProtectmapRoute
              requireRoles={["ADMIN"]}
            >
              <Adminlayout />
            </ProtectmapRoute>
          }
        >
          {adminRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
