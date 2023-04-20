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

// Icons
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faHeart, faShareNodes} from '@fortawesome/free-solid-svg-icons'

function CourseDetails() {

  const [data, setData] = useState({});
  const [isFetched, setIsFetched] = useState(false);
  
  const id = 1; //Alterar o curso que deseja visualizar, quando for integrar vou deixar direto na função

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(
          `http://portal-aulas-api.fly.dev/courses/courses/${id}`
        )
      ).json();
      // set state when the data received
      setData({ ...data});
      setIsFetched(true);
    };
    dataFetch();

  }, []);

  return (
    <div className="container-fluid body">
      <div className="row">
        <div className="col-2">
          {/* SideBar */}
        </div>
        <div className="col mt-5">
          <Card className="custom-bg">
            <div className="row">
              <div className="col-8">
                <div className="row mt-4 mx-2 fw-bold">
                  <Card.Title> 
                    {data.title} 
                  </Card.Title>
                </div>
                <div className="row mt-5 mx-2">
                  <Card.Text>
                    {data.description}
                  </Card.Text>
                </div>
                <div className="row mt-5 mx-2">
                    <StarRating value={4.6}/>
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

              <div className="col d-flex justify-content-center align-items-center my-2">
                <CardDetails image={data.banner} />
              </div>
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
                <div className="row">
                  <Card.Text className="my-2 ms-3">
                    {data.content}
                  </Card.Text>
                </div>
              </Card>
            </div>
          </div>

          <div className="row">
            <div className="col mt-3">
              <Card className="body-card">
                <div className="row">
                  <Card.Text className="my-2 ms-3 fw-bold">
                    O que você aprenderá:
                  </Card.Text>
                </div>
                <CheckDetails cdetails={data}/>
              </Card>
            </div>
          </div>

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
              <Card className="body-card ">
                <div className="row">
                  <Card.Text className="my-2 ms-3 fw-bold">
                    Conteúdo do curso:
                  </Card.Text>
                  <div>
                    <AccordionListCourse sessions={data}/>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails