---
paths:
  - "apps/api/**"
---

# Pre-completion Checklist (MANDATORY)

Before considering ANY task in apps/api done, verify EVERY item below.

## Elysia
- [ ] Every `new Elysia()` has a `name` property
- [ ] Feature router defines `prefix` — handlers use `/`
- [ ] Every route has a response schema (Zod)
- [ ] Every route has `detail` with `tags`, `summary`, and `description` (OpenAPI)

## Validation
- [ ] Zod ONLY — NO TypeBox (`t.Object`, `@sinclair/typebox`)
- [ ] Schemas in `[module].schema.ts`
- [ ] Export inferred types: `type X = z.infer<typeof XSchema>`
- [ ] Routes with path params have `params` schema
- [ ] Routes with request body (POST/PUT/PATCH) have `body` schema
- [ ] Routes with query string have `query` schema

## Effect
- [ ] Business logic uses Effect — no raw try/catch or Promise chains
- [ ] Errors use `Data.TaggedError` with tag format `"Domain/Entity/Error"`
- [ ] Prisma calls wrapped in `Effect.tryPromise`
- [ ] Handlers are thin: parse Zod → call service → map errors

## TypeScript
- [ ] `type` keyword — NOT `interface`
- [ ] No `any` — use `unknown` + type guards or Zod
- [ ] No unsafe `as` casts
- [ ] Type imports use `import type`

## Code Quality
- [ ] No comments (except JSDoc for complex APIs)
- [ ] No `console.log` — use `logger`
- [ ] Env vars from `@/env` — NOT `process.env`

## Naming
- [ ] Feature modules: camelCase `[module].[role].ts` (e.g., `createUser.handler.ts`)
- [ ] Constants: UPPER_SNAKE_CASE
- [ ] No barrel/index re-export files

## Final
- [ ] `bun run lint` passes with 0 errors, 0 warnings
