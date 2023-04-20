import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import "./card_details.css"

function CardDetails ({image}) {

    const alertClicked = () => {
        alert('Sucesso! vocês está inscrito no curso');
    };

    const [dados, setDados] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    
    const id_a = 2;
    const id_c = 2;

    const inscricaoCursoAPI = () => {
    const url = `https://portal-aulas-api.fly.dev/courses/courses/enroll-student/${id_c}/${id_a}`;
    const requestOptions = {
      method: 'POST'
    };
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => {console.log(data);
        alertClicked();
        setButtonDisabled(true);})
      .catch(error => console.error(error));
    };
    
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
            <Button onClick={inscricaoCursoAPI} disabled={buttonDisabled} className="bottom-color">
                Inscreva-se
            </Button>
        </Card.Body>
        </Card>
        </div>
    );
};

export default CardDetails;