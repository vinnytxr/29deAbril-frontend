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
    const courseInfoFromUser = UserTools.getEnrolledCourseFromUser();
    setCourseInfoPromUserEnrolledCourse(courseInfoFromUser);
  }, [user])

  let description = teste.description;
  if (description.length > 100) {
    description = description.substring(0, 100);
  }

  return (
    <Card className="cardAula" style={{ width: '15rem' }}>
      100%
      <Card.Img className="cardAula-img-top" variant="top" src={teste?.banner ?? noImage} />
      <Card.Body>
        <Card.Title className="cardAula-title">{teste.title}</Card.Title>
        <Card.Text className="cardAula-description">
          {description}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default CardCourses
