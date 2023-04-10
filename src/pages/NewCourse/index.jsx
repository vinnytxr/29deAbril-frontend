import React, { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import Avatar from 'react-avatar';

// Style
import './style.css'

// Componentes
import SideNav from "./components/nav";

// Bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import { Card } from 'react-bootstrap';

//Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const NewCourseScreen = () => {
    const [data, setData] = useState();
    const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
        const dataFetch = async () => {
            const data = await (
                await fetch(
                    "https://dummyjson.com/products"
                )
            ).json();

            setData(data);
            setIsFetched(true);
        };
        dataFetch();
    }, []);

    return (
            <div className="container-fluid fundo">
                <Row>
                    <div className="col-2 d-none d-lg-inline">
                        <SideNav />
                    </div>
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
                        <hr />
                        <h1 className="mt-3 ms-3 fs-5 fw-bold">Que legal que voce quer dar aulas por aqui.</h1>
                        <h1 className="mb-3 ms-3 fs-6">Preencha o formulário abaixo para criar o seu curso.</h1>
                        <div className="formulario-cadastro">
                            <Container fluid>
                                <Row className='d-flex justify-content-center align-items-center'>
                                    <Col lg='10' className='my-5'>
                                        <h1 class="text-black mb-4 fs-2">Página inicial do curso</h1>
                                        <Card>
                                            <Card.Body className='px-4'>
                                                <Row className='align-items-center pt-4 pb-3'>
                                                    <Col md='3' className='ps-4'>
                                                        <h6 className="mb-4">Título do curso</h6>
                                                    </Col>
                                                    <Col md='9' className='pe-5 mt-2'>
                                                        <div className="mb-3">
                                                            <input
                                                                type="text"
                                                                name="username"
                                                                placeholder="Insira o título do seu curso."
                                                                className="form-control"
                                                            />
                                                            <p className="input-anotation mt-1 ms-1">Pense em um título chamativo e informativo.</p>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <hr className="mx-n3" />
                                                <Row className='align-items-center pt-4 pb-3'>
                                                    <Col md='3' className='ps-4'>
                                                        <h6 className="mb-4">Subtítulo do curso</h6>
                                                    </Col>
                                                    <Col md='9' className='pe-5 mt-2'>
                                                        <div className="mb-3">
                                                            <input
                                                                type="text"
                                                                name="username"
                                                                placeholder="Insira o subtítulo do seu curso."
                                                                className="form-control"
                                                            />
                                                            <p className="input-anotation mt-1 ms-1">Descreva de forma rápida o que seu aluno atingirá com seu curso</p>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <hr className="mx-n3" />
                                                <Row className='align-items-center pt-4 pb-3'>
                                                    <Col md='3' className='ps-4'>
                                                        <h6 className="mb-0">Descrição do curso</h6>
                                                    </Col>
                                                    <Col md='9' className='pe-5'>
                                                        <Form.Control placeholder="Insira a descrição do seu curso. Descreva tópicos e assuntos abordados." as="textarea" rows={3} />
                                                    </Col>
                                                </Row>
                                                <hr className="mx-n3" />
                                                <Button className='my-4 btn-success' size='lg'>Cadastrar curso&nbsp; <FontAwesomeIcon icon={faPaperPlane} /></Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                            </Container>
                        </div>
                    </Col>
                </Row>
            </div>
    )
}

export default NewCourseScreen