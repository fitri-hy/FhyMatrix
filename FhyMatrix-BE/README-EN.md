## Configuration [ID](./README.md)

This project uses a .env file to store environment configuration. Each service has its own variables.

- API Gateway `/gateway/.env`
- Auth Service `/auth-service/.env`
- User Service `/user-service/.env`
- Other Service `/other-service/.env`

## Running

| Script | Purpose |
| -------------------------- | ----------------------------------------------------------------------- |
| `pnpm run start:auth` | Running the Auth Service** (gRPC + REST for login/register) |
| `pnpm run start:user` | Running the User Service** (gRPC + REST for user listing and details) |
| `pnpm run start:other` | Running the Other Service** (gRPC + REST for ping, metrics, and health) |
| `pnpm run start:gateway` | Running the API Gateway** (REST wrapper for all services) |
| `pnpm run start:all` | Running all services at once: Auth, User, Other, and Gateway |

## Prisma

| Script | Purpose |
| ----------------------------- | -------------------------------------------------------------------- |
| `pnpm run prisma:gen:auth` | Generate Prisma Client for Auth Service |
| `pnpm run prisma:gen:other` | Generate Prisma Client for Other Services |
| `pnpm run prisma:gen:all` | Generate Prisma Client for all services |
| `pnpm run prisma:migrate:auth` | Run database migration for Auth Service |
| `pnpm run prisma:migrate:other` | Run database migration for Other Services |
| `pnpm run prisma:migrate:all` | Run database migration for all services |

## AuthService

#### gRPC

| Method | Requests | Response | Description |
| ---------- | ------------------------------------- | ------------------------------- | -------------------- |
| `Login` | `{ email: string, password: string }` | `{ token: string }` | Login user |
| `Register` | `{ email: string, password: string }` | `{ id: number, email: string }` | New user registration |
| `Ping` | `{}` | `{ id, message, createdAt }` | Test service |
| `Metrics` | `{}` | `{ status: string }` | Metrics / Prometheus data |
| `Health` | `{}` | `{ status: string }` | Health check |

#### REST API (via `authRoutes` / API Gateway)

| Endpoints | Method | Body / Params | Response |
| ---------------- | ------ | --------------------------------- | ------------------------------- |
| `/auth/login` | POST | `{ "email": "", "password": "" }` | `{ "token": "" }` |
| `/auth/register` | POST | `{ "email": "", "password": "" }` | `{ "id": number, "email": "" }` |
| `/auth/ping` | GET | - | `{ id, message, createdAt }` |
| `/auth/metrics` | GET | - | `{ status: string }` (text/plain) |
| `/auth/health` | GET | - | `{ status: string }` |

## User Service

#### gRPC

| Method | Requests | Response | Description |
| ----------- | ---------------- | ---------------------------- | -------------------------- |
| `ListUsers` | `{}` | `{ users: [{ id, email }] }` | List of all users |
| `GetUser` | `{ id: number }` | `{ id, email }` | User details based on ID |
| `Ping` | `{}` | `{ id, message, createdAt }` | Test service |
| `Metrics` | `{}` | `{ status: string }` | Metrics / Prometheus data |
| `Health` | `{}` | `{ status: string }` | Health check |

#### REST API (via API Gateway)

| Endpoints | Method | Body / Params | Response |
| ------------ | ------ | ---------------- | ---------------------------- |
| `/users` | GET | - | `{ users: [{ id, email }] }` |
| `/users/:id` | GET | `id` (URL param) | `{ id, email }` |
| `/users/ping` | GET | - | `{ id, message, createdAt }` |
| `/users/metrics` | GET | - | `{ status: string }` (text/plain) |
| `/users/health` | GET | - | `{ status: string }` |

## Other Services

#### gRPC

| Method | Requests | Response | Description |
| --------- | ------- | ---------------------------- | ------------------------- |
| `Ping` | `{}` | `{ id, message, createdAt }` | Test service |
| `Metrics` | `{}` | `{ status: string }` | Metrics / Prometheus data |
| `Health` | `{}` | `{ status: string }` | Health check |

#### REST API (via API Gateway)

| Endpoints | Method | Body / Params | Response |
| ---------------- | ------ | ------------- | --------------------------------- |
| `/other/ping` | GET | - | `{ id, message, createdAt }` |
| `/other/metrics` | GET | - | `{ status: string }` (text/plain) |
| `/other/health` | GET | - | `{ status: string }` |