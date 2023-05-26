import React, { useEffect, useState } from 'react'
import { Col, Container, Row, Pagination } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL, HttpResponse, HttpStatus } from '../../api/default'
import { useAuthContext } from '../../contexts/AuthContext';
import CardCourses from '../../components/CardCourses'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons'

const BookmarksPage = () => {
    const [userData, setUserData] = useState({ name: "" });
    const [data, setData] = useState({});
    const [isFetched, setIsFetched] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const [amountPages, setAmountPages] = useState(6);
    const navigate = useNavigate();
    const { token } = useAuthContext();

    const pageSize = 6;

    const renderPagination = () => {
        let items = []
        for (let i = 1; i <= amountPages; i++) {
            if (!isFetched) {
                items.push(
                    <Pagination.Item key={i} active={i === activePage} disabled onClick={() => setActivePage(i)}>{i}</Pagination.Item>
                )
            } else {
                items.push(
                    <Pagination.Item key={i} active={i === activePage} onClick={() => setActivePage(i)}>{i}</Pagination.Item>
                )
            }
        }

        return (
            <div>
                <Pagination>
                    {amountPages > 1 && (
                        <>
                            {isFetched ?
                                <Pagination.Prev onClick={() => activePage > 1 && setActivePage((prevState) => prevState - 1)} />
                                : <Pagination.Prev disabled onClick={() => activePage > 1 && setActivePage((prevState) => prevState - 1)} />
                            }
                            {items}
                            {isFetched ? <Pagination.Next onClick={() => activePage < 3 && setActivePage((prevState) => prevState + 1)} />
                                : <Pagination.Next disabled onClick={() => activePage < 3 && setActivePage((prevState) => prevState + 1)} />}
                        </>
                    )}
                </Pagination>
            </div>
        )
    }

    useEffect(() => {
        const userData = localStorage.getItem('userData')
        if (userData != null)
            setUserData(JSON.parse(userData))
    }, [])

    const getBookmarks = async() => {
        const url = `${BASE_URL}/courses/favorites`
        try {
            const options = {
                method: 'GET',
                credentials: 'include',
                headers: {
                    // jwt: jwt,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    jwt: token
                }
            }
    
            const response = await fetch(url, options);
    
            if (response.ok) {
                const data = await response.json();
                //AUTH_DEBUG && console.log("AuthAPI::getBookmarks(): ", data);
                return new HttpResponse(HttpStatus.OK, data);
            } else throw new Error("Error on getBookmarks()");
         } catch (error) {
                console.warn(error)
                return new HttpResponse(HttpStatus.ERROR, null);
         }
    }

    useEffect(() => {
        const getStudentCourses = async () => {
            setIsFetched(false)
            try {
                const responseCourses = await getBookmarks()
                if (responseCourses.status === HttpStatus.OK) {
                    //console.log(responseCourses)
                    setData(responseCourses.data)
                    const pages = Math.ceil(responseCourses.data.count / pageSize)
                    setAmountPages(pages)
                    setIsFetched(true)
                }
            } catch (err) {
                console.log(err)
            }
        }

        getStudentCourses();
    }, [userData, activePage, pageSize])

    return (
        <Row>
            <Row className="home-card mt-5">
                <div className="col">
                    <h1 className="mb-3 fs-5 fw-bold">Booksmarks</h1>

                    {isFetched ? (
                        data.results.length ? (
                            <Row className="g-4">
                                {data.results.map((course) => (
                                    <Col xs={12} lg={4} key={course.id}>
                                        <Link to={`/student/courses/${course.id}`}>
                                            <CardCourses teste={course} />
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Container fluid>
                                <div class="d-flex align-items-center justify-content-center" style={{"height": "350px"}}>
                                    <span><h1>Você não tem nenhum curso marcado.</h1>
                                    <p className='fs-5' style={{ color: "#1dbfb0", cursor:"pointer" }} onClick={() => {navigate('/')}}>Clique aqui e procure algo do seu interesse <FontAwesomeIcon className='fs-5' style={{color:"yellow"}} icon={faHandPointLeft}/></p></span>
                                </div>
                            </Container>
                        )
                    ) : (
                        <p>Carregando...</p>
                    )}
                </div>
            </Row>
            <Row className='mt-5'>
                <Col className='d-flex justify-content-center'>
                    {renderPagination()}
                </Col>
            </Row>
        </Row>
    )
}

export default BookmarksPage;