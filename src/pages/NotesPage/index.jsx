import React, { useEffect, useState } from 'react'

import './style.css'

import { Col, Container, Navbar, Row, Card, Button, Form, ListGroup, ListGroupItem, Spinner } from 'react-bootstrap'
import Avatar from 'react-avatar'
import { useAuthContext } from '../../contexts/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode, faEnvelope, faShare } from '@fortawesome/free-solid-svg-icons'
import { AUTH_DEBUG, BASE_URL, HttpStatus } from '../../api/default'
import { AdminAPI } from '../../api/admin'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HttpResponse } from '../CreateCourse/api'


const NotesPage = () => {
    const { user, token } = useAuthContext();
    const [newCode, setNewCode] = useState("")
    const [email, setEmail] = useState("")
    const [codes, setCodes] = useState([]);
    const [enableBtn, setEnableBtn] = useState(true)
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingEmail, setIsLoadingEmail] = useState(false)

    const notifySuccess = () => toast.success("E-mail enviado com sucesso.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });

    const notifyError = (texto) => toast.error(texto, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });

    useEffect(() => {
        requestCodes()
    }, [token]);


  


    const fetchCodes = async () => {
        const url = `${BASE_URL}/anotation/`;
        var errorMessage;
        try {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'jwt': token,
                    Accept: 'application/json'
                }
            }
    
            const response = await fetch(url, options);
            if (response.ok) {
                const data = await response.json();
                AUTH_DEBUG && console.log("AuthAPI::FetchCodes(): ", data.token);
                return new HttpResponse(HttpStatus.OK, data);
            } else {
                errorMessage = await response.json();
                throw new Error("Error on FetchCodes()");
            }
        } catch (error) {
            console.warn(error)
            return new HttpResponse(HttpStatus.ERROR, errorMessage);
        }
    }
    

    const requestCodes = async () => {
        const listCodes = await fetchCodes();

        if (listCodes.status !== HttpStatus.OK) {
            notifyError("Falha ao requisitar lista de códigos.");
        }
        setCodes(listCodes.data.results);
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
                        
                        {codes && codes.length ?
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
                                                    <span className="code-span box">{code.user}</span>
                                                    <span className="code-span box">{code.note}</span>
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

export default NotesPage
