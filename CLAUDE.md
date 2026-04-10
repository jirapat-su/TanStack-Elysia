# my-turborepo

Bun monorepo managed by Turborepo.

## Workspace

| App/Package | Path | Description |
|---|---|---|
| `web` | `apps/web` | TanStack Start (React 19 + Tailwind + Paraglide i18n) |
| `api` | `apps/api` | Elysia + Effect + Prisma (see `apps/api/CLAUDE.md`) |
| `eden` | `packages/eden` | Elysia Eden Treaty client — shared API client with end-to-end type safety |
| `shadcn` | `packages/shadcn` | shadcn/ui components — shared design system (`@repo/shadcn`) |
| `typescript-config` | `packages/typescript-config` | Shared tsconfig (`base.json`, `web.json`) |

## Commands

```bash
bun run dev          # Start all apps
bun run build        # Build all apps
bun run lint         # Lint via biome
bun run format       # Format via biome
bun run check-deps   # Check outdated deps
bun run upgrade-deps # Interactive upgrade
bun run check-types  # Type-check all packages
bun run clean-deps   # Remove node_modules, lockfiles, caches
```

## Important

- **Never make autonomous decisions** — always follow project documentation (CLAUDE.md, `.claude/rules/`). If anything is unclear or uncertain, ask before starting the task.
- **Always run `bun run lint` after completing a task** — must pass with 0 errors and 0 warnings. Fix all issues before considering the task done.

## Conventions

- **Package manager:** Bun only — never npm/yarn/pnpm
- **Linting & formatting:** Biome (root `biome.json`) — no ESLint, no Prettier
- **TypeScript config:** Extend from `@repo/typescript-config/base.json` or `web.json`
- **Coding rules:** See `.claude/rules/` for quality, typescript, naming, git, testing, documentation standards
- **API client:** Use `@repo/eden` for all API calls from frontends — never raw `fetch`
- **Web rules:** See `apps/web/CLAUDE.md` for TanStack Start + React patterns
- **API rules:** See `apps/api/CLAUDE.md` for Effect + Elysia patterns
