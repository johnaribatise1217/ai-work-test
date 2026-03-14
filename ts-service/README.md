# AI Candidate Screening Backend

**Backend Assessment Implementation**

**Author:** Aribatise John Olugbadeleke

## Overview

This project implements an **AI-assisted candidate screening backend service** designed for recruiters in workspace-based organizations.

Recruiters can:

- Create candidates within their workspace
- Upload candidate documents (resumes, CVs, etc.)
- Extract raw text from uploaded documents
- Generate AI-based candidate summaries using a Large Language Model (LLM)
- Process summarization tasks **asynchronously** through a background worker

The system enforces **workspace-level multi-tenant access control** — recruiters can only access candidates that belong to their workspace.

### Key Features & Practices

- Modular architecture
- Repository pattern
- Background job processing
- LLM provider abstraction
- Structured error handling
- Unit testing

## Tech Stack

| Technology          | Purpose                              |
|---------------------|--------------------------------------|
| Node.js             | Runtime environment                  |
| TypeScript          | Strongly typed JavaScript            |
| NestJS              | Backend framework                    |
| PostgreSQL          | Database                             |
| TypeORM             | ORM for database interaction         |
| Jest                | Unit testing                         |
| Google Gemini API   | AI candidate summarization           |
| Postman / HTTP Client | API testing                        |
| Visual Studio Code  | Development IDE                      |

## Project Requirements

To run this project locally, ensure you have:

- Node.js **v22+**
- npm
- PostgreSQL
- Visual Studio Code (recommended)
- Postman or any HTTP client

## Getting Started

### 1. Cloning the Repository

```bash
# Navigate to your preferred directory
cd Desktop
# or
cd Documents

# Clone the repo
git clone https://github.com/johnaribatise1217/ai-work-test.git backend-test

# Enter the project directory
cd backend-test

#Enter the NESTJS application directory
cd ts-service

#Install dependencies
npm install
```

## Environment Configuration
- Create a .env file in the root of ts-service folder (next to package.json).
A .env.example file is already provided in the repository.
Example .env

- PORT=3000

- DATABASE_URL=postgres://assessment_user:assessment_pass@localhost:5432/assessment_db

- POSTGRES_DB=assessment_db
- POSTGRES_USER=assessment_user
- POSTGRES_PASSWORD=assessment_pass
- POSTGRES_PORT=5432

- NODE_ENV=development

- GEMINI_API_KEY=your-api-key-here

## (Getting a Gemini API Key)

Go to → https://aistudio.google.com
Create a free API key
Copy and paste it into GEMINI_API_KEY=

Model used: gemini-2.5-flash
(Chosen for free tier, large context window, speed, and cost-efficiency)

## PostgreSQL Setup
You have two options:
Option A: Using Docker (recommended for quick setup)

```bash
# From the root of the repository (where docker-compose.yml is)
docker compose up -d postgres
```
Option B: Local PostgreSQL
Create the database manually in your DBMS:
```bash
CREATE DATABASE assessment_db;
```
Make sure credentials match your .env file.

## Run Migrations
Navigate to /src/migrations folder to check the migrations needed to configure table schemas
```bash
npm run migration:run
```
This creates the following tables:

- workspaces
- candidates
- candidate_documents
- candidate_summaries

## Run Service

```bash
npm run start:dev
```
The API will be available at:
http://localhost:3000 or The API will be available at:
http://localhost:3001 (depending on your port)

## Run Tests

```bash
npm test
```

## Fake Authentication (Assessment Mode)
Include these headers in requests:

- `x-user-id`: any non-empty string (example: `user-1`)
- `x-workspace-id`: workspace identifier used for scoping (example: `workspace-1`)
These simulate a logged-in recruiter.

## API Endpoints
All endpoints are workspace-scoped and require the following headers for fake authentication (assessment mode):


| Method | Endpoint                                | Description                                      |
|--------|-----------------------------------------|--------------------------------------------------|
| `POST`   | `/candidates`                           | Create a new candidate in the workspace          |
| `GET`    | `/candidates`                           | List all candidates in the authenticated workspace |
| `POST`   | `/candidates/:candidateId/documents`    | Upload document(s) for a specific candidate (PDF, DOCX, TXT supported) |
| `POST`   | `/candidates/:candidateId/summaries/generate` | Start an asynchronous summarization job for the candidate |
| `GET`    | `/candidates/:candidateId/summaries`    | List all summary jobs/results for a candidate    |
| `GET`    | `/candidates/:candidateId/summaries/:summaryId` | Get details of a specific summary job/result     |
| `GET`    | `/health`                               | Service health check                             |

### Quick Example (using cURL)

```bash
# Create a candidate
curl -X POST http://localhost:3000/candidates \
  -H "x-user-id: user-1" \
  -H "x-workspace-id: workspace-1" \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane@example.com"}'

# Upload document (multipart/form-data)
curl -X POST http://localhost:3000/candidates/123/documents \
  -H "x-user-id: user-1" \
  -H "x-workspace-id: workspace-1" \
  -F "file=@/path/to/resume.pdf"

# Trigger summary generation
curl -X POST http://localhost:3000/candidates/123/summaries/generate \
  -H "x-user-id: user-1" \
  -H "x-workspace-id: workspace-1"
```

## Layout Highlights

- `src/auth/`: fake auth guard, user decorator, auth types
- `src/entities/`: starter entities
- `src/sample/`: tiny example module (controller/service/dto)
- `src/queue/`: in-memory queue abstraction
- `src/llm/`: provider interface + fake provider + Actual Provider
- `src/migrations/`: TypeORM migration files
- `src/candidate/`: Candidate Resources (entity, dto, services, controllers, modules)
- `src/candidatedocument/`: Candidate Document Resources (entity, dto, services, controllers, modules)
- `src/candidatesummary/`: Candidate Summary Resources (entity, dto, services, controllers, modules)
- `src/Exception/`: Global Http Exception Handler and Database Exception
- `src/worker/`: Background job runner and processor

## Background Processing
- AI operations run in a worker process rather than inside API controllers.
- This prevents request timeouts and improves system scalability.

## LLM Implementation
- This project integrates with the Google Gemini API.
- Model used:
```bash
gemini-2.5-flash
```
The LLM receives candidate document text and returns structured evaluation data.

Expected response format:
```json
{
  score: number,
  strengths: string[],
  concerns: string[],
  summary: string,
  recommendedDecision: "advance" | "hold" | "reject"
}
```

## Assumptions

- Recruiters always belong to a workspace

- Candidate emails must be unique

- Resume text extraction is sufficient for AI summarization

- An in-memory queue is acceptable for the scope of this assessment

## Potential Improvements

- Future improvements could include:

- Redis-based queue (BullMQ)

- Cloud storage for uploaded files (AWS S3)

- Schema validation for LLM responses

- JWT authentication instead of header-based auth

- Distributed worker scaling

## Final Notes

This implementation focuses on clean architecture, maintainability, and production-oriented backend practices while fulfilling the requirements of the assessment.

The project demonstrates:

- multi-tenant backend design

- asynchronous AI processing

- structured LLM integration

- robust error handling

- unit testing