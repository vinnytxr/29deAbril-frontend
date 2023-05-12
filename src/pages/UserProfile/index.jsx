import React, { useEffect, useState } from 'react'
import { Col, Container, Navbar, Row, Card, Button, Modal, Form } from 'react-bootstrap'
import Avatar from 'react-avatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { AuthAPI } from "../../api/auth-api";
import { HttpStatus, HttpResponse, BASE_URL } from "../../api/default";
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import { Roles } from '../../api/default'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AUTH_DEBUG } from '../../api/default';

import './style.css'

const UserProfileScreen = () => {
  const navigate = useNavigate()

  const [selectedFileTmp, setSelectedFile] = useState(null);
  const [editando, setEditando] = useState(false)
  const [aboutText, setAboutText] = useState();
  const [newName, setNewName] = useState();
  const [formErrors, setFormErrors] = useState({});

  const { logged, user, token, setToken } = useAuthContext();

  const [authorizationCode, setAuthorizationCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showModalNotification, setShowModalNotification] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModalNotification = () => {
    setShowModalNotification(false);
    handleShowModal();
  }
  const handleShowModalNotification = () => setShowModalNotification(true);

  const date = (dateString) => {
    const dateObj = new Date(dateString);
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    const formattedDate = `Usuário desde: ${month}/${year}`;
    return formattedDate // saída: "23/4/2023"

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await AuthAPI.putInvite(user.id, authorizationCode, token)
    if (response.status === HttpStatus.OK) {
      setToken(token)
      handleCloseModal()
    } else {
      setAuthorizationCode('')
      handleCloseModal()
      handleShowModalNotification()
    }
  }

  const editar = () => {
    setNewName(user.name)
    setAboutText(user.about)
    setEditando(true)
  }

  const fetchPicture = async (selectedFile) => {

    var formdata = new FormData();
    formdata.append("photo", selectedFile);
    const url = `${BASE_URL}/user/${user.id}/`
    try {
        const options = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: formdata
        }

        const response = await fetch(url, options);
        console.log("Response: ", response)
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::sendPhoto(): ", data.token);
            return new HttpResponse(HttpStatus.OK, data);
        } else{
          console.log("Data: ", await response.json())
          throw new Error("Error on sendPhoto()");
        }
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}

  const fetchEdit = async () => {
    const url = `${BASE_URL}/user/${user.id}/`
    try {
        const options = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({ about: aboutText, name: newName})
        }

        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::edit(): ", data.token);
            return new HttpResponse(HttpStatus.OK, data);
        } else throw new Error("Error on edit()");
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}

  const salvarAlteracoes = async () => {

    
    if (Object.keys(validateEditing()).length == 0 && editando) {
      setEditando(false)
      if (user.name != newName || aboutText != user.about) {
        console.log("Válidado, enviar para o banco.")
        const response = await fetchEdit()
        console.log(response)
        if(response.status == HttpStatus.OK){
          console.log("RECARREGAR")
          navigate(0)
        }
        
      } else {
        console.log("Nenhuma mudança, não fazer requisição.")
      }
    }
  }

  const cancelEditing = () => {
    setFormErrors({})
    setEditando(false)
  }

  const validateEditing = () => {

    const errors = {};

    if (newName.length < 3) {
      errors.newName = "Digite um nome válido!";
    } else if (newName.length > 50) {
      errors.newName = "O nome não deve ter mais do que 50 caracteres!";
    }

    if (aboutText.length == 0) {
      errors.about = "Digite algo sobre você!";
    } else if (aboutText.length > 150) {
      errors.about = "Texto 'sobre' é muito longo!";
    }

    setFormErrors(errors)
    return errors;
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file)
    fetchPicture(file)
  };


  return logged && user ? (
    <>
      <Navbar style={{ marginBottom: '50px' }}>
        <Container fluid>
          <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
            &#128075;&nbsp; Hey, {user.name.split(' ')[0]}!
          </p>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Avatar
                class
                name={user.name}
                color="#0f5b7a"
                size={30}
                textSizeRatio={2}
                round={true}
              />
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Row className="d-flex justify-content-center gap-4">
          <Col xs={3}>
            <Card
              style={{
                paddingTop: '16px',
              }}
            >
              <Row>
                <Col className="d-flex justify-content-center align-items-center flex-column">
                  <div style={{ position: 'relative' }}>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip>Mudar foto de Perfil</Tooltip>}
                    >
                      <div
                        onClick={() => {
                          const fileInput = document.createElement('input');
                          fileInput.type = 'file';
                          fileInput.accept = 'image/*';
                          fileInput.onchange = handleFileSelect;
                          fileInput.click();
                        }}
                      >
                        <Avatar
                          name={user.name && user.name.split(' ')[0]}
                          color="#0f5b7a"
                          size={150}
                          textSizeRatio={2}
                          round={true}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                    </OverlayTrigger>
                    {selectedFileTmp && (
                      <div>
                        <p>Selected file: {selectedFileTmp.name}</p>
                      </div>
                    )}
                  </div>
                  <Col className="d-flex align-items-center gap-1">

                    {editando ? (
                      <div className="mt-4 mb-4 ms-1">
                        <input
                          type="text"
                          className="form-control"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="d-flex justify-content-between align-items-center">
                        <h1
                          className="fw-bold fs-4 mt-4 mb-4 ms-1"
                          style={{ color: '#727273' }}
                        >
                          {user.name}
                        </h1>
                      </div>
                    )}


                    <Button onClick={() => editar()} variant="outline-light">
                      <FontAwesomeIcon
                        style={{ color: '#8a9094', fontSize: '16' }}
                        icon={faPen}
                      />
                    </Button>
                  </Col>
                </Col>
              </Row>
              <Card.Footer className="d-flex justify-content-center align-items-center">
                <p className="mt-0 mb-0 fs-6" style={{ color: '#727273' }}>
                  {date(user.created)}
                </p>
              </Card.Footer>
            </Card>
            {
              user?.role?.includes(Roles.STUDENT)
              && (!user?.role?.includes(Roles.PROFESSOR) ?? false)
              && (!user?.role?.includes(Roles.ADMIN) ?? false) &&
              <Card style={{ cursor: 'pointer' }} className='mt-1' onClick={handleShowModal}>
                <Col style={{ backgroundColor: "#198754", color: "white" }} className="d-flex justify-content-center align-items-center bg-gradient">
                  <p className="m-1">Tornar-me professor!</p>
                </Col>
              </Card>
            }

            <Modal show={showModal} onHide={handleCloseModal} className="modal-invite">
              <Modal.Header closeButton>
                <Modal.Title>Tornar-se professor</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="authorizationCode">
                    <Form.Control autoComplete="off" type="text" placeholder="Cole o código aqui" value={authorizationCode} onChange={(e) => setAuthorizationCode(e.target.value)} />
                  </Form.Group>
                  <Button disabled={authorizationCode?.length < 3} className='mt-2' variant="success" type="submit">Utilizar convite</Button>
                </Form>
              </Modal.Body>
            </Modal>
            <Modal
              size="lg"
              className="modal-invite"
              show={showModalNotification}
              onHide={handleCloseModalNotification}
            >
              <Modal.Header closeButton style={{ border: 'none' }} />
              <Modal.Body>
                <h5>Convite inválido, tente novamente ou contate o administrador !</h5>
              </Modal.Body>
            </Modal>
          </Col>

          <Col>
            <Row>
              <Col className='d-flex justify-content-between pe-0 ps-0'>
                {editando && <Button onClick={() => cancelEditing()} className='btn btn-danger mb-1'>
                  Cancelar
                </Button>}
                {editando && <Button onClick={() => salvarAlteracoes()} className='btn btn-success mb-1'>
                  Salvar
                </Button>}
              </Col>
            </Row>
            <Row className="mb-4">
              {Object.keys(formErrors).length != 0 && editando && <> <p className="ps-2 mb-1" style={{ color: "red" }}>{formErrors.newName}</p><p className="ps-2 mb-1" style={{ color: "red" }}>{formErrors.about}</p></>}
              <Card
                style={{
                  padding: '16px',
                }}
              >
                <Row className="mb-4">
                  <Col className="d-flex justify-content-between align-items-center">
                    <h1 className="fw-bold fs-5" style={{ color: '#727273' }}>
                      Sobre mim
                    </h1>
                    <Button onClick={() => editar()} variant="outline-light">
                      <FontAwesomeIcon
                        style={{ color: '#8a9094', fontSize: '16' }}
                        icon={faPen}
                      />
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {editando ? (
                      <div className="mb-3">
                        <textarea
                          rows={4}
                          className="form-control"
                          value={aboutText}
                          onChange={(e) => setAboutText(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="mb-3 d-flex justify-content-between align-items-center">
                        <p className="mt-0 mb-0 fs-6" style={{ color: '#727273' }}>
                          {user.about}
                        </p>
                      </div>
                    )}
                  </Col>
                </Row>
              </Card>
            </Row>


          </Col>
        </Row>
      </Container>
    </>
  ) : <></>
}

export default UserProfileScreen
