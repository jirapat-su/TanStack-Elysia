# TypeScript Rules

- Always `type`, never `interface`
- No `any` — use `unknown` + type guards or Zod
- No unsafe `as` — use type guards or Zod
- Use `satisfies` for type checking without widening
- Prefer union types over enums for constants

```typescript
// ✅ Good
type User = { id: string; name: string };
type Status = "active" | "inactive" | "pending";
const config = { timeout: 5000 } satisfies Config;

// ❌ Bad
interface User { id: string; name: string }
enum Status { Active, Inactive, Pending }
const config: Config = { timeout: 5000 };
```
