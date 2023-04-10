import React from "react";
import Card from 'react-bootstrap/Card';

// Style
import './style.css'

function CardCourses({ teste }) {

  let description = teste.description;    
  if (description.length > 100) {
      description = description.substring(0, 100);
  }

  return (
          <Card className="m-2 cardAula" style={{ width: '15rem' }}>
            <Card.Img className="cardAula-img-top" variant="top" src={teste.thumbnail} />
            <Card.Body>
              <Card.Title className="cardAula-title">{teste.title}</Card.Title>
              <Card.Text className="cardAula-description">
                {description}
              </Card.Text>
            </Card.Body>
            <Card.Footer className="cardAula-footer">
              <p>Commodo do ullamco esse laborum.</p>
            </Card.Footer>
            <a href="https://www.google.com" target="_blank" class="stretched-link" rel="noreferrer" />
          </Card>
  





  )
}

export default CardCourses