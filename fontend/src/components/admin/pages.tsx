import Dashboard from "./Dashboard/Dashboard";
import Table from "./Table/Table";
import ManageUser from "./ManageUser/page";
import Summary from "./Summary/schedule";
import { RouteObject } from "react-router-dom";

  
  // ? use this function to create admin routes
  const createAdminRoutes = (): RouteObject[] => [
    { path: "dashboard", element: <Dashboard  /> },
    { path: "mark-pin", element: <Table  /> },
    { path: "manage-user", element: <ManageUser /> },
    { path: "summary", element: <Summary /> },
  ];
  
  export default createAdminRoutes;