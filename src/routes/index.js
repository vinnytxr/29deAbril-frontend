import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../pages/Login";
import RegisterScreen from "../pages/Register";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage/>,
  },
  {
    path: "/register",
    element: <RegisterScreen/>,
  },
]);

export default Routes
