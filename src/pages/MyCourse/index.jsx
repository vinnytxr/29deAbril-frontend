import React, { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import Avatar from 'react-avatar';

// Componentes
import CardMyCourses from "../../components/CardMyCourse/CardMyCourses"
import SideNav from "../../components/nav";

// Bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const MyCoursesScreen = () => {
    const [data, setData] = useState();
    const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
        const dataFetch = async () => {
            const data = await (
                await fetch(
                    "https://dummyjson.com/products"
                )
            ).json();

            setData(data);
            setIsFetched(true);
        };

        dataFetch();
    }, []);

    return (
            <div className="container-fluid fundo">
                <Row>
                    <div className="col-2 d-none d-lg-inline">
                        <SideNav />
                    </div>
                    <Col>
                        <Navbar>
                            <Container fluid>
                                <p style={{ color: "#0f5b7a" }} className="mt-3 fs-6 fw-bold">&#128075;&nbsp; Hey, CHRISTOFER!</p>
                                <Navbar.Toggle />
                                <Navbar.Collapse className="justify-content-end">
                                    <Navbar.Text>
                                        <button style={{ color: "#1dbfb0" }} data-mdb-ripple-color="#1dbfb0" type="button" class="fw-bold btn btn-light">ASSINE KULTIVI+</button>
                                    </Navbar.Text>
                                    <Navbar.Text>
                                        <Avatar class name="Christofer" color="#0f5b7a" size={30} textSizeRatio={2} round={true} />
                                    </Navbar.Text>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                        <Row>
                            <h1 className="mt-3 mb-3 ms-3 fs-5 fw-bold">Continuar estudando</h1>
                            <div className="col">
                                {
                                    isFetched ?
                                        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                                            {data.products.map((aula) => (
                                                <Col className=" d-flex justify-content-center">
                                                    <CardMyCourses key={aula.id} teste={aula} />
                                                </Col>
                                            ))}
                                        </Row>

                                        : <p>Carregando</p>
                                }
                            </div>
                        </Row>
                    </Col>
                </Row>
            </div>
    )
}

export default MyCoursesScreen