const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Define test viewports with device context
const viewports = [
  { name: 'iPhone SE', width: 320, height: 568, category: 'mobile' },
  { name: 'iPhone 12/13/14', width: 375, height: 812, category: 'mobile' },
  { name: 'iPhone 12/13/14 Plus', width: 414, height: 896, category: 'mobile' },
  { name: 'iPad Mini', width: 768, height: 1024, category: 'tablet' },
  { name: 'iPad Pro 11"', width: 834, height: 1194, category: 'tablet' },
  { name: 'Desktop Small', width: 1024, height: 768, category: 'desktop' },
  { name: 'Desktop Medium', width: 1366, height: 768, category: 'desktop' },
  { name: 'Desktop Large', width: 1920, height: 1080, category: 'desktop' },
  { name: '4K Monitor', width: 2560, height: 1440, category: 'desktop' },
  { name: 'Ultra-wide', width: 3440, height: 1440, category: 'desktop' }
];

// Define all pages to test
const pages = [
  { path: 'index.html', name: 'Homepage' },
  { path: 'about.html', name: 'About' },
  { path: 'contact.html', name: 'Contact' },
  { path: 'class-action.html', name: 'Class Action' },
  { path: 'consumer-protection.html', name: 'Consumer Protection' },
  { path: 'privacy-class-action.html', name: 'Privacy Class Action' },
  { path: 'insurance-class-action.html', name: 'Insurance Class Action' },
  { path: 'blog.html', name: 'Blog' },
  { path: 'projects.html', name: 'Projects' }
];

