# Pokemon API

This is a back-end project that provides a RESTful API to manage a database of Pokemon. Users can consult, add, modify, and delete Pokemon entries. Additionally, users can create accounts, log in, and log out.

## Table of Contents
- Installation
- Dependencies
- API Endpoints
  - Get All Pokemon
  - Get Pokemon by ID
  - Add a New Pokemon
  - Update a Pokemon
  - Delete a Pokemon
  - Register new User
  - Log In
  - Log Out
- Examples


## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Adalab/modulo-4-evaluacion-final-bpw-ellisoalgo.git
    ```
2. Navigate to the project directory:
    ```sh
    cd modulo-4-evaluacion-final-bpw-ellisoalgo
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
4. Start the server:
    ```sh
    npm run dev
    ```

## Dependencies

- Express
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- cors

## API Endpoints

### Get All Pokemon
- **Endpoint:** `/pokemon`
- **Method:** `GET`
- **Description:** Retrieve all Pokemon from the database.

### Get Pokemon by ID
- **Endpoint:** `/pokemon/:id`
- **Method:** `GET`
- **Description:** Retrieve a single Pokemon by its ID.

### Add a New Pokemon
- **Endpoint:** `/pokemon/addnew`
- **Method:** `POST`
- **Description:** Add a new Pokemon to the database.
- **Request Body:**
```json

  {
    "name": "string",
    "photo": "string",
    "type": "string",
    "weight": "number",
    "height": "number"
  }
```
### Update a Pokemon
- **Endpoint:** `/pokemon/update/:id`
- **Method:** `PUT`
- **Description:** Update an existing Pokemon by its ID.
- **Request Body:**
```json
  {
    "name": "string",
    "photo": "string",
    "type": "string",
    "weight": "number",
    "height": "number"
  }
```

### Delete Pokemon
- **Endpoint:** `/pokemon/delete/:id`
- **Method:** `DELETE`
- **Description:** Delete a Pokemon by its ID.

### Register new User
- **Endpoint:** `/signup`
- **Method:** `POST`
- **Description:** Create a new user account with encrypted password.
- **Request Body:**
    ```json
 {
    "email": "string",
    "name": "string",
    "address": "string",
    "password": "string"
  }
```

### Log In
- **Endpoint:** `/login`
- **Method:** `POST`
- **Description:** Log in to an existing user account.
- **Request Body:**
    ```json
{
        "email": "string",
        "password": "string"
    }
```

### Log Out
- **Endpoint:** `/logout`
- **Method:** `POST`
- **Description:** Log out of the current user session.

## Examples
### Fetch Examples
**Get All Pokemon**
 ```javascript
   {
            fetch('/pokemon')
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
        }
```

**Get Pokemon by ID**
   ```javascript
 {
        fetch('/pokemon/1')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }
```

**Add a New Pokemon**
```javascript
 {
        fetch('/pokemon/addnew', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Pikachu',
                photo: 'url_to_photo',
                type: 'Electric',
                weight: 6.0,
                height: 0.4
            })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }
```

**Update a Pokemon**
  
  ```javascript
  {
        fetch('/pokemon/update/1', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Raichu',
                photo: 'url_to_new_photo',
                type: 'Electric',
                weight: 30.0,
                height: 0.8
            })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }
```

**Delete a Pokemon**
   ```javascript
 {
        fetch('/pokemon/delete/1', {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }
```
**Register New User**

 ```javascript
   {
        fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'email@email.com',
                name: 'newuser',
                address: '123 Street',
                password: 'password123'
            })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }
```

**Log in**
   ```javascript
 {
        fetch('login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'newuser',
                password: 'password123'
            })
        })      
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }
```

**Log out**
  ```javascript
  {
        fetch('/logout', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }
```
