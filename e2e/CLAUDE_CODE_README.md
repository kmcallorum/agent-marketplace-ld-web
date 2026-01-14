# CLAUDE CODE QUICK REFERENCE

## Your Job
Make ALL tests pass. No excuses. No "it's fixed" until tests are green.

## Run Tests
```bash
npm run test:e2e
```

## When Tests Fail

### 1. Read the Error
The error message tells you exactly what's broken.

### 2. Look at Screenshots
```bash
open playwright-report/index.html
```

### 3. Fix The Actual Bug
Don't try to fix the test. Fix the code.

### 4. Run Again
```bash
npm run test:e2e
```

### 5. Repeat Until Green
No shortcuts. All tests must pass.

## Common Failures

### "Agent not visible after starring"
**Problem**: Caching bug - starred agents don't appear without refresh

**Fix**: Add to `UserProfilePage.tsx` line 33:
```typescript
const { data: starredData, isLoading: starredLoading } = useQuery({
  queryKey: ['user-starred', username],
  queryFn: () => usersService.getStarredAgents(username!),
  enabled: !!username && activeTab === 'starred',
  staleTime: 0,              // ← ADD THIS
  refetchOnMount: 'always',  // ← ADD THIS
});
```

### "Login redirects to 404"
**Problem**: OAuth callback route missing or broken

**Fix locations to check**:
1. Backend: `/api/v1/auth/github` endpoint exists
2. Frontend: Router has `/auth/callback` route
3. GitHub OAuth app settings: redirect URI matches

### "Login button not found"
**Problem**: Homepage not rendering correctly

**Check**:
1. Is dev server running?
2. Does homepage load in browser?
3. Check button text matches: "Login with GitHub"

## Debug Mode

Run tests in slow motion with browser visible:
```bash
npx playwright test --headed --debug
```

Watch what's happening:
```bash
npx playwright test --headed
```

## Important Rules

❌ Don't say "it's fixed" if tests still fail
❌ Don't modify tests to make them pass
❌ Don't skip failing tests
❌ Don't ask Mac to test manually

✅ Read error messages carefully
✅ Fix the root cause
✅ Run tests after every change
✅ All tests must be green before claiming success

## Success Looks Like

```
Running 8 tests using 1 worker

  ✓ starred-agents.spec.ts:27:3 › should show newly starred agent in profile without refresh (12s)
  ✓ starred-agents.spec.ts:105:3 › should handle star/unstar toggle correctly (5s)
  ✓ starred-agents.spec.ts:137:3 › should show empty state when no agents starred (3s)
  ✓ login.spec.ts:10:3 › should display login button on homepage (2s)
  ✓ login.spec.ts:19:3 › should redirect to GitHub OAuth when clicking login (3s)
  ✓ login.spec.ts:42:3 › should have working OAuth callback endpoint (2s)
  ✓ login.spec.ts:59:3 › should preserve auth state after page reload (2s)
  ✓ login.spec.ts:80:3 › should clear auth state on logout (3s)

  8 passed (32s)
```

This ☝️ is what success looks like. Nothing less.

## Getting Help

If stuck:
1. Read `e2e/README.md`
2. Check screenshots in `playwright-report/`
3. Run with `--debug` flag
4. Ask Mac specific questions with error messages

## Final Word

Tests don't lie. If they fail, it's broken. If they pass, it's fixed.

No more "trust me, it works" - let the tests prove it.
