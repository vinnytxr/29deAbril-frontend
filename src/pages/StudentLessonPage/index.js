import React, { useEffect } from 'react';
import { AuthContext, useAuthContext } from '../../contexts/AuthContext';
import { Container, Row, Col } from 'react-bootstrap';
import { LessonAPI } from './api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BsFillPlayFill } from 'react-icons/bs';
import { Button } from 'react-bootstrap';
import ReactPlayer from 'react-player'

import './styles.css'

const DEFAULT_VIDEO_PLAYER_STATE = {
  playing: false,
  started: false,
  played: 0,
  duration: 0,
  completed: false
}

export const StudentLessonPage = () => {

  const { id } = useParams();
  const [lesson, setLesson] = React.useState()
  const [videoPlayer, setVideoPlayer] = React.useState(DEFAULT_VIDEO_PLAYER_STATE)
  const [videoDuration, setVideoDuration] = React.useState(null)
  const { user, refreshUserOnContext } = useAuthContext();

  useEffect(() => console.log(lesson), [lesson])

  const navigate = useNavigate();

  React.useEffect(() => {
    if(lesson && lesson.users_who_completed && user)
      if(lesson.users_who_completed.includes(user.id) && lesson.professor !== user.id)
        setVideoPlayer({...videoPlayer, completed: true})
  }, [lesson, user])

  // React.useEffect(() => {
  //   console.log('videoPlayer: ', videoPlayer)
  //   console.log('duration', videoDuration)
  // }, [videoPlayer, videoDuration]);

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
      if (videoPlayer.played > 0.8 && !videoPlayer.completed) {
        window.alert("Parabéns, você concluiu a aula!")
        setVideoPlayer({ ...videoPlayer, completed: true })

        await LessonAPI.completeLessonAsStudent(user.id, lesson.id);
        await refreshLesson()
      }
    }

    completeLesson()

  }, [videoPlayer])

  const handleVideoOnPlay = () => setVideoPlayer({ ...videoPlayer, playing: true, started: true })
  // const handleVideoOnPause = () => setVideoPlayer({ ...videoPlayer, playing: false })

  const handleOnProgress = ({ played }) => setVideoPlayer({ ...videoPlayer, played });
  // const handleDuration = (duration) => setVideoDuration(duration);
  // const handleOnProgress = (e) => console.log('progress: ', e);

  return lesson ? (
    <Container fluid style={{ marginBottom: '1rem' }} className='container-student-lesson-page'>
      <Row>
        {
          videoPlayer.completed &&
          <Col xs={12} style={{ marginTop: '0.5rem' }}>
            <span className='span-aula-concluida'>Aula concluída</span>
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
            {(!videoPlayer.playing || !lesson.banner) && lesson.video && <BsFillPlayFill onClick={handleVideoOnPlay} style={{ fontSize: '5rem', color: '#198754', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', cursor: 'pointer' }} />}
          </section>}
        </Col>
        <Col xs={12} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <p style={{ textAlign: 'justify' }}>{lesson.content}</p>
        </Col>
        <Col xs={12}>
          <section style={{ display: 'flex', justifyContent: 'space-between' }}>
            {lesson.prev && <LinkLesson title={lesson.prev.title} link={`/student/lessons/${lesson.prev.id}`} image={lesson.prev.banner} inverse />}
            <Button style={{ width: '22%', fontWeight: 'bold', backgroundColor: '#198754', borderColor: '#198754', borderRadius: '10px' }} onClick={() => navigate(`/student/courses/${lesson.course}`)}>
              Ver todas as aulas
            </Button>
            {lesson.next && <LinkLesson title={lesson.next.title} link={`/student/lessons/${lesson.next.id}`} image={lesson.next.banner} />}
          </section>
        </Col>
      </Row>
    </Container>
  ) : <></>;
}

const LinkLesson = ({ title, link, image, inverse }) => {
  return (
    <Link to={link} style={{ width: '37%' }}>
      <article style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden' }}>
        <img src={image} style={{ width: '100%', filter: 'brightness(35%)', aspectRatio: '16/8' }} />

        <div style={{ position: 'absolute', color: 'white', left: 0, top: 0, fontWeight: 'bold', textAlign: 'center', maxWidth: '100%', maxHeight: '100%', overflow: 'hidden', padding: '5px' }}>
          {!inverse && <span>Próxima aula</span>}
          {inverse && <span>Aula anterior</span>}
          <br /><br />
          <span>{title}</span>
        </div>
        {/* {!inverse && <BsFillPlayFill style={{ fontSize: '5rem', color: '#198754', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', cursor: 'pointer' }} />}
                {inverse && <BsFillPlayFill style={{ fontSize: '5rem', color: '#198754', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(180deg)', cursor: 'pointer' }} />} */}
      </article>
    </Link>
  );
}