import React from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Container, Row, Col } from 'react-bootstrap';
import { LessonAPI } from './api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BsFillPlayFill } from 'react-icons/bs';
import { Button } from 'react-bootstrap';

import './styles.css'

export const StudentLessonPage = () => {

    const { id } = useParams();
    const [lesson, setLesson] = React.useState()

    const navigate = useNavigate();

    React.useEffect(() => {
        if(window) window.scrollTo(0, 0);
    }, [lesson])

    React.useEffect(() => {
        const getLesson = async () => {
            const response = await LessonAPI.getLesson(id);
            setLesson(response.data);
        }

        if (id) getLesson();
    }, [id]);

    return lesson ? (
        <Container fluid style={{ marginBottom: '1rem' }} className='container-student-lesson-page'>
            <Row>
                <Col xs={12}>
                    <h1 style={{fontWeight: 'bold'}}>{lesson.title}</h1>
                </Col>
                <Col xs={12}>
                    <section style={{ position: 'relative' }}>
                        <img src={lesson.banner} style={{ width: '100%', aspectRatio: '16/9', margin: '1rem 0', cursor: 'pointer' }} />
                        <BsFillPlayFill style={{ fontSize: '5rem', color: '#198754', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', cursor: 'pointer' }} />
                    </section>
                </Col>
                <Col xs={12}>
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