import React from "react";
import ListGroup from 'react-bootstrap/ListGroup';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck} from '@fortawesome/free-solid-svg-icons'


const Check_details = () => {
    return (
      <div >
        <ListGroup>
        <ListGroup.Item><FontAwesomeIcon icon={faCheck} className="me-2" />Descrição 1</ListGroup.Item>
        <ListGroup.Item><FontAwesomeIcon icon={faCheck} className="me-2" />Descrição 2</ListGroup.Item>
        <ListGroup.Item><FontAwesomeIcon icon={faCheck} className="me-2" />Descrição 3</ListGroup.Item>
        <ListGroup.Item><FontAwesomeIcon icon={faCheck} className="me-2" />Descrição 4</ListGroup.Item>
        </ListGroup>
      </div>
    );
  };
  
  export default Check_details;