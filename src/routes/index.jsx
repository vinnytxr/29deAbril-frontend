/* eslint-disable no-unused-vars */

import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import React from 'react';
import LoginPage from "../pages/Login";
import RegisterScreen from "../pages/Register";
import NewCourseScreen from "../pages/CreateCourse";
import Home from "../pages/Home/Home";
import SideNav from '../components/NavBar';
import { AuthProvider, useAuthContext } from '../contexts/AuthContext';
import { Roles } from '../api/default';

const hasRoles = (context, role) => {
  const { logged, user } = context;
  if (!!logged && !!user && (user.role?.includes(role) ?? false)) return true
  return false
}

const StrictRoute = ({ children, role }) => {
  const authContext = useAuthContext();
  return hasRoles(authContext, role) ? children : <></>
}


const SidebarLayout = () => (
  <>
    <SideNav />
    <Outlet />
  </>
);

function DefaultRoutes() {
  const authContext = useAuthContext();

  return (

    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterScreen />} />
          <Route element={<SidebarLayout />}>
            <Route path='/' element={<Home />} />
            <Route path='/novo-curso' element={<StrictRoute role={Roles.PROFESSOR} children={<NewCourseScreen />} />} />

            <Route path='/test/student' element={<StrictRoute role={Roles.STUDENT} children={<PageForStudent />} />} />
            <Route path='/test/professor' element={<StrictRoute role={Roles.PROFESSOR} children={<PageForProfessor />} />} />
            <Route path='/test/admin' element={<StrictRoute role={Roles.ADMIN} children={<PageForAdmin />} />} />
            <Route path='/test/any' element={<PageForNotLogged />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default DefaultRoutes


const PageForProfessor = () => {
  const { logged, user } = useAuthContext();
  return <h1>Pagina de Professor - {user?.name}</h1>
}

const PageForStudent = () => {
  const { logged, user } = useAuthContext();
  return <h1>Pagina de Aluno - {user?.name}</h1>
}

const PageForAdmin = () => {
  const { logged, user } = useAuthContext();
  return <h1>Pagina de Admin - {user?.name}</h1>
}

const PageForNotLogged = () => {
  return <h1>Pagina geral, não precisa estar logado</h1>
}