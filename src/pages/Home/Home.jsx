import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import Avatar from 'react-avatar'

import './style.css'

// componentes
import CardCourses from '../../components/CardCourses'

//Bootstrap
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import { ListGroup } from 'react-bootstrap'

//Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { AuthAPI } from '../../api/auth-api'
import { HttpResponse, HttpStatus } from '../../api/default'
import { useAuthContext } from '../../contexts/AuthContext'

function Home() {
    const [data, setData] = useState({})
    const [isFetched, setIsFetched] = useState(false)

    const {logged, user} = useAuthContext()

    const getCourses = async (e) => {
        const responseCourses = await AuthAPI.getCoursesData()
        if (responseCourses.status == HttpStatus.OK) {
            setData(responseCourses.data)
            setIsFetched(true)
        }
    }


    useEffect(() => {
        getCourses()
    }, [])

    return (
        <>
            <Col>
                <Navbar>
                    <Container fluid>
                        {logged && user ? <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
                            &#128075;&nbsp; Hey, {user?.name?.split(' ')[0]}!
                        </p> : 
                        <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
                            &#128075;&nbsp; BEM-VINDO!
                        </p>}

                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">

                            <Navbar.Text>
                                {   user && 
                                    <Avatar
                                    name={user.name}
                                    color="#0f5b7a"
                                    size={30}
                                    textSizeRatio={2}
                                    round={true}
                                />
                                }
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Row>


                    <div className="col">
                        <h1 className="mt-3 mb-3 fs-5 fw-bold">Todos os cursos</h1>

                        <InputGroup className="mb-3">
                            <Form.Control placeholder="Buscar cursos" />
                            <Button variant="outline-secondary" id="button-addon2">
                                <FontAwesomeIcon icon={faMagnifyingGlass} className="me-2" />
                            </Button>
                        </InputGroup>

                        {isFetched ? (
                            <Row xs={1} md={3} lg={4} className="g-4">
                                {data.results.map((aula) => (
                                    <Col key={aula.id}>
                                        <CardCourses teste={aula} />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <p>Carregando</p>
                        )}
                    </div>
                </Row>
            </Col>
        </>
    )
}

export default Home
