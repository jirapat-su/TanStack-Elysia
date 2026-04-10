# Documentation

- **No comments.** No `//`, no `/* */`, no inline comments. Code should be self-documenting.
- **Exception:** JSDoc (`/** */`) is allowed ONLY for complex algorithms, public APIs, non-obvious types, or functions with side effects.
- **Exception:** `// Arrange`, `// Act`, `// Assert` markers in test files are allowed.

```typescript
// ✅ Good — JSDoc for complex logic only
/**
 * Calculates the discounted price based on user tier and promo code.
 *
 * @param originalPrice - The original price before discounts
 * @param userTier - User's membership tier
 * @param promoCode - Optional promotional code
 * @returns The final price after applying all discounts
 */
export const calculateDiscount = (
  originalPrice: number,
  userTier: UserTier,
  promoCode?: string,
): number => {
  // ...
};

// ❌ Bad — unnecessary comments
const age = 25; // user age
// check if user is active
if (user.isActive) { ... }
// loop through users
for (const user of users) { ... }
```
