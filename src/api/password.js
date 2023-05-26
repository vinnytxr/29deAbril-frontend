import { AUTH_DEBUG, BASE_URL, HttpResponse, HttpStatus } from "./default";

const fetchChange = async (oldPassword, newPassword, jwt) => {
    const url = `${BASE_URL}/change-password`
    var errorMessage;
    try {
        const options = {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json', 
                'jwt': jwt
            },
            body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
        }

        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::ChangePassword(): ", data.token);
            return new HttpResponse(HttpStatus.OK, data);
        } else{ 
            errorMessage =  await response.json();
            throw new Error("Error on ChangePassword()");
            return new HttpResponse(HttpStatus.ERROR, await response.json());
        }
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

const fetchRecovery = async (email) => {
    const url = `${BASE_URL}/generate-password`
    var errorMessage;
    try {
        const options = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({ email: email})
        }

        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::RecoverPassword(): ", data.token);
            return new HttpResponse(HttpStatus.OK, data);
        } else{
            errorMessage =  await response.json();
            throw new Error("Error on RecoverPassword()");
            return new HttpResponse(HttpStatus.ERROR, await response.json());
        }
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

export const PasswordAPI = {
   fetchChange,
   fetchRecovery
}