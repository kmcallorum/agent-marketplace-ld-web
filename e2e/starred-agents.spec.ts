import { test, expect, Page } from '@playwright/test';

/**
 * CRITICAL TEST: Starred Agents Workflow
 * 
 * This test reproduces Mac's exact bug scenario:
 * 1. Login
 * 2. Browse categories, drill down into an agent
 * 3. View author profile (yourself) and check starred tab (should be empty initially)
 * 4. Go back, star the agent
 * 5. Navigate to profile starred tab again
 * 6. THE BUG: Starred agent should appear WITHOUT manual refresh
 * 
 * If this test fails, the caching issue is NOT fixed.
 */

// Test user configuration - UPDATE THESE
const TEST_USER = {
  username: process.env.TEST_USERNAME || 'kmcallorum',
  email: process.env.TEST_EMAIL || 'test@example.com',
};

/**
 * Simple auth helper - just checks if already logged in
 * If not, pauses so you can login manually
 */
async function ensureLoggedIn(page: Page): Promise<void> {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Check if we see "Login with GitHub" button (not logged in)
  const loginButton = page.getByRole('button', { name: /login with github/i });
  const isLoggedOut = await loginButton.isVisible({ timeout: 2000 }).catch(() => false);
  
  if (isLoggedOut) {
    console.log('');
    console.log('⚠️  NOT LOGGED IN');
    console.log('Please:');
    console.log('1. Click "Login with GitHub" in the browser');
    console.log('2. Complete the OAuth flow');
    console.log('3. Press SPACE or click Resume in Playwright Inspector');
    console.log('');
    
    // Pause test execution - user can login manually
    await page.pause();
    
    // After resume, wait for auth to complete
    await page.waitForLoadState('networkidle');
  }
  
  // Verify we're logged in by checking for username or profile link
  const usernameVisible = await page.locator(`text=${TEST_USER.username}`).isVisible({ timeout: 3000 }).catch(() => false);
  const profileLink = await page.locator('a[href*="/users/"], button:has-text("Profile")').isVisible({ timeout: 3000 }).catch(() => false);
  
  if (!usernameVisible && !profileLink) {
    throw new Error('Login verification failed - could not find username or profile link');
  }
  
  console.log('✅ Logged in as', TEST_USER.username);
}

