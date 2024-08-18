# Code Nest With Vlad

NestJs project made for practice, from the codeWithVlad course.

## Requirements

Runtime:

- Node.js

Database:

- PostgreSQL

OR

- Docker & Docker Compose

```bash
docker compose up --file ./docker/compose.yaml --detach
```

### Installation

```bash
yarn install

# push the prisma schema to the database
npx prisma db push
```

### Running the app

In development mode:

```bash
yarn start:dev
```

In production mode:

```bash
yarn build
yarn start
```

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

### User Profile Route

- GET `/users/me`
- Request headers:
  - Set-Cookie: string
- Response:
  - User Object
    - id: string
    - email: string
    - hash: string
    - createdAt: Date
    - updatedAt: Date
- Example:

```bash
curl  -X GET \
'http://localhost:3000/users/me' \
--header 'Accept: */*' \
--header 'Set-Cookie: connect.sid=$cookieValue; Path=/; HttpOnly'
```
