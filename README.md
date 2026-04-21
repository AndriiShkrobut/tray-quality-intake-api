# Tray Quality Intake API

A backend application that allows the intake of egg tray quality result data from machines in the hatchery and the management of this data.

## Local Setup

### Prerequisites

- Node.js 20+
- Docker and Docker Compose


### With Docker (recommended)

```bash
cp .env.example .env
# Edit .env with your database credentials and desired port
docker compose up --build
 ```

With default .env values this starts the API on `http://localhost:8000` and PostgreSQL on port 5432. Migrations run automatically on container startup.

### Without Docker

Requires a running PostgreSQL instance.

```bash
cp .env.example .env
# Edit .env with your database credentials and desired port
npm install
npm run db:migrate
npm run dev
 ```
