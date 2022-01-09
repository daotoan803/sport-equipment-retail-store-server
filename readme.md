# Online sport equipment retail store

Backend api project build with JavaScript, NodeJS, Express and Sequelize.  
This project's frontend can be found here :  
Demo :

## Endpoints

## User and account

### 1. Signup

POST `/api/user/signup`  
Signup new user

Required field:

- Name: String
- Email: String
- password: String
- gender: "male"|"female"|"other"
- dob: date format can be any format that new Date() except.

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
  - Content : `{"token" : "token-value"}`

### 2. Login

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

### 3. Logout everywhere

POST `/api/user/logout/all`  
This function will make all access tokens belong to current user account invalid.  
Must be logged in to use this function

Required field:

- password: String

Response:

- Errors:

  - Incorrect password (status 400)
  - Invalid token (status 401)

- Success: status 200

## ADMIN

All end point after `/api/admin` can only be access with account that have admin permission.
Default admin account is :

- email: vnsport@vnsport.com
- password: admin

### 1. Add brand

POST `/api/admin/brand`  
Required field:

- name: String

Optional field:

- image: Image file (jpeg, jpg, png, gif)

response:

- Errors:

  - Name already exists or missing name (status 400)

- Success:
  - status(200)
  - content: brand object

### 2. Add category
POST `/api/admin/category`   
Required field:

- name: String

Optional field:

- image: Image file (jpeg, jpg, png, gif)

response:

- Errors:

  - Name already exists or missing name (status 400)

- Success:
  - status(200)
  - content: brand object