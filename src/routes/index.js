import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'
import { Container, Col, Row } from 'react-bootstrap'

// Components
import SideNav from '../components/NavBar'

// Pages
import LoginPage from '../pages/Login'
import RegisterScreen from '../pages/Register'
import NewCourseScreen from '../pages/CreateCourse'
import Home from '../pages/Home/Home'
import UserProfileScreen from '../pages/UserProfile'

import '../global.css'

const SidebarLayout = () => (
  <>
    <SideNav />
    <Container>
      <Row>
        <div className="col-2" />
        <Col>
          <Outlet />
        </Col>
      </Row>
    </Container>
  </>
)

const CSSBaseline = () => (
  <>
    <div className="baseline" />
  </>
)

const DefaultRoutes = () => {
  return (
    <BrowserRouter>
      <CSSBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route element={<SidebarLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/perfil" element={<UserProfileScreen />} />
          <Route path="/professor/courses/create" element={<NewCourseScreen />} />
          <Route path="/professor/courses/:courseId/lessons/create" element={< h2 className="w-100 vh-100 d-flex flex-row justify-content-center align-items-center font-weight-bold-important">Página de cadastro de aula.<br/> Implementação em andamento!</h2>} />
        </Route>
        <Route path="*" element={< h2 className="w-100 vh-100 d-flex flex-row justify-content-center align-items-center font-weight-bold-important">Ops! Você está perdido ?!<br />Esta rota não existe ;(</h2>} />
      </Routes>
    </BrowserRouter>
  )
}

export default DefaultRoutes
