---
paths:
  - "apps/api/**"
---

# API — Folder Structure

```
src/
├── features/
│   ├── router.ts                         # Central router (imports all feature routers)
│   └── [feature]/                        # Feature folder (e.g., user, product)
│       ├── [feature].router.ts           # Feature router (aggregates handlers)
│       ├── domain/                       # 🟢 DOMAIN LAYER (pure, no dependencies)
│       │   ├── [feature].errors.ts       # Tagged errors (Data.TaggedError)
│       │   ├── [feature].types.ts        # Domain types, value objects, entities
│       │   ├── [feature].rules.ts        # Business rules (optional)
│       │   └── [feature].events.ts       # Domain events (optional)
│       ├── ports/                        # 🔵 PORT DEFINITIONS (types only)
│       │   ├── [feature].repository.port.ts
│       │   └── [feature].external.port.ts (optional)
│       └── [module]/                     # 🟡 USE CASE (application + infrastructure)
│           ├── [module].handler.ts       # Driver adapter — Elysia HTTP route
│           ├── [module].service.ts       # Use case — Effect orchestration
│           ├── [module].repository.ts    # Driven adapter — Prisma + Effect
│           ├── [module].schema.ts        # Zod schemas (request/response)
│           └── [module].utils.ts         # Module helpers (optional)
├── libs/                                 # Shared libraries (NO barrel files)
│   ├── auth/                             # import from '@/libs/auth/jwt'
│   ├── cache/
│   ├── effect/
│   ├── logger/
│   └── prisma/                           # import from '@/libs/prisma/client'
├── plugins/                              # Elysia plugins
├── utils/                                # Cross-feature utilities
├── constants/                            # App-wide constants
├── env/                                  # Environment config (t3-oss)
└── index.ts                              # App entry point
```

## Layer rules

- **domain/** — Pure types and errors. No imports from libs/, plugins/, or external packages (except Effect `Data`).
- **ports/** — Type definitions only. Contracts that adapters implement.
- **[feature].router.ts** — Defines the feature `prefix` (e.g., `/health`). Handlers use `/` as their path.
- **[module].handler.ts** — Thin. Parse Zod → call service → map errors to HTTP. Route path is `/`, prefix comes from the feature router.
- **[module].service.ts** — Effect orchestration. Business logic lives here.
- **[module].repository.ts** — Prisma calls wrapped in Effect.
- **libs/** — NO barrel files. Import directly: `import { prisma } from '@/libs/prisma/client'`
