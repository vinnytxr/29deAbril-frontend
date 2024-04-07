import React, { useEffect, useState } from 'react'

import './style.css'

import { Col, Container, Navbar, Row, Card, Button, Form, ListGroup, ListGroupItem, Spinner } from 'react-bootstrap'
import Avatar from 'react-avatar'
import { useAuthContext } from '../../contexts/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown} from '@fortawesome/free-solid-svg-icons'
import { HttpStatus } from '../../api/default'
import { AdminAPI } from '../../api/admin'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'


const AdministrateUsers = () => {
    const { user, token } = useAuthContext();
    const [users, setUsers] = useState([]);
    const [orderBy, setOrderBy] = useState("ra");

    const notifySuccess = () => toast.success("E-mail enviado com sucesso.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
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
        requestUsers()
    }, [orderBy]);

    const requestUsers = async () => {
        const listUsers = await AdminAPI.fetchUsers(token, orderBy);

        if (listUsers.status !== HttpStatus.OK) {
            notifyError("Falha ao requisitar lista de usuários.");
        } else {
            setUsers(listUsers.data);
        }
    }

    const toggleOrderBy = () => {
        setOrderBy(prevOrder => (prevOrder === 'ra' ? 'role' : 'ra'));
    }

    return (
        <>
            <Navbar style={{ marginBottom: '50px' }}>
                <Container fluid>
                    <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
                        &#128075;&nbsp; Hey, Administrador!
                    </p>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            <Avatar
                                class
                                name={user?.name}
                                color="#0f5b7a"
                                size={30}
                                textSizeRatio={2}
                                round={true}
                            />
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container fluid className='mb-3'>
                <Row className="d-flex justify-content-center gap-4">
                    <Col>
                        {users.length ?
                            <Card
                                style={{
                                    padding: '16px',
                                }}
                            >
                                <Row className="mb-4">
                                    <Col className="d-flex justify-content-between align-items-center">
                                        <h1 className="fw-bold fs-5" style={{ color: '#727273' }}>
                                            Usuários Cadastrados:
                                        </h1>
                                        <div className='button-div'>
                                            <Button className="button-order" onClick={toggleOrderBy}>
                                                {orderBy === 'ra' ? (
                                                    <>
                                                        Ordenar <FontAwesomeIcon style={{ color: 'white', fontSize: '16' }} icon={faArrowDown} />
                                                    </>
                                                ) : (
                                                    <>
                                                        Ordenar <FontAwesomeIcon style={{ color: 'white', fontSize: '16' }} icon={faArrowUp} />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <ListGroup>
                                            {users.map(users =>
                                                <ListGroupItem key={users.id}>
                                                    <Col>
                                                        <Row className="d-sm-flex justify-content-between">
                                                            <Col className="col-lg-2 col-12">
                                                                <span className="code-ra">{users.ra}</span>
                                                            </Col>
                                                            <Col className="col-lg-4 col-12">
                                                                <span className="code-span">{users.name}</span>
                                                            </Col>
                                                            <Col className="col-lg-4 col-12">
                                                                <span className="d-sm-inline-block break-word">{users.email}</span>
                                                            </Col>
                                                            <Col className="col-lg-2 col-12">
                                                                <span className="d-sm-inline-block break-word tag-role">
                                                                    {users.role.includes(3) ? 'Admin' : users.role.includes(2) ? 'Professor' : 'Estudante'}
                                                                </span>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </ListGroupItem>
                                            )}
                                        </ListGroup>
                                    </Col>
                                </Row>
                            </Card> : <></>}
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default AdministrateUsers
