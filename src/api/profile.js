import { AUTH_DEBUG, BASE_URL, HttpResponse, HttpStatus } from "./default";

const updateUserPicture = async (userImageToUpdate, id) => {
    var body = new FormData();
    body.append("photo", userImageToUpdate);
    var errorMessage;
    const url = `${BASE_URL}/user/${id}/`
    try {
        const options = {
            method: 'PATCH',
            headers: {
                Accept: 'application/json'
            },
            body: body
        }
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            errorMessage = await response.json();
            throw new Error("Error on sendPhoto()");
        }
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

const fetchEdit = async (newName, aboutText, newLink, id) => {
    const url = `${BASE_URL}/user/${id}/`
    var errorMessage;
    try {
        const options = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({ about: aboutText, name: newName, contactLink: newLink })
        }

        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            errorMessage = await response.json();
            throw new Error("Error on fetchEdit()");
        }
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

const putInvite = async (userId, invite, jwt) => {
    const url = `${BASE_URL}/invitation/`;
    var errorMessage;
    try {
        const options = {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify({ code: invite, professor: userId }),
            headers: {
                jwt: jwt,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
        }

        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::getUserInfo(): ", data);
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            errorMessage = await response.json();
            throw new Error("Error on putInvite()");
        }
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}




export const ProfileAPI = {
    updateUserPicture,
    fetchEdit,
    putInvite
}