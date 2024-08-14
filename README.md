# Code Nest With Vlad

NestJs project made for practice, from the codeWithVlad course.

## API Usage

### Signup Route

- POST `/auth/signup`
- Request body:
  - email: string
  - password: string
- Response:
  - User Object
    - id: string
    - email: string
    - hash: string
    - createdAt: Date
    - updatedAt: Date
- Example:

```bash
curl  -X POST \
'http://localhost:3000/auth/signup' \
--header 'Accept: */*' \
--header 'Content-Type: application/json' \
--data-raw '{
"email": "titux@lgdweb.fr",
"password": "123456"
}'
```

### Login Route

- POST `/auth/login`
- Request body:
  - email: string
  - password: string
- Response:
  - User Object
    - id: string
    - email: string
    - hash: string
    - createdAt: Date
    - updatedAt: Date
- Example:

```bash
curl  -X POST \
'http://localhost:3000/auth/login' \
--header 'Accept: */*' \
--header 'Content-Type: application/json' \
--data-raw '{
"email": "titux@lgdweb.fr",
"password": "123456"
}'
```
