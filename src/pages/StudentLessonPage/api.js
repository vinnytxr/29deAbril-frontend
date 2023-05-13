import { BASE_URL, HttpResponse, HttpStatus } from "../../api/default"

const getLesson = async (id) => {
    try {
        const url = `${BASE_URL}/lessons/lessons/${id}`
        const options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        }
        const response = await fetch(url, options)
        if (response.ok) {
            const data = await response.json()

            if(data.prev && data.prev.banner)
                data.prev.banner = BASE_URL + data.prev.banner

            if(data.next && data.next.banner)
                data.next.banner = BASE_URL + data.next.banner

            return new HttpResponse(HttpStatus.OK, data)
        }
        throw new Error("LessonAPI::getLesson()")
    } catch (error) {
        console.warn(error);
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}

export const LessonAPI = {
    getLesson
}