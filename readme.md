# Online sport equipment retail store

Backend api project build with JavaScript, NodeJS, Express and Sequelize.  
This project's frontend can be found here :  
Demo :

## Endpoints

### Signup

POST `/api/user/signup`  
Signup new user

Required field:

- Name: String
- Email: String
- password: String
- gender: "male"|"female"|"other"
- dob: the number of milliseconds since the Unix Epoch (Date.getTime()).

Response:

- Errors :
  - Invalid input value:
    - status 400
    - Error content:
    ```json
    {
      "error field": "error message"
    }
    ```
  - Email already exist:
    - status 409
- Success :
  - Status 200
  - Content : user data

### Login

POST `/api/user/signin`  
validate user and get access token  
Required field:

- email: String
- password: String

Response:

- Errors:
  - Incorrect value (status 400)
- Success :
  - Status 200
  - Content:
  ```json
  {
    "token": "token value"
  }
  ```
