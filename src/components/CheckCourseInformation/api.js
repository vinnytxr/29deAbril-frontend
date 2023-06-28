import { BASE_URL } from "../../api/default";

export const HttpStatus = {
  OK: 200,
  ERROR: 400
}

export class HttpResponse {
  status = HttpStatus.ERROR;
  data = null;

  constructor(status, data) {
    this.status = status;
    this.data = data;
  }
}

const getCourse = async (id) => {
  try {
    const url = `${BASE_URL}/courses/courses/${id}`
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()

      if (data.lessons && data.lessons.length) {
        data.lessons = data.lessons.sort((lessonA, lessonB) => lessonA.id < lessonB.id ? -1 : 1);
      }

      return new HttpResponse(HttpStatus.OK, data)
    }

    throw new Error("CourseAPI::getCourse()")
  } catch (error) {
    console.warn(error);
    return new HttpResponse(HttpStatus.ERROR, null);
  }
}

export const CourseAPI = {
  getCourse
}