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
    }
  }

  const { courseId } = useParams()

  const [estado, setEstado] = useState({
    title: undefined,
    files: undefined,
    content: undefined,
    videos: undefined,
  })

  const [formValores, setFormValores] = useState(resetValores())
  const [postFormSuccess, setPostFormStatus] = useState(PostFormStatus.NULL)
  const [editable, setEditable] = useState(true)
  const [categories, setCategories] = useState([])

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

  const setTitle = (e) => {
    setEstado({ ...estado, title: undefined })
    setFormValores({ ...formValores, title: cut(e?.target?.value ?? '', 64) })
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
    }

    setEstado({ ...estadoAux })

    for (let [, value] of Object.entries(estadoAux)) if (!value) return

    setPostFormStatus(PostFormStatus.ENVIANDO)

    var post = new FormData()

    post.append('title', formValores.title)
    post.append('content', formValores.content)
    post.append('course', courseId)

    if (!formValores.useBannerFromVideo)
      post.append('banner', formValores.files[0])

    if (formValores.videos.length) post.append('video', formValores.videos[0])

    if (formValores.categoryId) post.append("category", formValores.categoryId)

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
        <Form>
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
                  <Col xs={12} className="mt-3 pr0">
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
                  <Col xs={12} className="mt-3 pr0">
                    <label
                      htmlFor="input-files-video-ftc"
                      className="label-to-use-frame-as-banner-input"
                    >
                      <span>Selecionar video</span>
                    </label>
                  </Col>
                  <Col xs={12} className="file-input-span mb-3">
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
                  <InvisibleInputFile />
                  <InvisibleVideoInputFile />
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
      setFormValores({...formValores, categoryId: catId});
      setCategories(response.data.categories);
      console.log('C', catId)
    }
  }
}

export default NewLessonScreen
