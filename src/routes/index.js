import React from "react";
import { createBrowserRouter } from "react-router-dom";

import LoginScreen from "../pages/Login";
import Dashboard from '../pages/Dashboard'

const Routes = createBrowserRouter([
  {
    path: "/home",
    element: <Dashboard/>,
  },
  {
    path: "/login",
    element: <LoginScreen/>,
  },
]);

export default Routes
