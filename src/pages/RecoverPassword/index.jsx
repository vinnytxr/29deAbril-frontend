import React, { useState, useEffect } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { Form, Spinner } from 'react-bootstrap';
import { PasswordAPI } from "../../api/password";
import { HttpStatus } from "../../api/default";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Style
import './style.css'

const PasswordRecoveryPage = () => {
    const navigate = useNavigate();
    const intialValues = { email: ""};
    const [formValues, setFormValues] = useState(intialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    var errorsC = 0;

    const notifySuccess = (texto) => toast.success(texto, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
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
        if (isSubmit)
            setFormErrors(validate(formValues));
    }, [formValues]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);
        setIsLoading(true)

        if (errorsC === 0) {
            const response = await PasswordAPI.fetchRecovery(formValues.email)
            if (response.status === HttpStatus.OK) {
                setIsLoading(false)
                notifySuccess("Requisição para alteração de senha realizada!")
            } else {
                setIsLoading(false)
                notifyError(`Falha em requisitar recuperação de senha.\n ${response.data.error}`)
            }
        }
        setIsLoading(false)
    }

    const validate = (values) => {
        const errors = {};
        errorsC = 0;
         const regexemail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if (!values.email) {
            errors.email = "Digite um e-mail.";
        } else if (!regexemail.test(values.email)) {
            errors.email = "Digite um email com formato válido!";
        }

        errorsC = Object.keys(errors).length;
        return errors;
    }



    return (
        <Container fluid>
            <Row className="justify-content-md-center p-5">
                <Col xs={12} md={9} lg={9}>
                    <Row>
                        <Col>
                            <Row>
                                <Col>
                                    <img
                                        style={{ width: '11em' }}
                                        onClick={() => {navigate('/')}}
                                        src="https://i.ibb.co/r3QPmSt/logo.png"
                                        alt="logo"
                                        border="0"
                                    />
                                </Col>
                                <Col className="d-flex justify-content-end">
                                    <p className="mt-3">
                                        Já tem conta?&nbsp;
                                        <Link className="fw-bold link-termos" to="/login">
                                            ENTRE AGORA!
                                        </Link>
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                        <p className="fw-bold fs-4 ms-1">Recuperação de Senha!</p>
                        <p className="fs-6 mb-1 ms-1">Digite seu e-mail de cadastro!</p>
                        <p className="fs-6 mb-1 ms-1">
                            &#x2022; Se o seu e-mail estiver cadastrado em nossa plataforma, um e-mail com instruções para recuperação de senha será enviado para você.
                        </p>
                    </Row>
                    <Row className="ps-1 mt-2">
                        <Form onSubmit={handleSubmit}>
                            <div>
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="Email"
                                    className="form-control"
                                    value={formValues.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <p className="mb-3 ps-1" style={{ color: 'red' }}>
                                {formErrors.email}
                            </p>
                            <Row className="mt-3">
                                <Col className="text-start">
                                    <button className="btn btn-info">
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
                                            <FontAwesomeIcon icon={faCheck} className="me-2" />
                                        )}
                                        Enviar
                                    </button>
                                </Col>
                            </Row>
                        </Form>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default PasswordRecoveryPage
