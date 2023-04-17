
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';

import LoginPage from "../pages/Login";
import RegisterScreen from "../pages/Register";
import NewCourseScreen from "../pages/CreateCourse";
import Home from "../pages/Home/Home";
import CourseDetails from "../pages/Course_details/course_details";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/login",
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
  {
    path: "/cursodetalhes",
    element: <CourseDetails/>,
  },
  
]);

const DefaultRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path='/login' element={<LoginPage/>}/> */}
        {/* <Route path='/register' element={<RegisterScreen/>}/> */}
        <Route element={<SidebarLayout/>}>
          <Route path='/' element={<Home /> }/>
          {/* <Route path='/novo-curso' element={<NewCourseScreen /> }/> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default DefaultRoutes
