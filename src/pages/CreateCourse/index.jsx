import React, { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import noImage from './no-image.png'

import './style.css'

//Bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Alert, FormLabel, ListGroup } from "react-bootstrap"

import {
    Card,
    Input,
}
    from 'react-bootstrap';

const registerCourse = async (body) => {

    try {

        const url = `https://portal-aulas-api.fly.dev/courses/courses`

        const data = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: body
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Something went wrong');
            })

        console.log(data)
        return ContatoStatus.OK

    } catch (error) {
        console.warn("Unexpect error on Contato: ", error);
        return ContatoStatus.ERROR;
    }
}

const ContatoStatus = {
    OK: 200,
    ERROR: 400
}

const PostFormStatus = {
    ENVIADO: 'ENVIADO',
    ENVIANDO: 'ENVIANDO',
    ERRO: 'ERRO',
    NULL: 'NULL'
}

export const NewCourseScreen = () => {
    const resetValores = () => {
        return {
            title: "",
            description: "",
            files: [],
        };
    };

    const [estado, setEstado] = useState({
        title: undefined,
        description: undefined,
        files: undefined
    })

    const [formValores, setFormValores] = useState(resetValores())
    const [postFormSuccess, setPostFormStatus] = useState(PostFormStatus.NULL)
    const [editable, setEditable] = useState(true)

    useEffect(
        () =>
            setEstado({
                ...estado,
                files: formValores.files.length > 0 ? true : undefined,
            }),
        [formValores.files]
    );

    const setDescription = (e) => {
        setEstado({ ...estado, description: undefined })
        setFormValores({ ...formValores, description: e?.target?.value })
    }

    const setTitle = (e) => {
        setEstado({ ...estado, title: undefined })
        setFormValores({ ...formValores, title: e?.target?.value })
    }

    const enviarForm = () => {
        var estadoAux = {
            title: formValores.title.length >= 3,
            description: formValores.description.length >= 2,
            files: formValores.files.length > 0,
        };

        setEstado({ ...estadoAux });

        for (let [, value] of Object.entries(estadoAux)) if (!value) return;

        setPostFormStatus(PostFormStatus.ENVIANDO);

        var post = new FormData();

        post.append("title", formValores.title);
        post.append("description", formValores.description);
        post.append("banner", formValores.files[0]);
        post.append("professor", 1);


        registerCourse(post).then(response => {
            setEditable(false)
            setTimeout(() => {
                setPostFormStatus(response === ContatoStatus.OK ? PostFormStatus.ENVIADO : PostFormStatus.ERRO)
                if (response === ContatoStatus.ERROR) setEditable(false)
            }, 1000)

            // setFormValores(resetValores())
            setEstado({})

            setTimeout(() => setPostFormStatus(PostFormStatus.NULL), 5000)
        })
    }

    const FileListToFileArray = (fileList) => {
        var files = []

        for (let idx = 0; idx < fileList.length; idx++) {
            files.push(fileList[idx])
        }

        return files
    }

    const InvisibleInputFile = () => (
        <input id='input-files-ftc'
            type="file"
            style={{ visibility: "hidden" }}
            onChange={(e) => {
                setFormValores({
                    ...formValores,
                    files: FileListToFileArray(e.target.files ?? new FileList())
                })
                setEstado({ ...estado, files: true })
            }}
            accept='.png,.jpeg,.jpg,.webp'
            disabled={!editable}
        />
    );

    return (
        <section style={{ marginLeft: "15%" }} className="box-course">
            <Container fluid className="container-new-course container-course mb-5">
                <Form>
                    <Row>
                        <Col lg={12} className="mt-2">
                            <h2>Criar novo curso</h2>
                        </Col>
                        <Col xs={12} lg={7}>
                            <Container fluid>
                                <Row>
                                    <Col xs={12} className="pl0">
                                        <Form.Label className="w-100 mt-3">
                                            Titulo da aula
                                            <Form.Control
                                                className="input-title"
                                                spellcheck={false}
                                                required
                                                type="text"
                                                placeholder=""
                                                value={formValores.title}
                                                onChange={setTitle}
                                                isValid={estado.title}
                                                disabled={!editable}
                                                isInvalid={estado.title != undefined ? !estado.title : undefined}
                                                onBlur={() => setEstado({ ...estado, title: formValores.title.length >= 3 })}
                                            />
                                        </Form.Label>
                                    </Col>
                                    <Col xs={12} className="pl0">
                                        <Form.Label className="w-100 mt-3">
                                            Descrição do curso
                                            <Form.Control
                                                className="input-description"
                                                spellcheck="false"
                                                required
                                                as="textarea"
                                                value={formValores.description}
                                                onChange={setDescription}
                                                isValid={estado.description}
                                                disabled={!editable}
                                                isInvalid={estado.description != undefined ? !estado.description : undefined}
                                                onBlur={() => setEstado({ ...estado, description: formValores.description.length >= 3 })}
                                            />
                                        </Form.Label>
                                    </Col>

                                </Row>
                            </Container>
                        </Col>
                        <Col xs={12} lg={5}>
                            <Container fluid>
                                <Row>
                                    <Col xs={12} className='mt-3 pr0'>
                                        <span >Imagem do curso</span>
                                        <label htmlFor="input-files-ftc" style={{ width: "100%" }}>
                                            <img
                                                className={`image-for-input-file ${estado.files === false ? "error" : ""}`}
                                                src={formValores.files.length ? URL.createObjectURL(formValores.files[0]) : noImage}
                                                style={{ width: "100%", objectFit: "fill", objectPosition: "center", cursor: "pointer" }}
                                            />
                                        </label>
                                    </Col>
                                    <Col xs={12} className='file-input-span mb-3'>
                                        <span className={`${!!estado.files ? 'ok' : estado.files === false ? 'error' : ''}`}>
                                            {formValores.files.length > 0 ? `${formValores.files.length} ${formValores.files.length > 1 ? 'imagens selecionadas' : 'imagem selecionada'}` : 'Nenhuma imagem selecionada'}
                                        </span>
                                    </Col>
                                    <InvisibleInputFile />
                                </Row>
                                <Row>
                                    <Col lg={12} className="mt-3 itemBotao pr0" style={{ display: postFormSuccess !== PostFormStatus.NULL ? "none" : "block" }}>
                                        <Button className="submit-form w-100"
                                            onClick={() => enviarForm()}
                                            style={{ height: "60px" }}
                                            disabled={!editable}
                                        >
                                            Salvar
                                        </Button>
                                    </Col>
                                    <Col lg={12} className="col-form-status pr0" style={{ display: postFormSuccess === PostFormStatus.NULL ? "none" : "block" }}>
                                        <Alert className="alert mt-3 form-status"
                                            variant={
                                                postFormSuccess === PostFormStatus.ENVIADO ? 'success' : postFormSuccess === PostFormStatus.ENVIANDO ? 'primary' : 'danger'}>
                                            {postFormSuccess === PostFormStatus.ENVIADO ? 'Formulário enviado com sucesso !' :
                                                postFormSuccess === PostFormStatus.ENVIANDO ? 'Enviando ...' : 'Houve um erro ao enviar o formulário, por favor, tente novamente mais tarde!'}
                                        </Alert>
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Form>
            </Container>
            
        </section >
    );
}

export default NewCourseScreen