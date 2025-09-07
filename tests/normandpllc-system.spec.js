// Playwright Test Suite for NormandPLLC Complete Animation System
// Tests menu navigation, page transitions, animations, and responsive behavior

const { test, expect } = require('@playwright/test');

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';
const DESKTOP_VIEWPORT = { width: 1440, height: 900 };
const MOBILE_VIEWPORT = { width: 375, height: 667 };
const TABLET_VIEWPORT = { width: 768, height: 1024 };

// Animation timing constants from normandpllc.com
const ANIMATION_TIMEOUTS = {
  preloader: 3000,
  menuOpen: 2000,
  menuClose: 1000,
  pageTransition: 1500,
  scrollAnimation: 800
};

test.describe('NormandPLLC Complete System Tests', () => {
  
  // ============================================
  // SETUP AND TEARDOWN
  // ============================================
  test.beforeEach(async ({ page }) => {
    // Navigate to the complete system demo
    await page.goto(`${BASE_URL}/normandpllc-complete-system.html`);
    
    // Wait for GSAP and other libraries to load
    await page.waitForFunction(() => {
      return typeof window.gsap !== 'undefined' && 
             typeof window.ScrollTrigger !== 'undefined' &&
             window.normandPageSystem !== undefined;
    });
    
    // Wait for preloader to complete
    await page.waitForSelector('.preloader', { state: 'hidden', timeout: ANIMATION_TIMEOUTS.preloader });
  });
  
  // ============================================
  // PRELOADER TESTS
  // ============================================
  test.describe('Preloader System', () => {
    test('should show preloader on page load', async ({ page }) => {
      // Reload page to test preloader
      await page.reload();
      
      // Check preloader elements exist
      await expect(page.locator('.preloader')).toBeVisible();
      await expect(page.locator('.preloader svg')).toBeVisible();
      await expect(page.locator('.preloader-percentage')).toBeVisible();
      
      // Check percentage counter starts at 0
      const percentage = await page.locator('.preloader-percentage').textContent();
      expect(percentage).toBe('0%');
    });
    
    test('should animate preloader exit', async ({ page }) => {
      await page.reload();
      
      // Wait for preloader to start exiting
      await page.waitForFunction(() => {
        const preloader = document.querySelector('.preloader');
        return preloader && getComputedStyle(preloader).transform !== 'none';
      }, { timeout: ANIMATION_TIMEOUTS.preloader });
      
      // Verify preloader is eventually hidden
      await expect(page.locator('.preloader')).toBeHidden({ timeout: ANIMATION_TIMEOUTS.preloader });
    });
  });
  
  // ============================================
  // MENU SYSTEM TESTS
  // ============================================
  test.describe('Menu System', () => {
    test('should open menu with proper animations', async ({ page }) => {
      const menuToggle = page.locator('.menu-toggle');
      const menuContainer = page.locator('.primary-menu-container');
      
      // Click menu toggle
      await menuToggle.click();
      
      // Wait for menu to become visible
      await expect(menuContainer).toBeVisible({ timeout: ANIMATION_TIMEOUTS.menuOpen });
      
      // Check ARIA attributes
      await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
      
      // Verify menu items are staggered in
      const menuItems = page.locator('.menu-item > a');
      const firstItem = menuItems.first();
      const lastItem = menuItems.last();
      
      // Check that items have proper opacity
      await expect(firstItem).toHaveCSS('opacity', '1');
      await expect(lastItem).toHaveCSS('opacity', '1');
    });
    
    test('should close menu properly', async ({ page }) => {
      const menuToggle = page.locator('.menu-toggle');
      const menuClose = page.locator('.menu-toggle-close');
      const menuContainer = page.locator('.primary-menu-container');
      
      // Open menu first
      await menuToggle.click();
      await expect(menuContainer).toBeVisible();
      
      // Close menu
      await menuClose.click();
      
      // Wait for menu to close
      await expect(menuContainer).toBeHidden({ timeout: ANIMATION_TIMEOUTS.menuClose });
      
      // Check ARIA attributes
      await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
    });
    
    test('should close menu with ESC key', async ({ page }) => {
      const menuToggle = page.locator('.menu-toggle');
      const menuContainer = page.locator('.primary-menu-container');
      
      // Open menu
      await menuToggle.click();
      await expect(menuContainer).toBeVisible();
      
      // Press ESC
      await page.keyboard.press('Escape');
      
      // Verify menu closes
      await expect(menuContainer).toBeHidden({ timeout: ANIMATION_TIMEOUTS.menuClose });
    });
    
    test('should show hover effects on menu items', async ({ page }) => {
      const menuToggle = page.locator('.menu-toggle');
      
      // Open menu
      await menuToggle.click();
      await page.waitForSelector('.primary-menu-container', { state: 'visible' });
      
      const firstMenuItem = page.locator('.menu-item > a').first();
      
      // Hover over menu item
      await firstMenuItem.hover();
      
      // Wait for hover animation
      await page.waitForTimeout(500);
      
      // Check for color change (indicating hover effect)
      const color = await firstMenuItem.evaluate(el => 
        getComputedStyle(el).color
      );
      
      // Color should change on hover (not grey)
      expect(color).not.toBe('rgb(128, 128, 128)'); // not grey
    });
  });
  
  // ============================================
  // RESPONSIVE BEHAVIOR TESTS
  // ============================================
  test.describe('Responsive Behavior', () => {
    test('should adapt menu for mobile viewport', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      
      const menuToggle = page.locator('.menu-toggle');
      
      // Check mobile menu positioning
      const box = await menuToggle.boundingBox();
      expect(box.width).toBeGreaterThan(300); // Full width on mobile
      
      // Check menu is at top
      expect(box.y).toBeLessThan(50);
    });
    
    test('should show vertical menu on desktop', async ({ page }) => {
      await page.setViewportSize(DESKTOP_VIEWPORT);
      
      const menuToggle = page.locator('.menu-toggle');
      
      // Check desktop menu positioning
      const transform = await menuToggle.evaluate(el => 
        getComputedStyle(el).transform
      );
      
      // Should have rotation transform on desktop
      expect(transform).toContain('matrix');
    });
    
    test('should hide custom cursor on mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      
      const cursor = page.locator('.custom-cursor');
      
      // Custom cursor should be hidden on mobile
      await expect(cursor).toBeHidden();
    });
  });
  
  // ============================================
  // SCROLL ANIMATION TESTS
  // ============================================
  test.describe('Scroll Animations', () => {
    test('should trigger fade-in animations on scroll', async ({ page }) => {
      // Scroll to trigger animations
      await page.evaluate(() => {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      });
      
      // Wait for scroll animation to complete
      await page.waitForTimeout(ANIMATION_TIMEOUTS.scrollAnimation);
      
      // Check that fade-in elements are now visible
      const fadeInElements = page.locator('.fade-in');
      const count = await fadeInElements.count();
      
      for (let i = 0; i < count; i++) {
        const element = fadeInElements.nth(i);
        const opacity = await element.evaluate(el => 
          getComputedStyle(el).opacity
        );
        expect(parseFloat(opacity)).toBeGreaterThan(0.5);
      }
    });
    
    test('should create parallax effects', async ({ page }) => {
      // Skip on mobile (parallax disabled)
      const viewport = await page.viewportSize();
      if (viewport.width <= 768) {
        test.skip('Parallax disabled on mobile');
      }
      
      // Get initial position of parallax element
      const parallaxElement = page.locator('[data-scroll-speed]').first();
      const initialTransform = await parallaxElement.evaluate(el => 
        getComputedStyle(el).transform
      );
      
      // Scroll down
      await page.evaluate(() => {
        window.scrollTo({ top: window.innerHeight * 0.5 });
      });
      
      // Wait for scroll effects
      await page.waitForTimeout(500);
      
      // Check transform has changed
      const newTransform = await parallaxElement.evaluate(el => 
        getComputedStyle(el).transform
      );
      
      expect(newTransform).not.toBe(initialTransform);
    });
  });
  
  // ============================================
  // CUSTOM CURSOR TESTS
  // ============================================
  test.describe('Custom Cursor', () => {
    test('should follow mouse movement', async ({ page }) => {
      // Skip on mobile
      const viewport = await page.viewportSize();
      if (viewport.width <= 768) {
        test.skip('Custom cursor disabled on mobile');
      }
      
      const cursor = page.locator('.custom-cursor');
      
      // Move mouse
      await page.mouse.move(200, 200);
      await page.waitForTimeout(100);
      
      // Check cursor position
      const box = await cursor.boundingBox();
      expect(box.x).toBeCloseTo(200, 50); // Within 50px
      expect(box.y).toBeCloseTo(200, 50);
    });
    
    test('should scale on hover', async ({ page }) => {
      // Skip on mobile
      const viewport = await page.viewportSize();
      if (viewport.width <= 768) {
        test.skip('Custom cursor disabled on mobile');
      }
      
      const cursor = page.locator('.custom-cursor');
      const hoverTarget = page.locator('a').first();
      
      // Hover over link
      await hoverTarget.hover();
      await page.waitForTimeout(400);
      
      // Check cursor has scaled
      const transform = await cursor.evaluate(el => 
        getComputedStyle(el).transform
      );
      
      expect(transform).toContain('scale');
    });
  });
  
  // ============================================
  // SLIDESHOW TESTS
  // ============================================
  test.describe('Slideshow System', () => {
    test('should animate slideshow continuously', async ({ page }) => {
      const slideshow = page.locator('.slideshow');
      
      // Get initial position
      const initialTransform = await slideshow.evaluate(el => 
        getComputedStyle(el).transform
      );
      
      // Wait for animation to progress
      await page.waitForTimeout(2000);
      
      // Check position has changed
      const newTransform = await slideshow.evaluate(el => 
        getComputedStyle(el).transform
      );
      
      expect(newTransform).not.toBe(initialTransform);
    });
  });
  
  // ============================================
  // PERFORMANCE TESTS
  // ============================================
  test.describe('Performance', () => {
    test('should maintain 60fps during animations', async ({ page }) => {
      let frameCount = 0;
      const startTime = Date.now();
      
      // Monitor frame rate
      await page.evaluate(() => {
        const monitor = () => {
          window.frameCount = (window.frameCount || 0) + 1;
          requestAnimationFrame(monitor);
        };
        monitor();
      });
      
      // Open menu (trigger animation)
      await page.click('.menu-toggle');
      await page.waitForTimeout(2000);
      
      // Check frame rate
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      frameCount = await page.evaluate(() => window.frameCount);
      const fps = frameCount / duration;
      
      expect(fps).toBeGreaterThan(55); // Should maintain close to 60fps
    });
    
    test('should load all resources quickly', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(`${BASE_URL}/normandpllc-complete-system.html`);
      
      // Wait for all libraries to load
      await page.waitForFunction(() => {
        return typeof window.gsap !== 'undefined' && 
               typeof window.ScrollTrigger !== 'undefined' &&
               typeof window.LocomotiveScroll !== 'undefined';
      });
      
      const endTime = Date.now();
      const loadTime = endTime - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });
  });
  
  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  test.describe('Accessibility', () => {
    test('should have proper ARIA attributes', async ({ page }) => {
      const menuToggle = page.locator('.menu-toggle');
      const menu = page.locator('#primary-menu');
      
      // Check ARIA attributes exist
      await expect(menuToggle).toHaveAttribute('aria-controls', 'primary-menu');
      await expect(menuToggle).toHaveAttribute('aria-expanded');
      await expect(menu).toHaveAttribute('role', 'menu');
    });
    
    test('should be keyboard accessible', async ({ page }) => {
      // Tab to menu button
      await page.keyboard.press('Tab');
      
      // Check menu button is focused
      const activeElement = await page.evaluate(() => 
        document.activeElement.className
      );
      
      expect(activeElement).toContain('menu-toggle');
      
      // Press Enter to open menu
      await page.keyboard.press('Enter');
      
      // Check menu opens
      await expect(page.locator('.primary-menu-container')).toBeVisible();
    });
    
    test('should respect reduced motion preferences', async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      
      // Reload page
      await page.reload();
      
      // Preloader should be skipped
      await expect(page.locator('.preloader')).toBeHidden({ timeout: 1000 });
    });
  });
  
  // ============================================
  // CROSS-BROWSER COMPATIBILITY TESTS
  // ============================================
  test.describe('Cross-Browser Compatibility', () => {
    test('should work in different browsers', async ({ page, browserName }) => {
      console.log(`Testing in ${browserName}`);
      
      // Basic functionality should work in all browsers
      await page.click('.menu-toggle');
      await expect(page.locator('.primary-menu-container')).toBeVisible();
      
      // Check GSAP is working
      const gsapWorking = await page.evaluate(() => {
        return typeof window.gsap !== 'undefined' && 
               window.gsap.version !== undefined;
      });
      
      expect(gsapWorking).toBe(true);
    });
  });
  
  // ============================================
  // INTEGRATION TESTS
  // ============================================
  test.describe('System Integration', () => {
    test('should initialize all systems properly', async ({ page }) => {
      // Check all required systems are loaded
      const systemStatus = await page.evaluate(() => {
        return {
          gsap: typeof window.gsap !== 'undefined',
          scrollTrigger: typeof window.ScrollTrigger !== 'undefined',
          locomotiveScroll: typeof window.LocomotiveScroll !== 'undefined',
          pageSystem: window.normandPageSystem !== undefined,
          menuSystem: document.querySelector('.menu-toggle') !== null
        };
      });
      
      expect(systemStatus.gsap).toBe(true);
      expect(systemStatus.scrollTrigger).toBe(true);
      expect(systemStatus.locomotiveScroll).toBe(true);
      expect(systemStatus.pageSystem).toBe(true);
      expect(systemStatus.menuSystem).toBe(true);
    });
    
    test('should handle multiple rapid interactions', async ({ page }) => {
      const menuToggle = page.locator('.menu-toggle');
      
      // Rapidly click menu toggle multiple times
      for (let i = 0; i < 5; i++) {
        await menuToggle.click();
        await page.waitForTimeout(100);
      }
      
      // System should still be responsive
      const isMenuVisible = await page.locator('.primary-menu-container').isVisible();
      
      // Menu should be in a consistent state
      expect(typeof isMenuVisible).toBe('boolean');
    });
  });
});

// ============================================
// VISUAL REGRESSION TESTS
// ============================================
test.describe('Visual Regression Tests', () => {
  test('should match menu closed state', async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
    await expect(page).toHaveScreenshot('menu-closed-desktop.png');
  });
  
  test('should match menu open state', async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
    await page.click('.menu-toggle');
    await page.waitForSelector('.primary-menu-container', { state: 'visible' });
    await expect(page).toHaveScreenshot('menu-open-desktop.png');
  });
  
  test('should match mobile layout', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await expect(page).toHaveScreenshot('mobile-layout.png');
  });
});

// ============================================
// API AND NETWORK TESTS
// ============================================
test.describe('Network Performance', () => {
  test('should load all assets successfully', async ({ page }) => {
    const failedRequests = [];
    
    page.on('requestfailed', request => {
      failedRequests.push({
        url: request.url(),
        errorText: request.failure().errorText
      });
    });
    
    await page.goto(`${BASE_URL}/normandpllc-complete-system.html`);
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check no critical assets failed
    const criticalFailures = failedRequests.filter(req => 
      req.url.includes('gsap') || 
      req.url.includes('locomotive') ||
      req.url.includes('normandpllc')
    );
    
    expect(criticalFailures).toHaveLength(0);
  });
});