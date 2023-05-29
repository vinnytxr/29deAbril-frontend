import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../api/default";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthContext } from '../../contexts/AuthContext'
import { Col, Row, Container, Card } from "react-bootstrap";
import CardProfessorProfile from "../../components/CardProfessorProfile/card_professor_profile";
import CardCourses from "../../components/CardCourses";
import './professor_profile.css'

function TeacherProfile() {

    const [data, setData] = useState({});
    const [isFetched, setIsFetched] = useState(false);

    const { logged, user } = useAuthContext()

    const navigate = useNavigate();
    const { id } = useParams(); //Alterar o curso que deseja visualizar, quando for integrar vou deixar direto na função

    useEffect(() => {
        // fetch data

        if (id) {
            const dataFetch = async () => {
                try {
                    const response = await fetch(`${BASE_URL}/courses/courses?professor=${id}`)
                    if (response.status < 200 || response.status >= 300) throw new Error(`Curso não encontrado ${id}`)
                    //console.log(response)
                    const data = await response.json();
                    // set state when the data received
                    setData({ ...data });
                    setIsFetched(true);
                } catch (err) {
                    //console.log("ERRO")
                    navigate("/404-not-found")
                }
            }
            dataFetch();
        }
    }, [id]);

    return (
        <Container>
            <Row>
                <Col>
                    <Row>
                        <CardProfessorProfile />
                    </Row>
                </Col>
            </Row>
            {isFetched && logged && !!user && data.results ? (
                <Row className="mt-3 home-card">
                    <h1 className="mt-3 mb-3 fs-5 fw-bold">Todos os cursos</h1>

                    <Col>
                        <Row className="g-4">
                            {data.results.map((course) => (
                                <Col xs={12} lg={4} key={course.id}>
                                    <Link to={`/student/courses/${course.id}`}>
                                        <CardCourses teste={course} />
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            ) : <>
                <Row className="mt-3 text-center">
                    <Card>
                        <Card.Body>Ficamos felizes pelo interesse, no momento o professor não possui cursos cadastrados!</Card.Body>
                        <Card.Body>Fique atento para novas atualizações, Obrigado!</Card.Body>
                    </Card>
                </Row>
            </>
            }
        </Container>
    )
};

export default TeacherProfile;