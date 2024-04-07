/* eslint-disable no-mixed-operators */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */

import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Container, Col, Row, Form, Button, Alert } from 'react-bootstrap'
import { HttpStatus, LessonAPI } from './api'
import { cut } from '../../tools/string'
import noImage from './no-image.png'
import { CategoryAPI } from '../../api/category'
import './style.css'
import Navbar from 'react-bootstrap/Navbar'
import Avatar from 'react-avatar'
import { useAuthContext } from '../../contexts/AuthContext'

const PostFormStatus = {
  ENVIADO: 'ENVIADO',
  ENVIANDO: 'ENVIANDO',
  ERRO: 'ERRO',
  NULL: 'NULL',
}

function compareObjects(a, b, idFirst) {
  if (a.id === idFirst) {
    return -1;
  } else if (b.id === idFirst) {
    return 1;
  } else {
    return 0;
  }
}

export const NewLessonScreen = () => {
  const resetValores = () => {
    return {
      title: '',
      files: [],
      content: '',
      videos: [],
      useBannerFromVideo: false,
      categoryId: null,
      apendices: [],
      externAppendixLink: '',
      externVideoLink: ""
    }
  }

  const { courseId } = useParams()

  const [estado, setEstado] = useState({
    title: undefined,
    files: undefined,
    content: undefined,
    videos: undefined,
    externAppendixLink: undefined,
    externVideoLink: undefined
  })

  const [formValores, setFormValores] = useState(resetValores())
  const [postFormSuccess, setPostFormStatus] = useState(PostFormStatus.NULL)
  const [editable, setEditable] = useState(true)
  const [categories, setCategories] = useState([])
  const { logged, user } = useAuthContext()

  const navigate = useNavigate()

  useEffect(
    () =>
      setEstado({
        ...estado,
        files: formValores.files.length > 0 ? true : undefined,
      }),
    [formValores.files]
  )

  useEffect(() => {
    getCategories()
  }, [])

  const validateExternLink = (value) => {
    const tags = ['http', 'https', 'localhost']

    for (const tag of tags)
      if (value.includes(tag)) return true

    return value.length == 0
  }

  const setTitle = (e) => {
    setEstado({ ...estado, title: undefined })
    setFormValores({ ...formValores, title: cut(e?.target?.value ?? '', 64) })
  }

  const setExternAppendixLink = (e) => {
    setEstado({ ...estado, externAppendixLink: undefined })
    setFormValores({ ...formValores, externAppendixLink: cut(e?.target?.value?.trim() ?? '', 256) })
  }

  const setExternVideoLink = (e) => {
    setEstado({ ...estado, externVideoLink: undefined })
    setFormValores({ ...formValores, externVideoLink: cut(e?.target?.value?.trim() ?? "", 256) })
  }

  const setCategoryId = (e) => {
    setFormValores({ ...formValores, categoryId: e?.target?.value })
  }

  const setContent = (e) => {
    setEstado({ ...estado, content: undefined })
    setFormValores({ ...formValores, content: cut(e?.target?.value, 1024) })
  }

  const sendForm = async () => {
    var estadoAux = {
      title: formValores.title.trim().length >= 3,
      files: formValores.files.length > 0 || formValores.useBannerFromVideo,
      content: formValores.content.trim().length >= 3,
      videos:
        formValores.videos.length > 0 ||
        (formValores.files.length > 0 && !formValores.useBannerFromVideo),
      externAppendixLink: validateExternLink(formValores.externAppendixLink),
      externVideoLink: validateExternLink(formValores.externVideoLink)
    }

    setEstado({ ...estadoAux })

    for (let [, value] of Object.entries(estadoAux)) if (!value) return

    setPostFormStatus(PostFormStatus.ENVIANDO)

    var post = new FormData()

    post.append('title', formValores.title)
    post.append('content', formValores.content)
    post.append('course', courseId)
    post.append('extern_appendix_link', formValores.externAppendixLink)
    post.append("extern_video_link", formValores.externVideoLink)

    if (!formValores.useBannerFromVideo)
      post.append('banner', formValores.files[0])

    if (formValores.videos.length) post.append('video', formValores.videos[0])

    if (formValores.categoryId) post.append("category", formValores.categoryId)

    console.log('form', formValores.apendices)

    if (formValores.apendices.length > 0 && !!formValores.apendices[0]) post.append("appendix", formValores.apendices[0])

    LessonAPI.registerLesson(post).then((response) => {
      setEditable(false)
      setTimeout(() => {
        setPostFormStatus(
          response.status === HttpStatus.OK
            ? PostFormStatus.ENVIADO
            : PostFormStatus.ERRO
        )
        if (response.status === HttpStatus.OK && !!response.data) {
          setTimeout(() => {
            setPostFormStatus(PostFormStatus.NULL)
            navigate(`/professor/courses/edit/${courseId}`)
          }, 2000)
          setEstado({})
        }
      }, 1500)
    })
  }

  const FileListToFileArray = (fileList) => {
    var files = []
    for (let idx = 0; idx < fileList.length; idx++) {
      files.push(fileList[idx])
    }
    return files
  }

  const InvisibleInputApendice = () => (
    <input
      id="input-files-apc"
      type="file"
      style={{ display: 'none' }}
      onChange={(e) => {
        setFormValores({
          ...formValores,
          apendices: FileListToFileArray(e.target.files ?? new FileList()),
        })
      }}
      accept=".pdf, .zip"
      disabled={!editable}
    />
  )

  const InvisibleInputFile = () => (
    <input
      id="input-files-ftc"
      type="file"
      style={{ display: 'none' }}
      onChange={(e) => {
        setFormValores({
          ...formValores,
          files: FileListToFileArray(e.target.files ?? new FileList()),
        })
        setEstado({ ...estado, files: true })
      }}
      accept=".png,.jpeg,.jpg,.webp"
      disabled={!editable}
    />
  )

  const InvisibleVideoInputFile = () => (
    <input
      id="input-files-video-ftc"
      type="file"
      style={{ display: 'none' }}
      onChange={(e) => {
        setFormValores({
          ...formValores,
          videos: FileListToFileArray(e.target.files ?? new FileList()),
        })
        setEstado({ ...estado, videos: true })
      }}
      accept=".mp4,.webm"
      disabled={!editable}
    />
  )

  return (
    <section className="box-course pb-1 pt-1">
      <Container fluid className="container-new-lesson container-lesson mb-5">
             <Navbar>
            {logged && user ? (
              <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
                &#128075;&nbsp; Hey, {user?.name?.split(' ')[0]}!
              </p>
            ) : (
              <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
                &#128075;&nbsp; BEM-VINDO!
              </p>
            )}

            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                {user && user.photo ? <img src={user.photo} style={{ width: '50px', aspectRatio: 1, borderRadius: '50%', objectFit: 'fill', objectPosition: 'center', cursor: 'pointer' }} alt="profile" />
                  : <Avatar
                      name={(user?.name && user?.name.split(' ')[0]) || "O i"}
                      color="#0f5b7a"
                      size={30}
                      textSizeRatio={2}
                      round={true}
                  />}
                {/* {user && (
                  <Avatar
                    name={user.name}
                    color="#0f5b7a"
                    size={30}
                    textSizeRatio={2}
                    round={true}
                  />
                )} */}
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>

        <Form className="mt-4">
          <Row>
            <Col lg={12} className="mt-2">
              <h2>Criar nova aula</h2>
            </Col>
            <Col xs={12} lg={7}>
              <Container fluid>
                <Row>
                  <Col xs={12} className="pl0">
                    <Form.Label className="w-100 mt-3">
                      Categoria da aula
                      <Form.Select
                        style={{ boxShadow: 'none' }}
                        onChange={setCategoryId}
                        disabled={!editable}
                      >
                        {categories.sort((a, b) => compareObjects(a, b, formValores.categoryId)).map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
                      </Form.Select>
                    </Form.Label>
                  </Col>
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
                        isInvalid={
                          estado.title !== undefined ? !estado.title : undefined
                        }
                        onBlur={() =>
                          setEstado({
                            ...estado,
                            title: formValores.title.trim().length >= 3,
                          })
                        }
                      />
                    </Form.Label>
                  </Col>
                  <Col xs={12} className="pl0">
                    <Form.Label className="w-100 mt-3">
                      Conteudo da aula
                      <Form.Control
                        className="input-content"
                        spellCheck="false"
                        required
                        as="textarea"
                        value={formValores.content}
                        onChange={setContent}
                        isValid={estado.content}
                        disabled={!editable}
                        isInvalid={
                          estado.content !== undefined
                            ? !estado.content
                            : undefined
                        }
                        onBlur={() =>
                          setEstado({
                            ...estado,
                            content: formValores.content.trim().length >= 3,
                          })
                        }
                      />
                    </Form.Label>
                  </Col>
                  <Col xs={12} className="pl0">
                    <Form.Label className="w-100 mt-3">
                      Link material de apoio
                      <Form.Control
                        className="input-title"
                        spellCheck={false}
                        required
                        type="text"
                        placeholder="https://<url> ou vazio"
                        value={formValores.externAppendixLink}
                        onChange={setExternAppendixLink}
                        isValid={estado.externAppendixLink}
                        disabled={!editable}
                        isInvalid={
                          estado.externAppendixLink !== undefined ? !estado.externAppendixLink : undefined
                        }
                        onBlur={() =>
                          setEstado({
                            ...estado,
                            externAppendixLink: validateExternLink(formValores.externAppendixLink),
                          })
                        }
                      />
                    </Form.Label>
                  </Col>
                  <Col xs={12} className="pl0">
                    <Form.Label className="w-100 mt-3">
                      Link video
                      <Form.Control
                        className="input-title"
                        spellCheck={false}
                        required
                        type="text"
                        placeholder="https://<url> ou vazio"
                        value={formValores.externVideoLink}
                        onChange={setExternVideoLink}
                        isValid={estado.externVideoLink}
                        disabled={!editable}
                        isInvalid={estado.externVideoLink !== undefined ? !estado.externVideoLink : undefined}
                        onBlur={() => setEstado({ ...estado, externVideoLink: validateExternLink(formValores.externVideoLink) })}
                      />
                    </Form.Label>
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col xs={12} lg={5}>
              <Container
                fluid
                className="h-100 d-flex flex-column justify-content-between"
              >
                <Row>
                  <Col xs={12} className="mt-3 pr0">
                    <span>Thumbnail da aula</span>
                    <label htmlFor="input-files-ftc" style={{ width: '100%' }}>
                      <img
                        className={`image-for-input-file ${estado.files === false ? 'error' : ''
                          }`}
                        src={
                          formValores.files.length
                            ? URL.createObjectURL(formValores.files[0])
                            : noImage
                        }
                        style={{
                          width: '100%',
                          objectFit: 'contain',
                          objectPosition: 'center',
                          cursor: 'pointer',
                          backgroundColor: 'white',
                        }}
                      />
                    </label>
                  </Col>
                  <Col xs={12} className="file-input-span mb-3">
                    <span
                      className={`${!!estado.files
                        ? 'ok'
                        : estado.files === false
                          ? 'error'
                          : ''
                        }`}
                    >
                      {formValores.files.length > 0
                        ? `${formValores.files.length} ${formValores.files.length > 1
                          ? 'imagens selecionadas'
                          : 'imagem selecionada'
                        }`
                        : 'Nenhuma imagem selecionada'}
                    </span>
                  </Col>
                  <Col xs={12} className="mt-3 pr0" style={{display: 'none'}}>
                    <Form.Check
                      type="checkbox"
                      id="use-frame-as-banner-checkbox"
                      aria-label="radio 2"
                      label="Usar 1º frame do video como thumbnail"
                      onChange={(e) => {
                        setFormValores({
                          ...formValores,
                          useBannerFromVideo: e.target.checked,
                        })
                      }}
                      checked={formValores.useBannerFromVideo}
                    />
                  </Col>
                  <Col xs={12} className="mt-3 pr0" style={{display: 'none'}}>
                    <label
                      htmlFor="input-files-video-ftc"
                      className="label-to-use-frame-as-banner-input"
                    >
                      <span>Selecionar video</span>
                    </label>
                  </Col>
                  <Col xs={12} className="file-input-span mb-3" style={{display: 'none'}}>
                    <span
                      className={`${!!estado.videos
                        ? 'ok'
                        : estado.videos === false
                          ? 'error'
                          : ''
                        }`}
                    >
                      {formValores.videos.length > 0
                        ? `${formValores.videos.length} ${formValores.videos.length > 1
                          ? 'videos selecionados'
                          : 'video selecionado'
                        }`
                        : 'Nenhum video selecionado'}
                    </span>
                  </Col>
                  <Col xs={12} className="mt-1 mb-2 pr0" style={{display: 'none'}}>
                    <label
                      htmlFor="input-files-apc"
                      className="label-to-use-frame-as-banner-input"
                    >
                      <span>{ formValores.apendices.length > 0 ? 'Trocar arquivo de apoio' : 'Selecionar arquivo de apoio'}</span>
                    </label>
                  </Col>
                  <InvisibleInputFile />
                  <InvisibleVideoInputFile />
                  <InvisibleInputApendice />
                </Row>
                <Row>
                  <Col
                    lg={12}
                    className="mt-3 pr0"
                    style={{
                      display:
                        postFormSuccess !== PostFormStatus.NULL
                          ? 'none'
                          : 'block',
                      paddingBottom: '5px',
                    }}
                  >
                    <Button
                      className="submit-form register-btn w-100"
                      onClick={() => sendForm()}
                      style={{ height: '60px' }}
                      disabled={!editable}
                    >
                      {(!editable && 'Cadastrado') || 'Cadastrar'}
                    </Button>
                  </Col>
                  <Col
                    lg={12}
                    className="col-form-status pr0"
                    style={{
                      display:
                        postFormSuccess === PostFormStatus.NULL
                          ? 'none'
                          : 'block',
                    }}
                  >
                    <Alert
                      className="alert mt-3 form-status"
                      variant={
                        postFormSuccess === PostFormStatus.ENVIADO
                          ? 'success'
                          : postFormSuccess === PostFormStatus.ENVIANDO
                            ? 'primary'
                            : 'danger'
                      }
                    >
                      {postFormSuccess === PostFormStatus.ENVIADO
                        ? 'Aula cadastrada com sucesso !'
                        : postFormSuccess === PostFormStatus.ENVIANDO
                          ? 'Enviando ...'
                          : 'Houve um erro ao cadastrar aula, por favor, tente novamente mais tarde!'}
                    </Alert>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Form>
      </Container>
    </section>
  )

  async function getCategories() {
    const response = await CategoryAPI.getCategoriesByCourse(courseId);

    if (response.status == HttpStatus.OK && response?.data) {
      const catId = response.data?.categories?.sort((a, b) => compareObjects(a, b, formValores.categoryId))?.[0]?.id ?? null;
      setFormValores({ ...formValores, categoryId: catId });
      setCategories(response.data.categories);
      //console.log('C', catId)
    }
  }
}

export default NewLessonScreen
