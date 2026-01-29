# Portfolio (Angular + NestJS + Postgres)

Monorepo for the portfolio/labs project: Angular frontend, NestJS API, Postgres + TypeORM.

## Structure

- `apps/web` — Angular app
- `apps/api` — NestJS API
- `libs/shared-types` — optional shared types
- `infra` — optional infrastructure

## Prerequisites

- Node.js 18+
- Docker and Docker Compose (for Postgres and Adminer)
- npm

## Local run

### 1. Start Postgres and Adminer

```bash
docker compose up -d
```

- Postgres: `localhost:5432`, database `portfolio`, user `postgres`, password `postgres`
- Adminer: http://localhost:8080 (use same credentials to log in)

### 2. Install dependencies

```bash
npm install
```

### 3. Run the apps

**Web only (Angular, http://localhost:4200):**

```bash
npm run dev:web
```

**API only (NestJS, http://localhost:3000):**

```bash
npm run dev:api
```

**Both (web + API in parallel):**

```bash
npm run dev
```

## Scripts

| Script        | Description                          |
|---------------|--------------------------------------|
| `npm run dev:web` | Start Angular dev server (apps/web)  |
| `npm run dev:api` | Start NestJS in watch mode (apps/api)|
| `npm run dev`     | Run both dev:web and dev:api         |
