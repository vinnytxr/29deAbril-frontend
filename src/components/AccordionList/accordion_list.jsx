import React, { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Accordion, ListGroupItem } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import "./accordion_list.css";

function AccordionListCourse () { 
    const alertClicked = () => {
      alert('Você clicou em uma aula');
    };

    const [data, setData] = useState({});
    const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
      // fetch data
      const dataFetch = async () => {
        const data = await (
          await fetch(
            "http://portal-aulas-api.fly.dev/lessons/lessons"
          )
        ).json();
        // set state when the data received
        setData({ ...data});
        console.log(data);
        setIsFetched(true);
      };
      dataFetch();
    }, []);

    if (!isFetched || !data.results) {
      return <p>Carregando...</p>;
    }

    return (
        <Accordion alwaysOpen>
          {data.results.map(item => (
            <Card>
              <Accordion.Item eventKey={item.id.toString()} key={item.id}>
              <Accordion.Header>{item.title}</Accordion.Header>
              <Accordion.Body>
                <ListGroup>
                  <ListGroupItem action onClick={alertClicked}>
                    <Row>
                      <Col className="col-2">
                        <img src={item.banner} alt="" className="expanded-image" />
                      </Col>
                      <Col className="col-10">
                        <p>{item.content}</p>
                      </Col>
                    </Row>
                  </ListGroupItem>
                </ListGroup>
              </Accordion.Body>
              </Accordion.Item>
            </Card>
          ))}
        </Accordion>
    );
  };
  
  export default AccordionListCourse