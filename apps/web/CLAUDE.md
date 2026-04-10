# Web — TanStack Start (React 19 + Tailwind + Paraglide)

## Commands

- Dev: `bun run dev`
- Build: `bun run build`
- Paraglide compile: `bunx paraglide-js compile --project ./project.inlang --outdir ./src/paraglide` (must run before lint if `src/paraglide/` is missing)
- Lint: `bun run lint` (tsc --noEmit + biome check)
- Format: `bun run format`

## Tech Stack

- **Framework:** TanStack Start (SSR via Nitro + Bun)
- **Routing:** TanStack Router (file-based, folder structure)
- **Server state:** TanStack Query (cache, fetch, sync)
- **UI state:** TanStack Store (not Zustand — already in stack)
- **Styling:** Tailwind CSS v4 (CSS-first, no config.js)
- **API client:** Eden Treaty via `@repo/eden` (end-to-end type safety with Elysia)
- **Forms:** TanStack Form + Zod validation (not yet installed)
- **i18n:** Paraglide JS (cookie strategy, EN/TH)
- **Env vars:** `import { env } from '@/env'` (never `process.env`)
- **Path alias:** `@/*` maps to `./src/*`

## Folder Structure

See `.claude/rules/structure-web.md` for full directory tree and TanStack Router conventions.

## Performance (Mandatory)

- **`React.memo`** — ALL exported components. Always set `displayName`.
- **`useMemo`** — expensive computations. **`useCallback`** — handlers passed to children.
- **`useEffectEvent`** — callbacks inside `useEffect` that need latest state without re-triggering.
- **Lazy loading** — `React.lazy` + `Suspense` for heavy components.

## React 19 Features

- **`ref` as prop** — no `forwardRef`. `function MyInput({ ref }: { ref?: React.Ref<HTMLInputElement> })`
- **`<Context value={...}>`** — use as provider directly, no `.Provider`
- **`use()`** — read promise or context conditionally
- **`useOptimistic`** — optimistic UI updates

## TanStack Router Patterns

### Route with loader + search params (Zod validated)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  page: z.number().default(1),
  q: z.string().optional(),
});

export const Route = createFileRoute("/products/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(productsQueryOptions(deps.search)),
  component: ProductsPage,
});

function ProductsPage() {
  const { page, q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const data = Route.useLoaderData();

  return (
    <div>
      <input
        value={q ?? ""}
        onChange={(e) => navigate({ search: { q: e.target.value, page: 1 } })}
      />
    </div>
  );
}
```

### Navigation

```tsx
import { useNavigate, Link } from "@tanstack/react-router";

const navigate = useNavigate();
navigate({ to: "/dashboard" });
navigate({ search: (prev) => ({ ...prev, page: 2 }) });

<Link to="/about">About</Link>
<Link to="/products" search={{ page: 1 }}>Products</Link>
```

## API Client — Eden Treaty (`@repo/eden`)

Use `@repo/eden` for all API calls. Provides end-to-end type safety with the Elysia backend.

### Setup

```tsx
import { createApiClient } from "@repo/eden";
import { env } from "@/env";

export const api = createApiClient(env.VITE_API_URL);
```

### Response structure

Every Eden call returns `{ data, error, status, headers }`:
- `data` — response value (null if status >= 300)
- `error` — error value (null if status < 300)

```tsx
const { data, error } = await api.server.health.get();
if (error) throw error;
return data;
```

## Data Fetching — Eden + TanStack Query

### File structure — one file per API hook

Each API call gets its own file inside a `-api/` folder. Reusable components go in `-components/`. Both are co-located with the route and excluded from routing by the `-` prefix.

```
src/routes/_admin/users/
├── index.tsx
├── -api/
│   ├── useGetAllUsers.ts      # queryOptions for listing
│   ├── useGetUser.ts          # queryOptions for single item
│   └── useCreateUser.ts       # mutation hook
└── -components/
    └── UserList.tsx            # PascalCase, React.memo + displayName
```

**`-components/` rules:**
- One component per file, PascalCase filename matching the component name
- Extract when: component is reusable, has its own props type, or makes the page file too long
- Keep page-specific layout in `index.tsx` — only extract discrete UI blocks

### Naming convention

| Operation | File name | Export |
|---|---|---|
| GET list | `useGetAll[Entity].ts` | `getAll[Entity]QueryOptions` |
| GET single | `useGet[Entity].ts` | `get[Entity]QueryOptions` |
| POST | `useCreate[Entity].ts` | `useCreate[Entity]` |
| PUT/PATCH | `useUpdate[Entity].ts` | `useUpdate[Entity]` |
| DELETE | `useDelete[Entity].ts` | `useDelete[Entity]` |

### Query options (GET) — export `queryOptions`, not a hook

```tsx
// -api/useGetAllUsers.ts
import { queryOptions } from "@tanstack/react-query";
import { api } from "@/libs/api/client";

export const getAllUsersQueryOptions = (search?: { page?: number; q?: string }) =>
  queryOptions({
    queryKey: ["users", search],
    queryFn: async () => {
      const { data, error } = await api.users.get({ query: search });
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });
```

```tsx
// -api/useGetUser.ts
import { queryOptions } from "@tanstack/react-query";
import { api } from "@/libs/api/client";

export const getUserQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data, error } = await api.user({ id }).get();
      if (error) throw error;
      return data;
    },
  });
```

### Mutation hooks (POST/PUT/DELETE) — export a custom hook

Use `Parameters` to extract the body type directly from Eden. Never duplicate types manually.

```tsx
// -api/useCreateUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { api } from "@/libs/api/client";

type CreateUserInput = Parameters<typeof api.user.post>[0];

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      const { data, error } = await api.user.post(input);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate({ to: "/users" });
    },
  });
};
```

## UI State — TanStack Store

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";

const uiStore = new Store({ query: "", page: 1 });

function FilterComponent() {
  const query = useStore(uiStore, (s) => s.query);
  return (
    <input
      value={query}
      onChange={(e) => uiStore.setState((s) => ({ ...s, query: e.target.value, page: 1 }))}
    />
  );
}
```

**Principle:** Server state → TanStack Query. UI state → TanStack Store.

## Tailwind CSS v4

```css
@import "tailwindcss";
@theme {
  --color-primary: oklch(0.7 0.2 240);
  --spacing-18: 4.5rem;
}
```

## i18n — Paraglide

```tsx
import * as m from "@/paraglide/messages";
import { getLocale, setLocale } from "@/paraglide/runtime";

<h1>{m.home_title()}</h1>
<html lang={getLocale()}>
```

- Messages: `locales/en.json`, `locales/th.json`
- Strategy: cookie-based (URL ไม่เปลี่ยน)

## Forms — TanStack Form + Zod

```tsx
const form = useForm({
  defaultValues: { email: "" },
  onSubmit: async ({ value }) => {
    const parsed = CreateUserSchema.safeParse(value);
    if (!parsed.success) return;
    await mutation.mutateAsync(parsed.data);
  },
});
```

## Do NOT

- Use `next/router`, `next/navigation`, or any Next.js APIs
- Use `'use client'` / `'use server'` directives (TanStack Start model is different)
- Use `dynamic()` from Next.js — use `React.lazy` + Suspense
- Use Zustand — use TanStack Store (already in stack)
- Fetch data in components — use route loaders + TanStack Query
- Store server data in UI state — server state belongs in TanStack Query
- Use raw `fetch` for API calls — use `@repo/eden` for type-safe API access
- Use `process.env` — use `@/env`
