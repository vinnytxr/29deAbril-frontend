import React from "react";
import Card from 'react-bootstrap/Card';

import './style.css'
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { faShare, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



function CardAnotation({ notetitulo = "", notetime, notenote, notedelete, notelesson = "" }) {
  const navigate = useNavigate();

  const getTime = (seconds) => {
    //console.log(seconds)
    const m = Math.floor(seconds % 3600 / 60).toString().padStart(2, '0'),
      s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return (seconds == undefined ? "00:00" : m + ':' + s);
  }

  return (
    <div className="row">
      <div className="col">
        {(notetitulo != "") ? <p className="mb-0 fw-bold">Aula: {notetitulo}</p> : <></>}
        <p className="fs-6 mt-0 pt-0 mb-2">Tempo: {getTime(notetime)}</p>
        <p style={{ maxWidth: '40rem', overflow: 'auto' }}>{notenote}</p>
        <div className="d-flex justify-content-end">
          {(notelesson != "") ? <span style={{ cursor: 'pointer' }} className="ms-3 goto" onClick={() => { navigate("/student/lessons/" + notelesson) }}>
            Ir para aula <FontAwesomeIcon style={{ color: 'white', fontSize: '16' }} icon={faShare} />
          </span> : <></>}
          <span title="Deletar nota" style={{ cursor: 'pointer', backgroundColor: "red" }} className="ms-1 goto" onClick={notedelete}>
            <FontAwesomeIcon style={{ color: 'white', fontSize: '16' }} icon={faTrash} />
          </span>
        </div>
      </div>
    </div>



    // <Card style={{ width:'50rem', maxWidth: '50rem', overflow: 'auto' }}>
    //   <Card.Body>
    //     <Card.Title><p className="mb-1">Aula: {notetitulo}</p></Card.Title>
    //     <Row>
    //       <Col>
    //         <span style={{ cursor: 'pointer' }} className="ms-3 goto" onClick={() => { navigate("/student/lessons/" + notelesson) }}>Ir para aula <FontAwesomeIcon
    //           style={{ color: 'white', fontSize: '16' }}
    //           icon={faShare}
    //         /></span>
    //       </Col>
    //       <Col>
    //         <span style={{ cursor: 'pointer', backgroundColor: "red" }} className="ms-3 goto" onClick={notedelete}>Deletar nota <FontAwesomeIcon
    //           style={{ color: 'white', fontSize: '16' }}
    //           icon={faX}
    //         /></span>
    //       </Col>
    //     </Row>
    //     <Card.Title><p className="fs-6 mt-0 pt-0 mb-2">Tempo: {notetime}</p></Card.Title>
    //     <Card.Text>
    //       <p>{notenote}</p>
    //     </Card.Text>
    //   </Card.Body>
    // </Card>
  )
}

export default CardAnotation
