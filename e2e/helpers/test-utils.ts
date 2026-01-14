import { Page, expect } from '@playwright/test';

/**
 * Common test utilities for AI Marketplace E2E tests
 */

/**
 * Wait for React Query to settle (no pending queries)
 */
export async function waitForReactQuery(page: Page, timeout = 5000): Promise<void> {
  await page.waitForFunction(
    () => {
      // Check if react-query devtools or state indicates no pending queries
      const queries = (window as any).__REACT_QUERY_STATE__;
      return !queries || Object.values(queries).every((q: any) => q.state.status !== 'loading');
    },
    { timeout }
  ).catch(() => {
    // If react-query state not exposed, just wait for network idle
    return page.waitForLoadState('networkidle', { timeout });
  });
}

/**
 * Navigate to an agent detail page
 */
export async function navigateToAgent(page: Page, slug?: string): Promise<string> {
  if (slug) {
    await page.goto(`/agents/${slug}`);
    return slug;
  }
  
  // Navigate to first available agent
  await page.goto('/');
  await page.waitForSelector('a[href*="/agents/"]', { timeout: 10000 });
  
  const firstAgentLink = page.locator('a[href*="/agents/"]').first();
  const href = await firstAgentLink.getAttribute('href');
  await firstAgentLink.click();
  
  await page.waitForURL(/\/agents\/[^/]+$/);
  await page.waitForLoadState('networkidle');
  
  return href?.split('/').pop() || '';
}

/**
 * Star an agent from its detail page
 */
export async function starAgent(page: Page): Promise<void> {
  const starButton = page.locator('button:has-text("Star"), [data-testid="star-button"]').first();
  
  // Wait for button to be ready
  await starButton.waitFor({ state: 'visible', timeout: 5000 });
  
  // Check if already starred
  const buttonText = await starButton.textContent();
  const isAlreadyStarred = buttonText?.toLowerCase().includes('unstar') || 
                           buttonText?.includes('★') ||
                           buttonText?.toLowerCase().includes('starred');
  
  if (isAlreadyStarred) {
    console.log('⚠️  Agent already starred, unstarring first...');
    await starButton.click();
    await waitForToast(page, /unstarred|success/i);
    await page.waitForTimeout(500);
  }
  
  // Star it
  await starButton.click();
  await waitForToast(page, /starred|success/i);
  await page.waitForTimeout(500);
}

/**
 * Unstar an agent from its detail page
 */
export async function unstarAgent(page: Page): Promise<void> {
  const unstarButton = page.locator('button:has-text("Unstar"), [data-testid="unstar-button"]').first();
  
  await unstarButton.waitFor({ state: 'visible', timeout: 5000 });
  await unstarButton.click();
  
  await waitForToast(page, /unstarred|success/i);
  await page.waitForTimeout(500);
}

/**
 * Wait for a toast notification with specific text
 */
export async function waitForToast(page: Page, textPattern: RegExp, timeout = 5000): Promise<void> {
  const toast = page.locator('[role="alert"], .toast, [class*="toast"]').filter({ hasText: textPattern });
  await toast.waitFor({ state: 'visible', timeout });
}

/**
 * Navigate to user profile
 */
export async function navigateToProfile(page: Page, username: string): Promise<void> {
  await page.goto(`/users/${username}`);
  await page.waitForLoadState('networkidle');
}

/**
 * Switch to a profile tab
 */
export async function switchProfileTab(page: Page, tabName: 'Agents' | 'Reviews' | 'Starred'): Promise<void> {
  const tab = page.locator(`button:has-text("${tabName}"), a:has-text("${tabName}")`);
  await tab.click();
  await page.waitForTimeout(1000); // Give React Query time to fetch
}

/**
 * Get count of visible agent cards
 */
export async function getAgentCardCount(page: Page): Promise<number> {
  await page.waitForTimeout(1000); // Wait for any animations/loading
  return await page.locator('[data-testid="agent-card"], .agent-card, [class*="agent-card"]').count();
}

/**
 * Check if an agent with specific slug is visible
 */
export async function isAgentVisible(page: Page, slug: string): Promise<boolean> {
  const agent = page.locator(`[href*="/agents/${slug}"], text="${slug}"`).first();
  return await agent.isVisible({ timeout: 3000 }).catch(() => false);
}

/**
 * Clear all starred agents (for test cleanup)
 */
export async function clearAllStarredAgents(page: Page, username: string): Promise<void> {
  await navigateToProfile(page, username);
  await switchProfileTab(page, 'Starred');
  
  let hasMore = true;
  while (hasMore) {
    const count = await getAgentCardCount(page);
    if (count === 0) break;
    
    // Click first agent
    const firstAgent = page.locator('[data-testid="agent-card"], .agent-card').first();
    await firstAgent.click();
    
    // Unstar it
    await unstarAgent(page);
    
    // Go back to profile
    await navigateToProfile(page, username);
    await switchProfileTab(page, 'Starred');
    
    const newCount = await getAgentCardCount(page);
    hasMore = newCount < count; // Continue if we made progress
  }
  
  console.log('✅ Cleared all starred agents');
}

/**
 * Wait for a specific number of agent cards to be visible
 */
export async function waitForAgentCount(
  page: Page, 
  expectedCount: number, 
  timeout = 10000
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const count = await getAgentCardCount(page);
    if (count === expectedCount) return;
    await page.waitForTimeout(500);
  }
  
  throw new Error(`Timeout waiting for ${expectedCount} agents. Current count: ${await getAgentCardCount(page)}`);
}

/**
 * Check if user is on a specific page
 */
export async function expectUrl(page: Page, urlPattern: string | RegExp): Promise<void> {
  const currentUrl = page.url();
  if (typeof urlPattern === 'string') {
    expect(currentUrl).toContain(urlPattern);
  } else {
    expect(currentUrl).toMatch(urlPattern);
  }
}

/**
 * Take a screenshot for debugging
 */
export async function debugScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: `debug-${name}-${Date.now()}.png`, fullPage: true });
  console.log(`📸 Debug screenshot saved: debug-${name}-${Date.now()}.png`);
}

/**
 * Log current page state for debugging
 */
export async function debugPageState(page: Page): Promise<void> {
  const url = page.url();
  const title = await page.title();
  const localStorage = await page.evaluate(() => JSON.stringify(window.localStorage));
  
  console.log('🔍 Page State Debug:');
  console.log(`  URL: ${url}`);
  console.log(`  Title: ${title}`);
  console.log(`  LocalStorage: ${localStorage}`);
}

/**
 * Wait for API call to complete
 */
export async function waitForApiCall(page: Page, urlPattern: string | RegExp, timeout = 10000): Promise<void> {
  await page.waitForResponse(
    response => {
      const url = response.url();
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern);
      }
      return urlPattern.test(url);
    },
    { timeout }
  );
}

/**
 * Mock API response
 */
export async function mockApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  responseData: any,
  status = 200
): Promise<void> {
  await page.route(urlPattern, route => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(responseData),
    });
  });
}
