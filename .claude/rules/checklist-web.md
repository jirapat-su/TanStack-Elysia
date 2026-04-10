---
paths:
  - "apps/web/**"
---

# Pre-completion Checklist (MANDATORY)

Before considering ANY task in apps/web done, verify EVERY item below. Do NOT skip any step.

## React Components
- [ ] All exported components wrapped with `React.memo`
- [ ] All memoized components have `displayName` set
- [ ] All event handlers passed to children use `useCallback`
- [ ] Expensive computations wrapped with `useMemo`
- [ ] `useEffectEvent` used for callbacks inside `useEffect` that need latest state
- [ ] Heavy components use `React.lazy` + `Suspense`

## Imports & Packages
- [ ] UI components from `@repo/shadcn` — NOT local `components/ui/`
- [ ] API calls use `@repo/eden` — NOT raw `fetch`
- [ ] Env vars from `@/env` — NOT `process.env`
- [ ] No Next.js APIs (`next/router`, `'use client'`, `dynamic()`)
- [ ] No Zustand — use TanStack Store
- [ ] No barrel/index re-export files

## TypeScript
- [ ] `type` keyword — NOT `interface`
- [ ] No `any` — use `unknown` + type guards or Zod
- [ ] No unsafe `as` casts
- [ ] Type imports use `import type`

## Styling
- [ ] Use shadcn design tokens (`text-foreground`, `bg-background`, `border-border`)
- [ ] No custom CSS vars (`var(--custom)`) — use shadcn tokens

## Code Quality
- [ ] No comments (except JSDoc for complex APIs)
- [ ] No `console.log` — use `logger`
- [ ] Early returns (guard clauses) over nested if/else
- [ ] `const` over `let`, never `var`

## Naming
- [ ] Component files: PascalCase (`.tsx`)
- [ ] Utility files: camelCase (`.ts`)
- [ ] Booleans: `is`/`has`/`can`/`should` prefix
- [ ] Constants: UPPER_SNAKE_CASE

## Final
- [ ] `bun run lint` passes with 0 errors, 0 warnings
