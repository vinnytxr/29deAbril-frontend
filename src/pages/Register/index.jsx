import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './style.css'
import { Form, Spinner } from "react-bootstrap";
import { HttpStatus } from "../../api/default";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthAPI } from "../../api/auth-api";
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/images/logo.png';


export default function RegisterScreen() {
  const intialValues = {
    name: '',
    email: '',
    password: '',
    ra: '',
    about: 'Conte algo sobre você!',
    role: [1],
    birth: '',
  }

  const initialConfirmPassword = '';
  const [formValues, setFormValues] = useState({ ...intialValues, confirmPassword: initialConfirmPassword })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmit, setIsSubmit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const notifySuccess = (texto) =>
    toast.success(texto, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })

  const notifyError = (texto) =>
    toast.error(texto, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })

  function formatRA(ra) {
    const formattedValue = ra.replace(/\D/g, '')
    return formattedValue.slice(0, 8)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "ra") {
        if (value.length > 8) {
            return;
        }
        const formattedValue = value.replace(/\D/g, '');

        setFormValues({ ...formValues, [name]: formattedValue });
    } else if (name === 'confirmPassword') {
      setFormValues({ ...formValues, confirmPassword: value });
    } else {
        setFormValues({ ...formValues, [name]: value });
    }
  }

  useEffect(() => {
    const fetchFunction = async () => {
      if (Object.keys(formErrors).length === 0 && isSubmit) {
        //setIsLoading(true)
        const response = await AuthAPI.fetchRegister(formValues);
        if (response.status === HttpStatus.OK) {
            notifySuccess("Registrado com sucesso!");
            //setIsLoading(false)
            navigate('/login')
        } else {
          //setIsLoading(false)
          notifyError("Falha ao cadastrar novo usuário. " + response.data.error + ".");
        }
    }
  }
  fetchFunction();
  }, [isSubmit]);

  useEffect(() => {
    if (isSubmit) setFormErrors(validate(formValues))
  }, [formValues])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
    setIsLoading(true);

    if (Object.keys(formErrors).length === 0 && isSubmit) {
        const response = await AuthAPI.fetchRegister(formValues);
        if (response.status === HttpStatus.OK) {
            notifySuccess("Registrado com sucesso!");
            //setIsLoading(false)
            navigate('/login')
        } else {
            setIsLoading(false)
            notifyError("Falha ao cadastrar novo usuário. " + response.data.error + ".");
        }

      }else{
        setIsLoading(false)
      }
  }



  const validarRA = (ra) => {
    // Elimina RAs inválidos conhecidos
    if (
      ra.length !== 8 ||
      ra === '00000000' ||
      ra === '11111111' ||
      ra === '22222222' ||
      ra === '33333333' ||
      ra === '44444444' ||
      ra === '55555555' ||
      ra === '66666666' ||
      ra === '77777777' ||
      ra === '88888888' ||
      ra === '99999999'
    ) {
      //setIsLoading(false)
      return false
    }

    return true
  }


  const validate = (values) => {
        //console.log("Validade date:", values.birth)
        const errors = {};
        const regexemail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

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

        if (!values.confirmPassword) {
          errors.confirmPassword = 'Digite a senha novamente!';
        } else if (values.confirmPassword !== values.password) {
          errors.confirmPassword = 'As senhas não coincidem!';
        }

        if (!values.birth) {
            errors.birth = "Selecione uma data!";
        } else {
            let date1 = new Date(values.birth)
            const yearsAgo = new Date();
            yearsAgo.setFullYear(yearsAgo.getFullYear() - 13);
            if (date1 > yearsAgo) {
                errors.birth = "O usuário precisa ter mais de 13 anos para realizar o cadastro."
            }
        }

        if (!values.ra) {
            errors.ra = "Digite um RA!";
        } else if (!validarRA(formValues.ra.replace(/\D/g, ''))) {
            errors.ra = "Número do RA é inválido!";
        }

        setIsLoading(false)
        return errors;
    }

  return (
    <>
      <div className="container-fluid p-5 col-sm-7 col-md-8 col-lg-10">
        <div className="row">
          <div className="col">
            <img
              style={{ width: '11em' }}
              onClick={() => {
                window.location.href = '/'
              }}
              src={logo}
              alt="logo"
              border="0"
            />
          </div>
          <div className="col d-flex justify-content-md-end justify-content-start">
            <p className="mt-3">
              Já tem conta? 
              <Link className="fw-bold link-termos" to="/login">
                ENTRE AGORA!
              </Link>
            </p>
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
              onChange={handleChange}
            />
            <p className="ps-2" style={{ color: 'red' }}>
              {formErrors.name}
            </p>

            <div className="mt-3">
              <input
                name="email"
                placeholder="Email *"
                className="form-control"
                value={formValues.email}
                onChange={handleChange}
              />
            </div>
            <p className="ps-2" style={{ color: 'red' }}>
              {formErrors.email}
            </p>
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
            <p className="ps-2" style={{ color: 'red' }}>
              {formErrors.password}
            </p>
            <div className="mt-3">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar Senha *"
                className="form-control"
                value={formValues.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <p className="ps-2" style={{ color: 'red' }}>
              {formErrors.confirmPassword}
            </p>
            <div className="mt-3">
              <input
                type="text"
                name="ra"
                placeholder="RA *"
                className="form-control"
                value={formatRA(formValues.ra)}
                onChange={handleChange}
              />
            </div>
            <p className="ps-2" style={{ color: 'red' }}>
              {formErrors.ra}
            </p>
            <div className="mt-3">
              <input
                type="date"
                name="birth"
                className="form-control"
                value={formValues.birth}
                onChange={handleChange}
              />
            </div>
            <p className="ps-2" style={{ color: 'red' }}>
              {formErrors.birth}
            </p>

            <div className="row mt-3">
              <div className="col text-start">
              <button className="fbtn btn btn-success" disabled={isLoading}>
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
                  CRIAR CONTA
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}
