import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'

// Components
import SideNav from '../components/NavBar'

// Pages
import LoginPage from '../pages/Login'
import RegisterScreen from '../pages/Register'
import NewCourseScreen from '../pages/CreateCourse'
import Home from '../pages/Home/Home'
import UserProfileScreen from '../pages/UserProfile'

const SidebarLayout = () => (
  <>
    <SideNav />
    <Row>
      <div className="col-2" />
      <Col>
        <Outlet />
      </Col>
    </Row>
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
          <Route path="/novo-curso" element={<NewCourseScreen />} />
          <Route path="/perfil" element={<UserProfileScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default DefaultRoutes
