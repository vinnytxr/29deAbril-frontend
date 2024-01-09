import React, { useState, useEffect } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong, faCheck } from '@fortawesome/free-solid-svg-icons'
import { Form, Spinner } from 'react-bootstrap';
import { HttpStatus } from "../../api/default";
import { PasswordAPI } from "../../api/password"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from "../../contexts/AuthContext";
import './style.css'

const ChangePasswordPage = () => {
    const navigate = useNavigate();

    const { token } = useAuthContext();
    const intialValues = { oldPassword: "", newPassword: "", newPasswordConfirm: "" };
    const [formValues, setFormValues] = useState(intialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

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

    var errorsC = 0;

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
        setIsLoading(true);

        if (errorsC === 0) {
            const response = await PasswordAPI.fetchChange(formValues.oldPassword, formValues.newPassword, token);
            if (response.status === HttpStatus.OK) {
                notifySuccess("Senha alterada com sucesso.");
                setIsLoading(false)
                navigate('/perfil')
            } else {
                notifyError(response.data.error);
                setIsLoading(false)
            }
        }
        
        setIsLoading(false)
    }


    const validate = (values) => {
        const errors = {};
        errorsC = 0;

        if (!values.oldPassword) {
            errors.oldPassword = "Digite sua senha atual!";
        }

        if (!values.newPassword) {
            errors.newPassword = "Digite sua nova senha!";
        } else if (values.newPassword.length < 4) {
            errors.newPassword = "Digite uma senha maior!";
        } else if (values.newPassword.length > 16) {
            errors.newPassword = "A senha não pode ter mais de 16 caracteres!";
        }

        if (!values.newPasswordConfirm) {
            errors.newPasswordConfirm = "Digite sua nova senha novamente!";
        } else if (values.newPassword !== values.newPasswordConfirm) {
            errors.newPasswordConfirm = "A senha digitada na confirmação deve ser idêntica a nova senha!";
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
                                        <Link className="fw-bold link-limpo" style={{ color: '#1dbfb0' }} to="/">
                                            <FontAwesomeIcon icon={faArrowLeftLong} className="me-1" /> Cancelar!
                                        </Link>
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                        <p className="fw-bold fs-4 ms-1">Mudança de senha!</p>
                        <p className="ms-2">Preencha os campos para realizar a mudança da sua senha.</p>
                    </Row>
                    <Row className="ps-1 mt-2">
                        <Form onSubmit={handleSubmit}>
                            <div>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    placeholder="Senha atual"
                                    className="form-control"
                                    value={formValues.oldPassword}
                                    onChange={handleChange}
                                />
                            </div>
                            <p className="mb-3 ps-1" style={{ color: 'red' }}>{formErrors.oldPassword}</p>
                            <div>
                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="Sua nova senha"
                                    className="form-control"
                                    value={formValues.newPassword}
                                    onChange={handleChange}
                                />
                            </div>
                            <p className="mb-3 ps-1" style={{ color: 'red' }}>{formErrors.newPassword}</p>
                            <div>
                                <input
                                    type="password"
                                    name="newPasswordConfirm"
                                    placeholder="Digite a nova senha novamente"
                                    className="form-control"
                                    value={formValues.newPasswordConfirm}
                                    onChange={handleChange}
                                />
                            </div>
                            <p className="mb-3 ps-1" style={{ color: 'red' }}>{formErrors.newPasswordConfirm}</p>
                            <Row className="mt-3">
                                <Col className="text-start">
                                    <button className="btn btn-success" disabled={isLoading}>
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
                                        Confirmar alteração
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

export default ChangePasswordPage
