# Testing Conventions

- Unit: `[name].test.ts`, Integration: `[name].integration.test.ts`, E2E: `[feature].e2e.test.ts`
- Structure: `describe` → `describe("when...")` → `it("should...")` + Arrange/Act/Assert

```typescript
describe("UserService", () => {
  describe("when user exists", () => {
    it("should return user data", () => {
      // Arrange
      const userId = "123";
      // Act
      const result = findById(userId);
      // Assert
      expect(result.name).toBe("John");
    });
  });
});
```
