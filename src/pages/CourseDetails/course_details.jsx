import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import { Modal } from 'react-bootstrap'
import './course_details.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import CardDetails from '../../components/CardDetails/card_details'
import CheckDetails from '../../components/CheckDetails/check_details'
import CheckCourseInformation from '../../components/CheckCourseInformation/check_course_information'
import StarRating from '../../components/StarRating/star_rating'
import StarCourseRating from '../../components/StarCourseRating/star_course'
import AccordionListCourse from '../../components/AccordionList/accordion_list'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button, Container } from 'react-bootstrap'
import { BASE_URL, HttpResponse, HttpStatus } from '../../api/default'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { useAuthContext } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BookmarkAPI } from '../../api/bookmark'

function CourseDetails() {
  const { token, logged, user, refreshUserOnContext } = useAuthContext()
  const [data, setData] = useState({})
  const [isFavorited, setFavorited] = useState(false);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [allowFavorite, setAllowFavorite] = useState(true)

  const handleRatingChange = (newValue) => {
    setRating(newValue);
  };

  const handleIsStudent = (newValue) => {
    setIsStudent(newValue);
  };

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

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      const dataFetch = async () => {
        try {
          const response = await fetch(`${BASE_URL}/courses/courses/${id}`, {
            method: 'GET',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
              jwt: token,
            },
          })
          if (response.status < 200 || response.status >= 300)
            throw new Error(`Curso não encontrado ${id}`)
          const data = await response.json()
          if (data.lessons && data.lessons.length) {
            data.lessons = data.lessons.sort((lessonA, lessonB) =>
              lessonA.id < lessonB.id ? -1 : 1
            )
          }
          //console.log("Favorite ", user.favorite_courses.includes(data.id))
          setFavorited(logged && user.favorite_courses.includes(data.id))
          setData({ ...data })
        } catch (err) {
          navigate('/404-not-found')
        }
      }
      dataFetch()
    }
  }, [id])

  const manageBookmark = async () => {
    setAllowFavorite(false);
    if (isFavorited) {
      const response = await BookmarkAPI.deleteBookmark(data.id, token);
      if (response.status === HttpStatus.OK) {
        setFavorited(false);
        notifySuccess('Curso removido das suas marcações.');
      } else {
        notifyError("Falha ao remover curso das marcações.");
      }
    } else {
      const response = await BookmarkAPI.saveBookmark(data.id, token);
      if (response.status === HttpStatus.OK) {
        setFavorited(true);
        notifySuccess('Curso adicionado as suas marcações.');
      } else {
        notifyError("Falha ao adicionar curso das marcações.");
      }
    }
    refreshUserOnContext();
    setAllowFavorite(true);
  }


  const isUserRating = async () => {
    const url = `${BASE_URL}/courses/ratings/check-rating/${data.id}/${user.id}`
    try {
      const options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        if (data.result === 1) { return setUserRating(true) }
        return new HttpResponse(HttpStatus.OK, data)
      } else throw new Error('Error on isUserRating()')
    } catch (error) {
      console.warn(error)
      return new HttpResponse(HttpStatus.ERROR, null)
    }
  }

  const updateRating = async () => {
    const url = `${BASE_URL}/courses/ratings/update-rating/${data.id}/${user.id}`
    try {
      const options = {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ rating: rating })
      }

      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        notifySuccess('Sucesso, agradecemos a sua avaliação!')
        return new HttpResponse(HttpStatus.OK, data)
      } else throw new Error('Error on updateRating()')
    } catch (error) {
      console.warn(error)
      return new HttpResponse(HttpStatus.ERROR, null)
    }
  }

  const createRating = async () => {
    const url = `${BASE_URL}/courses/ratings`
    try {
      const options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ user: user.id, course: data.id, rating: rating })
      }

      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        notifySuccess('Sucesso, agradecemos a sua avaliação!')
        return new HttpResponse(HttpStatus.OK, data)
      } else throw new Error('Error on createRating()')
    } catch (error) {
      console.warn(error)
      return new HttpResponse(HttpStatus.ERROR, null)
    }
  }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container flex="true" className="pageDetails course-details mb-4">
      <div className="row">
        <div className="row mt-2">
          <div className="col">
            {
              user && data && user.id === data?.professor?.id &&
              <div className="col-md-12 mt-3">
                <span className='flag-is-professor'>Você é o professor deste curso</span>
              </div>
            }
          </div>
          {isStudent && user && data && user.id !== data?.professor?.id &&
            <div className="col text-end">
              <Button className="pageDetails mt-2 submit-rating" onClick={() => { handleShow(); isUserRating(); }}>
                Avaliar curso
              </Button>
              
              <Modal className="pageDetails" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Avaliar curso</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-center align-items-center">
                  Ficamos felizes pela conclusão de seu aprendizado!<br>
                  </br> Avalie o curso e nos ajude com seu feedback!
                </Modal.Body>
                <Modal.Body className="d-flex justify-content-center align-items-center">
                  <StarCourseRating value={data.rating} onChange={handleRatingChange} />
                </Modal.Body >
                <Modal.Footer>
                  <Button className="pageDetails mt-3 cancel-rating" onClick={handleClose}>
                    Cancelar
                  </Button>
                  {!userRating ? (
                    <>
                      <Button className="pageDetails mt-3 submit-rating" onClick={() => { handleClose(); createRating(); }}>
                        Salvar
                      </Button>
                    </>
                  ) : (<>
                    <Button className="pageDetails mt-3 submit-rating" onClick={() => { handleClose(); updateRating(); }}>
                      Salvar
                    </Button>
                  </>)
                  }
                </Modal.Footer>
              </Modal>
            </div>
          }
        </div>

        <div className="col mt-1">
          <Card className="custom-bg">
            <div className="row">
              <div className="col-8 mt-2 mx-1">
                <Card.Title>
                  {logged && (
                    <Button
                      onClick={() => manageBookmark()}
                      variant="outline-light"
                      disabled={!allowFavorite}
                      className="button-bookmark"
                    >
                      <FontAwesomeIcon
                        color={isFavorited ? 'gold' : 'lightwhite'}
                        opacity={isFavorited ? 1 : 0.7}
                        icon={faBookmark}
                      />
                    </Button>
                  )}
                </Card.Title>
                <div className="row mt-4 mx-2 fw-bold fs-4">
                  <p>{data.title}</p>
                </div>
                <div className="row mt-5 mx-2">
                  <Card.Text>{data.description}</Card.Text>
                </div>
                <div className="row mt-5 mx-2">
                  <StarRating value={data.rating} />
                </div>
                <div className="row">
                  <div className="col">
                    <Card.Text className="mt-5 ms-3 mb-2">
                      Professor:
                        <Link to={`/student/courses/professor/${data?.professor?.id}`}>
                          <strong className='mx-2 link'>{data?.professor?.name}</strong>
                        </Link>
                    </Card.Text>
                  </div>
                </div>
              </div>

              {data && data?.students && (
                <div className="col d-flex justify-content-center align-items-center my-2">
                  <CardDetails image={data.banner} course={data} onChange={handleIsStudent} />
                </div>
              )}
            </div>
          </Card>

          <div className="row">
            <div className="col mt-3">
              <Card className="body-card">
                <div className="row">
                  <Card.Text className="my-2 ms-3 fw-bold">
                    Sobre o curso:
                  </Card.Text>
                </div>
                <div className="row mx-1">
                  <Card.Text className="my-2">{data.content}</Card.Text>
                </div>
              </Card>
            </div>
          </div>

          {data?.learnings?.length ? (
            <div className="row">
              <div className="col mt-3">
                <Card className="body-card">
                  <div className="row">
                    <Card.Text className="my-2 ms-3 fw-bold">
                      O que você aprenderá:
                    </Card.Text>
                  </div>
                  <CheckDetails cdetails={data} />
                </Card>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className="row">
            <div className="col mt-3">
              <Card className="body-card ">
                <div className="row">
                  <Card.Text className="my-2 ms-3 fw-bold">
                    O curso inclui:
                  </Card.Text>
                  <div>
                    <CheckCourseInformation />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="row">
            <div className="col mt-3">
              {data?.lessons?.length ? (
                <Card className="body-card ">
                  <div className="row">
                    <Card.Text className="my-2 ms-3 fw-bold">
                      Aulas do curso:
                    </Card.Text>
                    <div>
                      <AccordionListCourse sessions={data} />
                    </div>
                  </div>
                </Card>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default CourseDetails
