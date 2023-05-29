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

const updateLesson = async (body, lessonId) => {
  try {
    const url = `${BASE_URL}/lessons/lessons/${lessonId}`
    const options = {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
      },
      body: body,
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      return new HttpResponse(HttpStatus.OK, data)
    }
    throw new Error("CourseAPI::updateLesson()")
  } catch (error) {
    console.warn(error);
    return new HttpResponse(HttpStatus.ERROR, null);
  }
}

const getLesson = async (lessonId) => {
  try {
    const url = `${BASE_URL}/lessons/lessons/${lessonId}`
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      return new HttpResponse(HttpStatus.OK, data)
    }

    throw new Error("LessonAPI::getLesson()")
  } catch (error) {
    console.warn(error);
    return new HttpResponse(HttpStatus.ERROR, null);
  }
}

const deleteLesson = async (id) => {
  try {
    const url = `${BASE_URL}/lessons/lessons/${id}`
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    }
    const response = await fetch(url, options)
    if (response.ok)
      return new HttpResponse(HttpStatus.OK, null)
    throw new Error("CourseAPI::deleteLesson()")
  } catch (error) {
    console.warn(error);
    return new HttpResponse(HttpStatus.ERROR, null);
  }
}

export const LessonAPI = {
  updateLesson,
  getLesson,
  deleteLesson,
}