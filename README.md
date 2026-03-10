# LeetLab

LeetLab is a full-stack coding platform inspired by LeetCode. Users can authenticate, solve problems in a browser-based editor, run code against test cases through Judge0, review submissions, and organize problems into playlists.

## What It Includes

- JWT authentication with secure HTTP-only cookies
- Problem solving flow with Monaco Editor
- Code execution for Python, Java, JavaScript, and C++
- Submission history with runtime, memory, and verdict data
- Admin-only problem creation and maintenance
- User playlists for grouping practice problems

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS v4
- DaisyUI
- Zustand
- React Router DOM v7
- React Hook Form + Zod
- Monaco Editor

### Backend

- Node.js
- Express 5
- Prisma 7
- PostgreSQL
- JWT + bcryptjs
- Judge0 for code execution

## Project Structure

```text
Leet/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── prisma.config.ts
│   ├── src/
│   │   ├── controllers/
│   │   ├── libs/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layout/
│   │   ├── lib/
│   │   ├── page/
│   │   └── store/
│   └── package.json
└── README.md
```

## How It Works

```text
React frontend
    |
    |  HTTP requests with cookies
    v
Express API
    |
    +--> PostgreSQL via Prisma
    |
    +--> Judge0 API for code execution
```

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL database
- Docker and Docker Compose for Judge0

## Local Setup

### 1. Install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 2. Configure backend environment

Create `backend/.env` with these keys:

```env
PORT=8080
DATABASE_URL=your_postgresql_connection_string
ACCELERATE_URL=your_prisma_accelerate_url
JWT_SECRET=your_jwt_secret
JUDGE0_API_URL=http://localhost:2358
```

Notes:

- `PORT` should stay aligned with the frontend's development API base URL, which currently points to `http://localhost:8080/api/v1`.
- `ACCELERATE_URL` is used by the Prisma client in this repo.

### 3. Apply database migrations

```bash
cd backend
npx prisma migrate dev
```

### 4. Start Judge0

This app expects a self-hosted Judge0 instance.

```bash
wget https://github.com/judge0/judge0/releases/download/v1.13.1/judge0-v1.13.1.zip
unzip judge0-v1.13.1.zip
cd judge0-v1.13.1
docker-compose up -d db redis
docker-compose up -d
```

After startup, Judge0 should be reachable at `http://localhost:2358`.

### 5. Run the backend

```bash
cd backend
npm run dev
```

### 6. Run the frontend

```bash
cd frontend
npm run dev
```

Frontend development server:

- `http://localhost:5173`

Backend development server:

- `http://localhost:8080`

## Authentication Model

- Registration and login issue a JWT in an HTTP-only `jwt` cookie
- Protected routes read the cookie through backend middleware
- Admin-only problem routes require the authenticated user to have role `ADMIN`

## Main Frontend Pages

- `/login` and `/signup` for authentication
- `/` for the problem list
- `/problem/:id` for solving a single problem
- `/playlist` for all playlists
- `/playlist/:playlistId` for playlist details
- `/profile` for user profile data
- `/add-problem` for admin problem creation

## API Overview

Base URL: `http://localhost:8080/api/v1`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/check`

### Problems

- `GET /problems/get-all-problems`
- `GET /problems/get-problem/:id`
- `GET /problems/get-solved-problems`
- `POST /problems/create-problem`
- `PUT /problems/update-problem/:id`
- `DELETE /problems/delete-problem/:id`

### Code Execution

- `POST /execute-code/`

### Submissions

- `GET /submission/get-all-submissions`
- `GET /submission/get-submission/:problemId`
- `GET /submission/get-submissions-count/:problemId`

### Playlists

- `GET /playlist/`
- `GET /playlist/:playlistId`
- `POST /playlist/create-playlist`
- `POST /playlist/:playlistId/add-problem`
- `DELETE /playlist/:playlistId`
- `DELETE /playlist/:playlistId/remove-problem`

## Database Models

The Prisma schema currently centers on these models:

- `User`
- `Problem`
- `Submission`
- `TestCasesResult`
- `ProblemSolved`
- `Playlist`
- `ProblemsInPlayList`

## Development Notes

- The frontend uses `withCredentials: true`, so the backend must keep CORS credentials enabled in development.
- The backend currently allows frontend origins `http://localhost:5173` and `http://localhost:5174`.
- Prisma configuration is split between `backend/prisma/schema.prisma` and `backend/prisma.config.ts`.

## Scripts

### Backend

- `npm run dev` - start the Express server with Nodemon

### Frontend

- `npm run dev` - start Vite
- `npm run build` - create a production build
- `npm run preview` - preview the production build
- `npm run lint` - run ESLint
