import React from "react";
import Card from 'react-bootstrap/Card';
import noImage from '../../assets/no-image.png'

import './style.css'
import { useAuthContext } from "../../contexts/AuthContext";
import { UserTools } from "../../tools/user";

function CardCourses({ teste, showProgress = false }) {

  const { user } = useAuthContext();
  const [courseInfoFromUserEnrolledCourse, setCourseInfoPromUserEnrolledCourse] = React.useState(null);

  React.useEffect(() => {
    const courseInfoFromUser = UserTools.getEnrolledCourseFromUser(user, teste.id);
    setCourseInfoPromUserEnrolledCourse(courseInfoFromUser);
  }, [user])

  let description = teste.description;
  if (description.length > 100) {
    description = description.substring(0, 100);
  }

  return (
    <div className="col-12 col-sm-12 col-md-12 d-flex justify-content-center align-items-center my-2">
      <Card className="cardAula" style={{ width: '100%' }}>
      <Card.Img className="cardAula-img-top" variant="top" src={teste?.banner ?? noImage} style={{minHeight: '200px', objectFit: 'cover'}} />
        {
          courseInfoFromUserEnrolledCourse &&
          <span className="completed-percentage-flag">{courseInfoFromUserEnrolledCourse.completed_percentage}%</span>
        }
        <Card.Body>
          <Card.Title className="cardAula-title">
            {teste.title}
          </Card.Title>
          <Card.Text className="cardAula-description" style={{textAlign: "justify"}}>
            {description}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}

export default CardCourses;