// Critical responsive design issues to check
const responsiveChecks = {
  // Text readability
  checkTextReadability: async (page, viewport) => {
    const issues = [];
    
    // Check font sizes are appropriate for device
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    for (let heading of headings) {
      const fontSize = await heading.evaluate(el => {
        return parseInt(window.getComputedStyle(el).fontSize);
      });
      
      if (viewport.category === 'mobile' && fontSize < 16) {
        issues.push(`${await heading.textContent()} has font size ${fontSize}px - too small for mobile (min 16px)`);
      }
    }
    
    // Check line length for readability (45-75 characters)
    const paragraphs = await page.locator('p').all();
    for (let p of paragraphs.slice(0, 5)) { // Check first 5 paragraphs
      const textContent = await p.textContent();
      const clientWidth = await p.evaluate(el => el.clientWidth);
      const fontSize = await p.evaluate(el => parseInt(window.getComputedStyle(el).fontSize));
      
      if (textContent && textContent.length > 10) {
        const avgCharWidth = fontSize * 0.6; // Approximate
        const charactersPerLine = Math.floor(clientWidth / avgCharWidth);
        
        if (charactersPerLine > 100) {
          issues.push(`Paragraph has ~${charactersPerLine} characters per line - too long for readability (max 75)`);
        }
        if (charactersPerLine < 20 && viewport.category !== 'mobile') {
          issues.push(`Paragraph has ~${charactersPerLine} characters per line - too short`);
        }
      }
    }
    
    return issues;
  },

  // Check for horizontal scrolling
  checkHorizontalScrolling: async (page) => {
    const issues = [];
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    
    if (scrollWidth > clientWidth) {
      issues.push(`Horizontal scrolling detected: content width ${scrollWidth}px exceeds viewport ${clientWidth}px`);
    }
    
    return issues;
  },

  // Check navigation menu behavior
  checkNavigationMenu: async (page, viewport) => {
    const issues = [];
    
    // Look for hamburger menu on mobile
    const hamburger = page.locator('[class*="hamburger"], [class*="menu-toggle"], [class*="nav-toggle"]');
    const navigationItems = page.locator('nav a, .nav a, .navigation a');
    
    if (viewport.category === 'mobile') {
      const hamburgerVisible = await hamburger.isVisible();
      const navCount = await navigationItems.count();
      
      if (!hamburgerVisible && navCount > 3) {
        issues.push('Mobile navigation should use hamburger menu when there are many items');
      }
    } else {
      const hamburgerVisible = await hamburger.isVisible();
      if (hamburgerVisible) {
        issues.push('Hamburger menu should be hidden on desktop');
      }
    }
    
    return issues;
  },

  // Check button and touch target sizes
  checkTouchTargets: async (page, viewport) => {
    const issues = [];
    
    if (viewport.category === 'mobile') {
      const buttons = await page.locator('button, a, input[type="submit"]').all();
      
      for (let button of buttons) {
        const box = await button.boundingBox();
        if (box) {
          const minSize = 44; // iOS HIG recommendation
          if (box.width < minSize || box.height < minSize) {
            const text = await button.textContent();
            issues.push(`Button "${text?.trim() || 'unnamed'}" is ${Math.round(box.width)}x${Math.round(box.height)}px - too small for mobile (min 44x44px)`);
          }
        }
      }
    }
    
    return issues;
  },

  // Check image responsiveness
  checkImageResponsiveness: async (page) => {
    const issues = [];
    const images = await page.locator('img').all();
    
    for (let img of images) {
      const naturalWidth = await img.evaluate(el => el.naturalWidth);
      const clientWidth = await img.evaluate(el => el.clientWidth);
      const hasResponsiveClass = await img.getAttribute('class');
      
      // Check if image is too large for its container
      if (naturalWidth && clientWidth && naturalWidth > clientWidth * 2) {
        const src = await img.getAttribute('src');
        issues.push(`Image ${src} is ${naturalWidth}px wide but displayed at ${clientWidth}px - consider optimizing`);
      }
      
      // Check for responsive classes
      if (!hasResponsiveClass?.includes('responsive') && !hasResponsiveClass?.includes('w-') && !hasResponsiveClass?.includes('img-')) {
        const src = await img.getAttribute('src');
        issues.push(`Image ${src} may not be responsive - missing responsive classes`);
      }
    }
    
    return issues;
  },

  // Check form elements
  checkFormElements: async (page, viewport) => {
    const issues = [];
    const inputs = await page.locator('input, textarea, select').all();
    
    for (let input of inputs) {
      const box = await input.boundingBox();
      if (box) {
        if (viewport.category === 'mobile' && box.height < 44) {
          const type = await input.getAttribute('type') || 'input';
          issues.push(`Form ${type} is ${Math.round(box.height)}px tall - too small for mobile (min 44px)`);
        }
      }
    }
    
    return issues;
  },

  // Check content overflow
  checkContentOverflow: async (page) => {
    const issues = [];
    
    // Check for elements with overflow hidden that might clip content
    const elements = await page.locator('*').evaluateAll(elements => {
      return elements.filter(el => {
        const style = window.getComputedStyle(el);
        return style.overflow === 'hidden' && (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight);
      }).map(el => ({
        tagName: el.tagName,
        className: el.className,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight
      }));
    });
    
    elements.forEach(el => {
      if (el.scrollWidth > el.clientWidth) {
        issues.push(`${el.tagName}.${el.className} has horizontal content overflow (${el.scrollWidth}px > ${el.clientWidth}px)`);
      }
      if (el.scrollHeight > el.clientHeight) {
        issues.push(`${el.tagName}.${el.className} has vertical content overflow (${el.scrollHeight}px > ${el.clientHeight}px)`);
      }
    });
    
    return issues;
  },

  // Check Webflow specific elements
  checkWebflowElements: async (page, viewport) => {
    const issues = [];
    
    // Check Webflow grid elements
    const grids = await page.locator('[class*="w-layout-grid"]').all();
    for (let grid of grids) {
      const display = await grid.evaluate(el => window.getComputedStyle(el).display);
      if (display !== 'grid') {
        issues.push('Webflow grid element not displaying as CSS grid');
      }
    }
    
    // Check Webflow containers
    const containers = await page.locator('.w-container').all();
    for (let container of containers) {
      const maxWidth = await container.evaluate(el => window.getComputedStyle(el).maxWidth);
      if (maxWidth === 'none' && viewport.category === 'desktop') {
        issues.push('Webflow container has no max-width on desktop - content may spread too wide');
      }
    }
    
    return issues;
  }
};

