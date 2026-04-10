# API — Elysia + Effect + Prisma

## Commands

- Dev: `bun run dev` (port 3100)
- Build: `bun run build`
- Lint: `bun run lint` (tsc --noEmit + biome check)
- Format: `bun run format`

## Tech Stack

- **Runtime:** Bun
- **Framework:** Elysia
- **Validation:** Zod ONLY. Never use TypeBox/@sinclair/typebox.
- **Business logic:** Effect library ONLY. Every service, data flow, and async operation must use Effect. No raw try/catch, no raw Promises.
- **Database:** Prisma (via `@prisma/client`). All Prisma calls wrapped in Effect.
- **Caching:** Keyv (in-memory Map). See [Caching](#caching) section.
- **Env vars:** `import { env } from '@/env'` (never `process.env`)
- **Path alias:** `@/*` maps to `./src/*`

## Folder Structure

See `.claude/rules/structure-api.md` for full directory tree and layer rules.

## API-Specific Naming

- Tagged errors: `Data.TaggedError("Domain/Entity/Error")`
- Effect services: PascalCase matching the type name
- Layers: `{ServiceName}Live` suffix
- Zod schemas: `{Entity}{Action}Schema` (e.g., `CreateUserSchema`)
- Handlers: `[module].handler.ts`, Services: `[module].service.ts`

## Effect Patterns

### Services — Context.Tag + Effect.gen

```typescript
import { Context, Effect, Layer } from "effect";

type UserService = {
  readonly findById: (id: string) => Effect.Effect<User, UserNotFoundError>;
};
const UserService = Context.GenericTag<UserService>("UserService");

const UserServiceLive = Layer.succeed(UserService, {
  findById: (id) =>
    Effect.gen(function* () {
      const repo = yield* UserRepository;
      return yield* repo.findById(id);
    }),
});
```

### Tagged Errors — One class per error

```typescript
import { Data } from "effect";

export class UserNotFoundError extends Data.TaggedError(
  "Repository/User/NotFound",
)<{ readonly userId: string }> {}
```

### Prisma in Effect — Wrap every call

```typescript
const findById = (id: string) =>
  Effect.tryPromise({
    try: () => prisma.user.findUniqueOrThrow({ where: { id } }),
    catch: (e) => new DatabaseError({ cause: e }),
  });
```

### Running Effect in Elysia handlers

```typescript
// Handler is thin: parse Zod → call service → map errors
Effect.match(serviceResult, {
  onFailure: (error) => {
    switch (error._tag) {
      case "Repository/User/NotFound":
        return status(404, { message: "User not found" });
      case "Repository/User/Error":
        return status(500, { message: "Database error" });
      default:
        return status(500, { message: "Internal server error" });
    }
  },
  onSuccess: (data) => status(200, data),
});
```

## Elysia Instances

- **Every `new Elysia()` MUST have a `name`** — enables plugin deduplication so lifecycle hooks don't run multiple times when the same plugin is used across instances
- **Feature router defines the `prefix`** — handlers use `/` as their path, the prefix comes from the feature router

```typescript
import { Elysia } from "elysia";

// ✅ Good — feature router owns the prefix, handler uses "/"
const getHealthHandler = new Elysia({ name: "health/get-health" })
  .get("/", () => ({ status: "ok" }));

const healthRouter = new Elysia({ name: "health", prefix: "/health" })
  .use(getHealthHandler);

// ❌ Bad — handler hardcodes the full path, no prefix on router
const getHealthHandler = new Elysia({ name: "health/get-health" })
  .get("/health", () => ({ status: "ok" }));

const healthRouter = new Elysia({ name: "health" })
  .use(getHealthHandler);
```

## OpenAPI Route Metadata

- **Every route MUST have `detail`** with `tags`, `summary`, and `description` — this generates the OpenAPI spec served at `/docs`
- `tags` groups routes in the documentation UI (use the feature name, e.g., `["User"]`, `["Server"]`)
- `summary` is a short label (1-5 words)
- `description` explains what the endpoint does (1-2 sentences)

```typescript
// ✅ Good — full detail metadata
new Elysia({ name: "user/get-user" }).get("/", handler, {
  response: GetUserResponseSchema,
  detail: {
    tags: ["User"],
    summary: "Get user by ID",
    description: "Returns a single user by their unique identifier",
  },
});

// ❌ Bad — no detail metadata (won't appear properly in OpenAPI docs)
new Elysia({ name: "user/get-user" }).get("/", handler, {
  response: GetUserResponseSchema,
});
```

## Validation

- Define Zod schemas in `[module].schema.ts`
- Export inferred types: `type CreateUser = z.infer<typeof CreateUserSchema>`
- Validate input at the handler layer via Elysia's Standard Schema support — Elysia auto-validates and returns 422 on failure
- **Every route MUST define a `response` schema**
- **Every route with input MUST define `params`, `body`, or `query` schemas** — this also generates OpenAPI request documentation

### Params, Body, Query Validation

```typescript
import { Elysia } from "elysia";
import { z } from "zod";

// Params validation — :id in path
new Elysia({ name: "user/get-user" }).get("/:id", ({ params }) => {
  return findUser(params.id);
}, {
  params: z.object({ id: z.string().uuid() }),
  response: { 200: GetUserResponseSchema, 404: ErrorSchema },
  detail: { tags: ["User"], summary: "Get user", description: "Get user by ID" },
});

// Body validation — POST/PUT/PATCH
new Elysia({ name: "user/create-user" }).post("/", ({ body }) => {
  return createUser(body);
}, {
  body: z.object({ name: z.string().min(1), email: z.string().email() }),
  response: { 201: CreateUserResponseSchema, 422: ErrorSchema },
  detail: { tags: ["User"], summary: "Create user", description: "Create a new user" },
});

// Query validation — search/filter
new Elysia({ name: "user/list-users" }).get("/", ({ query }) => {
  return listUsers(query);
}, {
  query: z.object({ page: z.coerce.number().default(1), limit: z.coerce.number().default(20) }),
  response: ListUsersResponseSchema,
  detail: { tags: ["User"], summary: "List users", description: "List users with pagination" },
});
```

### Response Schema

```typescript
// Single response schema
new Elysia({ name: "health/get-health" }).get("/", () => ({ status: "ok" }), {
  response: z.object({ status: z.string() }),
});

// Response schema per status code
new Elysia({ name: "user/get-user" }).get("/:id", ({ params, status }) => {
  if (!user) return status(404, { error: "User not found" });
  return { id: user.id, name: user.name };
}, {
  params: z.object({ id: z.string() }),
  response: {
    200: z.object({ id: z.string(), name: z.string() }),
    404: z.object({ error: z.string() }),
  },
});
```

## Error Handling

- NEVER use try/catch. Use `Effect.tryPromise`, `Effect.catchTag`, `Effect.catchAll`.
- Every error is a tagged class extending `Data.TaggedError`.
- Map errors to HTTP responses at the handler layer.
- Unknown errors become 500 via a global Elysia `onError` handler.
- Never expose internal error details to clients.
- Use `Effect.all` for parallel operations.

## Security

- Always validate input with Zod schemas at handler layer
- Use parameterized queries (Prisma handles this)
- Implement rate limiting on public endpoints
- Log security events (failed auth, suspicious activity)
- Use soft deletes to preserve audit trail

## Caching

- **Library:** Keyv (in-memory Map store)
- **Import:** `import { CacheService } from '@/libs/cache/cache'`
- **Layer:** `CacheServiceLive` — provide via Effect Layer
- **Default TTL:** 5 minutes (300,000 ms), override per operation
- **Cache errors are swallowed** — if cache fails, the system continues without cache (just slower)

### Usage in Service Layer (with tags)

```typescript
import { Effect } from "effect";
import { CacheService } from "@/libs/cache/cache";

const findByIdWithRole = (id: string, roleId: string) =>
  Effect.gen(function* () {
    const cache = yield* CacheService;
    return yield* cache.getOrSet(
      `user:profile:${id}`,
      () => fetchUserFromDb(id),
      { ttl: 60_000, tags: [`user:${id}`, `role:${roleId}`] },
    );
  });
```

### Invalidation on Mutation

```typescript
const updateUser = (id: string, data: UpdateUserInput) =>
  Effect.gen(function* () {
    const cache = yield* CacheService;
    const result = yield* saveUserToDb(id, data);
    yield* cache.delete(`user:profile:${id}`);
    return result;
  });
```

### Tag-based Invalidation (cross-entity)

```typescript
const updateRole = (roleId: string, data: UpdateRoleInput) =>
  Effect.gen(function* () {
    const cache = yield* CacheService;
    const result = yield* saveRoleToDb(roleId, data);
    yield* cache.invalidateByTag(`role:${roleId}`);
    return result;
  });
```

### Providing CacheServiceLive Layer

```typescript
import { Effect } from "effect";
import { CacheService, CacheServiceLive } from "@/libs/cache/cache";

const program = Effect.gen(function* () {
  const cache = yield* CacheService;
  return yield* cache.get("key");
});

Effect.runPromise(Effect.provide(program, CacheServiceLive));
```

## Do NOT

- Use TypeBox for validation
- Use raw try/catch or Promise chains in business logic
- Put business logic in handler files — handlers only parse input + call services + map errors
- Create barrel/index re-export files in libs/
- Use `process.env` — use `@/env`
