import React, { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import Avatar from 'react-avatar';

import './style.css'

// componentes
import SideNav from "../../components/NavBar";



//Bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { ListGroup } from "react-bootstrap"

import {
    Card,
    Input,
}
    from 'react-bootstrap';

//Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faMagnifyingGlass, faPaperPlane, } from '@fortawesome/free-solid-svg-icons'



function NewCourseScreen() {


    const intialValues = { title: "", subtitle: "", description: "", img: "" };
    const [formValues, setFormValues] = useState(intialValues);
    const [formErrors, setFormErrors] = useState({});
    var errorsC = 0


    const handleChange = (e) => {
        console.log(e.target);
        console.log(formValues);
        const { name, value } = e.target;

        setFormValues({ ...formValues, [name]: value });

    }

    const handleSubmit = (e) => {
        console.log("CHAMOU")
        e.preventDefault();
        setFormErrors(validate(formValues));
        if(errorsC == 0){
            console.log("Válido")// CAHAMAR A FUNÇÃO DE CADASTRO AQUI ======================================================================================
        }
    }

    const validate = (values) => {
        errorsC = 0;
        const errors = {};

        if (!values.title) {
            errors.title = "Digite um título!";
        }

        if (!values.subtitle) {
            errors.subtitle = "Digite um subtítulo!";
        } else if (values.subtitle.length > 1120) {
            errors.subtitle = "Subtítulo não pode ter mais que 120 caracteres!";
        }

        if (!values.description) {
            errors.description = "Digite uma descricao!";
        }

        if (!values.img) {
            errors.img = "Selecione um banner para seu curso!";
        }
        errorsC = Object.keys(errors).length;
        return errors;
    }

        return (
            <>
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




                            {/* <Row>
                        <Col>
                            <p style={{ color: "#0f5b7a" }} className="mt-3 fs-6 fw-bold">&#128075;&nbsp; Hey, CHRISTOFER!</p>
                        </Col>
                        <Col className="justify-content-end ml-3">
                            <Row className="justify-content-end ml-3">
                                <Col className="justify-content-end ml-3">
                                    <button style={{ color: "#1dbfb0" }} data-mdb-ripple-color="#1dbfb0" type="button" class="btn btn-light">ASSINE KULTIVI+</button>
                                    <Avatar name="Christofer" color="#0f5b7a" size={30} textSizeRatio={2} round={true} />
                                </Col>

                            </Row>
                        </Col>

                    </Row> */}

                            <hr />
                            <h1 className="mt-3 ms-3 fs-5 fw-bold">Que legal que voce quer dar aulas por aqui.</h1>
                            <h1 className="mb-3 ms-3 fs-6">Preencha o formulário abaixo para criar o seu curso.</h1>
                            <div className="formulario-cadastro">
                                <Container fluid>
                                    <Row className='d-flex justify-content-center align-items-center'>
                                        <Col lg='10' className='my-5'>
                                            <h1 class="text-black mb-4 fs-2">Página inicial do curso</h1>
                                            <Card>
                                                <Form onSubmit={handleSubmit}>
                                                    <Card.Body className='px-4'>
                                                        <Row className='align-items-center pt-4 pb-3'>
                                                            <Col md='3' className='ps-4'>
                                                                <h6 className="mb-4">Título do curso</h6>
                                                            </Col>
                                                            <Col md='9' className='pe-5 mt-2'>
                                                                <div className="mb-3">
                                                                    <input
                                                                        type="text"
                                                                        name="title"
                                                                        placeholder="Insira o título do seu curso."
                                                                        className="form-control"
                                                                        value={formValues.titulo}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <p className="input-anotation mt-1 ms-1 mb-0">Pense em um título chamativo e informativo.</p>
                                                                    <p className="ps-2" style={{ color: "red" }}>{formErrors.title}</p>
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
                                                                        name="subtitle"
                                                                        placeholder="Insira o subtítulo do seu curso."
                                                                        className="form-control"
                                                                        value={formValues.subtitulo}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <p className="input-anotation mt-1 ms-1 mb-0">Descreva de forma rápida o que seu aluno atingirá com seu curso</p>
                                                                    <p className="ps-2" style={{ color: "red" }}>{formErrors.title}</p>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <hr className="mx-n3" />
                                                        <Row className='align-items-center pt-4 pb-3'>
                                                            <Col md='3' className='ps-4'>
                                                                <h6 className="mb-0">Descrição do curso</h6>
                                                            </Col>
                                                            <Col md='9' className='pe-5'>
                                                                <Form.Control
                                                                    name="description"
                                                                    placeholder="Insira a descrição do seu curso. Descreva tópicos e assuntos abordados."
                                                                    as="textarea" rows={3}
                                                                    value={formValues.descricao}
                                                                    onChange={handleChange}
                                                                />
                                                                <p className="ps-2" style={{ color: "red" }}>{formErrors.description}</p>
                                                            </Col>
                                                        </Row>
                                                        <hr className="mx-n3" />
                                                        <Row className='align-items-center pt-4 pb-3'>
                                                            <Col md='3' className='ps-4'>
                                                                <h6 className="mb-0">Imagem do curso</h6>
                                                            </Col>
                                                            <Col md='9' className='pe-5'>
                                                                <Form.Control type="file"
                                                                    name="img"
                                                                    onChange={handleChange}
                                                                    rows={3} />
                                                            <p className="ps-2" style={{ color: "red" }}>{formErrors.img}</p>
                                                            </Col>
                                                        </Row>
                                                        <hr className="mx-n3" />

                                                        <Button className='my-4 btn-success' type="submit" size='lg'>Cadastrar curso&nbsp; <FontAwesomeIcon icon={faPaperPlane} /></Button>
                                                    </Card.Body>
                                                </Form>
                                            </Card>
                                        </Col>
                                    </Row>

                                </Container>
                            </div>


                        </Col>
                    </Row>


                </div>

            </>
        )
    }

    export default NewCourseScreen