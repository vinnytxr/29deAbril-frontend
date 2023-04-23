import React from "react"

import './style.css'
import { Col, Row, Container } from "react-bootstrap"
import { Link } from "react-router-dom"

function Home() {
    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <Link to="/login">Login</Link>
                </Col>
                <Col xs={12}>
                    <Link to="/register">Cadastro</Link>
                </Col>
                <Col xs={12}>
                    <Link to="/perfil">Meu perfil</Link>
                </Col>
                <Col xs={12}>
                    <Link to="/professor/courses/create">Professor: Criar curso</Link>
                </Col>
            </Row>
        </Container>
    )
}

export default Home
