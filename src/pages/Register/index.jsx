import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCirclePlus, faCheck } from '@fortawesome/free-solid-svg-icons'

import './style.css'
import { Form, Row, Toast, ToastHeader, ToastBody } from "react-bootstrap";
import { BASE_URL } from "../../api/default";

export default function RegisterScreen() {
    const intialValues = { name: "", email: "", password: "", cpf: "", about: "Conte algo sobre você!", role: [1], birth: ""};
    const [formValues, setFormValues] = useState(intialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false)

    const navigate = useNavigate();

    function formatCPF(cpf) {
        const formattedValue = cpf.replace(/\D/g, '');
        return formattedValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    const handleChange = (e) => {
        // console.log(e.target);
        const { name, value } = e.target;

        if (name === "cpf") {
            // Remove tudo que não é número
            if (value.length > 14) {
                return;
            }
            const formattedValue = value.replace(/\D/g, '');

        
            setFormValues({ ...formValues, [name]: formattedValue });
        } else {
            setFormValues({ ...formValues, [name]: value });
        }

    }

    useEffect(() => {
        //console.log(formValues);
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            const url = `${BASE_URL}/user/`
            //console.log(JSON.stringify(formValues))// CAHAMAR A FUNÇÃO DE CADASTRO AQUI ======================================================================================
                fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(
                        formValues
                    ),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                })
                    .then((response) => {
                        console.log(response)
                        if (!response.ok) {
                         //console.log("OLHA O ERRO")
                         alert("Falha ao se comunicar com o servidor.");
                        }else{
                            navigate('/login')
                            alert("Registrado com sucesso!")
                        }
                        return response.json();
                      })
                    .then((data) => {
                        console.log("data:", data)
                        //console.log("erro 400", data);
                        //setToast(true)
                    })
                    .catch((err) => {
                        //console.log("catch", err.message);
                        //setToast(true)
                    });
            
           
        }
    }, [isSubmit]);

    useEffect(() => {
        //console.log(formValues);
        if (isSubmit)
            setFormErrors(validate(formValues));
    }, [formValues]);

    useEffect(() => {
        // console.log(formErrors);
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            // console.log(formErrors);
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);
      
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            const url = `${BASE_URL}/user/`
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(
                    formValues
                ),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
                .then((response) => {
                    if (!response.ok) {
                     //console.log("OLHA O ERRO")
                     console.log(response)
                     alert("Falha ao se comunicar com o servidor.");
                    }
                    return response.json();
                  })
                .then((data) => {
                    console.log("data:", data)
                   // console.log("erro 400", data);
                    //setToast(true)
                })
                .catch((err) => {
                    //console.log("catch", err.message);
                    //setToast(true)
                });
            
        }
    }

    const validarCPF = (cpf) => {
        console.log(cpf)
        // Elimina CPFs inválidos conhecidos
        if (
          cpf.length !== 11 ||
          cpf === "00000000000" ||
          cpf === "11111111111" ||
          cpf === "22222222222" ||
          cpf === "33333333333" ||
          cpf === "44444444444" ||
          cpf === "55555555555" ||
          cpf === "66666666666" ||
          cpf === "77777777777" ||
          cpf === "88888888888" ||
          cpf === "99999999999"
        ) {
          return false;
        }
      
        // Valida o primeiro dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
          soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;
        if (digitoVerificador1 !== parseInt(cpf.charAt(9))) {
          return false;
        }
      
        // Valida o segundo dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
          soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;
        if (digitoVerificador2 !== parseInt(cpf.charAt(10))) {
          return false;
        }
      
        // CPF é válido
        return true;
      }
      

    const validate = (values) => {
        console.log("Validade date:", values.birth)
        const errors = {};
        const regexemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const regexcpf = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;

        if (!values.name) {
            errors.name = "Digite um nome!";
        }

        if (!values.email && isSubmit) {
            errors.email = "Digita um email!";
        } else if (!regexemail.test(values.email)) {
            errors.email = "Digite um email com formato válido!";
        }

        if (!values.password) {
            errors.password = "Digite uma senha!";
        } else if (values.password.length < 4) {
            errors.password = "Senha precisa ter mais de 4 caracteres!";
        } else if (values.password.length > 16) {
            errors.password = "Senha não pode ter mais que 16 caracteres!";
        }

        if(!values.birth){
            errors.birth = "Selecione uma data!";
        }else {
            let date1 = new Date(values.birth)
            const yearsAgo = new Date();
            yearsAgo.setFullYear(yearsAgo.getFullYear() - 13);
            if(date1>yearsAgo){
                errors.birth = "O usuário precisa ter mais de 13 anos para realizar o cadastro."
            }
        }

        if (!values.cpf) {
            errors.cpf = "Digite um cpf!";
        } else if (!regexcpf.test(formatCPF(values.cpf))) {
            errors.cpf = "Digite um cpf com formato válido!";
        } else if (!validarCPF(formValues.cpf.replace(/\D/g, ''))){
            errors.cpf = "Número do cpf é inválido!";
        }
        console.log("CPF:", validarCPF(formValues.cpf.replace(/\D/g, '')))

        return errors;
    }







    return (
        <>



            <div className="container-fluid p-5 col-sm-7 col-md-8 col-lg-10">
                <div className="row">
                    <div className="col">
                        <img style={{ width: "11em" }} src="https://i.ibb.co/r3QPmSt/logo.png" alt="logo" border="0" />
                    </div>
                    <div className="col d-flex justify-content-end">
                    <p className="mt-3">Já tem conta? <Link className="fw-bold link-termos" to="/login">ENTRE AGORA!</Link></p>
                        
                    </div>
                    <p className="fw-bold fs-4 ms-1 mt-5">Estude Gratuitamente!</p>
                </div>

                <div className="row ps-1 mt-2">
                    <Form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nome e Sobrenome"
                            className="form-control"
                            value={formValues.name}
                            onChange={handleChange} />
                        <p className="ps-2" style={{ color: "red" }}>{formErrors.name}</p>

                        <div className="mt-3">
                            <input
                                name="email"
                                placeholder="Email *"
                                className="form-control"
                                value={formValues.email}
                                onChange={handleChange} />
                        </div>
                        <p className="ps-2" style={{ color: "red" }}>{formErrors.email}</p>
                        <div className="mt-3">
                            <input
                                type="password"
                                name="password"
                                placeholder="Senha *"
                                className="form-control"
                                value={formValues.password}
                                onChange={handleChange}
                            />
                        </div>
                        <p className="ps-2" style={{ color: "red" }}>{formErrors.password}</p>
                        <div className="mt-3">
                            <input
                                type="text"
                                name="cpf"
                                placeholder="CPF *"
                                className="form-control"
                                value={formatCPF(formValues.cpf)}
                                onChange={handleChange}
                            />
                        </div>
                        <p className="ps-2" style={{ color: "red" }}>{formErrors.cpf}</p>
                        <div className="mt-3">
                            <input
                            type="date"
                                name="birth"
                                className="form-control"
                                value={formValues.birth}
                                onChange={handleChange} />
                        </div>
                        <p className="ps-2" style={{ color: "red" }}>{formErrors.birth}</p>
                        <p className="ps-1" style={{ fontSize: "13px" }}>Ao me cadastrar, concordo com os <a href="http://www.google.com.br" className="link-termos">Termos de uso e Política de privacidade</a></p>


                        <div className="row mt-3">
                            <div className="col text-start">
                                <button className="fbtn btn btn-success"><FontAwesomeIcon icon={faCheck} className="me-2" />CRIAR CONTA</button>
                            </div>
                            {/* <div className="col text-end">
                                    <button className="btn btn-outline-info"><FontAwesomeIcon icon={faCheck} className="me-2" />Entrar</button>
                                </div> */}
                        </div>
                    </Form>
                </div>
            </div >


        </>
    )
}