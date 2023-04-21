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
        return { status: ContatoStatus.OK, data: data };

    } catch (error) {
        console.warn("Unexpect error on Contato: ", error);
        return { status: ContatoStatus.ERROR, data: null };
    }
}

const registerLearning = async (body) => {
    console.log(body)
    const url = `https://portal-aulas-api.fly.dev/courses/learnings`

    const data = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Something went wrong');
        })

    return data
}

const getCourse = async (id) => {
    try {
        const url = `https://portal-aulas-api.fly.dev/courses/courses/${id}`

        const data = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Something went wrong');
            })

        return { status: ContatoStatus.OK, data: data };
    } catch (err) {
        return { status: ContatoStatus.ERROR, data: null};
    }
}

const deleteLearning = async (id) => {

    try {

        const url = `https://portal-aulas-api.fly.dev/courses/learnings/${id}`

        const data = await fetch(url, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Something went wrong');
            })

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

    const [id, setId] = useState();

    const [estado, setEstado] = useState({
        title: undefined,
        description: undefined,
        files: undefined
    })

    const [formValores, setFormValores] = useState(resetValores())
    const [postFormSuccess, setPostFormStatus] = useState(PostFormStatus.NULL)
    const [editable, setEditable] = useState(true)

    const [learnings, setLearnings] = useState([])
    const [learningInput, setLearningInput] = useState("")
    const [allowLearnings, setAllowLearnings] = useState(false)

    useEffect(
        () =>
            setEstado({
                ...estado,
                files: formValores.files.length > 0 ? true : undefined,
            }),
        [formValores.files]
    );

    useEffect(() => { refreshLearnings() }, [id]);

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
        post.append("content", "Curso de C++ para iniciantes, neste curso você vai aprenser com a professora Luana conceitos fundamentais da programação em C++, como programação Orientada a Objetos, funções de iteração em C++, biblioteca padrão e muito mais");
        post.append("professor", 2);


        registerCourse(post).then(response => {
            setEditable(false)
            if (response.status === ContatoStatus.OK && !!response.data)
                setId(response.data.id)

            setTimeout(() => {
                setPostFormStatus(response.status === ContatoStatus.OK ? PostFormStatus.ENVIADO : PostFormStatus.ERRO)
                setAllowLearnings(true)
            }, 1500)

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

    const addLearning = async (json) => {
        console.log(json)
        if (!json.name || !json.name.length) return
        try {
            const data = await registerLearning(json)
            console.log(data)
            refreshLearnings()
        } catch (error) { }
    }

    const rmLearning = async (id) => {
        try {
            const data = await deleteLearning(id)
            console.log(data)
            refreshLearnings()
        } catch (error) { }
    }

    const refreshLearnings = async () => {
        const response = await getCourse(id)
        if(response.status === ContatoStatus.OK && !!response.data){
            console.log('learnings: ', response.data)
            const courses = response.data
            setLearnings([...courses.learnings]);
        }
    }


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
                                                spellCheck={false}
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
                                                spellCheck="false"
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
            {allowLearnings &&
                <Container fluid className="container-learnings-metadados container-course">
                    <Row>
                        <Col xs={12} lg={6}>
                            <Container fluid className="pl0 pr0">
                                <Col xs={12}>
                                    <h2>Aprendizados</h2>
                                </Col>
                                <Row>
                                    {learnings?.map((learning) => (
                                        <Col xs={12} className="mt-2" style={{ display: "flex", flexDirection: "row" }} key={learning.id}>
                                            <Form.Control
                                                className="input-learning"
                                                value={learning.name}
                                                disabled={true}
                                                style={{ width: "90%" }}
                                            />
                                            <Button className="remove-learning"
                                                onClick={() => rmLearning(learning.id)}
                                            >
                                                -
                                            </Button>
                                        </Col>
                                    ))}
                                    <Col xs={12}>
                                        <Form>
                                            <Form.Label className="label-submit-learning mt-3" style={{ width: "80%" }}>
                                                <span>Adicionar novo aprendizado</span>
                                                <Form.Control
                                                    className="input-learning w-100"
                                                    spellCheck={false}
                                                    required
                                                    type="text"
                                                    placeholder=""
                                                    value={learningInput}
                                                    onChange={(e) => setLearningInput(e?.target?.value ?? learningInput)}
                                                />
                                            </Form.Label>
                                            <Button className="submit-form-learning"
                                                onClick={() => {
                                                    addLearning({ name: learningInput, course: id })
                                                    setLearningInput("")
                                                }}
                                            >
                                                +
                                            </Button>
                                        </Form>
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            }
        </section >
    );
}

export default NewCourseScreen