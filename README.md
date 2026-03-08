# 🚀 LeetLab - LeetCode Clone

LeetLab is a full-stack, LeetCode-like coding platform that allows users to solve programming problems, execute code in multiple languages, and organize problems into custom playlists. Built with modern web technologies, it provides a real coding environment with test case execution, submission tracking, and problem management similar to competitive programming platforms.

---

## 📋 Features

- 👤 **User Authentication**: Secure JWT-based sign up, login, and profile management (with bcrypt hashing).
- 💻 **Real-Time Code Execution**: Execute code securely using a self-hosted Judge0 API. Supports JavaScript, Python, Java, and C++.
- 🧪 **Test Case Validation**: Run code against multiple test cases, automatically compare outputs, and display runtime, memory usage, and execution status.
- 📊 **Submissions**: Track and view submission history for each problem (Language, Execution Time, Memory, Status).
- 📚 **Playlists**: Create custom playlists, save problems, and organize practice sets.
- 🧠 **Problem Management**: Admin panel with full CRUD operations to manage problems (Title, Description, Difficulty, Tags, Constraints, Test cases).
- 🧑‍💻 **Code Editor**: Integrated Monaco Editor with language selection, syntax highlighting, and a clean coding environment.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4, DaisyUI
- **State Management**: Zustand
- **Routing**: React Router DOM v7
- **Editor**: Monaco Editor
- **Forms & Validation**: React Hook Form, Zod
- **Icons & Toasts**: Lucide React, React Hot Toast
- **HTTP Client**: Axios

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: PostgreSQL (Neon Database)
- **ORM**: Prisma v7 (with Prisma Accelerate)
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Code Execution**: Self-hosted Judge0 (Docker)

---

## ⚙️ System Architecture

```text
Frontend (React)
        │
        │ HTTP API (Axios)
        ▼
Backend (Node.js + Express)
        │
        ├── PostgreSQL (Neon) via Prisma
        │
        └── Judge0 (Docker container)
                │
                └── Executes code securely

```

---

## 📁 Project Structure

```
LeetLab/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/       # Reusable UI (Navbar, Modals, Editor, etc.)
│   │   │   ├── AddToPlaylistModal.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── AuthImagePattern.jsx
│   │   │   ├── CreatePlaylistModal.jsx
│   │   │   ├── CreateProblemForm.jsx
│   │   │   ├── LogoutButton.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProblemTable.jsx
│   │   │   ├── Submission.jsx
│   │   │   └── SubmissionList.jsx
│   │   ├── layout/           # App Layout wrappers
│   │   ├── lib/              # Axios config and language maps
│   │   ├── page/             # Route pages
│   │   │   ├── AddProblem.jsx
│   │   │   ├── AllPlaylist.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── PlaylistPage.jsx
│   │   │   ├── ProblemPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── SignUpPage.jsx
│   │   └── store/            # Zustand state stores
│   ├── package.json
│   └── vite.config.js
│
└── backend/
   ├── prisma/
   │   ├── schema.prisma     # Database schema definition
   │   └── migrations/       # Prisma migration history
   ├── src/
   │   ├── controllers/      # Route controllers (auth, executeCode, etc.)
   │   ├── libs/             # Database client & Judge0 API wrappers
   │   ├── middleware/       # Custom middleware (auth.middleware.js)
   │   ├── routes/           # API route definitions
   │   ├── generated/        # Generated Prisma Client
   │   └── index.js          # Express server entry point
   └── package.json

```

---

## 🐳 Judge0 Setup (Self-Hosted)

This project relies on Judge0 for secure code execution. You must start it via Docker before submitting any code on the platform.
**_Prerequisites:_** Ensure you have Docker and Docker Compose installed (Ubuntu 22.04 recommended).


1. Download and extract the release archive:
```
wget https://github.com/judge0/judge0/releases/download/v1.13.1/judge0-v1.13.1.zip
unzip judge0-v1.13.1.zip
```

2. Visit [this website](https://www.random.org/passwords/?num=1&len=32&format=plain&rnd=new) to generate a random password.
3. Use the generated password to update the variable `REDIS_PASSWORD` in the `judge0.conf` file.
4. Visit again [this website](https://www.random.org/passwords/?num=1&len=32&format=plain&rnd=new) to generate another random password.
5. Use the generated password to update the variable `POSTGRES_PASSWORD` in the `judge0.conf` file.
6. Run all services and wait a few seconds until everything is initialized:
```
cd judge0-v1.13.1
docker-compose up -d db redis
sleep 10s
docker-compose up -d
sleep 5s
```

The Judge0 API will now be available at ``` http://localhost:2358/ ``` for your backend to use.

---
## 🛣️ API Routes
### Authentication (```/api/v1/auth```)
- ```POST /register``` - User registration

- ```POST /login``` - User login

- ```POST /logout``` - User logout
- ```GET /check``` - User Data loads

### Problems (```/api/v1/problems```)
- GET ```/get-all-problems``` - Fetch all problems

- GET ```/get-problem/:id``` - Get problem details

- POST ```/create-problem``` - Create new problem (Admin only)

- PUT ```/update-problem/:id``` - Update problem (Admin only)

- DELETE ```/delete-problem/:id``` - Delete problem (Admin only)

### Code Execution (```/api/v1/execute-Code```)
- POST ```/``` - Execute code and run test cases

### Submissions (/api/submission)
- GET ```/get-all-submissions``` - Fetch user submissions

- GET ```/get-submission/:problemId``` - Get submission details
- GET ```/get-submissions-count/:problemId``` - Get Submission Count

### Playlists (```/api/v1/playlist```)
- GET ```/``` - Fetch user playlists

- Get /```:playlistId``` - Fetch Playlist detail
- POST ```/create-playlist``` - Create new playlist

- ```DELETE /:id``` - Delete playlist

- POST ```/:playlistId/add-problem``` - Add problems to playlist

- DELETE ```/:id/problems/:problemId``` - Remove problem from playlist

---
## 🗄️ Database Schema
Key entities managed via Prisma:

- ***User:*** User accounts and authentication credentials.

- ****Problem:**** Coding problems, descriptions, and metadata.

- ***Submission:*** User code submissions and execution results.

- ***TestCase:*** Input/output test cases for problems.

- ***Playlist:*** User-created problem collections.

- ***ProblemsOnPlaylist:*** Junction table managing problems within playlists.