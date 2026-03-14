# TalentFlow TypeScript Service Starter

NestJS starter service for the backend assessment.

This service includes:

- Nest bootstrap with global validation
- TypeORM + migration setup
- Fake auth context (`x-user-id`, `x-workspace-id`)
- Tiny workspace-scoped sample module
- Queue abstraction module
- LLM provider abstraction with a fake summarization provider
- Jest test setup

The assessment-specific candidate document and summary workflow is intentionally not implemented.

## Prerequisites

- Node.js 22+
- npm
- PostgreSQL running from repository root:

```bash
docker compose up -d postgres
```

## Setup

```bash
cd ts-service
npm install
cp .env.example .env
```

## Environment

- `PORT`
- `DATABASE_URL`
- `NODE_ENV`
- `GEMINI_API_KEY` (leave blank unless implementing a real provider)

Do not commit API keys or secrets.

Candidates may create a free Gemini API key through Google AI Studio for the full assessment implementation.

## Run Migrations

```bash
cd ts-service
npm run migration:run
```

## Run Service

```bash
cd ts-service
npm run start:dev
```

## Run Tests

```bash
cd ts-service
npm test
npm run test:e2e
```

## Fake Auth Headers

Sample endpoints in this starter are protected by a fake local auth guard.
Include these headers in requests:

- `x-user-id`: any non-empty string (example: `user-1`)
- `x-workspace-id`: workspace identifier used for scoping (example: `workspace-1`)

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