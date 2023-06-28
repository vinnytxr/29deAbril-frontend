import React from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Accordion, ListGroupItem } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import "./accordion_list.css";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../../contexts/AuthContext";

const isAValidLessonResume = (obj) => {
  if (typeof obj !== 'object') return false;
  if (
    !Number.isInteger(obj.id) ||
    typeof obj.title !== 'string' ||
    typeof obj.banner !== 'string' ||
    typeof obj.content !== 'string' ||
    !Array.isArray(obj.users_who_completed)
  ) return false;
  if (!!obj.users_who_completed.length && !Number.isInteger(obj.users_who_completed[0]))
    return false;
  return true;
}

const userCompleteTheLesson = (lesson, loggedUserId) => {
  if (lesson.users_who_completed.includes(loggedUserId))
    return true;
  return false;
}

function AccordionListCourse({ sessions }) {
  const { lessons } = sessions;
  const { user, logged } = useAuthContext();
  const navigate = useNavigate();

  return (
    <Accordion alwaysOpen className="lesson-accordion">
      {lessons?.filter(isAValidLessonResume).map(item => (
        <Card key={item.id}>
          <Accordion.Item eventKey={item.id.toString()} key={item.id}>
            <Accordion.Header className='accordion-header'>
              <section className="lesson-on-lesson-list">
                <span>{item.title}</span>
                {
                  user && logged && userCompleteTheLesson(item, user.id) &&
                  <span className="completed-flag">Concluído</span>
                }
              </section>
            </Accordion.Header>
            <Accordion.Body>
              <ListGroup>
                <ListGroupItem action onClick={() => navigate(`/student/lessons/${item.id}`)}>
                  <Row>
                    <Col className="col-2  d-flex flex-column justify-content-center">
                      <img src={item.banner} alt="" className="expanded-image" />
                    </Col>
                    <Col className="col-10">
                      <p>{item.content}</p>
                    </Col>
                  </Row>
                </ListGroupItem>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        </Card>
      ))}
    </Accordion>
  );
};

export default AccordionListCourse