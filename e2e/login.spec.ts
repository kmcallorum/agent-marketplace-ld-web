import { test, expect } from '@playwright/test';

/**
 * Login Flow Tests
 * 
 * These tests catch the recurring "Login with GitHub returns 404" bug
 * that Mac keeps hitting after every code change.
 */

test.describe('Authentication Flow', () => {
  test('should display login button on homepage', async ({ page }) => {
    await page.goto('/');
    
    const loginButton = page.getByRole('button', { name: /login with github/i });
    await expect(loginButton).toBeVisible();
    
    console.log('✅ Login button visible on homepage');
  });

  test('should redirect to GitHub OAuth when clicking login', async ({ page }) => {
    await page.goto('/');
    
    // Click login button
    const loginButton = page.getByRole('button', { name: /login with github/i });
    await loginButton.click();
    
    // Should redirect to GitHub or show OAuth flow
    // Wait for either GitHub URL or local OAuth callback
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    
    // Check if we got to GitHub OAuth or if there's an error
    const isGitHubOAuth = currentUrl.includes('github.com');
    const is404 = await page.locator('text=/404|not found/i').isVisible().catch(() => false);
    
    if (is404) {
      console.error('❌ BUG DETECTED: Login redirected to 404');
      throw new Error('Login with GitHub redirected to 404 - OAuth endpoint broken');
    }
    
    if (isGitHubOAuth) {
      console.log('✅ Successfully redirected to GitHub OAuth');
    } else {
      console.log(`⚠️  Redirected to: ${currentUrl}`);
    }
    
    // At minimum, should NOT be a 404
    expect(is404).toBe(false);
  });

  test('should have working OAuth callback endpoint', async ({ page }) => {
    // Test that the OAuth callback route exists
    // This catches the common bug where /auth/callback returns 404
    
    // Navigate to callback with a fake code (will fail auth, but route should exist)
    await page.goto('/auth/callback?code=fake-test-code');
    
    // Should NOT get 404
    const is404 = await page.locator('text=/404|not found/i').isVisible().catch(() => false);
    
    if (is404) {
      console.error('❌ BUG DETECTED: OAuth callback route returns 404');
      throw new Error('OAuth callback endpoint missing - check routing configuration');
    }
    
    // Might get an error message about invalid code, but route should exist
    console.log('✅ OAuth callback route exists');
  });

  test('should preserve auth state after page reload', async ({ page }) => {
    // Mock a logged-in state
    await page.goto('/');
    
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ 
        username: 'testuser',
        email: 'test@example.com' 
      }));
    });
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check if auth persisted
    const hasToken = await page.evaluate(() => !!localStorage.getItem('auth_token'));
    expect(hasToken).toBe(true);
    
    console.log('✅ Auth state persists across reload');
  });

  test('should clear auth state on logout', async ({ page }) => {
    // Setup logged-in state
    await page.goto('/');
    
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ 
        username: 'testuser',
        email: 'test@example.com' 
      }));
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Click logout
    const logoutButton = page.getByRole('button', { name: /logout|sign out/i });
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await page.waitForTimeout(1000);
      
      // Check if tokens cleared
      const hasToken = await page.evaluate(() => !!localStorage.getItem('auth_token'));
      expect(hasToken).toBe(false);
      
      console.log('✅ Auth cleared on logout');
    } else {
      console.log('⚠️  Logout button not found - skipping test');
    }
  });
});

test.describe('Login Bug Regression', () => {
  test('login should work after starring changes', async ({ page }) => {
    /**
     * This test specifically catches the bug where:
     * "Every time we fix starring, login breaks with 404"
     * 
     * If this test fails, it means recent changes broke the auth flow
     */
    
    await page.goto('/');
    
    const loginButton = page.getByRole('button', { name: /login with github/i });
    await expect(loginButton).toBeVisible();
    
    await loginButton.click();
    await page.waitForTimeout(2000);
    
    const is404 = await page.locator('text=/404|not found/i').isVisible().catch(() => false);
    
    if (is404) {
      throw new Error(
        '🚨 REGRESSION BUG: Login with GitHub returns 404! ' +
        'This is the recurring bug Mac keeps finding. ' +
        'Check routing configuration and OAuth endpoints.'
      );
    }
    
    console.log('✅ Login flow not broken by recent changes');
  });
});

/**
 * INSTRUCTIONS FOR CLAUDE CODE:
 * 
 * If ANY of these tests fail, the login flow is broken.
 * 
 * Common causes:
 * 1. OAuth callback route missing or misconfigured
 * 2. GitHub OAuth app settings wrong (redirect URI)
 * 3. Auth middleware blocking the callback endpoint
 * 4. Frontend routing not handling /auth/callback
 * 
 * DO NOT say "login is fixed" until ALL these tests pass.
 */
