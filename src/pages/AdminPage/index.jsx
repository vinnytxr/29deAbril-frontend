import React, { useEffect, useState } from 'react'

import './style.css'

import { Col, Container, Navbar, Row, Card, Button, Form, ListGroup, ListGroupItem, Spinner } from 'react-bootstrap'
import Avatar from 'react-avatar'
import { useAuthContext } from '../../contexts/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCode, faShare } from '@fortawesome/free-solid-svg-icons'
import { AUTH_DEBUG, BASE_URL, HttpResponse, HttpStatus } from '../../api/default'

const AdministrationPage = () => {
    const { user, token } = useAuthContext();
    const [newCode, setNewCode] = useState("")
    const [email, setEmail] = useState("")
    const [codes, setCodes] = useState([]);
    const [enableBtn, setEnableBtn] = useState(true)
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        requestCodes()
    }, []);

    const fetchCodes = async () => {
        const response = await fetch(`${BASE_URL}/invitation/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'jwt': token,
                Accept: 'application/json'
            },
        })

        if (response.ok) {
            const data = await response.json()
            return data
        } else {
            return []
        }
    }

    const createCode = async () => {
        var myHeaders = new Headers();
        myHeaders.append("jwt", token);
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

        const response = await fetch(`${BASE_URL}/invitation/`, requestOptions)
        if (response.ok) {
            const data = await response.json()
            return data.code
        } else {
            return ""
        }

    }

    const validate = () => {
        const errors = {};
        const regexemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if (newCode == "") {
            errors.codigo = "Selecione um código para ser enviado."
        }

        if (email == "") {
            errors.email = "Digite um email!";
        } else if (!regexemail.test(email)) {
            errors.email = "Digite um email com formato válido!";
        }
        setErrors(errors)
        return Object.keys(errors).length
    }

    const sendCode = async () => {
        if (validate() == 0) {
            console.log("Válido")
            const url = `${BASE_URL}/user/send-email/`
            try {
                const options = {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                    body: JSON.stringify({ email: email, code: newCode })
                }

                const response = await fetch(url, options);
                if (response.ok) {
                    const data = await response.json();
                    AUTH_DEBUG && console.log("AuthAPI::send code(): ", data.token);
                    alert("E-mail enviado com sucesso!")
                    return new HttpResponse(HttpStatus.OK, data);
                } else {
                    alert("Falha ao enviar e-mail!")
                    throw new Error("Error on send code()");
                }
            } catch (error) {
                console.warn(error)
                return new HttpResponse(HttpStatus.ERROR, null);
            }
        }
        console.log(errors)
        console.log(email)
    }

    const selectCode = (code) => {
        console.log("Código selecionado:", code)
        setNewCode(code)
    }

    const requestCodes = async () => {
        const response = await fetchCodes()
        setCodes(response)

    }

    const handleClick = async () => {
        setEnableBtn(false)
        setIsLoading(true)
        const response = await createCode()
        setNewCode(response)
        requestCodes()
        setTimeout(() => {setEnableBtn(true);setIsLoading(false);}, 1500)
    }

    const createNewCode = () => {
        handleClick()

    }


    return (
        <>
            <Navbar style={{ marginBottom: '50px' }}>
                <Container fluid>
                    <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
                        &#128075;&nbsp; Hey, Administrador!
                    </p>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            <Avatar
                                class
                                name={user?.name}
                                color="#0f5b7a"
                                size={30}
                                textSizeRatio={2}
                                round={true}
                            />
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container fluid className='mb-3'>
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
                                        <Form.Control readOnly type="text" placeholder='Clique no botão abaixo para gerar o código.' value={newCode} />
                                        <Button disabled={!enableBtn} className='mt-2 btn-success' onClick={() => { createNewCode() }}>
                                            {isLoading ? (
                                                <Spinner
                                                className="me-2"
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                />
                                            ) : (
                                                <FontAwesomeIcon icon={faCode} className="me-2" />
                                            )}
                                            Gerar Código
                                        </Button>
                                    </Col>
                                </Row>
                                <div className='pt-4'></div>
                                <Row>
                                    <Col>
                                        <p className='mb-1'>Enviar o código por e-mail</p>
                                        <input
                                            type="text"
                                            name="email"
                                            placeholder="Email"
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)} />
                                        <Button className='mt-2 mb-1 btn-success' onClick={() => { sendCode() }}>Enviar</Button>
                                        <p className="ps-2 mb-0" style={{ color: "red" }}>{errors.email}</p>
                                        <p className="ps-2  mb-0" style={{ color: "red" }}>{errors.codigo}</p>
                                    </Col>
                                </Row>
                            </Card>
                        </Row>

                        {codes.length ?
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
                                                {codes.map(code => <ListGroupItem key={code.id} style={{ display: "flex" }}>
                                                    <span className="code-span box">{code.code}</span>
                                                    <span className='box'>
                                                        <span className={`flag ${code.professor !== null ? "flag-used" : "flag-not-used"}`}>{code.professor !== null ? "utilizado" : "livre"}</span>
                                                    </span>
                                                    {code.professor === null &&<span onClick={() => selectCode(code.code)} className='share'>Selecionar <FontAwesomeIcon
                                                        style={{ color: 'white', fontSize: '16' }}
                                                        icon={faShare}
                                                    /></span>}
                                                </ListGroupItem>)}
                                            </ListGroup>
                                        </Col>
                                    </Row>
                                </Card>
                            </Row> : <></>
                        }
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default AdministrationPage
