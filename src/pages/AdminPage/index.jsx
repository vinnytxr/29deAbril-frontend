import React, { useEffect, useState } from 'react'

import './style.css'

import { Col, Container, Navbar, Row, Card, Button, Form, ListGroup, ListGroupItem } from 'react-bootstrap'
import Avatar from 'react-avatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { AuthAPI } from "../../api/auth-api";
import { HttpStatus } from '../CreateCourse/api'

const AdministrationPage = () => {

    var count = 4;

    const [newCode, setNewCode] = useState("Clique no botão abaixo para gerar o código.")
    const [codes, setCodes] = useState([]);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const userData = localStorage.getItem('userData')
        console.log(JSON.parse(userData))
        setUserData(JSON.parse(userData))
    }, []);

    const fetchCodes = async () => {
        const jwt = localStorage.getItem('token')
        const response = await fetch('https://portal-aulas-api.fly.dev/invitation/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'jwt': jwt,
                Accept: 'application/json'
            },
        })

        if (response.ok) {
            const data = await response.json()
            console.log(data)
            return data
        } else {
            return []
        }
    }

    const createCode = async () => {
        const jwt = localStorage.getItem('token')
        console.log(jwt)
        var myHeaders = new Headers();
        myHeaders.append("jwt", jwt);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "code": "",
            "professor": null
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://portal-aulas-api.fly.dev/invitation/", requestOptions)
            .then(response => response.text())
            .then(result => {return result})
            .catch(error => console.log('error', error));
    }

    const requestCodes = async () => {
        const response = await fetchCodes()
        setCodes(response)

    }

    const handleClick = async () => {
        const response = await createCode()
        setNewCode(response)
        requestCodes()
    }

    const createNewCode = () => {
        count = count + 1;
        handleClick()

    }

    useEffect(() => {
        requestCodes()
    }, [])

    useEffect(() => {
        console.log(codes)
    }, [codes])


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
                                            Gerar novo código:
                                        </h1>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Control readOnly type="text" value={newCode} />
                                        <Button className='mt-3 btn-success' onClick={() => { createNewCode() }}>Gerar Código</Button>
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
                                    <Col className="d-flex justify-content-between align-items-center">
                                        <h1 className="fw-bold fs-5" style={{ color: '#727273' }}>
                                            Códigos gerados:
                                        </h1>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <ListGroup>
                                            <div>
                                                {codes.map(code => <ListGroupItem key={code.id}>Código: {code.code} Professor: {code.professor}</ListGroupItem>)}
                                            </div>
                                        </ListGroup>
                                    </Col>
                                </Row>
                            </Card>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default AdministrationPage
