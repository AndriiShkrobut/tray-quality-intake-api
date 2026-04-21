# Tray Quality Intake API

A backend application that allows the intake of egg tray quality result data from machines in the hatchery and the management of this data.

## Local Setup

### Prerequisites

- Node.js 20+
- Docker and Docker Compose

### Docker (recommended)

```bash
cp .env.example .env
# Edit .env with your database credentials and desired port
docker compose up --build
```

With default `.env` values this starts the API on `http://localhost:8000` and PostgreSQL on port 5432. Migrations run automatically on container startup.

### Without Docker

Requires a running PostgreSQL instance.

```bash
cp .env.example .env
# Edit .env - set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME to match your PostgreSQL instance
npm install
npm run db:migrate
npm run dev
```

### Registering a Machine

Before a machine can submit tray data, it must be registered. Use the admin key from your `.env` file:

```bash
curl -X POST http://localhost:8000/machines/register \
  -H "x-admin-key: ADMIN_KEY"
```

This returns a plaintext machine key. Store it securely - it is shown only once.

### Submitting Tray Data

```bash
curl -X POST http://localhost:8000/machines/trays \
  -H "Content-Type: application/json" \
  -H "x-machine-key: <machine-key-from-registration>" \
  -d '{
    "tray_barcode": "232458",
    "total_eggs": 10,
    "fertile": 5,
    "infertile": 3,
    "early_death": 1,
    "blood_ring": 1
  }'
```

### API Documentation

- OpenAPI JSON spec: `http://localhost:8000/docs`
- Swagger UI: `http://localhost:8000/swagger`

## Technology Choices

| Technology | Purpose | Why |
|---|---|---|
| **TypeScript** | Language | Type safety across the entire stack - from database schema to API responses |
| **NodeJs** | Runtime | Reliable and time-proven runtime solution instead of new cool kids stuff like Deno, Bun. However, Bun seems pretty promising |
| **Hono** | Backend framework | Lightweight, fast - good fit for a focused API service without the overhead of Express or Fastify. Has cool OpenAPI support via `@hono/zod-openapi`  |
| **Drizzle ORM** | Database access | Pretty young but powerful and lightweight type-safe orm with support of SQL like syntax. Schema definitions generate both TypeScript types and Zod validation schemas, eliminating duplication. Also, it has pretty rich toolkit (seeding, migration, DB admin (check `npx drizzle-kit studio`) |
| **PostgreSQL** | Database | Just good old reliable and extensible relational database |
| **Zod** | Validation | Integrates natively with both Hono (request validation) and Drizzle (schema-derived validators). Single source of truth for types and validation |
| **Docker** | Deployment | Used a multi-stage build to keep the app image small. And docker compose to bundle app and db together |
| **Swagger** | API Documentation | Industry standard for api documentation |




## Architecture Decisions

### Structure

```
Routes (OpenAPI definitions) → Handlers (HTTP concerns) → Services (business logic/database interactions) → Database (Drizzle ORM)
```

- **Routes** define the API contract: paths, methods, request/response schemas with OpenAPI metadata.
- **Handlers** deal with HTTP: extracting validated data from the request, calling services, returning responses with appropriate status codes.
- **Services** contain business logic and database queries. They have no knowledge of HTTP.
- **Database layer** provides the Drizzle instance and schema definitions.



### Machine Authentication

Machines authenticate via an `x-machine-key` header. The flow:

1. An admin or machine itself registers a machine using the `POST /machines/register` endpoint (protected by a shared `ADMIN_KEY`).
2. The system generates a cryptographically random 64-character hex key, stores its SHA-256 hash in the database, and returns the plain hex key only once.
3. On each request, the middleware hashes the provided key and looks up the matching machine.

This approach was chosen over JWT or OAuth for the sake of simplicity for machine-to-system communication. The key acts as a long-lived credential similar to an API key. Hashing ensures that a database compromise does not expose usable keys. In production environments data should flow through HTTPS only, so that the plain keys are not exposed.



### Duplicate Barcode Handling

A tray barcode can only be submitted once. Submitting a duplicate returns `409 Conflict`.

**Rationale:** In a hatchery environment, each physical tray is scanned once. Allowing duplicates would risk overwriting or conflicting quality data. If a re-scan is needed, the appropriate workflow would be to delete-and-resubmit or update, which considered as potential improvement with more time given.

**Implementation:** The handler checks for an existing barcode before inserting. A database-level unique index acts as a safety against race conditions.



### Validation

Zod schemas are derived from the Drizzle table definition using `drizzle-zod`, which avoids maintaining separate validation and database schemas. Also, a custom validation added to enforce that `fertile + infertile + early_death + blood_ring == total_eggs`, catching data inconsistencies.



## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/machines/register` | `x-admin-key` header | Register a new machine, returns its API key |
| `POST` | `/machines/trays` | `x-machine-key` header | Submit tray quality data |
| `GET` | `/trays/:barcode` | None | Get a single tray result by barcode |
| `GET` | `/trays/` | None | List all tray results (newest first) |



## Assumptions and Trade-offs

- **No user authentication on read endpoints.** The tray result data management API should have been under proper authentication and authorization for users or other services.
- **Admin and machine keys are doesn't provide production grade security.** This simplicity is sufficient for this scope. However, a production system has to use a proper admin/machine auth flow.
- **No soft deletes and updates.** Tray results cannot be changed once submitted. An `updated_at`, `updated_by`, `deleted_at`, `deleted_by` columns or some kind of history table would be needed for corrections in a real workflow.
- **Code aesthetics.** Standard Node ESM was used for reliability and compile time errors of invalid imports, instead of using bundlers or other young runtimes. As a result: `.js` extensions in imports, harder to implement absolute imports.



## What should be improved with more time

- **Tests** - Unit and integration tests to cover the main flows: valid/invalid payloads, duplicate barcodes, auth failures, retrieval.
- **Security** - Make machine registration process more secure in terms of authentication and authorization (because admin key is single source of true that's easily exposed) .
- **Filtering** - Query parameters on `GET /trays/` for filtering by machine, eggs data, date/time range.
- **Robusteness** - Protect the intake endpoint from machines flooding the system by some kind of rate limits.
- **Logging** - Implement production-level logging with log level configuration for system observation and simpler development.
- **CI/CD pipeline** - Automated linting, type checking, tests on pull requests and automated deployment.
- **Seeding mechanism** - At least some `seed.ts` script to populate the database with sample data for development.
