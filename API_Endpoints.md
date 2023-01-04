# API Endpoints

These are all the endpoints that will be included in this backend project.

The endpoints are divided into 5 categories:
  1. [Auth Endpoints ('/')](#auth-endpoints)
  2. [User Endpoints ('/user')](#user-endpoints)
  3. [Project Endpoints ('/project')](#project-endpoints)
  4. [Form Endpoints ('/form')](#form-endpoints)
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
  * **Verified:** *(Account with Email verified is required or not for this route) True | False*
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
- **Verified**: False
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
- **Verified**: False
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

- **Method**: GET
- **Authorized**: False
- **Verified**: False
- **Success Status Code:** 200
- **Response Data:** 
```json
{
  "url": "Google OAuth URL"
}
```

#### `/auth/google`

- **Method**: POST
- **Authorized**: False
- **Verified**: False
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

---

## User Endpoints
> *Base URI: `/user`*

### `/raiseverification`

- **Method**: GET
- **Authorized**: True
- **Verified**: False
- **Success Status Code:** 200
- **Response Data:** `Null`

### `/verify/<secret>`

- **Method**: GET
- **Authorized**: False
- **Verified**: False
- **Success Status Code:** 200
- **Response Data:** `Null`

### `/update`

- **Method**: PATCH
- **Authorized**: True
- **Verified**: True
- **Request Parameters:**
```json
{
  "name": "User Name",
  "email": "test@test.com",
  "password": "older One",
  "recaptcha_token": "Google Recaptcha Token recieved from Google"
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

### `/updatepassword`

- **Method**: PATCH
- **Authorized**: True
- **Verified**: False
- **Request Parameters:**
```json
{
  "oldPassword": "older One",
  "newPassword": "newer One",
  "recaptcha_token": "Google Recaptcha Token recieved from Google"
}
```
- **Success Status Code:** 200
- **Response Data:** `Null`


### `/dashboard`

- **Method**: GET
- **Authorized**: True
- **Verified**: True
- **Success Status Code:** 200
- **Response Data:** 
```json
{
  "name": "User's name",
  "email": "test@test.com",
  "verified": true,
  "project_count": 2,
  "projects":[
    {
      "id": "Project Id"
      "name": "Project Name",
      "form_count": 5,
      "allowed_origins": ["http://localhost", "https://savemyform.tk"],
      "date_created": "date-of-creation"
    }
  ]
}
```

### `/self`

- **Method**: GET
- **Authorized**: True
- **Verified**: False
- **Success Status Code:** 200
- **Response Data:** 
```json
{
  "name": "User's name",
  "email": "test@test.com",
  "verified": true
}
```

---

## Project Endpoints
> *Base URI: `/project`*

### `/new`

- **Method**: POST
- **Authorized**: True
- **Verified**: True
- **Request Parameters:**
```json
{
  "name": "Project Name",
  "hasRecaptcha": true,
  "recaptchaKey": "User's project Recaptcha Key",
  "recaptchaSecret": "User's project Recaptcha Secret",
  "allowedOrigins": ["http://localhost", "https://savemyform.tk"],
  "collaborators": ["test1@test.com", "test2@test.com"],
  "recaptcha_token": "Google Recaptcha Token recieved from Google"
}
```
- **Success Status Code:** 201
- **Response Data:** 
```json
{
    "id": "project's id",
    "name": "project's name"
}
```

### `/dashboard/<id>`

- **Method**: GET
- **Authorized**: True
- **Verified**: True
- **Success Status Code:** 200
- **Response Data:** 
```json
{
  "id": "Project ID",
  "name": "Project's name",
  "is_owner": true,
  "owner":{
    "name": "Owner Name",
    "email": "owner@test.com"
  },
  "collaborators": [
    {
      "name": "Collab 1",
      "email": "test1@test.com"
    }
  ],
  "hasRecaptcha": true,
  "recaptchaKey": "User's project Recaptcha Key",
  "recaptchaSecret": "User's project Recaptcha Secret",
  "allowedOrigins": ["http://localhost", "https://savemyform.tk"],
  "form_count": 2,
  "forms":[
    {
      "name": "Form Name",
      "submission_count": 5,
      "last_updated": "date-of-last-submission",
      "date_created": "date-of-creation"
    }
  ]
}
```


### `/update/<id>`

- **Method**: PATCH
- **Authorized**: True
- **Verified**: True
- **Request Parameters:**
```json
{
  "name": "Project Name",
  "hasRecaptcha": true,
  "recaptchaKey": "User's project Recaptcha Key",
  "recaptchaSecret": "User's project Recaptcha Secret",
  "allowedOrigins": ["http://localhost", "https://savemyform.tk"],
  "collaborators": ["test1@test.com", "test2@test.com"],
  "recaptcha_token": "Google Recaptcha Token recieved from Google",
  "password": "user's password"
}
```
- **Success Status Code:** 200
- **Response Data:** 
```json
{
  "id": "Project ID"
  "name": "Project's name",
  "is_owner": true,
  "owner":{
    "name": "Owner Name",
    "email": "owner@test.com"
  },
  "collaborators": [
    {
      "name": "Collab 1",
      "email": "test1@test.com"
    }
  ],
  "hasRecaptcha": true,
  "recaptchaKey": "User's project Recaptcha Key",
  "recaptchaSecret": "User's project Recaptcha Secret",
  "allowedOrigins": ["http://localhost", "https://savemyform.tk"],
}
```

### `/delete/<id>`

- **Method**: DELETE
- **Authorized**: True
- **Verified**: True
- **Request Parameters:**
```json
{
  "recaptcha_token": "Google Recaptcha Token recieved from Google",
  "password": "user's password"
}
```
- **Success Status Code:** 200
- **Response Data:** `Null`

---

## Form Endpoints
> *Base URI: `/form`*

### `/new/<projectId>`

- **Method**: POST
- **Authorized**: True
- **Verified**: True
- **Request Parameters:**
```json
{
  "name": "Form Name",
  "hasRecaptcha": true,
  "hasFileField": false,
  "schema": {"schema": "object"}
  "recaptcha_token": "Google Recaptcha Token recieved from Google"
}
```
- **Success Status Code:** 201
- **Response Data:** 
```json
{
    "id": "form's id",
    "name": "form's name"
}
```

### `/dashboard/<id>`

- **Method**: GET
- **Authorized**: True
- **Verified**: True
- **Query Parameters**: 
```json
{
  "sort": "ascending/descending",
  "page": 5,
  "perpage": 10
}
```
- **Success Status Code:** 200
- **Response Data:** 
```json
{
  "id": "Form's ID"
  "name": "Form's name",
  "is_owner": true,
  "owner":{
    "name": "Owner Name",
    "email": "owner@test.com"
  },
  "hasRecaptcha": true,
  "submissions":{
    "total": 999,
    "page": 2,
    "per_page": 10,
    "has_next_page": true,
    "has_prev_page": true,
    "total_pages": 100,
    "data":[
      {
        "id": "Submission ID",
        "data": {"submitted": "data"},
        "file": "link to file",
        "date_created": "date-of-creation"
      }
    ]
  }
}
```


### `/update/<id>`

- **Method**: PATCH
- **Authorized**: True
- **Verified**: True
- **Request Parameters:**
```json
{
  "name": "Form Name",
  "hasRecaptcha": true,
  "hasFileField": false,
  "schema": {"schema": "object"}
  "password": "user's password",
  "recaptcha_token": "Google Recaptcha Token recieved from Google"
}
```
- **Success Status Code:** 200
- **Response Data:** 
```json
{
  "id": "Form's Id"
  "name": "Form's name",
  "is_owner": true,
  "owner":{
    "name": "Owner Name",
    "email": "owner@test.com"
  },
  "hasRecaptcha": true
}
```

### `/delete/<id>`

- **Method**: DELETE
- **Authorized**: True
- **Verified**: True
- **Request Parameters:**
```json
{
  "recaptcha_token": "Google Recaptcha Token recieved from Google",
  "password": "user's password"
}
```
- **Success Status Code:** 200
- **Response Data:** `Null`
