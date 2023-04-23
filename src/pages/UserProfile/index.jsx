import React from 'react'

import './style.css'

import { Col, Container, Navbar, Row, Card, Button } from 'react-bootstrap'
import Avatar from 'react-avatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'

const UserProfileScreen = () => {
  return (
    <>
      <Navbar style={{ marginBottom: '50px' }}>
        <Container fluid>
          <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
            &#128075;&nbsp; Hey, CHRISTOFER!
          </p>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <button
                style={{ color: '#1dbfb0' }}
                data-mdb-ripple-color="#1dbfb0"
                type="button"
                class="fw-bold btn btn-light"
              >
                ASSINE KULTIVI+
              </button>
            </Navbar.Text>
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
                    name="Avatar"
                    color="#0f5b7a"
                    size={150}
                    textSizeRatio={2}
                    round={true}
                  />
                  <Col className="d-flex align-items-center gap-4">
                    <h1
                      className="fw-bold fs-4 mt-4 mb-4"
                      style={{ color: '#727273' }}
                    >
                      Iago Carmona
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
                  Aluno desde: ABRIL, 2023
                </p>
              </Card.Footer>
            </Card>
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
                      Conte-nos mais sobre você. Adoraríamos conhecê-lo melhor.
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
                    href="/"
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
