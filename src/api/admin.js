import { AUTH_DEBUG, BASE_URL, HttpResponse, HttpStatus } from "./default"

const revokePermissions = async (jwt, id) => {
    console.log("token", jwt)
    console.log("id", id)
    const url = `${BASE_URL}/user/prof-permission/${id}/`;
    var errorMessage;
    try {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'jwt': jwt,
                Accept: 'application/json'
            },
            body:JSON.stringify({"permission": 0})
        }

        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::FetchCodes(): ", data.token);
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            errorMessage = await response.json();
            throw new Error("Error on FetchCodes()");
        }
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}



const fetchTeachers = async (jwt) => {
    const url = `${BASE_URL}/user/list-professors/`;
    var errorMessage;
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'jwt': jwt,
                Accept: 'application/json'
            }
        }

        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::FetchCodes(): ", data.token);
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            errorMessage = await response.json();
            throw new Error("Error on FetchCodes()");
        }
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}


const fetchCodes = async (jwt) => {
    const url = `${BASE_URL}/invitation/`;
    var errorMessage;
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'jwt': jwt,
                Accept: 'application/json'
            }
        }

        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::FetchCodes(): ", data.token);
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            errorMessage = await response.json();
            throw new Error("Error on FetchCodes()");
        }
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

const createCode = async (jwt) => {
    const url = `${BASE_URL}/invitation/`
    var errorMessage;
    try {
        const options = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                "jwt": jwt
            },
            body: JSON.stringify({
                "code": "",
                "professor": null
            })
        }

        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::CreateCode(): ", data.token);
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            errorMessage = await response.json();
            throw new Error("Error on CreateCode()");
        }
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

const sendCode = async (email, code, jwt) => {
    const url = `${BASE_URL}/send-email`
    var errorMessage;
    try {
        const options = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                jwt: jwt
            },
            body: JSON.stringify({ email: email, code: code   })
        }


        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::SendCode(): ", data.token);
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            errorMessage = await response.json();
            throw new Error("Error on SendCode()");
        }
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

export const AdminAPI = {
    createCode,
    fetchCodes,
    sendCode,
    fetchTeachers,
    revokePermissions
}