import React from "react";

import './style.css'

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container, Navbar } from "react-bootstrap";
import Avatar from "react-avatar";

const UserProfileScreen = () => {
    return (
        <>
           <div className="container-fluid fundo">
                <Row>
                    <Col>
                        <Navbar>
                            <Container fluid>
                                <p style={{ color: "#0f5b7a" }} className="mt-3 fs-6 fw-bold">&#128075;&nbsp; Hey, CHRISTOFER!</p>
                                <Navbar.Toggle />
                                <Navbar.Collapse className="justify-content-end">
                                    <Navbar.Text>
                                        <button style={{ color: "#1dbfb0" }} data-mdb-ripple-color="#1dbfb0" type="button" class="fw-bold btn btn-light">ASSINE KULTIVI+</button>
                                    </Navbar.Text>
                                    <Navbar.Text>
                                        <Avatar class name="Christofer" color="#0f5b7a" size={30} textSizeRatio={2} round={true} />
                                    </Navbar.Text>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                        <h1 className="mt-3 ms-3 fs-5 fw-bold">Que legal que voce quer dar aulas por aqui.</h1>
                        <h1 className="mb-3 ms-3 fs-6">Preencha o formulário abaixo para criar o seu curso.</h1>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default UserProfileScreen