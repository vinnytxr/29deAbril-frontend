import React, { useEffect, useState } from 'react'
import { Col, Container, Navbar, Row, Card, Button, Modal, Form, Dropdown } from 'react-bootstrap'
import Avatar from 'react-avatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { HttpStatus } from "../../api/default";
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import { Roles } from '../../api/default'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ProfileAPI } from '../../api/profile';
import './style.css'
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu'
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle'
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
                    <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
                        &#128075;&nbsp; Hey, {user.name.split(' ')[0]}!
                    </p>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Row className='align-items-center'>
                            <Col>
                                <Navbar.Text>
                                    <Dropdown>
                                        <DropdownToggle className='gear'>
                                            <FontAwesomeIcon icon={faBars} />
                                        </DropdownToggle>

                                        {/* TODO: Exibição dos itens tá passando da tela*/}
                                        <DropdownMenu>
                                            <Dropdown.Item className="dropdown-item-no-highlight" onClick={() => editar()}>Editar Perfil</Dropdown.Item>
                                            <Dropdown.Item className="dropdown-item-no-highlight" onClick={() => changePass()}>Alterar Senha</Dropdown.Item>
                                        </DropdownMenu>
                                    </Dropdown>
                                </Navbar.Text>
                            </Col>
                            <Col>
                                <Navbar.Text className='pb-1'>
                                    <Avatar
                                        name={user.name}
                                        color="#0f5b7a"
                                        size={34}
                                        textSizeRatio={2}
                                        round={true}
                                    />
                                </Navbar.Text>
                            </Col>
                        </Row>
                    </Navbar.Collapse>
            </Container>
        </Navbar>

        <Container>
            <Row className="d-flex justify-content-center gap-4">
                <Col className='pe-0' xs={3}>
                    <Card style={{ paddingTop: '16px', width: '90%' }} >
                        <Row>
                            <Col className="d-flex justify-content-center align-items-center flex-column">
                                <div style={{ position: 'relative' }}>
                                    <InvisibleInputFile />
                                    <OverlayTrigger
                                    placement="bottom"
                                    overlay={<Tooltip>Mudar foto de Perfil</Tooltip>}
                                    >
                                        <label className='d-flex justify-content-center' htmlFor="input-files-user-photo-update" >
                                        {user.photo ? <img src={user.photo} style={{ width: '70%', aspectRatio: 1, borderRadius: '50%', objectFit: 'fill', objectPosition: 'center', cursor: 'pointer' }} alt="profile"/>
                                            : <Avatar
                                            name={user.name && user.name.split(' ')[0]}
                                            color="#0f5b7a"
                                            size={150}
                                            textSizeRatio={2}
                                            round={true}
                                            style={{ cursor: 'pointer' }}
                                            />}
                                        </label>
                                    </OverlayTrigger>
                                </div>
                                <Col className="d-flex align-items-center gap-1">

        {/* Parei aqui */}
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
            <Card style={{ cursor: 'pointer', width: '90%' }} className='mt-1' onClick={handleShowModal}>
            <Col style={{ backgroundColor: "#0E6216", color: "white" }} className="d-flex justify-content-center align-items-center bg-gradient">
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
        {Object.keys(formErrors).length !== 0 && editando && <> <p className="ps-2 mb-1" style={{ color: "red" }}>{formErrors.newName}</p><p className="ps-2 mb-1" style={{ color: "red" }}>{formErrors.about}</p></>}
        <Card
        style={{
            padding: '16px',
        }}
        >
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
        {user.contactLink && 
            <Row className="mb-3">
            <Col className="d-flex justify-content-between align-items-center">
            <h1 className="fw-bold fs-5" style={{ color: '#727273' }}>
            Rede Social
            </h1>
            </Col>
            </Row>
        }
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
