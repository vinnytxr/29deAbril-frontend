//  export const BASE_URL = 'https://api.29deabril.cloud';
export const BASE_URL = 'http://localhost:8401';

export const AUTH_DEBUG = true

/*
  HttpStatus e HttpResponse são utilizados em várias partes
  do projeto, ao altera-ĺos verificar se as demais partes continuaram funcionando!
*/
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

export const Roles = {
  STUDENT: 1,
  PROFESSOR: 2,
  ADMIN: 3
}
