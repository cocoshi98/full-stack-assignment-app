# Task Assignment Application

A full-stack Task Assignment application built with React, TypeScript, Node.js, Express, PostgreSQL, Prisma, Docker, and Gemini.

The application allows users to:

- Create tasks with required skills.
- Create subtasks and nested subtasks recursively.
- Assign tasks to developers who have all required skills.
- Update task statuses.
- Prevent a parent task from being completed until all of its subtasks are completed.
- Automatically identify required skills using an LLM when no skills are specified.
- Run the complete application using Docker Compose.

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Nginx for serving the production build

### Backend

- Node.js
- TypeScript
- Express
- Prisma ORM
- Google Gemini API

### Database

- PostgreSQL 16

### Infrastructure

- Docker
- Docker Compose

---

## Project Structure

```text
full-stack-assignment-app/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── errors/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   │
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   │
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## System Architecture

The application follows a layered backend architecture:

```text
Browser
   │
   ▼
React Frontend
   │
   │ HTTP / JSON
   ▼
Express Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ├──────────────► Gemini API
   │
   ▼
Prisma ORM
   │
   ▼
PostgreSQL
```

### Backend responsibilities

**Routes**

Map API URLs and HTTP methods to the appropriate controller.

**Controllers**

Handle HTTP-specific concerns such as:

- Request parameters
- Request bodies
- HTTP status codes
- Responses

**Services**

Contain application and business logic, including:

- Task creation
- Developer eligibility validation
- Task completion validation
- Skill classification

**Prisma**

Provides type-safe access to PostgreSQL and manages database relationships.

**Error middleware**

Provides centralized handling of application and unexpected server errors.

---

## Database Design

The application contains three primary entities:

### Developer

A Developer:

- Has a name.
- Can have multiple Skills.
- Can be assigned multiple Tasks.

### Skill

A Skill:

- Has a unique name.
- Can belong to multiple Developers.
- Can be required by multiple Tasks.

The seeded Skills are:

```text
Frontend
Backend
```

### Task

A Task:

- Has a title.
- Has a status.
- Can require multiple Skills.
- May be assigned to one Developer.
- May have a parent Task.
- May have multiple subtasks.

Tasks use a self-referencing relationship to support arbitrary levels of nested subtasks.

Conceptually:

```text
Task
├── Subtask
│   └── Nested Subtask
└── Subtask
```

### Task Status

The supported statuses are:

```text
TODO
IN_PROGRESS
DONE
```

---

## Seed Data

The database is seeded with the following Developers and Skills:

| Developer | Skills |
|---|---|
| Alice | Frontend |
| Bob | Backend |
| Carol | Frontend, Backend |
| Dave | Backend |

The seed script is designed to be safely re-run without intentionally creating duplicate seed records.

---

# Running the Application with Docker

Docker Compose is the recommended way to run the application.

## Prerequisites

Install:

- Docker Desktop
- Docker Compose

No separate PostgreSQL or Node.js installation is required when running the complete application through Docker.

---

## 1. Clone the repository

```bash
git clone https://github.com/cocoshi98/full-stack-assignment-app.git
cd full-stack-assignment-app
```

---

## 2. Configure the Gemini API key

Create a `.env` file at the **project root**:

```text
full-stack-assignment-app/.env
```

Add:

```env
GEMINI_API_KEY=your_gemini_api_key
```

The `.env` file is excluded from Git and must not be committed.

A Gemini API key can be created using Google AI Studio.

---

## 3. Start the application

From the project root:

```bash
docker compose up --build
```

Docker Compose will start:

```text
PostgreSQL
Backend
Frontend
```

During backend startup, Prisma will:

1. Apply database migrations.
2. Run the database seed script.
3. Start the Express server.

---

## 4. Open the application

Frontend:

```text
http://localhost:5173
```

Task List:

```text
http://localhost:5173/tasks
```

Task Creation:

```text
http://localhost:5173/tasks/new
```

Backend API:

```text
http://localhost:3000
```

---

## Stopping the Application

Press:

```text
Ctrl + C
```

if Docker Compose is running in the foreground.

Alternatively:

```bash
docker compose down
```

The PostgreSQL data is stored in a Docker named volume, so normal container recreation does not remove the database data.

To also remove the database volume:

```bash
docker compose down -v
```

**Warning:** this deletes the local database data.

---

# Local Development

The frontend and backend can also be run directly during development.

## Backend

Create:

```text
backend/.env
```

Example:

```env
DATABASE_URL="postgresql://taskapp:taskapp_password@localhost:5432/task_assignment"
GEMINI_API_KEY="your_gemini_api_key"
```

Start PostgreSQL using Docker:

```bash
docker compose up -d postgres
```

Then:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

The backend runs at:

```text
http://localhost:3000
```

---

## Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server runs at:

```text
http://localhost:5173
```

---

# API Documentation

Base URL:

```text
http://localhost:3000/api
```

## Developers

### Get all developers

```http
GET /api/developers
```

Returns Developers together with their Skills.

### Get developer by ID

```http
GET /api/developers/:id
```

Example:

```http
GET /api/developers/3
```

---

## Skills

### Get all skills

```http
GET /api/skills
```

Returns Skills and their relevant relationships.

### Get skill by ID

```http
GET /api/skills/:id
```

Example:

```http
GET /api/skills/1
```

---

## Tasks

### Get all tasks

```http
GET /api/tasks
```

Returns Tasks and their relevant properties including:

- Required Skills
- Assigned Developer
- Parent Task relationship
- Subtasks
- Status

### Get task by ID

```http
GET /api/tasks/:id
```

---

### Create a task

```http
POST /api/tasks
Content-Type: application/json
```

Example with manually specified Skills:

```json
{
  "title": "Build a responsive homepage",
  "skillIds": [1]
}
```

Example requiring both Skills:

```json
{
  "title": "Build a user registration feature",
  "skillIds": [1, 2]
}
```

A Developer does not need to be assigned during Task creation.

---

### Create a subtask

A subtask uses the same Task model and specifies its parent using `parentTaskId`.

```json
{
  "title": "Build profile API",
  "skillIds": [2],
  "parentTaskId": 1
}
```

Nested subtasks are supported using the same mechanism.

---

### Update a task

```http
PATCH /api/tasks/:id
Content-Type: application/json
```

Change status:

```json
{
  "status": "IN_PROGRESS"
}
```

Assign a Developer:

```json
{
  "developerId": 3
}
```

Update both:

```json
{
  "developerId": 3,
  "status": "IN_PROGRESS"
}
```

Unassign a Developer:

```json
{
  "developerId": null
}
```

---

# Business Rules

## Developer Assignment

A Task may only be assigned to a Developer who has **all Skills required by the Task**.

For example:

```text
Task requires:
Frontend + Backend
```

Seeded Developers:

```text
Alice → Frontend
Bob   → Backend
Carol → Frontend + Backend
Dave  → Backend
```

Only Carol is eligible for that Task.

This rule is enforced by the backend even though the frontend also filters the Developer dropdown for improved user experience.

---

## Task Completion

A Task cannot have its status changed to:

```text
DONE
```

while any of its subtasks are incomplete.

Example:

```text
Parent Task
├── Subtask A → DONE
└── Subtask B → TODO
```

Attempting to mark `Parent Task` as Done will be rejected.

Once both subtasks are Done:

```text
Parent Task
├── Subtask A → DONE
└── Subtask B → DONE
```

the parent Task can be completed.

Because the same rule applies to every Task, this behavior also supports nested subtasks.

---

# Nested Task Support

Task creation uses a recursive React component.

Conceptually:

```text
TaskFormNode
   │
   └── TaskFormNode
          │
          └── TaskFormNode
