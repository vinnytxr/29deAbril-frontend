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

            if(data.video){
                let pathVideo = data.video.split('/')
                data.video = BASE_URL + '/lessons/lessons/stream-video/' + pathVideo[pathVideo.length - 1]
                console.log('X', pathVideo, data.video)
            }

            return new HttpResponse(HttpStatus.OK, data)
        }
        throw new Error("LessonAPI::getLesson()")
    } catch (error) {
        console.warn(error);
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}


const completeLessonAsStudent = async (idStudent, idLesson) => {
    try {
        const url = `${BASE_URL}/lessons/lessons/complete-course/${idLesson}/${idStudent}`;
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
        }
        const response = await fetch(url, options)
        if (response.ok) {
            const data = await response.json()
            return new HttpResponse(HttpStatus.OK, data)
        }
        throw new Error("LessonAPI::completeLessonAsStudent()")
    } catch (error) {
        console.warn(error);
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}

export const LessonAPI = {
    getLesson,
    completeLessonAsStudent
}