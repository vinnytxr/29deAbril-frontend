import React, { useState, useEffect } from 'react'
import { Row, Col, Container } from 'react-bootstrap';
import Avatar from 'react-avatar';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { AiFillLinkedin, AiFillInstagram } from 'react-icons/ai';
import { IoShareSocialOutline } from 'react-icons/io5';
import StarRating from '../StarRating/star_rating';
import { AuthAPI } from '../../api/auth-api';
import { HttpStatus } from '../../api/default';
import { useParams } from "react-router-dom";
import { useAuthContext } from '../../contexts/AuthContext'


function CardProfessorProfile() {

    const [data, setData] = useState({});
    const [isFetched, setIsFetched] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        const getProfessorPerfil = async () => {
            setIsFetched(false)
            try {
                const responsePerfil = await AuthAPI.getProfessorPerfil(id)
                if (responsePerfil.status === HttpStatus.OK) {
                    setData(responsePerfil.data)
                    setIsFetched(true)
                }
            } catch (err) {
                console.log(err)
            }
        }
        getProfessorPerfil();
    }, [id])

    const date = (dateString) => {
        const dateObj = new Date(dateString);
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();

        const formattedDate = `Docente desde: ${month}/${year}`;
        return formattedDate // saída: "23/4/2023"

    }

    return (
        <Container fluid className='mt-5'>
            <Row>
                {isFetched && data ? (
                    <>
                        <Card>
                            <Row className='mt-4'>
                                <Col className='col-4 ms-2'>
                                    <Row>
                                        <Col className="d-flex justify-content-center align-items-center flex-column">
                                            {data.photo ? <img src={data.photo} style={{ width: '70%', aspectRatio: 1, borderRadius: '50%', objectFit: 'fill', objectPosition: 'center', cursor: 'pointer' }} alt="profile" />
                                                : <Avatar
                                                    name={data.name && data.name.split(' ')[0]}
                                                    color="#0f5b7a"
                                                    size={150}
                                                    textSizeRatio={2}
                                                    round={true}
                                                    style={{ cursor: 'pointer' }}
                                                />}
                                            <Col className="d-flex align-items-center gap-1">
                                                <Card.Title
                                                    className="fw-bold fs-4 mt-4 mb-4 ms-1"
                                                    style={{ color: '#727273' }}
                                                >
                                                    {data.name && data.name.split(' ')[0]}
                                                </Card.Title>
                                            </Col>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col>
                                    <Row>
                                        <Card.Title className="fw-bold fs-5" style={{ color: '#727273' }}>
                                            Sobre o docente {data.name}
                                        </Card.Title>
                                    </Row>
                                    <Row >
                                        <Col>
                                            <Card.Text className="mt-1 mb-0 fs-6" style={{ color: '#727273' }}>
                                                {data.about}
                                            </Card.Text>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Card.Text className="mt-0 mb-0 fs-6" style={{ color: '#727273' }}>
                                            {date(data.created)}
                                        </Card.Text>
                                    </Row>
                                    {/* <Row className="mt-2">
                                    <Col>
                                        <Card.Text className="mt-0 mb-0 fs-6" style={{ color: '#727273' }}>
                                            <StarRating value={4.0} />
                                        </Card.Text>
                                    </Col>
                                </Row> */}
                                    {data.contactLink &&
                                        <Row className="mt-2 mb-2">
                                            <Row>
                                                <Card.Title className="fw-bold mt-2 fs-5" style={{ color: '#727273' }}>
                                                    Rede social
                                                </Card.Title>
                                            </Row>
                                            <Row>
                                                <Col className='col-2'>
                                                    {data.contactLink.includes('linkedin') ? (
                                                        <Button variant="outline-light" href={data.contactLink} target="_blank">
                                                            <AiFillLinkedin style={{ color: '#0072b1', fontSize: '25' }} />
                                                        </Button>
                                                    ) : data.contactLink.includes('instagram') ? (
                                                        <Button variant="outline-light" href={data.contactLink} target="_blank">
                                                            <AiFillInstagram style={{ color: '#E1306C', fontSize: '25' }} />
                                                        </Button>
                                                    ) :
                                                        data.contactLink.includes('https://www.examplo.com') ? null
                                                            :
                                                            <Button variant="outline-light" href={data.contactLink} target="_blank">
                                                            <IoShareSocialOutline style={{ color: '#0072b1', fontSize: '25' }} />
                                                        </Button>}
                                                </Col>
                                            </Row>
                                        </Row>
                                    }
                                </Col>
                            </Row>
                        </Card>
                    </>
                ) : <>
                </>
                }

            </Row>
        </Container>
    )
};

export default CardProfessorProfile;