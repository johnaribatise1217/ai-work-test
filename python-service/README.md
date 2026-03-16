# Mini Briefing Report Generator (Python Service)

**Author:** Aribatise John Olugbadeleke

This project implements the **Python/FastAPI** part of the Backend Engineering Take-Home Assessment.  
It provides a RESTful API for creating, retrieving, generating, and rendering internal company briefing reports.  
The service stores structured briefing data in PostgreSQL, enforces strict validation rules, transforms data into a clean view model, and renders professional HTML reports using Jinja2 templates — all while following clean architecture principles (thin controllers, service layer, proper separation of concerns).

Focus: FastAPI + SQLAlchemy + Pydantic + Jinja2 + PostgreSQL

The TypeScript/NestJS service (`ts-service/`) was completed separately.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Navigate to Python service](#2-navigate-to-python-service)
  - [3. Create and activate virtual environment](#3-create-and-activate-virtual-environment)
  - [4. Install dependencies](#4-install-dependencies)
  - [5. Configure environment variables](#5-configure-environment-variables)
  - [6. Database – choose one option](#6-database--choose-one-option)
  - [7. Run migrations](#7-run-migrations)
  - [8. Start the FastAPI server](#8-start-the-fastapi-server)
- [API Endpoints](#api-endpoints)
- [How to Test](#how-to-test)
- [Project Structure (python-service)](#project-structure-python-service)
- [Design Decisions & Notes](#design-decisions--notes)
- [Assumptions & Trade-offs](#assumptions--trade-offs)
- [Limitations & Possible Improvements](#limitations--possible-improvements)

## Project Overview

This backend service allows analysts to:

- Create structured company briefing reports via JSON API  
- Retrieve stored briefing data  
- Generate a professionally formatted HTML report (server-side rendered)  
- Fetch the already generated HTML  

All business logic is separated into services, data validation uses Pydantic, HTML is rendered with Jinja2, and relational integrity is enforced via PostgreSQL constraints.

## Technologies

- Python 3.10+
- FastAPI
- SQLAlchemy 2.0 (async-capable but used synchronously here)
- Pydantic v2
- Jinja2
- PostgreSQL
- python-dotenv (optional – for `.env` support)

## Prerequisites

Make sure the following are installed on your system:

- Python 3.10 or higher
- PostgreSQL (local or via Docker)
- Git
- (Recommended) Postman / curl / HTTPie for API testing
- Docker & docker-compose (optional – only if using containerized Postgres)

## Setup & Installation

### 1. Clone the repository

```bash
git clone "repo-link" backend-test
cd backend-test
```

### 2. Navigate to Python Service
```bash
cd python-service
```

### 3. Create and activate virtual environment
```bash
# Linux / macOS
python3 -m venv .venv
source .venv/bin/activate

# Windows (PowerShell)
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Windows (cmd)
python -m venv .venv
.\.venv\Scripts\activate.bat
```

### 4. Install dependencies
```bash
pip install -r requirements.txt
```

### 5. Configure environment variables
```bash
cp .env.example .env
```
Then open .env and fill in your values, for example:
```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-strong-password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=assessment_db
```

### 6. Database – choose one option
Option A – Docker (recommended for local dev)
Make sure docker-compose.yml exists in the repo root or python-service/.
Update values in docker-compose.yml if needed, then start Postgres:
```bash
# From repo root or python-service folder (where docker-compose.yml lives)
docker compose up -d postgres
```

### Option B – Local PostgreSQL (without Docker)
```bash
CREATE DATABASE assessment_db; #execute this query inside your postgres system
```

### 7. Run migrations
The project uses manual SQL migrations (located in app/db/migrations/).
Apply all migrations:
```bash
python -m app.db.run_migrations up
```
To rollback the last migration (if needed):
```bash
python -m app.db.run_migrations down
```

### 8. Start the FastAPI server
```bash
uvicorn app.main:app --reload --port 8000
```

### Project Structure 
python-service/
├── app/
│   ├── api/                → route definitions
│   ├── core/               → config, settings
│   ├── db/                 → session, base, migrations runner
│   │   └── migrations/
│   ├── models/             → SQLAlchemy models
│   ├── schemas/            → Pydantic schemas (input/output)
│   ├── services/           → business logic (briefing_service, report_formatter)
│   └── templates/          → Jinja2 HTML templates
├── .env.example
├── requirements.txt
├── docker-compose.yml      (optional)
└── main.py

### API Endpoints

| Method | Endpoint                          | Description                              |
|--------|-----------------------------------|------------------------------------------|
| POST   | `/briefings`                      | Create a new briefing                    |
| GET    | `/briefings/{id}`                 | Retrieve briefing data (JSON)            |
| POST   | `/briefings/{id}/generate`        | Generate HTML report & store it          |
| GET    | `/briefings/{id}/html`            | Fetch the rendered HTML (text/html)      |

### Design Decisions & Notes
- All input validation (required fields, min length, at least 2 key points, at least 1 risk, unique metric names, ticker uppercase normalization) is handled declaratively in Pydantic v2 using Field, field_validator and model_validator.
- Extended the existing ReportFormatter class to handle briefing-specific view model transformation and Jinja rendering — no raw HTML string concatenation in Python.
- Thin API routes: all logic lives in briefing_service.py.
- HTML is semantic, styled with plain CSS, auto-escaped by Jinja2, and gracefully handles missing metrics.
- Generated HTML and timestamp are stored in the database → /html endpoint is fast and idempotent.
- Followed the starter repository patterns (manual migrations, service layer, selectinload eager loading, etc.) without changing the overall architecture.

### Assumptions & Trade-offs
- Single analyst per briefing (no multi-user / ownership yet)
- No soft deletes, versioning or audit trail
- HTML is stored in DB instead of generating on-the-fly every time (trade-off: faster read, but uses more storage)
- No authentication / authorization (assessment scope limitation)
- No pagination / listing endpoint for briefings (kept focused on required features)
- Ticker is normalized to uppercase but no external ticker validation
- No rate limiting, logging beyond FastAPI defaults, or monitoring

### Limitations & Possible Improvements
- Full CRUD + list endpoint with pagination & filtering
- Authentication (JWT / API keys)
- Alembic migrations instead of manual SQL files
- Async SQLAlchemy + async endpoints
- Richer HTML (charts via inline SVG, PDF export option)
- Input sanitization / XSS prevention beyond Jinja autoescape
- Caching layer for frequently accessed reports
- Background task / queue for report generation (if reports become expensive)
- OpenAPI security schemes & better Swagger documentation