import React from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Container, Row, Col } from 'react-bootstrap';
import { LessonAPI } from './api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BsFillPlayFill } from 'react-icons/bs';
import { Button } from 'react-bootstrap';

export const StudentLessonPage = () => {

    const { id } = useParams();
    const [lesson, setLesson] = React.useState()

    const navigate = useNavigate();

    React.useEffect(() => {
        console.log("lesson id: ", id);
    }, [id]);

    React.useEffect(() => {
        const getLesson = async () => {
            const response = await LessonAPI.getLesson(id);
            setLesson(response.data);
            console.log("lesson: ", lesson)
        }

        if (id) getLesson();
    }, [id]);

    return lesson ? (
        <Container fluid style={{ marginBottom: '1rem' }}>
            <Row>
                <Col xs={12}>
                    <h1>{lesson.title}</h1>
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
                        <LinkLesson title='Aula 1: Módulos Python' link='/student/lessons/39' image='https://portal-aulas-api.fly.dev/media/images/courses/lessons/ea36a5ec6b7745be881848315f62f50c.png' inverse />
                        <Button style={{ width: '32%', fontWeight: 'bold', backgroundColor: '#198754', borderColor: '#198754', borderRadius: '10px' }} onClick={() => navigate(`/student/courses/${lesson.course}`)}>
                            Ver todas as aulas
                        </Button>
                        <LinkLesson title='Aula 1: Módulos Python' link='/student/lessons/42' image='http://portal-aulas-api.fly.dev/media/images/courses/lessons/88d3cb895c6a4630ac4947a88af3fce4.jpg' />
                    </section>
                </Col>
            </Row>
        </Container>
    ) : <></>;
}

const LinkLesson = ({ title, link, image, inverse }) => {
    return (
        <Link to={link} style={{ width: '32%' }}>
            <article style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden' }}>
                <img src={image} style={{ width: '100%', filter: 'brightness(40%)', aspectRatio: '16/9' }} />
                <span style={{ position: 'absolute', color: 'white', left: '5px', fontWeight: 'bold' }}>{title}</span>
                {!inverse && <BsFillPlayFill style={{ fontSize: '5rem', color: '#198754', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', cursor: 'pointer' }} />}
                {inverse && <BsFillPlayFill style={{ fontSize: '5rem', color: '#198754', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(180deg)', cursor: 'pointer' }} />}
            </article>
        </Link>
    );
}