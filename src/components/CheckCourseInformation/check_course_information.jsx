import React from "react";
import ListGroup from 'react-bootstrap/ListGroup';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faCertificate, faFileArchive, faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { useParams } from "react-router-dom";
import { CourseAPI, HttpStatus } from "./api";

const CheckCourseInformation = () => {
  const { id } = useParams();
  const [info, setInfo] = React.useState({ lessonsQtd: 0, apendicesQtd: 0})

  React.useEffect(() => {
    getCourseInfos();
  }, [id]);

  return (
    <div >
      <ListGroup>
        {
          info.lessonsQtd > 0 && 
          <ListGroup.Item><FontAwesomeIcon icon={faPlayCircle} className="me-2" />{info.lessonsQtd} { info.lessonsQtd > 1 ? 'Aulas':'Aula'}.</ListGroup.Item>
        }
        {
          info.apendicesQtd > 0 && 
          <ListGroup.Item><FontAwesomeIcon icon={faBook} className="me-2" />{info.apendicesQtd} {info.apendicesQtd > 1 ? 'arquivos':'arquivo'} de apoio.</ListGroup.Item>
        }
        <ListGroup.Item><FontAwesomeIcon icon={faCertificate} className="me-2" />Certificação de conclusão.</ListGroup.Item>
      </ListGroup>
    </div>
  );

  async function getCourseInfos() {
    const response = await CourseAPI.getCourse(id);
    if (response.status === HttpStatus.OK && !!response.data) {
      const course = response.data;
      let lessonsQtd = 0, apendicesQtd = 0;

      if (course.lessons && Array.isArray(course.lessons)) {
        lessonsQtd = course.lessons.length;

        apendicesQtd = course.lessons.reduce((count, item) => {
          if (!!item.appendix)
            return count + 1;
          else return count;
        }, 0);

        setInfo({ lessonsQtd, apendicesQtd});
      }


    }
  }
};

export default CheckCourseInformation;