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
import CourseDetails from '../pages/CourseDetails/course_details'
import '../global.css'

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
        <Route element={<SidebarLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterScreen />} />
          <Route path='/students/courses/:id' element={<CourseDetails />} />
          <Route path='/students/lessons/:id' element={<h2>Pagina de aula</h2>} />
          <Route path='/novo-curso' element={<NewCourseScreen />} />
        </Route>
        <Route path='/404-not-found' element={<h2 className="vw-100 vh-100 d-flex flex-row justify-content-center align-items-center font-weight-bold-important">Está perdido?! Parece que você errou o caminho :(</h2>} />
        <Route path='/*' element={<h2 className="vw-100 vh-100 d-flex flex-row justify-content-center align-items-center font-weight-bold-important">Está perdido?! Parece que você errou o caminho :(</h2>} />
      </Routes>
    </BrowserRouter>
  )
}

export default DefaultRoutes