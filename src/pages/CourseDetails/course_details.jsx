import React, { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import "./course_details.css"

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css"

// Components
import CardDetails from "../../components/CardDetails/card_details"
import CheckDetails from "../../components/CheckDetails/check_details"
import CheckCourseInformation from "../../components/CheckCourseInformation/check_course_information"
import StarRating from "../../components/StarRating/star_rating";
import AccordionListCourse from "../../components/AccordionList/accordion_list";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import { AUTH_DEBUG, BASE_URL, HttpResponse, HttpStatus } from "../../api/default";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "../../contexts/AuthContext";

// Icons
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faHeart, faShareNodes} from '@fortawesome/free-solid-svg-icons'

function CourseDetails() {

  const { token, logged } = useAuthContext();
  const [data, setData] = useState({});
  const [isFavorited, setFavorited] = useState(false)
  const [isFetched, setIsFetched] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); //Alterar o curso que deseja visualizar, quando for integrar vou deixar direto na função

  useEffect(() => {
    // fetch data

    if (id) {
      const dataFetch = async () => {
        try {
          const response = await fetch(`${BASE_URL}/courses/courses/${id}`,  {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'jwt':token
            }})
          if (response.status < 200 || response.status >= 300) throw new Error(`Curso não encontrado ${id}`)
          //console.log(response)
          const data = await response.json();
          // set state when the data received
          if (data.lessons && data.lessons.length) {
            data.lessons = data.lessons.sort((lessonA, lessonB) => lessonA.id < lessonB.id ? -1 : 1);
          }
          //console.log(data)
          setData({ ...data });
          setFavorited(data.favorited)
          setIsFetched(true);
        } catch (err) {
          console.log("ERRO")
          navigate("/404-not-found")
        }
      }
     // console.log(data);
      dataFetch();
    }

  }, [id]);

  useEffect(()=>{console.log(data)},[data])

const manageBokomark = () => {
  if(isFavorited){
    deleteBookmark()
    setFavorited(false)
  }else{
    saveBookmark()
    setFavorited(true)
  }
}

  const saveBookmark = async () => {
    const url = `${BASE_URL}/courses/favorites/${data.id}`
    try {
      const options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'jwt': token
        }
      }

      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        alert("Curso adicionado as marcações.")
        //AUTH_DEBUG && console.log("AuthAPI::ChangePassword(): ", data.token);
        return new HttpResponse(HttpStatus.OK, data);
      } else throw new Error("Error on ChangePassword()");
    } catch (error) {
      console.warn(error)
      return new HttpResponse(HttpStatus.ERROR, null);
    }
  }

  const deleteBookmark = async () => {
    const url = `${BASE_URL}/courses/favorites/${data.id}/remove`
    try {
      const options = {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'jwt': token
        }
      }

      const response = await fetch(url, options);
      if (response.ok) {
        alert("Curso removido das marcações.")  
        //AUTH_DEBUG && console.log("AuthAPI::ChangePassword(): ", data.token);
        return new HttpResponse(HttpStatus.OK);
      } else throw new Error("Error on ChangePassword()");
    } catch (error) {
      console.warn(error)
      return new HttpResponse(HttpStatus.ERROR, null);
    }
  }

  return (
    <Container flex className="mb-4">
      <div className="row">
        <div className="col mt-5">
          <Card className="custom-bg">
            <div className="row">
              <div className="col-8">
                <div className="row mt-4 mx-2 fw-bold">

                  <Card.Title>
                   { logged && <Button onClick={() => manageBokomark()} variant="outline-light" className="mb-2">
                      <FontAwesomeIcon style={{ fontSize: '18px' }} icon={faBookmark} />
                    </Button> }
                    <p>{data.title}</p>
                  </Card.Title>

                </div>
                <div className="row mt-5 mx-2">
                  <Card.Text>
                    {data.description}
                  </Card.Text>
                </div>
                <div className="row mt-5 mx-2">
                  <StarRating value={4.6} />
                </div>
                <div className="row">
                  <div className="col">
                    <Card.Text className="mt-5 ms-3">
                      Professor: {data?.professor?.name}
                    </Card.Text>
                  </div>
                  {/* <div className="col mt-5 mx-5">
                      <FontAwesomeIcon style={{ color: "#ffffff", fontSize: "20" }} icon={faHeart} className="mx-5" />
                    </div>
                    <div className="col mt-5">
                      <FontAwesomeIcon style={{ color: "#ffffff", fontSize: "20" }} icon={faShareNodes}/> 
                    </div> */}
                </div>
              </div>

              {data && data?.students &&
                <div className="col d-flex justify-content-center align-items-center my-2">
                  <CardDetails image={data.banner} course={data} />
                </div>
              }
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
                  <Card.Text className="my-2">
                    {data.content}
                  </Card.Text>
                </div>
              </Card>
            </div>
          </div>


          {data?.learnings?.length ?
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
            </div> : <></>
          }


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
              {data?.lessons?.length ?
                <Card className="body-card ">
                  <div className="row">
                    <Card.Text className="my-2 ms-3 fw-bold">
                      Aulas do curso:
                    </Card.Text>
                    <div>
                      <AccordionListCourse sessions={data} />
                    </div>
                  </div>
                </Card> : <></>
              }
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CourseDetails