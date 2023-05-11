import React from 'react';
import { AuthContext} from '../../contexts/AuthContext';
import { Container, Row, Col } from 'react-bootstrap';
import { LessonAPI } from './api';
import { useParams } from 'react-router-dom';
import { BsFillPlayFill } from 'react-icons/bs';
import { Button } from 'react-bootstrap';

export const StudentLessonPage = () => {

    const { id } = useParams();
    const [lesson, setLesson] = React.useState()

    React.useEffect(() => {
        console.log("lesson id: ", id);
    }, [id]);

    React.useEffect(() => {
        const getLesson = async () => {
            const response = await LessonAPI.getLesson(id);
            setLesson(response.data);
            console.log("lesson: ", lesson)
        }

        if(id) getLesson();
    }, [id]);

    return lesson ? (
        <Container fluid style={{marginBottom: '1rem'}}>
            <Row>
                <Col xs={12}>
                    <h1>{lesson.title}</h1>
                </Col>
                <Col xs={12}>
                    <section style={{position: 'relative'}}>
                        <img src={lesson.banner} style={{width: '100%', aspectRatio: '16/9', margin: '1rem 0', cursor: 'pointer'}}/>
                        <BsFillPlayFill style={{fontSize: '5rem', color: '#198754', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', cursor: 'pointer'}}/>
                    </section>
                </Col>
                <Col xs={12}>
                    <p style={{textAlign: 'justify'}}>{lesson.content}</p>
                </Col>
                <Col xs={12}>
                    <section style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button style={{width: '33%', fontWeight: 'bold', backgroundColor: '#198754', borderColor: '#198754'}}>
                            Aula anterior
                        </Button>
                        <Button style={{width: '33%', fontWeight: 'bold', backgroundColor: '#198754', borderColor: '#198754'}}>
                            Ver todas as aulas
                        </Button>
                        <Button style={{width: '33%', fontWeight: 'bold', backgroundColor: '#198754', borderColor: '#198754'}}>
                            Próxima aula
                        </Button>
                    </section>
                </Col>
            </Row>
        </Container>
    ) : <></>;
}