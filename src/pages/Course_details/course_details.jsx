import React from "react";
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
import { faHeart, faShareNodes} from '@fortawesome/free-solid-svg-icons'

function CourseDetails() {

    return (
      <div className="container-fluid body">
        <div class="row">
          {/* <div class="col col-md-2">
            <SideNav />
          </div> */}

          <div class="col mt-5">
            <Card className="custom-bg">
              <div class="row">
                <div class="col">
                  <div class="row mt-4 mx-2">
                  <Card.Title> Nome do curso </Card.Title>
                  </div>
                  <div class="row mt-5 mx-2">
                    <Card.Text>
                      Some quick example text to build on the card title and make up the
                      bulk of the card's content.
                    </Card.Text>
                  </div>
                  <div class="row mt-5 mx-2">
                  <Card.Text>
                        Rating imprementar: .........
                      </Card.Text>
                  </div>
                  <div class="row">
                    <div class="col">
                      <Card.Text class="mt-5 ms-3">
                        Professor: .........
                      </Card.Text>
                    </div>
                    {/* <div class="col mt-5 mx-5">
                      <FontAwesomeIcon style={{ color: "#ffffff", fontSize: "20" }} icon={faHeart} className="mx-5" />
                    </div>
                    <div class="col mt-5">
                      <FontAwesomeIcon style={{ color: "#ffffff", fontSize: "20" }} icon={faShareNodes}/> 
                    </div> */}
                  </div>
                </div>

                <div class="col my-2">
                  <Card_details />
                </div>
              </div>
            </Card> 

              <div class="row my-3">
                <div class="col">
                  <Card className="body-card">
                    <div class="row">
                      <Card.Text class="mt-2 ms-2">
                        O que você aprenderá:
                      </Card.Text>
                    </div>
                      <Check_details />
                  </Card>
                </div>

                <div class="col">
                  <Card className="body-card">
                    <div class="row">
                      <Card.Text class="mt-2 ms-2">
                        O curso inclui:
                      </Card.Text>
                      <div>
                        <Check_Course_Information />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  Aulas
                </div>
              </div>      
          </div>
        </div>
      </div>
    );
  };

  export default CourseDetails