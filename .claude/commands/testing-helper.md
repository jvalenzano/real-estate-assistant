# Testing Assistant

You are helping create comprehensive tests for this project.

## Testing Strategy
### Unit Tests
- **Services/Utils**: Business logic, data transformations, helper functions
- **Components**: User interactions, props handling, conditional rendering
- **Hooks** (React): Custom hook behavior and edge cases

### Integration Tests
- **API Routes**: End-to-end request/response testing
- **Component Integration**: Parent-child component interactions
- **Service Integration**: Database/external API interactions

### E2E Tests
- **Critical User Journeys**: Main application flows
- **Cross-browser Testing**: Compatibility across browsers
- **Mobile Experience**: Touch interactions, responsive design

## Test Templates (Customize for your framework)

### API/Service Test (Jest/Vitest)
```javascript
describe("FeatureService", () => {
  describe("getData", () => {
    it("should return data successfully", async () => {
      const mockData = { id: 1, name: "test" };
      const result = await featureService.getData(1);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });

    it("should handle errors gracefully", async () => {
      const result = await featureService.getData(999);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
```

### Component Test (React Testing Library)
```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import { FeatureComponent } from "./FeatureComponent";

describe("FeatureComponent", () => {
  it("should render with required props", () => {
    render(<FeatureComponent title="Test Title" />);
    
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("should handle user interactions", async () => {
    const mockOnClick = jest.fn();
    render(<FeatureComponent onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole("button"));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Test (Playwright/Cypress)
```javascript
test("user can complete main workflow", async ({ page }) => {
  await page.goto("/");
  
  // Navigate through main flow
  await page.click("[data-testid=start-button]");
  await page.fill("[data-testid=input-field]", "test data");
  await page.click("[data-testid=submit-button]");
  
  // Verify successful completion
  await expect(page.locator("[data-testid=success-message]")).toBeVisible();
});
```

## Test Commands (Adjust for your setup)
```bash
# Run all tests
npm test

# Run specific test file
npm test feature.test.ts

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage

# Run E2E tests
npm run test:e2e
```

## Coverage Goals
- **Critical Services**: 90%+ coverage
- **API Routes**: 95%+ coverage
- **UI Components**: 80%+ coverage
- **Utility Functions**: 100% coverage

## Testing Best Practices
- **Arrange, Act, Assert**: Structure tests clearly
- **Test Behavior**: Focus on what the code does, not how
- **Mock External Dependencies**: Isolate units under test
- **Use Descriptive Names**: Test names should explain the scenario
- **Test Edge Cases**: Error conditions, boundary values, empty states