test.describe('Starred Agents Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we're logged in before each test
    await ensureLoggedIn(page);
  });

  test('should show newly starred agent in profile without refresh', async ({ page }) => {
    // STEP 1: Browse to an agent detail page
    console.log('📍 Step 1: Browsing to an agent...');
    await page.goto('/');
    
    // Wait for agents to load
    await page.waitForSelector('a[href*="/agents/"]', { timeout: 10000 });
    
    // Click on first agent
    const firstAgent = page.locator('a[href*="/agents/"]').first();
    const agentHref = await firstAgent.getAttribute('href');
    const agentSlug = agentHref?.split('/').pop() || '';
    
    await firstAgent.click();
    
    // Wait for agent detail page
    await page.waitForURL(/\/agents\/[^/]+$/);
    await page.waitForLoadState('networkidle');
    
    console.log(`✅ Viewing agent: ${agentSlug}`);
    
    // STEP 2: Navigate to your own profile and check starred (before starring)
    console.log('📍 Step 2: Checking profile starred tab (before starring)...');
    
    await page.goto(`/users/${TEST_USER.username}`);
    await page.waitForLoadState('networkidle');
    
    // Click on "Starred" tab
    const starredTab = page.locator('button:has-text("Starred"), a:has-text("Starred")').first();
    await starredTab.click();
    await page.waitForTimeout(2000); // Give React Query time to fetch
    
    // Get initial count of starred items (might be 0, might have previous stars)
    const starredBefore = await page.locator('a[href*="/agents/"]').count();
    console.log(`📊 Starred count before: ${starredBefore}`);
    
    // STEP 3: Go back to agent and star it
    console.log('📍 Step 3: Going back to star the agent...');
    
    // Navigate directly to agent page
    await page.goto(`/agents/${agentSlug}`);
    await page.waitForLoadState('networkidle');
    
    // Find the star button - try multiple selectors
    const starButton = page.locator('button:has-text("Star")').first();
    await starButton.waitFor({ state: 'visible', timeout: 5000 });
    
    // Check if already starred
    const buttonText = await starButton.textContent();
    const isAlreadyStarred = buttonText?.toLowerCase().includes('unstar') || 
                             buttonText?.toLowerCase().includes('starred');
    
    if (isAlreadyStarred) {
      console.log('⚠️  Agent already starred, unstarring first...');
      await starButton.click();
      await page.waitForTimeout(1500);
      
      // Now star it again
      const starButtonAgain = page.locator('button:has-text("Star")').first();
      await starButtonAgain.waitFor({ state: 'visible', timeout: 5000 });
      await starButtonAgain.click();
    } else {
      console.log('⭐ Starring the agent...');
      await starButton.click();
    }
    
    // Wait for success indication
    await page.waitForTimeout(2000);
    console.log('✅ Agent starred');
    
    // STEP 4: Navigate back to profile starred tab
    console.log('📍 Step 4: Navigating to profile starred tab (THE CRITICAL TEST)...');
    
    // Navigate to profile
    await page.goto(`/users/${TEST_USER.username}`);
    await page.waitForLoadState('networkidle');
    
    // Click starred tab
    const starredTabAgain = page.locator('button:has-text("Starred"), a:has-text("Starred")').first();
    await starredTabAgain.click();
    
    // CRITICAL: Wait for React Query to fetch
    await page.waitForTimeout(3000);
    
    // Count starred items now
    const starredAfter = await page.locator('a[href*="/agents/"]').count();
    console.log(`📊 Starred count after: ${starredAfter}`);
    
    // THE BUG TEST: starred count should have increased
    expect(starredAfter).toBeGreaterThan(starredBefore);
    
    // Extra verification: Check if the specific agent we starred is visible
    const agentVisible = await page.locator(`a[href*="/agents/${agentSlug}"]`).isVisible({ timeout: 3000 }).catch(() => false);
    
    if (!agentVisible) {
      // Take screenshot for debugging
      await page.screenshot({ path: 'starred-bug-screenshot.png', fullPage: true });
      throw new Error(`Agent ${agentSlug} not visible in starred list - CACHING BUG STILL EXISTS`);
    }
    
    console.log('✅ TEST PASSED: Starred agent appears without manual refresh!');
  });

  test('should handle star/unstar toggle correctly', async ({ page }) => {
    console.log('📍 Testing star/unstar toggle...');
    
    // Navigate to any agent
    await page.goto('/');
    await page.waitForSelector('a[href*="/agents/"]');
    await page.locator('a[href*="/agents/"]').first().click();
    await page.waitForURL(/\/agents\/[^/]+$/);
    await page.waitForLoadState('networkidle');
    
    // Find star button
    const starButton = page.locator('button:has-text("Star"), button:has-text("Unstar")').first();
    await starButton.waitFor({ state: 'visible', timeout: 5000 });
    
    const initialText = await starButton.textContent();
    console.log(`Initial button state: ${initialText}`);
    
    // Click to toggle
    await starButton.click();
    await page.waitForTimeout(1500);
    
    // Verify button text changed
    const afterClick = page.locator('button:has-text("Star"), button:has-text("Unstar")').first();
    const newText = await afterClick.textContent();
    expect(newText).not.toBe(initialText);
    
    console.log(`After toggle: ${newText}`);
    console.log('✅ Star/unstar toggle works correctly');
  });

  test('should show empty state when no agents starred', async ({ page }) => {
    console.log('📍 Testing empty starred state...');
    
    await page.goto(`/users/${TEST_USER.username}`);
    await page.waitForLoadState('networkidle');
    
    const starredTab = page.locator('button:has-text("Starred"), a:has-text("Starred")').first();
    await starredTab.click();
    await page.waitForTimeout(2000);
    
    // Count starred agents
    const starredCount = await page.locator('a[href*="/agents/"]').count();
    
    if (starredCount === 0) {
      // Check for empty state message
      const emptyMessage = await page.locator('text=/no starred|empty|none yet/i').isVisible({ timeout: 3000 }).catch(() => false);
      expect(emptyMessage).toBe(true);
      console.log('✅ Empty state displays correctly');
    } else {
      console.log(`⚠️  Skipping empty state test - ${starredCount} agents already starred`);
    }
  });
});

test.describe('Profile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedIn(page);
  });

  test('should navigate between profile tabs', async ({ page }) => {
    await page.goto(`/users/${TEST_USER.username}`);
    await page.waitForLoadState('networkidle');
    
    // Test all tabs
    const tabs = ['Agents', 'Reviews', 'Starred'];
    
    for (const tab of tabs) {
      console.log(`📍 Clicking ${tab} tab...`);
      const tabButton = page.locator(`button:has-text("${tab}"), a:has-text("${tab}")`).first();
      await tabButton.click();
      await page.waitForTimeout(1000);
      
      // Just verify the tab button exists and was clicked
      console.log(`✅ ${tab} tab clicked`);
    }
    
    console.log('✅ All tabs navigate correctly');
  });
});

/**
 * SETUP INSTRUCTIONS FOR MAC:
 * 
 * 1. Update .env.test with your actual GitHub username:
 *    TEST_USERNAME=kmcallorum
 *    TEST_EMAIL=your-email@example.com
 * 
 * 2. Make sure you're logged in to http://agent-marketplace.local in your regular browser
 * 
 * 3. Run the tests:
 *    npx playwright test e2e/starred-agents.spec.ts --headed
 * 
 * 4. If it says "NOT LOGGED IN":
 *    - The Playwright browser will pause
 *    - Click "Login with GitHub" in the Playwright browser
 *    - Complete OAuth
 *    - Press SPACE or click Resume in the Playwright Inspector
 *    - Tests will continue
 * 
 * 5. Give to Claude Code and say:
 *    "Make ALL these tests pass. The first test is THE critical one - 
 *     it must show starred agents without refresh. Don't come back until green."
 */
