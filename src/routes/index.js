import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../pages/Login";
import RegisterScreen from "../pages/Register";
import NewCourseScreen from "../pages/CreateCourse";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage/>,
  },
  {
    path: "/register",
    element: <RegisterScreen/>,
  },
  {
    path: "/novocurso",
    element: <NewCourseScreen/>,
  },
]);

export default Routes
