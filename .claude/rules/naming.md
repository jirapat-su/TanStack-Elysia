# Naming Conventions

## Files
- Components: PascalCase (`UserCard.tsx`, `Header.tsx`)
- Utilities/hooks: camelCase (`formatDate.ts`, `useAuth.ts`)
- Types: camelCase + `.types.ts` (`user.types.ts`)
- Constants: camelCase (`system.ts`)
- Feature modules (API): `[module].[role].ts` (`createUser.handler.ts`, `createUser.service.ts`)

## Code
- Booleans: `is`, `has`, `can`, `should` prefix
- Constants: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- Inline exports only — no `export { myFunction }` at bottom
- No barrel/index re-export files
- No enums — use `as const` objects or union types

```typescript
// ✅ Good
export const MAX_RETRY_COUNT = 3;
export const myFunction = () => { ... };

// ❌ Bad
const myFunction = () => { ... }; export { myFunction };
```
