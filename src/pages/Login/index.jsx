import React, { useState, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { Form } from 'react-bootstrap'

// Style
import './style.css'

const LoginPage = () => {
  const intialValues = { username: '', password: '' }
  const [formValues, setFormValues] = useState(intialValues)
  const [formErrors, setFormErrors] = useState({})
  const [isSubmit, setIsSubmit] = useState(false)

  const handleChange = (e) => {
    console.log(e.target)
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
    console.log(formValues)
  }

  useEffect(() => {
    console.log(formErrors)
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formErrors)
    }
  }, [formErrors, isSubmit])

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormErrors(validate(formValues))
    setIsSubmit(true)
  }
  const validate = (values) => {
    const errors = {}

    if (!values.username) {
      errors.username = 'Digita um usuário'
    }

    if (!values.password) {
      errors.password = 'Digita uma senha'
    } else if (values.password.length < 4) {
      errors.password = 'Senha inválida'
    } else if (values.password.length > 16) {
      errors.password = 'Senha inválida'
    }
    return errors
  }

  return (
    <>
      <div className="container p-5 col-7">
        <div className="row">
          <div className="col mb-5">
            <div className="row">
              <div className="col">
                <img
                  style={{ width: '35%' }}
                  src="https://i.ibb.co/DfGzNpM/logo.png"
                  alt="logo"
                  border="0"
                />
              </div>
              <div className="col d-flex justify-content-end">
                <p>Não tem uma conta?</p>&nbsp;{' '}
                <a className="link-limpo" href="https://www.google.com.br">
                  <p style={{ color: '#1dbfb0' }} className="fw-bold">
                    CADASTRE-SE AGORA!
                  </p>
                </a>
              </div>
            </div>
          </div>
          <p className="fs-6 mb-1 ms-1">
            Bem-vindo(a) a plataforma da Let Cursos.
          </p>
          <p className="fw-bold fs-4 ms-1">Entre para estudar!</p>
        </div>

        <div className="row ps-1 mt-2">
          <Form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="username"
                placeholder="Usuário"
                className="form-control"
                value={formValues.username}
                onChange={handleChange}
              />
            </div>
            <p style={{ color: 'red' }}>{formErrors.username}</p>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Senha"
                className="form-control"
                value={formValues.password}
                onChange={handleChange}
              />
            </div>
            <p style={{ color: 'red' }}>{formErrors.password}</p>
            <div className="row mt-3">
              <div className="col text-start">
                <button className="btn btn-info">
                  <FontAwesomeIcon icon={faCheck} className="me-2" />
                  Entrar
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}

export default LoginPage
