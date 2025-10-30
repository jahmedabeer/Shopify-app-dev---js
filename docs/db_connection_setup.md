# Shopify React Router App with Neon PostgreSQL Setup

## Objective
Deploy a Shopify React Router app to Cloudflare Workers using Neon PostgreSQL instead of SQLite.

## Setup Steps

### Step 1: Create Neon Database
1. Sign up at neon.com (free tier)
2. Create a project
3. Copy the pooled connection string (with `-pooler`)
4. Copy the direct connection string (without `-pooler`)

### Step 2: Create `.dev.vars` File
Create `.dev.vars` in project root:
```
DATABASE_URL=postgresql://user:password@host-pooler.region.aws.neon.tech/dbname?sslmode=require&channel_binding=require
DIRECT_URL=postgresql://user:password@host.region.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

### Step 3: Update Prisma Schema
Update `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Session {
  id            String    @id
  shop          String
  state         String
  isOnline      Boolean   @default(false)
  scope         String?
  expires       DateTime? @default(now())
  accessToken   String
  userId        BigInt?
  firstName     String?
  lastName      String?
  email         String?
  accountOwner  Boolean   @default(false)
  locale        String?
  collaborator  Boolean?  @default(false)
  emailVerified Boolean?  @default(false)
}
```

### Step 4: Update Prisma Client
Update `app/db.server.js`:
```javascript
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

neonConfig.fetchConnectionString = () => process.env.DATABASE_URL;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default prisma;
```

### Step 5: Install Dependencies
```bash
npm install @prisma/adapter-neon @neondatabase/serverless
npm install -D dotenv-cli
```

### Step 6: Run Migration
```bash
npx prisma migrate dev --name init
```

---

## Problems Encountered & Solutions

### Problem 1: Preview Feature Warning
**Error:** `Preview feature "driverAdapters" is deprecated`

**Solution:** Remove `previewFeatures = ["driverAdapters"]` from schema.prisma. It's no longer needed in recent Prisma versions.

---

### Problem 2: Environment Variable Not Found
**Error:** `Error: Environment variable not found: DIRECT_URL`

**Cause:** `.dev.vars` file not in project root or missing content.

**Solution:** 
- Create `.env` file (Prisma CLI looks for `.env`, not `.dev.vars`)
- Add both DATABASE_URL and DIRECT_URL
- Both values must come from Neon console

---

### Problem 3: Migration Failed - datetime Type
**Error:** `ERROR: type "datetime" does not exist`

**Cause:** Prisma generated migration with SQLite syntax (`datetime` instead of PostgreSQL's `timestamp`)

**Solution:**
```bash
rm -r prisma/migrations
npx prisma migrate dev --name init
```

Regenerating migrations uses correct PostgreSQL syntax automatically.

---

### Problem 4: Prisma Client Validation Error
**Error:** 
```
PrismaClientValidationError: Argument `expires` must not be null.
```

**Cause:** Shopify's session storage doesn't provide `expires` value, but schema didn't have a default.

**Solution:** Add default to `expires` field in schema:
```prisma
expires DateTime? @default(now())
```

Then:
```bash
npx prisma migrate reset
```

---

### Problem 5: Database Drift
**Error:** `Drift detected: Your database schema is not in sync with your migration history`

**Cause:** Schema changes didn't match migrations in database.

**Solution:**
```bash
npx prisma migrate reset
```

This drops and recreates the development database, syncing everything. Safe for development (all data lost).

---

## Verification

After all steps, verify with:
```bash
npm run dev
```

Install the Shopify app and check:
1. Session data appears in Neon database
2. No authentication errors
3. App functions normally

**Command to see sessions in Neon:**
```bash
npx prisma studio
```

Opens GUI to view Session table directly.

---

## Key Commands Summary

| Task | Command |
|------|---------|
| Generate Prisma client | `npx prisma generate` |
| Create migration | `npx prisma migrate dev --name init` |
| Reset database | `npx prisma migrate reset` |
| View database GUI | `npx prisma studio` |
| Local development | `npm run dev` |
| Deploy to Workers | `npm run deploy` |

---

## What's Next

With Neon + Prisma working locally, next step is deploying to Cloudflare Workers:

1. Add Wrangler configuration
2. Deploy secrets to Cloudflare
3. Run `npm run deploy`

See Cloudflare Workers + React Router docs for deployment steps.