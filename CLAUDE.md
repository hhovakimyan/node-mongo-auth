# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Node.js + Express + TypeScript authentication server backed by MongoDB and Redis. Node version is pinned to v24.12.0 via `.nvmrc`.

## Commands

```bash
npm start          # run with tsx --watch (dev, hot reload)
npm run build      # tsc (compiles to dist/)
npm run lint       # eslint src
npm run format     # prettier --write src
npx tsc --noEmit   # type-check only
```

Tests are not yet set up — `npm test` is a placeholder.

## Architecture

Entry point is `src/index.ts`. Express app is assembled there: Redis initialization, JSON body parsing, validation middleware, and route handlers wired to controllers.

```
src/
  controllers/    # request handlers (static class methods)
  dbSchemas/      # Mongoose schema definitions and model types
  integrations/   # external service clients (singletons)
    MongoDb/      # native MongoClient + MongooseClient
    Redis/        # RedisClient
  middleware/     # Express middleware (authentication, validation)
  repositories/   # data-access layer (per-collection classes)
  routes/         # Express Router definitions (auth, user)
  types/          # shared TypeScript interfaces and types
    global/       # ambient declarations (env vars, Express augmentation)
  validation/     # yup schemas (one schema per route group)
```

**Request flow:** route → `authenticate()` middleware (JWT + Redis blacklist check) → `validate()` middleware (yup schema) → controller → repository → MongooseClient

**Key config:**
- `tsconfig.json` extends `@tsconfig/node24`, strict mode, `moduleResolution: nodenext`
- JWT tokens are blacklisted in Redis on logout (6-hour TTL)

## Subpath imports

All internal imports use Node.js native subpath imports (`#`-prefixed) — never relative paths across directories. Defined in the `"imports"` field of `package.json`; no tsconfig `paths` needed.

| Specifier | Source directory |
|---|---|
| `#controllers/*` | `src/controllers/` |
| `#dbSchemas/*` | `src/dbSchemas/` |
| `#integrations/*` | `src/integrations/` |
| `#middleware/*` | `src/middleware/` |
| `#repositories/*` | `src/repositories/` |
| `#routes/*` | `src/routes/` |
| `#types/*` | `src/types/` |
| `#validation/*` | `src/validation/` |

Each entry uses a `default` condition pointing to `src/**/*.ts`. Wildcard expansion handles nested paths (e.g. `#integrations/Redis/RedisClient`).