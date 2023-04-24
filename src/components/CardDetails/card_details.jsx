import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useParams } from "react-router-dom";

import "./card_details.css"

const getUser = () => {
    /* need integration */
    return {
        id: 2
    }
}

function CardDetails({ image , students }) {

    const alertClicked = () => {
        alert('Sucesso! vocês está inscrito no curso');
    };

    const [dados, setDados] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [cardText, setcardText] = useState('');
    const [cardText2, setcardText2] = useState('');
    const [buttonText, setButtonText] = useState('');
    let { id: courseId } = useParams();

    const verificaInsc = () => {
        const student = students?.find((student) => student.id === getUser().id);
        console.log(student);
        return student !== undefined;
    }

    useEffect(() => {
        const isStudentInscrito = verificaInsc();
        setButtonDisabled(isStudentInscrito ? true : false);
        setcardText(isStudentInscrito ? 'Oba! As aula estão disponíveis!' : 'Gostou do conteúdo do curso?');
        setcardText2(isStudentInscrito ? 'Aproveite!' : 'Inscreva-se já!');
        setButtonText(isStudentInscrito ? 'Inscrito' : 'Inscrever-se');
    }, []);

    const inscricaoCursoAPI = () => {
        const url = `https://portal-aulas-api.fly.dev/courses/courses/enroll-student/${courseId}/${getUser().id}`;
        const requestOptions = {
            method: 'POST'
        };
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                alertClicked();
                setButtonDisabled(true);
                setcardText('Oba! As aula estão disponíveis!');
                setcardText2('Aproveite!');
                setButtonText('Inscrito');
            })
            .catch(error => console.error(error));
    };
    
    return (
        <div className="card-css text-center">
            <Card style={{ width: '14rem' }}>
                <Card.Img variant="top" src={image} />
                <Card.Body>
                    <Card.Title className='text-color'>
                        {cardText}
                    </Card.Title>
                    <Card.Text className='text-color'>
                        {cardText2}
                    </Card.Text>
                    <Button onClick={inscricaoCursoAPI} disabled={buttonDisabled} className="btn-success">
                        {buttonText}
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CardDetails;