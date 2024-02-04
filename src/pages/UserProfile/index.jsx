import React, { useEffect, useState } from 'react'
import { Col, Container, Navbar, Row, Card, Button, Modal, Form, Dropdown, Nav } from 'react-bootstrap'
import Avatar from 'react-avatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { HttpStatus } from "../../api/default";
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import { Roles } from '../../api/default'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ProfileAPI } from '../../api/profile';
import './style.css'
import { toast } from 'react-toastify'

const UserProfileScreen = () => {
    const navigate = useNavigate()
    const { logged, user, token, setToken, refreshUserOnContext } = useAuthContext();
    const [authorizationCode, setAuthorizationCode] = useState('');

    const [editando, setEditando] = useState(false)
    const [aboutText, setAboutText] = useState();
    const [newName, setNewName] = useState();
    const [newLink, setNewLink] = useState(undefined);
    const [imagesToUpdate, setImagesToUpdate] = useState()

    const [formErrors, setFormErrors] = useState({});
    const [showModal, setShowModal] = useState(false);

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
    const notifySuccess = (texto) => toast.success(texto, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    useEffect(() => {

        // Atualiza imagem do aluno, se editada
        const fetchFunction = async () => {
            if (imagesToUpdate && imagesToUpdate.length) {
                const response = await ProfileAPI.updateUserPicture(imagesToUpdate[0], user.id);
                if (response.status !== HttpStatus.OK) {
                    notifyError("Falha na alteração da foto de perfil.")
                } else {
                    refreshUserOnContext()
                }
            }
        }
        fetchFunction()
    }, [imagesToUpdate])

    // Formata data em String para exibição no perfil
    const date = (dateString) => {
        const dateObj = new Date(dateString);
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();

        const formattedDate = `Usuário desde: ${month}/${year}`;
        return formattedDate // saída: "23/4/2023"

    }

    // Faz requisição de "Tornar-se professor" de um aluno
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await ProfileAPI.putInvite(user.id, authorizationCode, token);
        //console.log("response: ", response)

        if (response.status !== HttpStatus.OK) {
            //console.log(response)
            setAuthorizationCode('')
            notifyError("Falha ao alterar permissões.")
        } else {
            refreshUserOnContext()
            notifySuccess("Permissões atualizadas com sucesso. Agora você é um professor :)");
            handleCloseModal()
        }
    }

    const changePass = () => {
        navigate('/alterar-senha')
    }

    const editar = () => {
        setNewName(user.name)
        setAboutText(user.about)
        setNewLink(user.contactLink == "https://www.exemplo.com" ? "": user.contactLink)
        setEditando(true)
    }

    // Salva edições das informações de perfil do usuário
    const salvarAlteracoes = async () => {
        if (Object.keys(validateEditing()).length === 0 && editando) {
            var link = "";
            if(newLink){
                if(newLink.length === 0){
                    link = "https://www.exemplo.com";
                }else{
                    link = newLink;
                    if(!link.includes("https")){
                        link = "https://" + newLink;
                    }
                }
            }else{
                link = "https://www.exemplo.com";
            }
            if (user.name !== newName || aboutText !== user.about  || newLink !== user.contactLink) {
                const response = await ProfileAPI.fetchEdit(newName, aboutText, link, user.id)
                if (response.status !== HttpStatus.OK) {
                    notifyError("Falha na edição de perfil.");
                } else {
                    notifySuccess("Perfil alterado com sucesso.");
                    setEditando(false);
                    refreshUserOnContext();
                }
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

        if (aboutText.length === 0) {
            errors.about = "Digite algo sobre você!";
        } else if (aboutText.length > 150) {
            errors.about = "Texto 'sobre' é muito longo!";
        }

        if (newLink && newLink.length > 150) {
            errors.about = "O link é muito longo!";
        }

        setFormErrors(errors)
        return errors;
    }

    const FileListToFileArray = (fileList) => {
        var files = []
        for (let idx = 0; idx < fileList.length; idx++) {
            files.push(fileList[idx])
        }
        return files
    }

    const InvisibleInputFile = () => (
        <input id='input-files-user-photo-update'
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => {
            setImagesToUpdate(FileListToFileArray(e.target.files ?? new FileList()))
        }}
        accept='.png,.jpeg,.jpg,.webp'
        />
    );


    return logged && user ? (
        <>
            <Navbar style={{ marginBottom: '50px' }}>
                <Container fluid>
                    <Navbar.Toggle />
                    <Navbar.Brand href="#home" className='navbar-brand-visibility'>
                        <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
                            &#128075;&nbsp; Hey, {user.name.split(' ')[0]}!
                        </p>
                    </Navbar.Brand>
                    <Dropdown className='dropdown-position-md-lg'>
                        <Dropdown.Toggle className='gear' style={{border: 'none'}} variant="none">
                            <FontAwesomeIcon
                                icon={faPen} 
                                /> 
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item className="dropdown-item-no-highlight" onClick={() => editar()}>Editar Perfil</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item-no-highlight" onClick={() => changePass()}>Alterar Senha</Dropdown.Item>
                            </Dropdown.Menu>
                    </Dropdown> 

                    <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            <Avatar
                                name={user.name}
                                color="#0f5b7a"
                                size={34}
                                textSizeRatio={2}
                                round={true}
                            />
                      </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        <Container>
            <Row className="d-flex gap-2 justify-content-center">

                <Col className="d-flex flex-column gap-2" style={{margin: 0, padding: 0}} xs={12} md={6} lg={4}>
                    <Card style={{margin: 0, padding: 0}} >

                        {/* Foto do aluno */}
                        <Card.Header style={{padding: 0, border: 'none', backgroundColor: 'white'}}>
                            <InvisibleInputFile />
                            <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip>Mudar foto de Perfil</Tooltip>}
                            >
                                <label className='d-flex justify-content-center' htmlFor="input-files-user-photo-update" >
                                {user.photo ? <img src={user.photo} style={{ width: '70%', height: '50%', aspectRatio: 1, borderRadius: '50%', objectFit: 'fill', objectPosition: 'center', cursor: 'pointer', paddingTop: '10px' }} alt="profile"/>
                                    : <Avatar
                                    name={user.name && user.name.split(' ')[0]}
                                    color="#0f5b7a"
                                    size={150}
                                    textSizeRatio={2}
                                    round={true}
                                    style={{ cursor: 'pointer', paddingTop: '10px' }}
                                    />}
                                </label>
                            </OverlayTrigger>
                        </Card.Header>

                        {/* Nome do aluno */}
                        <Card.Body>
                            {editando ? (
                                <input
                                type="text"
                                className="form-control"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                />
                            ) : (
                                <h1
                                className="fw-bold fs-4 mt-4 mb-4 ms-1"
                                style={{ color: '#727273', textAlign: 'center' }}
                                >
                                {user.name}
                                </h1>
                            )}
                        </Card.Body>

                        {/* Data de cadastro */}
                        <Card.Footer className="d-flex justify-content-center align-items-center">
                            <p className="mt-0 mb-0 fs-6" style={{ color: '#727273' }}>
                                {date(user.created)}
                            </p>
                        </Card.Footer>
                    </Card>

            {/* Botão "Tornar-me professor" */}
            {
                user?.role?.includes(Roles.STUDENT)
                    && (!user?.role?.includes(Roles.PROFESSOR) ?? false)
                    && (!user?.role?.includes(Roles.ADMIN) ?? false) &&
                    <Button style={{ backgroundColor: "#0E6216", color: "white", border: 'none' }} onClick={handleShowModal}>Tornar-me professor!</Button>
            }

                    {/* Modal do form para colocar o código de professor */}
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
                </Col>

                <Col className='about-me-column' xs={12} md={6} lg={4}>

                    {/* Botões de Salvar e Cancelar na edição do perfil */}
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

                        {/* Erro ao editar nome e sobre mim */}
                        {
                            Object.keys(formErrors).length !== 0 && editando && 
                            <> 
                                <p className="ps-2 mb-1" style={{ color: "red" }}>
                                    {formErrors.newName}
                                </p>
                                <p className="ps-2 mb-1" style={{ color: "red" }}>
                                    {formErrors.about}
                                </p>
                            </>
                        }

                        {/* Card "Sobre mim" */}
                        <Card style={{ padding: '16px', }} >
                            <Row className="mb-3">
                                <Col className="d-flex justify-content-between align-items-center">
                                    <h1 className="fw-bold fs-5" style={{ color: '#727273' }}>
                                        Sobre mim
                                    </h1>
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

                            {/* Label Rede Social Opcional */}
                            {user.contactLink && 
                                <Row className="mb-3">
                                    <Col className="d-flex justify-content-between align-items-center">
                                        <h1 className="fw-bold fs-5" style={{ color: '#727273' }}>
                                            Rede Social
                                        </h1>
                                    </Col>
                                </Row>
                            }

                            {/* Campo Rede Social (modo Edição ou Visualização) */}
                            <Row>
                                <Col>
                                    {editando ? (
                                        <div className="mb-3">
                                            <span className="ms-1">
                                                Insira o link completo do LinkedIn ou Instagram: 
                                            </span>
                                            <textarea
                                                rows={1}
                                                className="form-control mt-1"
                                                value={newLink}
                                                onChange={(e) => setNewLink(e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="mb-3 d-flex justify-content-between align-items-center">
                                            <p className="mt-0 mb-0 fs-6" style={{ color: '#727273' }}>
                                                {user.contactLink == "https://www.exemplo.com" ? "": user.contactLink}
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
