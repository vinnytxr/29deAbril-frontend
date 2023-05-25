import { AUTH_DEBUG, BASE_URL, HttpResponse, HttpStatus } from "./default"

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
            return new HttpResponse(HttpStatus.ERROR, await response.json());
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
            return new HttpResponse(HttpStatus.ERROR, await response.json());
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
            return new HttpResponse(HttpStatus.ERROR, await response.json());
        }
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

const sendCodeT = async (email, newCode) => {
    if (0 == 0) {
        console.log("Válido")
        const url = `${BASE_URL}/user/send-email/`
        try {
            const options = {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({ email: email, code: newCode })
            }

            const response = await fetch(url, options);
            if (response.ok) {
                const data = await response.json();
                AUTH_DEBUG && console.log("AuthAPI::send code(): ", data.token);
                alert("E-mail enviado com sucesso!")
                return new HttpResponse(HttpStatus.OK, data);
            } else {
                alert("Falha ao enviar e-mail!")
                throw new Error("Error on send code()");
            }
        } catch (error) {
            console.warn(error)
            return new HttpResponse(HttpStatus.ERROR, null);
        }
    }

}

export const AdminAPI = {
    createCode,
    fetchCodes,
    sendCode
}