import React from "react"

import './style.css'
import { Col, Row, Container } from "react-bootstrap"
import { Link } from "react-router-dom"

function Home() {
    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <Link to="/test/student">Aluno: Teste Login</Link>
                </Col>
                <Col xs={12}>
                    <Link to="/test/professor">Professor: Teste Login</Link>
                </Col>
                <Col xs={12}>
                    <Link to="/test/admin">Admin: Teste Login</Link>
                </Col>
            </Row>
        </Container>
    )
}

export default Home
