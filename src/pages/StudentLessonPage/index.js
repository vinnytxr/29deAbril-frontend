import React, { useEffect, useState } from 'react';
import { AuthContext, useAuthContext } from '../../contexts/AuthContext';
import { Container, Row, Col, Modal, Form } from 'react-bootstrap';
import { LessonAPI } from './api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BsFillPlayFill } from 'react-icons/bs';
import { Button } from 'react-bootstrap';
import ReactPlayer from 'react-player'
import { toast } from 'react-toastify';


import './styles.css'
import { AUTH_DEBUG, BASE_URL, HttpResponse, HttpStatus } from '../../api/default';

const DEFAULT_VIDEO_PLAYER_STATE = {
  playing: false,
  started: false,
  played: 0,
  duration: 0,
  completed: false,
  progress: 0
}

export const StudentLessonPage = () => {

  const { id } = useParams();
  const [lesson, setLesson] = React.useState()
  const [controle, setControle] = React.useState({ enrolled: undefined })
  const [videoPlayer, setVideoPlayer] = React.useState(DEFAULT_VIDEO_PLAYER_STATE);
  const [videoDuration, setVideoDuration] = React.useState(null);
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState('');
  const { user, refreshUserOnContext, token } = useAuthContext();

  const notifySuccess = (texto) => toast.success(texto, {
    position: "top-right",
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const notifyError = (texto) => toast.error(texto, {
    position: "top-right",
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const navigate = useNavigate();

  React.useEffect(() => {
    if (lesson && lesson.users_who_completed && user)
      if (lesson.users_who_completed.includes(user.id) && lesson.professor !== user.id)
        setVideoPlayer({ ...videoPlayer, completed: true })
  }, [lesson, user])

  React.useEffect(() => {

    const verifyPermissions = async (courseId) => {
      const response = await LessonAPI.getCourse(lesson.course);
      const course = response.data;
      const isEnrolled = course.students.map(c => c.id).includes(user.id)
      setControle({ enrolled: isEnrolled })
    }

    if (lesson && lesson.id) {
      verifyPermissions(lesson.course)
    }
  }, [lesson])

  const isProfessorOfLessonCourse = () => user && lesson && lesson.professor && (lesson.professor === user.id);

  const refreshLesson = async () => {
    const response = await LessonAPI.getLesson(id);
    setLesson(response.data);
  }

  React.useEffect(() => {
    setVideoPlayer(DEFAULT_VIDEO_PLAYER_STATE)
    setVideoDuration(null)

    if (id) refreshLesson();
    if (window) window.scrollTo(0, 0);
  }, [id]);

  React.useEffect(() => {
    const completeLesson = async () => {
      if (videoPlayer.played > 0.95 && !videoPlayer.completed && !isProfessorOfLessonCourse()) {
        notifySuccess("Parabéns, você concluiu a aula!")
        setVideoPlayer({ ...videoPlayer, completed: true })

        await LessonAPI.completeLessonAsStudent(user.id, lesson.id);
        await refreshLesson()
      }
    }

    completeLesson()

  }, [videoPlayer])

  const handleVideoOnPlay = () => {
    if (!controle.enrolled && !isProfessorOfLessonCourse()) {
      notifyError("Você precisa matricular-se no curso para assistir as aula!")
      setVideoPlayer({ ...videoPlayer, playing: false, started: false, played: false })
    } else {
      setVideoPlayer({ ...videoPlayer, playing: true, started: true, played: false })
    }
  }

  const handleOnProgress = ({ played, playedSeconds }) => {
    console.log(playedSeconds)
    if (controle.enrolled) setVideoPlayer({ ...videoPlayer, played, playedSeconds });
  }

  const getTime = (seconds) => {
    console.log(seconds)
    const m = Math.floor(seconds % 3600 / 60).toString().padStart(2, '0'),
      s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return (seconds == undefined ? "00:00" : m + ':' + s);
  }

  const handleCloseModal = (clear) => { if (clear) setNote(''); setShowModal(false) }
  const handleShowModal = () => { videoPlayer.playing = false; setShowModal(true) };

  const fetchNote = async (time, note) => {
    const url = `${BASE_URL}/anotation/`;
    var errorMessage;
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'jwt': token,
          Accept: 'application/json'
        },
        body: JSON.stringify({ user: id, time: time, note: note, link: "https://www.google.com.br", course:lesson.course, lesson:lesson.id })
      }

      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        AUTH_DEBUG && console.log("AuthAPI::FetchNote(): ", data.token);
        return new HttpResponse(HttpStatus.OK, data);
      } else {
        errorMessage = await response.json();
        throw new Error("Error on FetchNote()");
      }
    } catch (error) {
      console.warn(error)
      return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
  }

  const handleSubmit = async (e) => {
    handleCloseModal(false)
    e.preventDefault();
    const response = await fetchNote(getTime(videoPlayer.playedSeconds), note)
    if (response.status !== HttpStatus.OK) {
      console.log(response)
      notifyError("Falha ao enviar anotação.")
    } else {
      refreshUserOnContext()
      notifySuccess("Anotação salva.");
      setNote("")
      handleCloseModal()
    }
    /* const response = await ProfileAPI.putInvite(user.id, authorizationCode, token);
     //console.log("response: ", response)
 
     if (response.status !== HttpStatus.OK) {
       console.log(response)
       setAuthorizationCode('')
       notifyError("Falha ao alterar permissões.")
     } else {
       refreshUserOnContext()
       notifySuccess("Permissões atualizadas com sucesso. Agora você é um professor :)");
       handleCloseModal()
     }*/
  }


  const anotar = () => {
    console.log("Anotação");
    handleShowModal();
  }

  return lesson ? (
    <>
      {React.createElement("Button", { onClick: () => anotar(), className: 'btn btn-success', style: { position: "absolute", right: "30px", bottom: "50%" } }, "Anotar")}
{console.log(lesson)}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Faça sua Anotação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Anotação para o tempo: {getTime(videoPlayer.playedSeconds)}</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="note">
              <Form.Control as="textarea" rows={5} style={{ resize: 'none' }} autoComplete="off" placeholder="Anotação" value={note} onChange={(e) => setNote(e.target.value)} />
            </Form.Group>
            <Button disabled={note?.length < 3} className='mt-2' variant="success" type="submit">Salvar anotação</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Container fluid style={{ marginBottom: '1rem' }} className='container-student-lesson-page'>
        <Row>
          {
            videoPlayer.completed &&
            <Col xs={12} style={{ marginTop: '0.5rem' }}>
              <span className='flag-completed-lesson'>Aula concluída</span>
            </Col>
          }
          {
            isProfessorOfLessonCourse() &&
            <Col xs={12} style={{ marginTop: '0.5rem' }}>
              <span className='flag-is-professor'>Você é o professor desta aula</span>
            </Col>
          }
          <Col xs={12}>
            <h1 style={{ fontWeight: 'bold' }}>{lesson.title}</h1>
          </Col>
          <Col xs={12}>
            {(lesson.banner || lesson.video) && <section style={{ position: 'relative' }}>
              {lesson.banner && (!videoPlayer.started || !lesson.video) && <img src={lesson.banner} style={{ width: '100%', aspectRatio: '16/9', margin: '1rem 0', cursor: 'pointer' }} />}
              {lesson.video && videoPlayer.started && <ReactPlayer url={lesson.video} controls={videoPlayer.playing} className='react-player' playing={videoPlayer.playing} onPlay={handleVideoOnPlay} onProgress={handleOnProgress} /* onPause={handleVideoOnPause} */ config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload'
                  }
                }
              }} />}
              {(!videoPlayer.playing || !lesson.banner) && lesson.video && <BsFillPlayFill onClick={handleVideoOnPlay} style={{ fontSize: '5rem', color: '#0E6216', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', cursor: 'pointer' }} />}
            </section>}
          </Col>
          <Col xs={12} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <p style={{ textAlign: 'justify' }}>{lesson.content}</p>
          </Col>
          <Col xs={12}>
            <section style={{ display: 'flex', justifyContent: 'space-between' }}>
              {lesson.prev && <LinkLesson title={lesson.prev.title} link={`/student/lessons/${lesson.prev.id}`} image={lesson.prev.banner} inverse />}
              <Button style={{ width: '22%', fontWeight: 'bold', backgroundColor: '#0E6216', borderColor: '#0E6216', borderRadius: '10px' }} onClick={() => navigate(`/student/courses/${lesson.course}`)}>
                Ver todas as aulas
              </Button>
              {lesson.next && <LinkLesson title={lesson.next.title} link={`/student/lessons/${lesson.next.id}`} image={lesson.next.banner} />}
            </section>
          </Col>
        </Row>
      </Container>
    </>
  )
    : <></>;
}

const LinkLesson = ({ title, link, image, inverse }) => {
  return (
    <Link to={link} style={{ width: '37%' }}>
      <article style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden' }}>
        <img alt='' src={image} style={{ width: '100%', filter: 'brightness(35%)', aspectRatio: '16/8' }} />

        <div style={{ position: 'absolute', color: 'white', left: 0, top: 0, fontWeight: 'bold', textAlign: 'center', maxWidth: '100%', maxHeight: '100%', overflow: 'hidden', padding: '5px' }}>
          {!inverse && <span>Próxima aula</span>}
          {inverse && <span>Aula anterior</span>}
          <br /><br />
          <span>{title}</span>
        </div>
      </article>
    </Link>
  );
}