# API Endpoints

These are all the endpoints that will be included in this backend project.

The endpoints are divided into 5 categories:
  1. [Auth Endpoints ('/')](#auth-endpoints)
  2. [User Endpoints ('/user')](#user-endpoints)
  3. Project Endpoints ('/project')
  4. Form Endpoints ('/form')
  5. Form Submission Endpoints ('/main')

A successful response from the server will look like this:
```json
{
  "status": "Ok",
  "message": "Message for the developer",
  "data": {
    "All the data from server will be here"
  }
}
```

An error response from the server will look like this:
```json
{
  "status": "error",
  "error": "Error Message for the developer",
}
```

The following properties of every endpoint will be descibed in this file:
  * **Method:** *GET | POST | PATCH | DELETE*
  * **Authorized:** *(Authentication is required or not for this route) True | False*
  * **Request Parameters:** *(Requet-Body to be sent along with the request, for POST | PATCH | DELETE methods)*
  * **Query Parameters:** *(Query Parameters available in GET requests to manipulate the response from the server)*
  * **Success Status Code:** *(Status Code of a successful response) 2xx*
  * **Response Data:** *(The format of data which is expected from the server with a successful response)*

---

## Auth Endpoints
> *Base URI: `/`*

#### `/login`

- **Method**: POST
- **Authorized**: False
- **Request Parameters:**
```json
{
  "email": "test@test.com",
  "password": "mY-pAsSwOrD",
  "recaptcha_token": "Google Recaptcha Token recieved from Google"
}
```
- **Success Status Code:** 200
- **Response Data:** 
```json
{
  "name": "User Name",
  "email": "test@test.com",
  "verfied": true,
  "secret": "JWT Token"
}
```

#### `/signup`

- **Method**: POST
- **Authorized**: False
- **Request Parameters:**
```json
{
  "name": "User Name"
  "email": "test@test.com",
  "password": "mY-pAsSwOrD",
  "recaptcha_token": "Google Recaptcha Token recieved from Google"
}
```
- **Success Status Code:** 201
- **Response Data:** 
```json
{
  "name": "User Name",
  "email": "test@test.com",
  "verfied": false,
  "secret": "JWT Token"
}
```

#### `/auth/google`

- **Method**: POST
- **Authorized**: False
- **Request Parameters:**
```json
{
  "token": "Google Auth Token recieved from Google"
}
```
- **Success Status Code:** 200/201
- **Response Data:** 
```json
{
  "name": "User Name",
  "email": "test@test.com",
  "verfied": true,
  "secret": "JWT Token"
}
```

## User Endpoints
> *Base URI: `/user`*

### `/raiseverification`

- **Method**: GET
- **Authorized**: True
- **Success Status Code:** 200
- **Response Data:** `Null`

### `/verify/<secret>`

- **Method**: GET
- **Authorized**: False
- **Success Status Code:** 200
- **Response Data:** `Null`

### `/update`

- **Method**: POST
- **Authorized**: True
- **Request Parameters:**
```json
{
  "name": "User Name",
  "email": "test@test.com",
  "password": "older One",
}
```
- **Success Status Code:** 200
- **Response Data:** 
```json
{
  "name": "User Name",
  "email": "test@test.com"
}
```
