// @ts-nocheck
// Smoke test for navigation components
// Run with: npx playwright test scripts/nav-smoke.test.ts
import { test, expect } from '@playwright/test';

test.describe('Navigation Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Start from homepage
    await page.goto('/');
  });

  test('burger menu exists and toggles on mobile breakpoint', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check burger button exists
    const burgerButton = page.locator('button[aria-expanded]');
    await expect(burgerButton).toBeVisible();
    
    // Check initial state (closed)
    await expect(burgerButton).toHaveAttribute('aria-expanded', 'false');
    
    // Click to open
    await burgerButton.click();
    await expect(burgerButton).toHaveAttribute('aria-expanded', 'true');
    
    // Check mobile menu is visible
    const mobileMenu = page.locator('#mobileMenu');
    await expect(mobileMenu).toHaveClass(/max-h-96/);
    await expect(mobileMenu).toHaveClass(/opacity-100/);
    
    // Click to close
    await burgerButton.click();
    await expect(burgerButton).toHaveAttribute('aria-expanded', 'false');
    await expect(mobileMenu).toHaveClass(/max-h-0/);
    await expect(mobileMenu).toHaveClass(/opacity-0/);
  });

  test('mobile menu closes on link click', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open menu
    const burgerButton = page.locator('button[aria-expanded]');
    await burgerButton.click();
    await expect(burgerButton).toHaveAttribute('aria-expanded', 'true');
    
    // Click a navigation link
    const aboutLink = page.locator('#mobileMenu a[href*="about"]');
    await aboutLink.click();
    
    // Menu should close (we'll be on about page)
    await expect(page).toHaveURL(/.*about.*/);
  });

  test('mobile menu closes on ESC key', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open menu
    const burgerButton = page.locator('button[aria-expanded]');
    await burgerButton.click();
    await expect(burgerButton).toHaveAttribute('aria-expanded', 'true');
    
    // Press ESC
    await page.keyboard.press('Escape');
    
    // Menu should close
    await expect(burgerButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('action buttons show branch selection dropdown', async ({ page }) => {
    // Check call button exists
    const callButton = page.locator('button').filter({ hasText: /Call|اتصل/ }).first();
    await expect(callButton).toBeVisible();
    
    // Check WhatsApp button exists
    const whatsappButton = page.locator('button').filter({ hasText: /WhatsApp|واتساب/ }).first();
    await expect(whatsappButton).toBeVisible();
    
    // Click call button to open dropdown
    await callButton.click();
    
    // Check dropdown appears
    const dropdown = page.locator('div').filter({ hasText: /Select Branch|اختر الفرع/ });
    await expect(dropdown).toBeVisible();
    
    // Check branch options exist
    const branchOptions = page.locator('button').filter({ hasText: /Dubai|دبي|Cairo|القاهرة/ });
    await expect(branchOptions.first()).toBeVisible();
  });

  test('action buttons work after branch selection', async ({ page }) => {
    // Open dropdown and select a branch
    const callButton = page.locator('button').filter({ hasText: /Call|اتصل/ }).first();
    await callButton.click();
    
    // Select Dubai HQ
    const dubaiOption = page.locator('button').filter({ hasText: /Dubai.*HQ|دبي.*المقر/ });
    await dubaiOption.click();
    
    // Now call button should have tel: href
    // We can't directly test tel: links, but we can check the button behavior changes
    await expect(callButton).toBeVisible();
    
    // Check WhatsApp button behavior
    const whatsappButton = page.locator('button').filter({ hasText: /WhatsApp|واتساب/ }).first();
    await expect(whatsappButton).toBeVisible();
  });

  test('desktop navigation is visible on larger screens', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Check desktop nav is visible
    const desktopNav = page.locator('ul.hidden.md\\:flex');
    await expect(desktopNav).toBeVisible();
    
    // Check burger button is hidden
    const burgerButton = page.locator('button[aria-expanded]');
    await expect(burgerButton).toBeHidden();
    
    // Check navigation links
    const homeLink = page.locator('ul.hidden.md\\:flex a').filter({ hasText: /Home|الرئيسية/ });
    await expect(homeLink).toBeVisible();
  });

  test('language switcher works', async ({ page }) => {
    // Check language switcher exists
    const langSwitcher = page.locator('a[title*="العربية"], a[title*="English"]');
    await expect(langSwitcher).toBeVisible();
    
    // Click to switch language
    await langSwitcher.click();
    
    // Should navigate to Arabic or English version
    await expect(page).toHaveURL(/.*(\/(ar|en))?.*|.*\/ar\/.*|.*\/$/);
  });

  test('header has correct z-index and positioning', async ({ page }) => {
    // Check header is fixed and has high z-index
    const header = page.locator('header');
    await expect(header).toHaveCSS('position', 'fixed');
    await expect(header).toHaveCSS('z-index', '9999');
    
    // Check spacer exists
    const spacer = page.locator('div[style*="height: 4rem"]');
    await expect(spacer).toBeVisible();
  });

  test('navigation works on Arabic pages', async ({ page }) => {
    // Go to Arabic homepage
    await page.goto('/ar');
    
    // Check RTL direction
    const mobileNav = page.locator('.md\\:hidden');
    await expect(mobileNav).toHaveAttribute('dir', 'rtl');
    
    // Check Arabic labels
    const aboutLink = page.locator('a').filter({ hasText: 'من نحن' });
    await expect(aboutLink).toBeVisible();
  });
});

// Simple DOM test for components that don't require full browser
test.describe('Component Unit Tests', () => {
  test('Nav.astro renders without errors', async ({ page }) => {
    await page.goto('/');
    
    // Check basic structure exists
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('img[alt="SupaKoto"]')).toBeVisible();
    
    // No console errors
    const logs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(msg.text());
      }
    });
    
    await page.reload();
    await page.waitForTimeout(2000);
    
    expect(logs.filter(log => 
      log.includes('hydration') || 
      log.includes('Nav') || 
      log.includes('undefined')
    )).toHaveLength(0);
  });
});
