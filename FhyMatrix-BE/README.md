## Configurasi [EN](./README-EN.md)

Project ini menggunakan .env file untuk menyimpan konfigurasi environment. Setiap service memiliki variabel sendiri.

- API Gateway `/gateway/.env`
- Auth Service `/auth-service/.env`
- User Service `/user-service/.env`
- Other Service `/other-service/.env`

## Menjalankan

| Script                     | Kegunaan                                                                 |
| -------------------------- | ----------------------------------------------------------------------- |
| `pnpm run start:auth`       | Menjalankan **Auth Service** (gRPC + REST untuk login/register)         |
| `pnpm run start:user`       | Menjalankan **User Service** (gRPC + REST untuk list & detail user)    |
| `pnpm run start:other`      | Menjalankan **Other Service** (gRPC + REST untuk ping, metrics, health)|
| `pnpm run start:gateway`    | Menjalankan **API Gateway** (REST wrapper untuk semua service)         |
| `pnpm run start:all`        | Menjalankan semua service sekaligus: Auth, User, Other & Gateway       |

## Prisma

| Script                        | Kegunaan                                                              |
| ----------------------------- | -------------------------------------------------------------------- |
| `pnpm run prisma:gen:auth`     | Generate Prisma Client untuk Auth Service                             |
| `pnpm run prisma:gen:other`    | Generate Prisma Client untuk Other Service                            |
| `pnpm run prisma:gen:all`      | Generate Prisma Client untuk semua service                            |
| `pnpm run prisma:migrate:auth` | Jalankan migrate database untuk Auth Service                           |
| `pnpm run prisma:migrate:other`| Jalankan migrate database untuk Other Service                          |
| `pnpm run prisma:migrate:all`  | Jalankan migrate database untuk semua service                          |

## Auth Service

#### gRPC

| Method     | Request                               | Response                        | Keterangan           |
| ---------- | ------------------------------------- | ------------------------------- | -------------------- |
| `Login`    | `{ email: string, password: string }` | `{ token: string }`             | Login user           |
| `Register` | `{ email: string, password: string }` | `{ id: number, email: string }` | Registrasi user baru |
| `Ping`    | `{}`    | `{ id, message, createdAt }` | Test service              |
| `Metrics` | `{}`    | `{ status: string }`         | Metrics / Prometheus data |
| `Health`  | `{}`    | `{ status: string }`         | Health check              |

#### REST API (via `authRoutes` / API Gateway)

| Endpoint         | Method | Body / Params                     | Response                        |
| ---------------- | ------ | --------------------------------- | ------------------------------- |
| `/auth/login`    | POST   | `{ "email": "", "password": "" }` | `{ "token": "" }`               |
| `/auth/register` | POST   | `{ "email": "", "password": "" }` | `{ "id": number, "email": "" }` |
| `/auth/ping`    | GET    | -             | `{ id, message, createdAt }`      |
| `/auth/metrics` | GET    | -             | `{ status: string }` (text/plain) |
| `/auth/health`  | GET    | -             | `{ status: string }`              |

## User Service

#### gRPC

| Method      | Request          | Response                     | Keterangan                 |
| ----------- | ---------------- | ---------------------------- | -------------------------- |
| `ListUsers` | `{}`             | `{ users: [{ id, email }] }` | Daftar semua user          |
| `GetUser`   | `{ id: number }` | `{ id, email }`              | Detail user berdasarkan ID |
| `Ping`    | `{}`    | `{ id, message, createdAt }` | Test service              |
| `Metrics` | `{}`    | `{ status: string }`         | Metrics / Prometheus data |
| `Health`  | `{}`    | `{ status: string }`         | Health check              |

#### REST API (via API Gateway)

| Endpoint     | Method | Body / Params    | Response                     |
| ------------ | ------ | ---------------- | ---------------------------- |
| `/users`     | GET    | -                | `{ users: [{ id, email }] }` |
| `/users/:id` | GET    | `id` (URL param) | `{ id, email }`              |
| `/users/ping`    | GET    | -             | `{ id, message, createdAt }`      |
| `/users/metrics` | GET    | -             | `{ status: string }` (text/plain) |
| `/users/health`  | GET    | -             | `{ status: string }`              |

## Other Service

#### gRPC

| Method    | Request | Response                     | Keterangan                |
| --------- | ------- | ---------------------------- | ------------------------- |
| `Ping`    | `{}`    | `{ id, message, createdAt }` | Test service              |
| `Metrics` | `{}`    | `{ status: string }`         | Metrics / Prometheus data |
| `Health`  | `{}`    | `{ status: string }`         | Health check              |

#### REST API (via API Gateway)

| Endpoint         | Method | Body / Params | Response                          |
| ---------------- | ------ | ------------- | --------------------------------- |
| `/other/ping`    | GET    | -             | `{ id, message, createdAt }`      |
| `/other/metrics` | GET    | -             | `{ status: string }` (text/plain) |
| `/other/health`  | GET    | -             | `{ status: string }`              |