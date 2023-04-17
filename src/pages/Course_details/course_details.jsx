import React, { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import "./course_details.css"

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle"

// Components
import Card_details from "../../components/Card_details/card_details"
import Check_details from "../../components/Check_details/check_details"
import Check_Course_Information from "../../components/Check_Course_Information/check_course_information"

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faHeart, faShareNodes} from '@fortawesome/free-solid-svg-icons'
import { faStar} from '@fortawesome/free-solid-svg-icons'

function CourseDetails() {

  const [data, setData] = useState({ title: "", description: "", banner: "", professor: { name: "Marcos Carpinski" } });
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(
          "http://localhost:8080/courses/courses/1"
        )
      ).json();
      // set state when the data received
      setData({ ...data, professor: { name: "Marcos Capinski" } });
      setIsFetched(true);
    };

    dataFetch();
  }, []);


  return (
    <div className="container-fluid body">
      <div className="row">
        <div className="col mt-5">
          <Card className="custom-bg">
            <div className="row">
              <div className="col">
                <div className="row mt-4 mx-2">
                  <Card.Title> {data.title} </Card.Title>
                </div>
                <div className="row mt-5 mx-2">
                  <Card.Text>
                    {data.description}
                  </Card.Text>
                </div>
                <div className="row mt-5 mx-2">
                  <Card.Text>
                    <FontAwesomeIcon style={{ color: "#ffff00", fontSize: "20" }} icon={faStar} />
                    <FontAwesomeIcon style={{ color: "#ffff00", fontSize: "20" }} icon={faStar} />
                    <FontAwesomeIcon style={{ color: "#ffff00", fontSize: "20" }} icon={faStar} />
                    <FontAwesomeIcon style={{ color: "#ffff00", fontSize: "20" }} icon={faStar} />
                    <FontAwesomeIcon style={{ color: "#ffffff", fontSize: "20" }} icon={faStar} />
                  </Card.Text>
                </div>
                <div className="row">
                  <div className="col">
                    <Card.Text className="mt-5 ms-3">
                      {data?.professor?.name}
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

              <div className="col my-2">
                <Card_details image={data} />
              </div>
            </div>
          </Card>

          <div className="row my-3">
            <div className="col">
              <Card className="body-card">
                <div className="row">
                  <Card.Text className="mt-2 ms-2">
                    O que você aprenderá:
                  </Card.Text>
                </div>
                <Check_details />
              </Card>
            </div>

            <div className="col">
              <Card className="body-card">
                <div className="row">
                  <Card.Text className="mt-2 ms-2">
                    O curso inclui:
                  </Card.Text>
                  <div>
                    <Check_Course_Information />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="row">
            <div className="col">
              Aulas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails