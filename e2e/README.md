# E2E Test Suite for AI Marketplace

## Overview

This Playwright test suite catches the recurring bugs that keep breaking:
1. **Starred agents caching** - Profile shows empty starred list until manual refresh
2. **Login with GitHub** - Returns 404 after code changes
3. **Star/unstar workflow** - State not updating correctly

## Quick Start

### 1. Install Dependencies

```bash
npm install
npx playwright install chromium
```

### 2. Setup Test Environment

Create `.env.test` in project root:

```bash
TEST_USERNAME=testuser
TEST_EMAIL=test@example.com
TEST_TOKEN=your-jwt-token-here
```

### 3. Create Test User

You need a test user in your database. Use your API or database directly:

```sql
-- Example SQL to create test user
INSERT INTO users (github_id, username, email, role, is_active) 
VALUES (999999, 'testuser', 'test@example.com', 'user', true);
```

### 4. Generate JWT Token

Option A - Use your API:
```bash
curl -X POST http://localhost:8000/api/v1/auth/github \
  -H "Content-Type: application/json" \
  -d '{"code": "test-code"}'
```

Option B - Generate manually with your JWT secret:
```python
import jwt
from datetime import datetime, timedelta

token = jwt.encode({
    'sub': 'testuser',
    'exp': datetime.utcnow() + timedelta(days=30)
}, 'your-secret-key', algorithm='HS256')

print(token)
```

## Running Tests

### Run all tests:
```bash
npm run test:e2e
```

### Run specific test file:
```bash
npx playwright test e2e/starred-agents.spec.ts
```

### Run in headed mode (see browser):
```bash
npx playwright test --headed
```

### Run in debug mode:
```bash
npx playwright test --debug
```

### View test report:
```bash
npx playwright show-report
```

## Test Files

### `starred-agents.spec.ts` - THE CRITICAL TEST
This test reproduces Mac's exact bug:
1. Login
2. Browse to agent detail page
3. View profile → starred tab (empty)
4. Go back, star the agent
5. View profile → starred tab again
6. **BUG**: Starred agent should appear WITHOUT manual refresh

**If this test fails, the caching bug is NOT fixed.**

### `login.spec.ts` - Login Regression Tests
Catches the "Login with GitHub returns 404" bug that keeps recurring.

Tests:
- Login button visible
- OAuth redirect works
- Callback endpoint exists (not 404)
- Auth state persistence
- Logout clears state

## For Claude Code

### DO NOT say "it's fixed" until:

```bash
npm run test:e2e
# All tests must pass ✅
```

### Debugging Failed Tests

1. **Check screenshots**: `playwright-report/` folder has screenshots of failures
2. **Watch video**: Failed tests record video showing exactly what went wrong
3. **Read traces**: Open trace viewer: `npx playwright show-trace trace.zip`

### Common Issues

**Test fails with "Login button not found"**
- Check if homepage is loading correctly
- Verify button text matches regex `/login with github/i`

**Test fails with "404 on OAuth callback"**
- Check backend routing for `/api/v1/auth/github` endpoint
- Verify frontend routing for `/auth/callback`

**Starred test fails - "Agent not visible after starring"**
- This IS the caching bug
- Check React Query config in `UserProfilePage.tsx`
- Add `staleTime: 0, refetchOnMount: 'always'` to starred query
- Verify cache invalidation is targeting correct query key

**Tests timeout**
- Increase timeout in `playwright.config.ts`
- Check if backend/frontend are running
- Look for network errors in test output

## CI/CD Integration

Add to your CI pipeline (GitHub Actions, GitLab CI, etc.):

```yaml
# .github/workflows/test.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
        env:
          TEST_USERNAME: ${{ secrets.TEST_USERNAME }}
          TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
          TEST_TOKEN: ${{ secrets.TEST_TOKEN }}
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Writing New Tests

Follow this pattern:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // 1. Setup
    await page.goto('/some-page');
    
    // 2. Action
    await page.click('button:has-text("Click Me")');
    
    // 3. Assert
    await expect(page.locator('.result')).toBeVisible();
    
    console.log('✅ Test passed');
  });
});
```

## Best Practices

1. **Use data-testid for stable selectors**
   ```tsx
   <button data-testid="star-button">Star</button>
   ```
   ```typescript
   await page.click('[data-testid="star-button"]');
   ```

2. **Wait for network to settle**
   ```typescript
   await page.waitForLoadState('networkidle');
   ```

3. **Add helpful console logs**
   ```typescript
   console.log('📍 Step 1: Navigating to profile...');
   ```

4. **Always verify success/error states**
   ```typescript
   await expect(page.locator('text=/success|error/i')).toBeVisible();
   ```

## Troubleshooting

### "Test user not found"
- Create test user in database
- Verify TEST_USERNAME in .env.test matches database

### "Invalid JWT token"
- Generate new token with longer expiry
- Check JWT secret matches between token generation and backend

### "Tests are flaky"
- Add more `waitForTimeout` or `waitForLoadState`
- Use more specific selectors
- Check for race conditions in React Query cache

### "All tests fail immediately"
- Check if dev server is running: `npm run dev`
- Verify backend API is accessible
- Look at `playwright.config.ts` baseURL setting

## Mac's Debugging Workflow

1. Make code change
2. Run tests: `npm run test:e2e`
3. If fails:
   - Read error message
   - Check screenshots in `playwright-report/`
   - Fix the actual bug (not the test)
4. Re-run until all pass
5. **ONLY THEN** is it "fixed"

No more "it's fixed!" → "nope, still broken" loops.

## Support

When tests fail:
1. Read the error message (it's usually clear)
2. Check screenshots/videos in `playwright-report/`
3. Run in headed mode to watch: `npx playwright test --headed`
4. Add more console.log to understand flow
5. Use debugger: `npx playwright test --debug`

## Success Criteria

✅ All tests pass
✅ No 404 errors on login
✅ Starred agents appear without refresh
✅ Star/unstar toggles correctly
✅ Profile tabs navigate properly

When ALL of these are true, the bug is ACTUALLY fixed.
