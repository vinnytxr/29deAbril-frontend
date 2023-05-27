import React, { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import { Container } from "react-bootstrap";
import "./course_rating.css"

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css"

// Icons
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faHeart, faShareNodes} from '@fortawesome/free-solid-svg-icons'

function CourseRating() {

  return (
    <Container flex className="mb-4">
      <Card>
        <Card.Header>Avaliar curso</Card.Header>
      </Card>
    </Container>
  );
};

export default CourseRating