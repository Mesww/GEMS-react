import Dashboard from "./Dashboard/Dashboard";
import Table from "./Table/Table";
import ManageUser from "./ManageUser/page";
import Summary from "./Summary/schedule";
import Sidebar from "./Sidebar/sidebar";
export { Dashboard, Table, ManageUser, Summary, Sidebar };
// const routes=[Dashboard, Table, ManageUser, Summary,Sidebar];
import {  Routes,Route } from "react-router-dom";

import { Cookie, CookieSetOptions } from "universal-cookie";
import { AigenSchedule } from "../../interfaces/schedule.interface";
const routes: React.FC<{
  setCookies: (
    name: "token",
    value: Cookie,
    options?: CookieSetOptions
  ) => void;
}> = ({ setCookies }) => {
  const newSchedule: AigenSchedule[] = [
    {
      busId: "Bus 1",
      route: "Route A",
      schedule: [
        { station: "Station 1", departureTime: "08:05" },
        { station: "Station 2", departureTime: "08:20" },
        // Update more stops...
      ],
    },
    {
      busId: "Bus 2",
      route: "Route B",
      schedule: [
        { station: "Station 3", departureTime: "09:10" },
        { station: "Station 4", departureTime: "09:30" },
        // Update more stops...
      ],
    },
    // Update more buses...
  ];
  const route = [
    {
      path: "/admin/dashboard",
      element: <Dashboard setCookies={setCookies} />,
    },
    { path: "/admin/mark-pin", element: <Table setCookies={setCookies} /> },
    { path: "/admin/manage-user", element: <ManageUser /> },
    { path: "/admin/summary", element: <Summary aigendata={newSchedule} /> },
  ];
  if (Routes === null) {
    return null;
  }

  return (
    <div className="h-0">
      <div className="flex h-screen">
        <Sidebar setCookies={setCookies} />
        {/* Map Section */}
        <div className="flex-1 flex justify-center items-center p-4">
          <Routes>
            {route.map((r, index) => (
              <Route key={index} path={r.path} element={r.element} />
            ))}
          </Routes>
        </div>
      </div>
    </div>
  );
};
export default routes;
