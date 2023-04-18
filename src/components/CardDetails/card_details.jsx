import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import "./card_details.css"

function CardDetails ({image}) {
    return (
        <div className ="card-css text-center">
        <Card style={{ width: '14rem' }}>
        <Card.Img variant="top" src={image} />
        <Card.Body>
            <Card.Title className='text-color'>
                Gostou do conteúdo do curso?
            </Card.Title>
            <Card.Text className='text-color'>
                Inscreva-se já!
            </Card.Text>
            <Button disabled className="bottom-color">Inscreva-se</Button>
        </Card.Body>
        </Card>
        </div>
    );
};

export default CardDetails;