import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './card_details.css'
import { useAuthContext } from '../../contexts/AuthContext'
import { BASE_URL } from '../../api/default'
import { Spinner } from 'react-bootstrap'
import { UserTools } from '../../tools/user'

function CardDetails({ image, course, onChange }) {
  const { logged, user, refreshUserOnContext } = useAuthContext()

  const alertClickedLooged = () => {
    setIsLoading(true)
    setButtonDisabled(true)
    notifyAlerta("Para realizar inscrição é necessário efetuar login!")
    setIsLoading(false)
  }

  const notifyAlerta = (texto) =>
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

  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [cardText, setcardText] = useState('')
  const [cardText2, setcardText2] = useState('')
  const [buttonText, setButtonText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { id: courseId } = useParams()
  const navigate = useNavigate()

  const verificaInsc = () => !!UserTools.getEnrolledCourseFromUser(user, parseInt(courseId));
  const isProfessor = () => (user.id === course.professor.id)

  useEffect(() => {
    if (user) {
      const isStudentInscrito = verificaInsc()
      if (isStudentInscrito) {
        onChange(true)
        setButtonDisabled(isStudentInscrito)
        setcardText2('')
        setcardText('')
        const enrolledCourseInfo = user.enrolled_courses.find((c) => c.id === parseInt(courseId));

        if (!!enrolledCourseInfo) {
          console.log("56: ", enrolledCourseInfo, user.enrolled_courses)
          let completedPercentage = 0
          if (enrolledCourseInfo.total_lessons > 0) completedPercentage = UserTools.getEnrolledCourseFromUser(user, parseInt(courseId)).completed_percentage
          setButtonText(`${completedPercentage}%`)
        }
      } else if (!isProfessor()) {
        setButtonText('Inscrever-se')
        setButtonDisabled(isStudentInscrito)
        setcardText('Gostou do conteúdo do curso?')
        setcardText2(isStudentInscrito ? 'Aproveite o curso!' : 'Inscreva-se já!')
      } else if(isProfessor()) {
        setButtonDisabled(true)
        setButtonText('Professor')
      }
        
    }
  }, [user])

  const inscricaoCursoAPI = () => {
    setIsLoading(true)
    const url = `${BASE_URL}/courses/courses/enroll-student/${courseId}/${user.id}`
    const requestOptions = {
      method: 'POST',
    }
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false)
        setButtonDisabled(true)
        // setcardText('Oba! As aula estão disponíveis!')
        // setcardText2('Aproveite!')
        refreshUserOnContext()
        // setButtonText('Inscrito')
        console.log("refreshUser")
      })
      .catch((error) => {
        setIsLoading(false)
        //console.log(error)
        notifyAlerta("Erro ao realizar inscrição, tente novamente mais tarde!")
      })
  }

  return logged && !!user && courseId ? (
    <div className="card-css text-center">
      <Card style={{ width: '14rem' }}>
        <Card.Img variant="top" src={image} />
        <Card.Body>
          <Card.Title className="text-color">{cardText}</Card.Title>
          <Card.Text className="text-color">{cardText2}</Card.Text>
            <Button
              onClick={inscricaoCursoAPI}
              disabled={buttonDisabled}
              className="btn-success"
            >
              {isLoading ? (
                <>
                  <Spinner
                    className="me-2"
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Matriculando
                </>
              ) : (
                buttonText
              )}
            </Button>
        </Card.Body>
      </Card>
    </div>
  ) : (
    <>
      <div className="card-css text-center">
        <Card style={{ width: '14rem' }}>
          <Card.Img variant="top" src={image} />
          <Card.Body>
            <Card.Title className="text-color">
              Gostou do conteúdo do curso?
            </Card.Title>
            <Card.Text className="text-color">inscreva-se ja!</Card.Text>
            <Button
              onClick={alertClickedLooged}
              disabled={buttonDisabled}
              className="btn-success"
            >
              {isLoading ? (
                <Spinner
                  className="me-2"
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                'Inscrever-se'
              )}
            </Button>
          </Card.Body>
        </Card>
      </div>
    </>
  )
}

export default CardDetails
