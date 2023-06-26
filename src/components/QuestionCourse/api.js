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

const getQuestions = async (id, token) => {
    try {
      const url = `${BASE_URL}/lessons/lessons/${id}/comments/list`
      const options = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          jwt: token,
        },
      }
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        return new HttpResponse(HttpStatus.OK, data)
      }
      throw new Error("QuestionAPI::getQuestions()")
    } catch (error) {
      console.warn(error);
      return new HttpResponse(HttpStatus.ERROR, null);
    }
}

const createQuestion = async (comment, id, token) => {
    try {
        const url = `${BASE_URL}/lessons/lessons/${id}/comments/`
        const options = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            jwt: token,
            Accept: 'application/json',
        },
        body: JSON.stringify({ content: comment })
        }

        const response = await fetch(url, options)
        if (response.ok) {
        const data = await response.json()
        return new HttpResponse(HttpStatus.OK, data)
        } 
        throw new Error('QuestionAPI::createQuestion()')
    } catch (error) {
      console.warn(error);
      return new HttpResponse(HttpStatus.ERROR, null);
    }
}

const createReply = async (comment, idCourse, idQuestion, token) => {
    try {
        const url = `${BASE_URL}/lessons/lessons/${idCourse}/comments/${idQuestion}/reply`
        const options = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            jwt: token,
            Accept: 'application/json',
        },
        body: JSON.stringify({ content: comment })
        }

        const response = await fetch(url, options)
        if (response.ok) {
        const data = await response.json()
        return new HttpResponse(HttpStatus.OK, data)
        } 
        throw new Error('QuestionAPI::createReply()')
    } catch (error) {
      console.warn(error);
      return new HttpResponse(HttpStatus.ERROR, null);
    }
}

const deleteQuestion = async (idCourse, idQuestion, token) => {
  try {
    const url = `${BASE_URL}/lessons/lessons/${idCourse}/comments/${idQuestion}/`
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        jwt: token,
      },
    }
    const response = await fetch(url, options)
    if (response.ok)
      return new HttpResponse(HttpStatus.OK, null)
  throw new Error("QuestionAPI::deleteQuestion()")
  } catch (error) {
    console.warn(error);
    return new HttpResponse(HttpStatus.ERROR, null);
  }
}

const updateQuestion = async (comment, idCourse, idQuestion, token) => {
  try {
    const url = `${BASE_URL}/lessons/lessons/${idCourse}/comments/${idQuestion}/`
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        jwt: token,
      },
      body: JSON.stringify({ content: comment })
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      return new HttpResponse(HttpStatus.OK, data)
    }
    throw new Error("QuestionAPI::updateQuestion()")
  } catch (error) {
    console.warn(error);
    return new HttpResponse(HttpStatus.ERROR, null);
  }
}
  
export const QuestionsAPI = {
  getQuestions,
  createQuestion,
  createReply,
  deleteQuestion,
  updateQuestion,
}