test.describe('Comprehensive Responsive Design Audit', () => {
  let auditResults = {
    critical: [],
    major: [],
    minor: [],
    summary: {}
  };

  test.beforeAll(() => {
    // Initialize results structure
    auditResults.summary = {
      totalPages: pages.length,
      totalViewports: viewports.length,
      totalTests: pages.length * viewports.length,
      pagesWithIssues: 0,
      viewportsWithIssues: 0
    };
  });

  test.afterAll(() => {
    // Write comprehensive audit report
    const reportPath = path.join(__dirname, '../responsive-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2));
    
    console.log('\n🎨 RESPONSIVE DESIGN AUDIT COMPLETE');
    console.log('=====================================');
    console.log(`📊 Tested ${auditResults.summary.totalTests} page/viewport combinations`);
    console.log(`🔴 Critical Issues: ${auditResults.critical.length}`);
    console.log(`🟡 Major Issues: ${auditResults.major.length}`);
    console.log(`🟢 Minor Issues: ${auditResults.minor.length}`);
    console.log(`📋 Full report saved to: ${reportPath}`);
  });

  // Test each page at each viewport
  for (const page of pages) {
    for (const viewport of viewports) {
      test(`${page.name} - ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page: playwrightPage }) => {
        const pageUrl = `file://${path.join(__dirname, '..', page.path)}`;
        
        // Set viewport
        await playwrightPage.setViewportSize({ 
          width: viewport.width, 
          height: viewport.height 
        });
        
        // Navigate to page
        await playwrightPage.goto(pageUrl);
        await playwrightPage.waitForLoadState('networkidle');
        
        // Allow page to settle and animations to complete
        await playwrightPage.waitForTimeout(2000);
        
        const pageIssues = {
          page: page.name,
          viewport: `${viewport.name} (${viewport.width}x${viewport.height})`,
          url: pageUrl,
          issues: {
            critical: [],
            major: [],
            minor: []
          }
        };
        
        // Run all responsive checks
        try {
          // Critical checks
          const horizontalScrolling = await responsiveChecks.checkHorizontalScrolling(playwrightPage);
          const touchTargets = await responsiveChecks.checkTouchTargets(playwrightPage, viewport);
          const contentOverflow = await responsiveChecks.checkContentOverflow(playwrightPage);
          
          pageIssues.issues.critical.push(...horizontalScrolling);
          pageIssues.issues.critical.push(...touchTargets.filter(issue => issue.includes('too small')));
          pageIssues.issues.critical.push(...contentOverflow.filter(issue => issue.includes('overflow')));
          
          // Major checks
          const textReadability = await responsiveChecks.checkTextReadability(playwrightPage, viewport);
          const navigation = await responsiveChecks.checkNavigationMenu(playwrightPage, viewport);
          const forms = await responsiveChecks.checkFormElements(playwrightPage, viewport);
          
          pageIssues.issues.major.push(...textReadability.filter(issue => issue.includes('too small')));
          pageIssues.issues.major.push(...navigation);
          pageIssues.issues.major.push(...forms);
          
          // Minor checks
          const images = await responsiveChecks.checkImageResponsiveness(playwrightPage);
          const webflow = await responsiveChecks.checkWebflowElements(playwrightPage, viewport);
          
          pageIssues.issues.minor.push(...images);
          pageIssues.issues.minor.push(...webflow);
          pageIssues.issues.minor.push(...textReadability.filter(issue => !issue.includes('too small')));
          
        } catch (error) {
          pageIssues.issues.critical.push(`Test execution error: ${error.message}`);
        }
        
        // Add to global results
        auditResults.critical.push(...pageIssues.issues.critical.map(issue => ({
          ...pageIssues,
          issue,
          severity: 'critical'
        })));
        
        auditResults.major.push(...pageIssues.issues.major.map(issue => ({
          ...pageIssues,
          issue,
          severity: 'major'
        })));
        
        auditResults.minor.push(...pageIssues.issues.minor.map(issue => ({
          ...pageIssues,
          issue,
          severity: 'minor'
        })));
        
        // Take screenshot for documentation
        const screenshotDir = path.join(__dirname, '../responsive-screenshots');
        if (!fs.existsSync(screenshotDir)) {
          fs.mkdirSync(screenshotDir, { recursive: true });
        }
        
        const screenshotName = `${page.name.toLowerCase().replace(/\s+/g, '-')}-${viewport.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
        await playwrightPage.screenshot({ 
          path: path.join(screenshotDir, screenshotName),
          fullPage: true
        });
        
        // Assert no critical issues (will fail test if critical issues found)
        const criticalCount = pageIssues.issues.critical.length;
        const majorCount = pageIssues.issues.major.length;
        const minorCount = pageIssues.issues.minor.length;
        
        console.log(`${page.name} @ ${viewport.name}: ${criticalCount} critical, ${majorCount} major, ${minorCount} minor issues`);
        
        // Only fail on critical issues
        if (criticalCount > 0) {
          console.error(`Critical issues found:`, pageIssues.issues.critical);
          expect(criticalCount).toBe(0);
        }
      });
    }
  }
});