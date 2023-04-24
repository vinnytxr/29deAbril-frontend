import React, { useEffect, useState } from 'react'

import './style.css'

import { Col, Container, Navbar, Row, Card, Button, Modal, Form } from 'react-bootstrap'
import Avatar from 'react-avatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { AuthAPI } from "../../api/auth-api";
import { HttpStatus } from '../CreateCourse/api'
import { Navigate, useNavigate } from 'react-router-dom'

const UserProfileScreen = () => {
  const navigate = useNavigate()

  const [authorizationCode, setAuthorizationCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const handleShowModal = () => setShowModal(true);

  const handleCloseModal = () => {
    setAuthorizationCode("")
    setShowModal(false);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    handleCloseModal();
  };

  const [userData, setUserData] = useState({});

  const date = (dateString) => {
    const dateObj = new Date(dateString);
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    const formattedDate = `Aluno desde: ${month}, ${year}`;
    return formattedDate // saída: "23/4/2023"

  }

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    setUserData(JSON.parse(userData))


  }, []);

  useEffect(() => {
    console.log(userData)
  }, [userData])


  return (
    <>
      <Navbar style={{ marginBottom: '50px' }}>
        <Container fluid>
          <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
            &#128075;&nbsp; Hey, {JSON.parse(localStorage.getItem('userData')).name.split(' ')[0]}!
          </p>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Avatar
                class
                name="Christofer"
                color="#0f5b7a"
                size={30}
                textSizeRatio={2}
                round={true}
              />
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Row className="d-flex justify-content-center gap-4">
          <Col xs={3}>
            <Card
              style={{
                paddingTop: '16px',
              }}
            >
              <Row>
                <Col className="d-flex justify-content-center align-items-center flex-column">
                  <Avatar
                    class
                    name={userData.name && userData.name.split(' ')[0]}
                    color="#0f5b7a"
                    size={150}
                    textSizeRatio={2}
                    round={true}
                  />
                  <Col className="d-flex align-items-center gap-1">
                    <h1
                      className="fw-bold fs-4 mt-4 mb-4 ms-1"
                      style={{ color: '#727273' }}
                    >
                      {userData.name}
                    </h1>
                    <Button variant="outline-light">
                      <FontAwesomeIcon
                        style={{ color: '#8a9094', fontSize: '16' }}
                        icon={faPen}
                      />
                    </Button>
                  </Col>
                </Col>
              </Row>
              <Card.Footer className="d-flex justify-content-center align-items-center">
                <p className="mt-0 mb-0 fs-6" style={{ color: '#727273' }}>
                  {date(userData.created)}
                </p>
              </Card.Footer>
            </Card>
            <Card style={{ cursor: 'pointer' }} className='mt-1' onClick={handleShowModal}>
              <Col style={{ backgroundColor: "#00a889" }} className="d-flex justify-content-center align-items-center bg-gradient">
                <p className="m-1">Tornar-me professor!</p>
              </Col>
            </Card>

            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Tornar-se professor</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Coloque o código de autorização aqui:</p>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="authorizationCode">
                  <Form.Control type="text" placeholder="Digite o código aqui" value={authorizationCode} onChange={(e) => setAuthorizationCode(e.target.value)} />
                  </Form.Group>
                  <Button className='mt-2' variant="success" type="submit">Virar professor</Button>
                </Form>
              </Modal.Body>
            </Modal>
          </Col>

          <Col>
            <Row className="mb-4">
              <Card
                style={{
                  padding: '16px',
                }}
              >
                <Row className="mb-4">
                  <Col className="d-flex justify-content-between align-items-center">
                    <h1 className="fw-bold fs-5" style={{ color: '#727273' }}>
                      Sobre mim
                    </h1>
                    <Button variant="outline-light">
                      <FontAwesomeIcon
                        style={{ color: '#8a9094', fontSize: '16' }}
                        icon={faPen}
                      />
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p className="mt-0 mb-0 fs-6" style={{ color: '#727273' }}>
                      {userData.about}
                    </p>
                  </Col>
                </Row>
              </Card>
            </Row>

            <Row>
              <Card
                style={{
                  padding: '16px',
                }}
              >
                <Row className="mb-4">
                  <h1 className="fw-bold fs-5" style={{ color: '#727273' }}>
                    Meus cursos
                  </h1>
                </Row>
                <Row className="d-flex justify-content-center align-items-center">
                  <p
                    className="mt-0 mb-0 fs-5 fw-bold"
                    style={{ color: '#505050', textAlign: 'center' }}
                  >
                    Você ainda não se matriculou em nenhum curso
                  </p>

                  <p
                    className="mt-2 mb-0 fs-6 "
                    style={{ color: '#505050', textAlign: 'center' }}
                  >
                    Aproveite e comece a estudar agora mesmo! 😃
                  </p>

                  <Button
                    variant="outline-success"
                    className="mt-4 w-25"
                    onClick={() => {navigate("/")}}
                  >
                    Explorar cursos
                  </Button>
                </Row>
              </Card>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default UserProfileScreen
