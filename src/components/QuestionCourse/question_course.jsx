import { useState, useEffect } from 'react';
import { HttpStatus, QuestionsAPI } from './api';
import { BASE_URL } from '../../api/default';
import { useAuthContext } from '../../contexts/AuthContext'
import ListGroup from 'react-bootstrap/ListGroup';
import { Form, Button, Modal, Col, Row, Card, ListGroupItem, ModalFooter } from 'react-bootstrap';
import { cut } from '../../tools/string'
import { Accordion } from 'react-bootstrap';
import Avatar from 'react-avatar';
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faXmark } from '@fortawesome/free-solid-svg-icons'
import './question_course.css'

const QuestionCourse = ({ dataLesson }) => {
  const { token, user } = useAuthContext();
  const [data, setData] = useState({});
  const [replyA, setReplyA] = useState(false);
  const [editReply, setEditReply] = useState(false);
  const [editQuestion, setEditQuestion] = useState(false);
  const [editFormId, setEditFormId] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

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

  const notifySuccess = (texto) =>
    toast.success(texto, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })

  const resetValores = () => {
    return {
      content: '',
    }
  }

  const [estado, setEstado] = useState({
    content: undefined,
    reply: undefined,
    edit: undefined,
  })

  const [formValores, setFormValores] = useState(resetValores())
  const [formReply, setFormReply] = useState(resetValores())
  const [formEditReply, setFormEditReply] = useState(resetValores())

  const setContent = (e) => {
    setEstado({ ...estado, content: undefined })
    setFormValores({ ...formValores, content: cut(e?.target?.value, 1024) })
  }

  const setReplyContent = (e) => {
    setEstado({ ...estado, reply: undefined })
    setFormReply({ ...formReply, content: cut(e?.target?.value, 1024) })
  }

  const setEditQuestions = (e) => {
    setEstado({ ...estado, edit: undefined })
    setFormEditReply({ ...formEditReply, content: cut(e?.target?.value, 1024) })
  }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    refreshQuestions()
  }, [id])

  const refreshQuestions = async () => {
    const response = await QuestionsAPI.getQuestions(id, token)
    if (response.status === HttpStatus.OK && !!response.data) {
      const questions = response.data
      setData({ ...questions })
    } else {
      navigate('/404-not-found')
    }
  }

  const addQuestion = async () => {
    const response = await QuestionsAPI.createQuestion(formValores.content, id, token)
    if (response.status === HttpStatus.OK) {
      notifySuccess("Pergunta enviada com sucesso!")
      refreshQuestions()
      setFormValores(resetValores())
      refreshQuestions()
    } else {
      notifyError("Erro ao enviar pergunta, tente novamente!")
      new Error('Error on addQuestion()')
    }
  }

  const addReply = async (idQuestion) => {
    const response = await QuestionsAPI.createReply(formReply.content, id, idQuestion, token)
    if (response.status === HttpStatus.OK) {
      notifySuccess("Resposta enviada com sucesso!")
      setFormReply(resetValores())
      refreshQuestions()
    } else {
      notifyError("Erro ao enviar resposta, tente novamente!")
      new Error('Error on addReply()')
    }
  }

  const rmQuestion = async (idQuestion) => {
    const response = await QuestionsAPI.deleteQuestion(id, idQuestion, token)
    if (response.status === HttpStatus.OK) {
      refreshQuestions()
      notifySuccess("Removido com sucesso!")
    } else {
      notifyError("Erro ao remover resposta, tente novamente!")
      new Error('Error on rmQuestion()')
    }
  }

  const upQuestion = async (replyContent, idQuestion) => {
    if (formEditReply.content !== replyContent) {
      const response = await QuestionsAPI.updateQuestion(formEditReply.content, id, idQuestion, token)
      if (response.status === HttpStatus.OK) {
        notifySuccess("Resposta alterada com sucesso!")
        setEditQuestion(false)
        setEditReply(false)
        setFormEditReply(resetValores())
        refreshQuestions()
      } else {
        notifyError("Erro ao alterada resposta, tente novamente!")
        new Error('Error on upQuestion()')
      }
    } else {
      notifySuccess("Resposta alterada com sucesso!")
      setEditQuestion(false)
      setEditReply(false)
      setFormEditReply(resetValores())
    }
  }

  const rmReply= async (idQuestion, idReply) => {
    const response = await QuestionsAPI.deleteReply(id, idQuestion, idReply, token)
    if (response.status === HttpStatus.OK) {
      refreshQuestions()
      notifySuccess("Removido com sucesso!")
    } else {
      notifyError("Erro ao remover resposta, tente novamente!")
      new Error('Error on rmReply()')
    }
  }

  const upReply = async (replyContent, idQuestion, idReply) => {
    if (formEditReply.content !== replyContent) {
      const response = await QuestionsAPI.updateReply(formEditReply.content, id, idQuestion, idReply, token)
      if (response.status === HttpStatus.OK) {
        notifySuccess("Resposta alterada com sucesso!")
        setEditQuestion(false)
        setEditReply(false)
        setFormEditReply(resetValores())
        refreshQuestions()
      } else {
        notifyError("Erro ao alterada resposta, tente novamente!")
        new Error('Error on upReply()')
      }
    } else {
      notifySuccess("Resposta alterada com sucesso!")
      setEditQuestion(false)
      setEditReply(false)
      setFormEditReply(resetValores())
    }
  }

  return (
    <div className="questionLesson">
      <Button style={{ width: '22%', fontWeight: 'bold', backgroundColor: '#0E6216', borderColor: '#0E6216', borderRadius: '10px' }}
        onClick={handleShow}>
        Perguntas
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        keyboard={false}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="questionLesson"
      >
        <Modal.Header closeButton>
          <Modal.Title>Perguntas - {dataLesson.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label className="w-100 mt-3">
              Perguntas ou dúvidas sobre o conteúdo?!
              <Form.Control
                className="input-content"
                spellCheck="false"
                required
                as="textarea"
                rows={3}
                value={formValores.content}
                onChange={setContent}
                isValid={estado.content}
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
                maxLength={1024}
              />
            </Form.Label>
          </Form>
          <Modal.Footer>
            <Button className="questionLesson submit-question"
              onClick={() => addQuestion()}
            >
              Enviar
            </Button>
          </Modal.Footer>

          <Accordion>
            {Object.values(data).map(item => (
              <Card key={item.id}>
                <Accordion.Item eventKey={item.id.toString()} key={item.id}>
                  <Accordion.Header className='accordion-header'>
                    <Row>
                      <Row>
                        <Col>
                          {item.user.photo ? <img src={`${BASE_URL}${item.user.photo}`} style={{ width: 'auto', height: '50px', aspectRatio: 1, borderRadius: '50%', objectFit: 'fill', objectPosition: 'center', cursor: 'pointer' }} alt="profile" />
                            : <Avatar
                              name={item.user.name && item.user.name.split(' ')[0]}
                              color="#0E6216"
                              size={50}
                              round={true}
                              style={{ cursor: 'pointer' }}
                            />}
                        </Col>
                      </Row>
                      <Row className='mt-1'>
                        <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#0E6216' }}>
                          {item.user.name}
                        </div>
                      </Row>
                      <Row>
                        {editQuestion && editFormId === item.id ? (
                          <></>
                        ) : (
                          <Row className='mt-3' >
                            <div className="text-justify" style={{ overflowWrap: 'break-word' }}>
                              {item.content}
                            </div>
                          </Row>
                        )}
                      </Row>
                    </Row>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row className='my-1'>
                      <Col className="questionLesson">
                        {editQuestion && editFormId === item.id &&
                          <Form>
                            <Form.Label className="w-100 mt-3">
                              <Form.Control
                                className="input-content"
                                spellCheck="false"
                                required
                                as="textarea"
                                rows={3}
                                value={formEditReply.content}
                                onChange={setEditQuestions}
                                isValid={estado.edit}
                                isInvalid={
                                  estado.edit !== undefined
                                    ? !estado.edit
                                    : undefined
                                }
                                onBlur={() =>
                                  setEstado({
                                    ...estado,
                                    edit: formEditReply.content.trim().length >= 3,
                                  })
                                }
                                maxLength={1024}
                              />
                            </Form.Label>
                          </Form>
                        }
                        { item.user.id === user.id && 
                          <Row className='me-1 my-1' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                              {editQuestion && editFormId === item.id ? (
                                <>
                                  <Button className="questionLesson submit-question" style={{ width: '100px' }} onClick={() => upQuestion(item.content, item.id)}>
                                    Salvar
                                  </Button>

                                  <Button className="questionLesson cancel-question" style={{ width: '100px' }} onClick={() => { setEditQuestion(false); setEditFormId(null) }}>
                                    Cancelar
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button className="questionLesson submit-question" style={{ width: '170px' }} 
                                    onClick={() => { setFormEditReply({ ...formEditReply, content: item.content }); setEditQuestion(true); setEditFormId(item.id) }}>
                                    Editar pergunta <FontAwesomeIcon icon={faEdit} />
                                  </Button>

                                  <Button className="questionLesson cancel-question" style={{ width: '100px' }} onClick={() => rmQuestion(item.id)}>
                                    Deletar <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </>
                              )}
                          </Row>
                        }
                      </Col>
                    </Row>
                    {item.replies.length > 0 && (
                      <ListGroup>
                        {item.replies.map(reply => (
                          <ListGroupItem key={reply.id} className='mt-2'>
                            <Row>
                              <Row>
                                <Col xs={1}>
                                  {reply.user.photo ? <img src={`${BASE_URL}${reply.user.photo}`} style={{ width: 'auto', height: '50px', aspectRatio: 1, borderRadius: '50%', objectFit: 'fill', objectPosition: 'center', cursor: 'pointer' }} alt="profile" />
                                    : <Avatar
                                      name={reply.user.name && reply.user.name.split(' ')[0]}
                                      color="#0E6216"
                                      size={50}
                                      round={true}
                                      style={{ cursor: 'pointer' }}
                                    />}
                                </Col>
                              </Row>
                              <Row style={{ fontWeight: 'bold', fontSize: '18px', color: '#0E6216' }}>
                                <div>
                                  {reply.user.name}
                                </div>
                              </Row>
                              <Col>
                                {editReply && editFormId === reply.id ? (
                                  <>
                                    <Form>
                                      <Form.Label className="w-100 mt-3">
                                        <Form.Control
                                          className="input-content"
                                          spellCheck="false"
                                          required
                                          as="textarea"
                                          rows={3}
                                          value={formEditReply.content}
                                          onChange={setEditQuestions}
                                          isValid={estado.edit}
                                          isInvalid={
                                            estado.edit !== undefined
                                              ? !estado.edit
                                              : undefined
                                          }
                                          onBlur={() =>
                                            setEstado({
                                              ...estado,
                                              edit: formEditReply.content.trim().length >= 3,
                                            })
                                          }
                                          maxLength={1024}
                                        />
                                      </Form.Label>
                                    </Form>
                                  </>
                                ) : <>
                                  <Row className="text-justify">
                                    <div className='mt-3'>
                                      {reply.content}
                                    </div>
                                  </Row>
                                </>
                                }
                              </Col>
                            </Row>
                            {reply.user.id === user.id &&
                              <Row className='me-1 mt-1' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {editReply && editFormId === reply.id ? (
                                  <>
                                    <Button style={{ width: '100px' }} className="questionLesson submit-question" onClick={() => upReply(reply.content, item.id, reply.id)}>
                                      Salvar
                                    </Button>
                                    <Button style={{ width: '50px' }} className="questionLesson cancel-question" onClick={() => { setEditReply(false); setEditFormId(null) }}>
                                      <FontAwesomeIcon icon={faXmark} />
                                    </Button>
                                  </>
                                ) : <>
                                  <Button style={{ width: '100px' }} className="questionLesson submit-question" onClick={() => { setFormEditReply({ ...formEditReply, content: reply.content }); setEditReply(true); setEditFormId(reply.id) }}>
                                    Editar <FontAwesomeIcon icon={faEdit} />
                                  </Button>
                                  <Button style={{ width: '50px' }} className="questionLesson cancel-question" onClick={() => rmReply(item.id, reply.id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </>
                                }
                              </Row>
                            }
                          </ListGroupItem>
                        ))}

                      </ListGroup>
                    )}
                    {!replyA ? (
                      <ModalFooter>
                        <Button className="questionLesson submit-question" onClick={() => setReplyA(true)}>
                          Responder
                        </Button>
                      </ModalFooter>
                    ) : (
                      <Row className='mt-4'>
                        <Form>
                          <Form.Label className="w-100 mt-3">
                            Insira a sua resposta!
                            <Form.Control
                              className="input-content"
                              spellCheck="false"
                              required
                              as="textarea"
                              rows={3}
                              value={formReply.content}
                              onChange={setReplyContent}
                              isValid={estado.reply}
                              isInvalid={
                                estado.reply !== undefined
                                  ? !estado.reply
                                  : undefined
                              }
                              onBlur={() =>
                                setEstado({
                                  ...estado,
                                  reply: formReply.content.trim().length >= 3,
                                })
                              }
                            />
                          </Form.Label>
                        </Form>
                        <Modal.Footer>
                          <Button className="questionLesson cancel-question" onClick={() => { setReplyA(false); setFormReply(resetValores()) }}>Cancelar</Button>
                          <Button className="questionLesson submit-question" onClick={() => { setReplyA(false); addReply(item.id) }}>Enviar</Button>
                        </Modal.Footer>
                      </Row>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              </Card>
            ))}
          </Accordion>
        </Modal.Body>
      </Modal>
    </ div>
  );
}

export default QuestionCourse;