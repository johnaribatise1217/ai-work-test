# Backend Engineering Assessment Starter

This repository is a standalone starter for the backend engineering take-home assessment.
It contains two independent services in a shared mono-repo:

- `python-service/` (InsightOps): FastAPI + SQLAlchemy + manual SQL migrations
- `ts-service/` (TalentFlow): NestJS + TypeORM

The repository is intentionally incomplete for assessment features. Candidates should build within the existing structure and patterns.

## Prerequisites

- Docker
- Python 3.12
- Node.js 22+
- npm

## Start Postgres

From the repository root:

```bash
docker compose up -d postgres
```

This starts PostgreSQL on `localhost:5432` with:

- database: `assessment_db`
- user: `assessment_user`
- password: `assessment_pass`

## Service Guides

- Python service setup and commands: [python-service/README.md](python-service/README.md)
- TypeScript service setup and commands: [ts-service/README.md](ts-service/README.md)