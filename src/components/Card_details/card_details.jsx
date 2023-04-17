import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import "./card_details.css"

function Card_details ({image}) {
    return (
        <div className ="card-css text-center">
        <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={image.banner} />
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

export default Card_details;