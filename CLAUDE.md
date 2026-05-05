# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Node.js + Express + TypeScript authentication server backed by MongoDB. Node version is pinned to v24.12.0 via `.nvmrc`.

## Commands

```bash
npm start        # run with tsx --watch (dev, hot reload)
npm run build    # tsc + tsc-alias (compiles to dist/)
npx tsc --noEmit # type-check only
```

Tests are not yet set up — `npm test` is a placeholder.

## Architecture

Entry point is `src/index.ts`. Express app is assembled there: JSON body parsing, validation middleware, and route handlers wired to controllers.

```
src/
  controllers/    # request handlers (static class methods)
  database/       # MongoClient singleton (connection management)
  middleware/      # Express middleware (validation wrapper)
  repositories/   # data-access layer (per-collection classes)
  types/          # shared TypeScript interfaces and types
  validation/     # yup schemas (one schema per route group)
```

**Request flow:** route → `validate()` middleware (yup schema) → controller → repository → MongoClient

**Key config:**
- `tsconfig.json` extends `@tsconfig/node24`, strict mode, `moduleResolution: nodenext`
- `baseUrl: "."` with per-directory path aliases (see below)


## Subpath imports

All internal imports use Node.js native subpath imports (`#`-prefixed) — never relative paths across directories. Defined in the `"imports"` field of `package.json`; no tsconfig `paths` needed.

| Specifier | Source directory |
|---|---|
| `#controllers/*` | `src/controllers/` |
| `#middleware/*` | `src/middleware/` |
| `#repositories/*` | `src/repositories/` |
| `#types/*` | `src/types/` |
| `#validation/*` | `src/validation/` |
| `#database/*` | `src/database/` |

Each entry uses a `types` condition (points to `src/**/*.ts` for TypeScript) and a `default` condition (points to `dist/**/*.js` for runtime).