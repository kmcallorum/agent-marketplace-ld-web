import { Page, expect } from '@playwright/test';

/**
 * Authentication helper for tests
 * 
 * IMPORTANT: For real GitHub OAuth, you'll need to:
 * 1. Create a test GitHub OAuth app
 * 2. Set GITHUB_TEST_USERNAME and GITHUB_TEST_PASSWORD in .env.test
 * 3. Or use the mockAuth approach below for faster tests
 */

export interface TestUser {
  username: string;
  email: string;
  token: string;
}

/**
 * Mock authentication by directly setting tokens in localStorage
 * This bypasses GitHub OAuth for faster, more reliable tests
 * 
 * Prerequisites:
 * - Backend must have a test user seeded in the database
 * - You need a valid JWT token for that user
 */
export async function mockAuth(page: Page, testUser: TestUser): Promise<void> {
  // Navigate to the app first
  await page.goto('/');
  
  // Inject auth tokens into localStorage
  await page.evaluate(({ token, user }) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }, { 
    token: testUser.token,
    user: { username: testUser.username, email: testUser.email }
  });
  
  // Reload to pick up auth state
  await page.reload();
  
  // Wait for auth to be recognized
  await page.waitForLoadState('networkidle');
}

/**
 * Real GitHub OAuth login flow
 * Use this if you want to test actual OAuth, but it's slower and requires real credentials
 */
export async function loginWithGitHub(
  page: Page, 
  username: string, 
  password: string
): Promise<void> {
  // Click GitHub login button
  await page.goto('/');
  const loginButton = page.getByRole('button', { name: /login with github/i });
  await loginButton.click();
  
  // Wait for GitHub OAuth page
  await page.waitForURL(/github\.com\/login/);
  
  // Fill in GitHub credentials
  await page.fill('input[name="login"]', username);
  await page.fill('input[name="password"]', password);
  await page.click('input[type="submit"]');
  
  // Handle 2FA if needed (you'll need to set this up for test account)
  const has2FA = await page.locator('input[name="otp"]').isVisible({ timeout: 2000 }).catch(() => false);
  if (has2FA) {
    throw new Error('2FA detected - disable 2FA on test account or implement TOTP handling');
  }
  
  // Wait for authorization page if first time
  const authorizeButton = page.getByRole('button', { name: /authorize/i });
  if (await authorizeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await authorizeButton.click();
  }
  
  // Wait for redirect back to app
  await page.waitForURL(/localhost|agent-marketplace/);
  await page.waitForLoadState('networkidle');
  
  // Verify we're logged in
  await expect(page.locator('text=/logged in|profile|logout/i')).toBeVisible({ timeout: 10000 });
}

/**
 * Logout helper
 */
export async function logout(page: Page): Promise<void> {
  // Click user menu or logout button
  const logoutButton = page.getByRole('button', { name: /logout|sign out/i });
  await logoutButton.click();
  
  // Wait for redirect to home
  await page.waitForURL('/');
  await page.waitForLoadState('networkidle');
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  const token = await page.evaluate(() => localStorage.getItem('auth_token'));
  return !!token;
}

/**
 * Get current user from localStorage
 */
export async function getCurrentUser(page: Page): Promise<any> {
  return await page.evaluate(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });
}
