import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowLeftLong, faArrowRotateBack, faCheck } from '@fortawesome/free-solid-svg-icons'
import { Form } from 'react-bootstrap';
import { AuthAPI } from "../../api/auth-api";
import { AUTH_DEBUG, BASE_URL, HttpStatus } from "../../api/default";

// Style
import './style.css'
import { useAuthContext } from "../../contexts/AuthContext";
import { HttpResponse } from "../CreateCourse/api";

const ChangePasswordPage = () => {
    const navigate = useNavigate();

    const { token } = useAuthContext();
    const intialValues = { oldPassword: "", newPassword: "", newPasswordConfirm: "" };
    const [formValues, setFormValues] = useState(intialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false)
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
        if (errorsC == 0) {
           // console.log("Requisição realizada.")
            //console.log(formValues)
            const response = await fetchChange()
           // console.log(response)
            if (response.status == HttpStatus.OK) {
              alert("Senha alterada com sucesso!")
            }else{
                alert("Falha em alterar senha.")
            }

        }
    }

    const fetchChange = async () => {
        const url = `${BASE_URL}/change-password`
        try {
            const options = {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json', 
                    'jwt': token
                },
                body: JSON.stringify({ old_password: formValues.oldPassword, new_password: formValues.newPassword })
            }

            const response = await fetch(url, options);
            if (response.ok) {
                const data = await response.json();
                AUTH_DEBUG && console.log("AuthAPI::ChangePassword(): ", data.token);
                return new HttpResponse(HttpStatus.OK, data);
            } else throw new Error("Error on ChangePassword()");
        } catch (error) {
            console.warn(error)
            return new HttpResponse(HttpStatus.ERROR, null);
        }
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
        } else if (values.newPassword != values.newPasswordConfirm) {
            errors.newPasswordConfirm = "A senha digitada na confirmação deve ser idêntica a nova senha!";
        }

        errorsC = Object.keys(errors).length;
        return errors;
    }

    return (
        <>
            <div className="container p-5 col-7">
                <div className="row">
                    <div className="col mb-5">
                        <div className="row">
                            <div className="col">
                                <img style={{ width: "11em" }} onClick={() => { navigate("/") }} src="https://i.ibb.co/r3QPmSt/logo.png" alt="logo" border="0" />
                            </div>
                            <div className="col d-flex justify-content-end">
                                <p className="mt-3"><Link className="fw-bold link-limpo" style={{ color: "#1dbfb0" }} to="/perfil"><FontAwesomeIcon icon={faArrowLeftLong} className="me-1"/> Voltar!</Link></p>
                            </div>
                        </div>
                    </div>
                    <p className="fw-bold fs-4 ms-1">Mudança de senha!</p>
                    <p className="ms-2">Preencha os campos para realizar a mudança da sua senha.</p>
                </div>
                <div className="row ps-1 mt-2">
                    <Form onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="password"
                                name="oldPassword"
                                placeholder="Senha atual"
                                className="form-control"
                                value={formValues.oldPassword}
                                onChange={handleChange} />
                        </div>
                        <p className="mb-3 ps-1" style={{ color: "red" }}>{formErrors.oldPassword}</p>
                        <div>
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="Sua nova senha"
                                className="form-control"
                                value={formValues.newPassword}
                                onChange={handleChange} />
                        </div>
                        <p className="mb-3 ps-1" style={{ color: "red" }}>{formErrors.newPassword}</p>
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
                        <p className="mb-3 ps-1" style={{ color: "red" }}>{formErrors.newPasswordConfirm}</p>
                        <div className="row mt-3">
                            <div className="col text-start">
                                <button className="btn btn-success"><FontAwesomeIcon icon={faCheck} className="me-2" />Confirmar alteração</button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div >
        </>
    )
}

export default ChangePasswordPage
