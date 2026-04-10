# TanStack + Elysia Monorepo

A full-stack TypeScript monorepo powered by **TanStack Start**, **Elysia**, and **Effect** — with end-to-end type safety from database to UI.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | TanStack Start, TanStack Router, TanStack Query, React 19, Tailwind CSS v4, shadcn/ui, Paraglide JS |
| Backend | Elysia, Effect, Prisma, Zod |
| API Client | Eden Treaty (end-to-end type safety) |
| Tooling | Turborepo, Bun, Biome, TypeScript |

## Workspace

| Package | Path | Description |
|---|---|---|
| `web` | `apps/web` | TanStack Start frontend (React 19 + Tailwind + Paraglide i18n) |
| `api` | `apps/api` | Elysia + Effect + Prisma backend |
| `@repo/eden` | `packages/eden` | Eden Treaty client — shared API client with end-to-end type safety |
| `@repo/shadcn` | `packages/shadcn` | shadcn/ui components — shared design system |
| `@repo/typescript-config` | `packages/typescript-config` | Shared tsconfig |

## Getting Started

```bash
# Install dependencies
bun install

# Start all apps in development
bun run dev

# Build all apps
bun run build
```

## Commands

```bash
bun run dev          # Start all apps
bun run build        # Build all apps
bun run lint         # Lint via Biome
bun run format       # Format via Biome
bun run check-types  # Type-check all packages
bun run check-deps   # Check outdated deps
bun run upgrade-deps # Interactive upgrade
bun run clean-deps   # Remove node_modules, lockfiles, caches
```

## License

MIT
