# API Endpoints

These are all the endpoints that will be included in this backend project.

The endpoints are divided into 5 categories:
  1. Auth Endpoints ('/')
  2. User Endpoints ('/user')
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
  * **Response Data:** *(The format of data which is expected from the server with a successful response)*


## Auth Endpoints
> *Base URI: `/`*

#### `/login`

- **Method**: POST
- **Authorized**: False
