import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import Avatar from 'react-avatar'
import CardCourses from '../../components/CardCourses'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'

//Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faCheck } from '@fortawesome/free-solid-svg-icons'
import { AuthAPI } from '../../api/auth-api'
import { HttpStatus } from '../../api/default'
import { useAuthContext } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import './style.css'


function Home() {
  const [data, setData] = useState({})
  const [isFetched, setIsFetched] = useState(false)
  const [searchData, setSearchData] = useState([])
  const [searchValue, setSearchValue] = useState('')

  const { logged, user } = useAuthContext()

  const getCourses = async (e) => {
    const responseCourses = await AuthAPI.getCoursesData()
    if (responseCourses.status === HttpStatus.OK) {
      setData(responseCourses.data)
      setIsFetched(true)
    }
  }

  const handleSearch = (e) => {
    setSearchValue(e.target.value)
    const filteredData = data.results.filter((curso) =>
      curso.title.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setSearchData(filteredData)
  }

  useEffect(() => {
    getCourses()
  }, [])



  return (
    <>

      <Container fluid>

        <Col>
          <Navbar>
            {logged && user ? (
              <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
                &#128075;&nbsp; Hey, {user?.name?.split(' ')[0]}!
              </p>
            ) : (
              <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
                &#128075;&nbsp; BEM-VINDO!
              </p>
            )}

            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                {user && (
                  <Avatar
                    name={user.name}
                    color="#0f5b7a"
                    size={30}
                    textSizeRatio={2}
                    round={true}
                  />
                )}
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>
          <Row className="home-card">
            <div className="col">

              <h1 className="mt-3 mb-3 fs-5 fw-bold">Todos os cursos</h1>

              <div className="mb-3 container-input" onChange={(e) => handleSearch(e)}>
                <input placeholder="Buscar cursos" className='input-search' />
                <FontAwesomeIcon icon={faMagnifyingGlass} className='icon-search' />
              </div>


              {isFetched ? (
                <>
                  {searchValue ? (
                    searchData.length > 0 ? (
                      <Row className="g-4">
                        {searchData.map((course) => (
                          <Col xs={12} lg={4} key={course.id}>
                            <Link to={`/courses/${course.id}`}>
                              <CardCourses teste={course} />
                            </Link>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <p>Nenhum curso encontrado com o termo de busca.</p>
                    )
                  ) : data.results ? (
                    <Row className="g-4">
                      {data.results.map((course) => (
                        <Col xs={12} lg={4} key={course.id}>
                          <Link to={`/courses/${course.id}`}>
                            <CardCourses teste={course} />
                          </Link>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <p>Não há cursos disponíveis.</p>
                  )}
                </>
              ) : (
                <p>Carregando...</p>
              )}
            </div>
          </Row>
        </Col>
      </Container>
    </>
  )
}

export default Home
