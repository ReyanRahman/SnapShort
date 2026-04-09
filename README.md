# SnapShort

SnapShort is a full-stack URL shortener built with `Next.js`, `Prisma`, `SQLite`, and `NextAuth`. It supports guest link creation, email/password accounts, dashboard-based link management, analytics, expirations, and team workspaces with invite links.

## Stack

- `Next.js 16` with App Router
- `TypeScript`
- `Tailwind CSS`
- `SQLite`
- `Prisma`
- `NextAuth` credentials auth
- `Recharts` for analytics

## Features

- Create short links for any valid URL
- Auto-generated short codes or custom aliases
- Guest link creation without authentication
- Signed-in dashboard for editing, enabling/disabling, and archiving links
- Expiry date support
- Redirect analytics:
  - total clicks
  - clicks by day
  - top countries
  - top referrers
  - top devices
- Teams with roles:
  - `OWNER`
  - `EDITOR`
  - `VIEWER`
- Invite-link based workspace onboarding

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Copy environment variables

Create a `.env` file from `.env.example`.

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 3. Create the local SQLite database

This project now defaults to `SQLite` for the easiest local setup.

After copying `.env`, run:

```bash
npm run db:check
npm run prisma:push
npm run prisma:generate
npm run seed
```

### 4. Generate Prisma client

```bash
npm run prisma:generate
```

### 5. Seed demo data

```bash
npm run seed
```

Seed credentials:

- Email: `demo@snapshort.dev`
- Password: `demo12345`

### 6. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Defined in [.env.example](C:\Users\Heyas\OneDrive\Desktop\projects\url-shortener\.env.example):

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`

## Project Structure

- [src/app](C:\Users\Heyas\OneDrive\Desktop\projects\url-shortener\src\app): pages, route handlers, redirect route
- [src/components](C:\Users\Heyas\OneDrive\Desktop\projects\url-shortener\src\components): UI, forms, dashboard blocks
- [src/lib](C:\Users\Heyas\OneDrive\Desktop\projects\url-shortener\src\lib): auth, Prisma, schemas, analytics, permissions
- [prisma/schema.prisma](C:\Users\Heyas\OneDrive\Desktop\projects\url-shortener\prisma\schema.prisma): database schema

## Important Notes

- Guest-created links are intentionally not recoverable in v1.
- Redirect analytics are stored in a local SQLite file during development.
- Rate limiting is currently in-memory and intended for basic development protection.
- In this OneDrive-backed workspace, `next build` can fail because of Windows filesystem locking on generated build directories. `eslint` and `tsc --noEmit` are the reliable validation commands in this environment.

## Validation

Useful commands:

```bash
npm run lint
npm run db:check
npx tsc --noEmit
```

## Notes

- The SQLite database file is created locally as `prisma/dev.db`.
- This setup is ideal for local development and portfolio demos.
- If you later want hosted production data, the project can be switched back to Postgres.
