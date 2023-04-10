import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ProgressBar from 'react-bootstrap/ProgressBar';

import './CardCourses.css'



function CardCourses({ teste }) {



  let description = teste.description;
  if (description.length > 100) {
    description = description.substring(0, 100);
  }

  return (
    <>
      <Card className="m-2 cardAula" style={{ width: '15em' }}>
        <Card.Img className="cardAula-img-top" variant="top" src={teste.thumbnail} />
        <Card.Body className="cardAula-body">
          <Card.Title className="cardAula-title">{teste.title}</Card.Title>
        </Card.Body>
        <Card.Footer className="cardAula-footer">
          <ProgressBar style={{height:"2px"}} variant="success" now={40} />
          <p>40%</p>
        </Card.Footer>
        <a href="https://www.google.com" target="_blank" class="stretched-link" />
      </Card>
    </>







  )
}

export default CardCourses