```

Each form node can dynamically add or remove its own subtasks.

When submitted, Tasks are created recursively:

```text
Create parent
     │
     ▼
receive parent database ID
     │
     ▼
create child using parentTaskId
     │
     ▼
create nested child
```

The Task List also reconstructs the complete hierarchy using `parentTaskId` and renders it recursively.

---

# Automatic Skill Identification with LLM

If the user creates a Task without selecting any Skills:

```json
{
  "title": "Build a responsive navigation menu",
  "skillIds": []
}
```

the backend automatically sends the Task title to Google Gemini.

The model classifies the Task into one or both of:

```text
Frontend
Backend
```

Example classifications:

```text
"Build a responsive navigation menu"
→ Frontend

"Create audit logs for all database modifications"
→ Backend

"Build a registration page that submits data to a backend API"
→ Frontend + Backend
```

The frontend does not need to manually trigger the classification.

Because subtasks use the same Task creation API, the same automatic classification process applies to Tasks, subtasks, and nested subtasks.

The Gemini response is constrained to structured JSON containing only the supported Skill names.

---

# Error Handling and Validation

The backend performs both request validation and business-rule validation.

Examples include:

```text
Invalid Task ID
Invalid Developer ID
Invalid Skill ID
Empty Task title
Developer does not exist
Developer does not have required Skills
Parent Task does not exist
Attempt to complete Task with incomplete subtasks
LLM classification failure
```

Expected application errors return appropriate HTTP status codes.

Unexpected errors are passed through centralized Express error-handling middleware and return an HTTP 500 response.

---

# Key Dependencies and Justification

### React

Used for building the single-page frontend and reusable recursive Task components.

### React Router

Used for SPA navigation between the Task List and Task Creation pages without full browser reloads.

### Vite

Used as the frontend development server and production build tool.

### Express

Provides a lightweight Node.js HTTP framework for implementing the REST API.

### Prisma

Used as the ORM for:

- Type-safe PostgreSQL access
- Database migrations
- Relationships
- Seed data
- Developer productivity

### PostgreSQL

Used as the relational database because the application contains several relational structures, including:

- Developer ↔ Skill many-to-many
- Task ↔ Skill many-to-many
- Developer → Task
- Task → Task self-reference

### `@prisma/adapter-pg` / `pg`

Used for Prisma's PostgreSQL database connection.

### Google GenAI SDK

Used to integrate the backend with Gemini for automatic Task Skill classification.

### Docker / Docker Compose

Used to provide a reproducible environment containing:

- PostgreSQL
- Backend
- Frontend
- Runtime dependencies

### Nginx

Used to serve the built React application inside the production frontend Docker image.

The Nginx configuration includes an SPA fallback so React Router paths such as `/tasks` and `/tasks/new` resolve correctly.

---

# Environment Variables

The application uses the following environment variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string used by Prisma |
| `GEMINI_API_KEY` | API key used by the backend for Gemini Skill classification |

Actual secrets are excluded from Git.

The repository contains:

```text
backend/.env.example
```

as a reference for required backend environment variables.

---

# Assumptions and Design Decisions

- `TODO`, `IN_PROGRESS`, and `DONE` are used as the supported Task statuses.
- Developer assignment is optional.
- A Task may have zero user-selected Skills because missing Skills are automatically determined using the LLM.
- Skills are predefined as `Frontend` and `Backend`.
- Task deletion was not implemented because it was not required by the assignment.
- Developer and Skill create/update/delete operations were not implemented because only read operations were required.
- Nested Tasks use the same `Task` database model rather than a separate Subtask entity.
- The frontend filters eligible Developers for usability, but eligibility is always enforced again by the backend.
- LLM integration is isolated in a dedicated service so the Task service does not depend directly on provider-specific implementation details.

---

# Build Verification

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```

Complete Docker environment:

```bash
docker compose up --build
```

---

# Repository

GitHub:

```text
https://github.com/cocoshi98/full-stack-assignment-app
```

---

## Author

Conant Quah