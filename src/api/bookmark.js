import { AUTH_DEBUG, BASE_URL, HttpResponse, HttpStatus } from "./default"

const saveBookmark = async (id, jwt) => {
    const url = `${BASE_URL}/courses/favorites/${id}`
    var errorMessage;
    try {
      const options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          jwt: jwt,
        },
      }

      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        return new HttpResponse(HttpStatus.OK, data)
    } else {
        errorMessage = await response.json();
        throw new Error("Error on saveBookmark()");
    }
    } catch (error) {
      console.warn(error)
      return new HttpResponse(HttpStatus.ERROR, errorMessage)
    }
  }

  const deleteBookmark = async (id, jwt) => {
    const url = `${BASE_URL}/courses/favorites/${id}/remove`
    var errorMessage;
    try {
      const options = {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          jwt: jwt,
        },
      }
      const response = await fetch(url, options)
      if (response.ok) {
        return new HttpResponse(HttpStatus.OK)
    } else {
        errorMessage = await response.json();
        throw new Error("Error on deleteBookmark()");
    }
    } catch (error) {
      console.warn(error)
      return new HttpResponse(HttpStatus.ERROR, errorMessage)
    }
  }


  export const BookmarkAPI = {
    saveBookmark,
    deleteBookmark
}