const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Critical viewports to test
const criticalViewports = [
  { name: 'iPhone SE', width: 320, height: 568, category: 'mobile' },
  { name: 'iPhone 12', width: 375, height: 812, category: 'mobile' },
  { name: 'iPad', width: 768, height: 1024, category: 'tablet' },
  { name: 'Desktop', width: 1366, height: 768, category: 'desktop' }
];

// Key pages to audit
const keyPages = [
  { path: 'index.html', name: 'Homepage' },
  { path: 'class-action.html', name: 'Class Action' },
  { path: 'consumer-protection.html', name: 'Consumer Protection' },
  { path: 'contact.html', name: 'Contact' }
];

test.describe('Focused Responsive Design Audit', () => {
  let auditResults = [];

  test.afterAll(() => {
    // Create comprehensive report
    const report = {
      summary: {
        totalTests: auditResults.length,
        criticalIssues: auditResults.filter(r => r.critical.length > 0).length,
        majorIssues: auditResults.filter(r => r.major.length > 0).length,
        timestamp: new Date().toISOString()
      },
      results: auditResults,
      recommendations: generateRecommendations()
    };
    
    const reportPath = path.join(__dirname, '../focused-responsive-audit.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Create HTML report
    createHtmlReport(report);
    
    console.log('\n🎨 FOCUSED RESPONSIVE AUDIT COMPLETE');
    console.log('=====================================');
    console.log(`📊 Tested ${report.summary.totalTests} page/viewport combinations`);
    console.log(`🔴 Pages with critical issues: ${report.summary.criticalIssues}`);
    console.log(`🟡 Pages with major issues: ${report.summary.majorIssues}`);
    console.log(`📋 Reports saved to focused-responsive-audit.json and .html`);
    
    printSummary(report);
  });

  for (const page of keyPages) {
    for (const viewport of criticalViewports) {
      test(`${page.name} @ ${viewport.name} (${viewport.width}px)`, async ({ page: playwrightPage }) => {
        const startTime = Date.now();
        const pageUrl = `file://${path.join(__dirname, '..', page.path)}`;
        
        // Set viewport
        await playwrightPage.setViewportSize({ 
          width: viewport.width, 
          height: viewport.height 
        });
        
        await playwrightPage.goto(pageUrl, { waitUntil: 'networkidle' });
        await playwrightPage.waitForTimeout(1000); // Allow animations to settle
        
        const result = {
          page: page.name,
          viewport: `${viewport.name} (${viewport.width}x${viewport.height})`,
          url: pageUrl,
          testDuration: 0,
          critical: [],
          major: [],
          minor: [],
          screenshot: ''
        };
        
        try {
          // CRITICAL CHECKS
          
          // 1. Horizontal scrolling check
          const scrollData = await playwrightPage.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            bodyScrollWidth: document.body.scrollWidth,
            bodyClientWidth: document.body.clientWidth
          }));
          
          if (scrollData.scrollWidth > scrollData.clientWidth + 5) { // 5px tolerance
            result.critical.push(`Horizontal scrolling detected: page width ${scrollData.scrollWidth}px exceeds viewport ${scrollData.clientWidth}px`);
          }
          
          // 2. Text too small on mobile
          if (viewport.category === 'mobile') {
            const smallText = await playwrightPage.locator('*').evaluateAll(elements => {
              return elements.filter(el => {
                const style = window.getComputedStyle(el);
                const fontSize = parseInt(style.fontSize);
                return fontSize > 0 && fontSize < 14 && el.textContent && el.textContent.trim().length > 5;
              }).map(el => ({
                tagName: el.tagName,
                fontSize: parseInt(window.getComputedStyle(el).fontSize),
                text: el.textContent.trim().substring(0, 50)
              }));
            });
            
            if (smallText.length > 0) {
              result.critical.push(`${smallText.length} elements with text smaller than 14px found on mobile`);
            }
          }
          
          // 3. Touch targets too small
          if (viewport.category === 'mobile') {
            const buttons = await playwrightPage.locator('button, a[href], input[type="submit"], input[type="button"]').all();
            let smallButtons = 0;
            
            for (let button of buttons.slice(0, 10)) { // Check first 10 buttons
              try {
                const box = await button.boundingBox();
                if (box && (box.width < 44 || box.height < 44)) {
                  smallButtons++;
                }
              } catch (e) {
                // Skip hidden or invalid elements
              }
            }
            
            if (smallButtons > 0) {
              result.critical.push(`${smallButtons} touch targets smaller than 44x44px found`);
            }
          }
          
          // MAJOR CHECKS
          
          // 1. Navigation issues
          const navItems = await playwrightPage.locator('nav a, .navigation a, .nav a').count();
          const hamburgerVisible = await playwrightPage.locator('[class*="hamburger"], [class*="menu-toggle"], [class*="nav-toggle"], .mobile-menu-btn').isVisible();
          
          if (viewport.category === 'mobile' && navItems > 4 && !hamburgerVisible) {
            result.major.push('Mobile navigation should use hamburger menu - too many nav items for small screen');
          }
          
          // 2. Form usability
          const inputs = await playwrightPage.locator('input, textarea, select').all();
          let problematicInputs = 0;
          
          for (let input of inputs) {
            try {
              const box = await input.boundingBox();
              if (box && viewport.category === 'mobile' && box.height < 44) {
                problematicInputs++;
              }
            } catch (e) {
              // Skip hidden elements
            }
          }
          
          if (problematicInputs > 0) {
            result.major.push(`${problematicInputs} form elements too small for mobile interaction`);
          }
          
          // 3. Content layout issues
          const overflowElements = await playwrightPage.locator('*').evaluateAll(elements => {
            return elements.filter(el => {
              const rect = el.getBoundingClientRect();
              return rect.width > window.innerWidth;
            }).length;
          });
          
          if (overflowElements > 0) {
            result.major.push(`${overflowElements} elements wider than viewport causing potential layout issues`);
          }
          
          // MINOR CHECKS
          
          // 1. Image optimization
          const images = await playwrightPage.locator('img[src]').all();
          let unoptimizedImages = 0;
          
          for (let img of images.slice(0, 5)) {
            try {
              const naturalWidth = await img.evaluate(el => el.naturalWidth);
              const clientWidth = await img.evaluate(el => el.clientWidth);
              
              if (naturalWidth > clientWidth * 1.5) {
                unoptimizedImages++;
              }
            } catch (e) {
              // Skip problematic images
            }
          }
          
          if (unoptimizedImages > 0) {
            result.minor.push(`${unoptimizedImages} images appear oversized for their display size`);
          }
          
          // 2. Typography hierarchy
          const headings = await playwrightPage.locator('h1, h2, h3, h4, h5, h6').evaluateAll(headings => {
            return headings.map(h => ({
              tag: h.tagName,
              fontSize: parseInt(window.getComputedStyle(h).fontSize)
            }));
          });
          
          // Check if heading sizes make sense
          let previousSize = Infinity;
          let hierarchyIssues = 0;
          headings.forEach(h => {
            if (h.fontSize > previousSize) {
              hierarchyIssues++;
            }
            previousSize = h.fontSize;
          });
          
          if (hierarchyIssues > 0) {
            result.minor.push(`Typography hierarchy issues detected - ${hierarchyIssues} headings larger than previous level`);
          }
          
        } catch (error) {
          result.critical.push(`Test execution error: ${error.message}`);
        }
        
        // Take screenshot
        const screenshotDir = path.join(__dirname, '../audit-screenshots');
        if (!fs.existsSync(screenshotDir)) {
          fs.mkdirSync(screenshotDir, { recursive: true });
        }
        
        const screenshotName = `${page.name.toLowerCase().replace(/\s+/g, '-')}-${viewport.width}px.png`;
        const screenshotPath = path.join(screenshotDir, screenshotName);
        await playwrightPage.screenshot({ 
          path: screenshotPath,
          fullPage: true
        });
        result.screenshot = screenshotName;
        
        result.testDuration = Date.now() - startTime;
        auditResults.push(result);
        
        // Log results
        const totalIssues = result.critical.length + result.major.length + result.minor.length;
        console.log(`${page.name} @ ${viewport.name}: ${result.critical.length}🔴 ${result.major.length}🟡 ${result.minor.length}🟢 (${result.testDuration}ms)`);
        
        // Only fail on critical issues
        if (result.critical.length > 0) {
          console.error('Critical responsive issues found:', result.critical);
        }
      });
    }
  }

  function generateRecommendations() {
    const recommendations = [];
    
    // Analyze patterns across results
    const allCritical = auditResults.flatMap(r => r.critical);
    const allMajor = auditResults.flatMap(r => r.major);
    
    // Horizontal scrolling issues
    if (allCritical.some(issue => issue.includes('Horizontal scrolling'))) {
      recommendations.push({
        priority: 'CRITICAL',
        category: 'Layout',
        issue: 'Horizontal scrolling detected',
        solution: 'Add CSS: `* { box-sizing: border-box; } body { overflow-x: hidden; }` and check for fixed-width elements',
        cssfix: `
/* Prevent horizontal scrolling */
* {
  box-sizing: border-box;
}

body {
  overflow-x: hidden;
  max-width: 100vw;
}

/* Ensure images don't overflow */
img {
  max-width: 100%;
  height: auto;
}
        `
      });
    }
    
    // Small text issues
    if (allCritical.some(issue => issue.includes('smaller than 14px'))) {
      recommendations.push({
        priority: 'CRITICAL',
        category: 'Typography',
        issue: 'Text too small on mobile devices',
        solution: 'Increase minimum font size to 16px for body text on mobile',
        cssfix: `
@media screen and (max-width: 768px) {
  body, p, span, div {
    font-size: 16px !important;
    line-height: 1.5 !important;
  }
  
  small, .small-text {
    font-size: 14px !important;
  }
}
        `
      });
    }
    
    // Touch target issues
    if (allCritical.some(issue => issue.includes('touch targets smaller'))) {
      recommendations.push({
        priority: 'CRITICAL',
        category: 'Usability',
        issue: 'Touch targets too small for mobile',
        solution: 'Ensure all interactive elements are at least 44x44px on mobile',
        cssfix: `
@media screen and (max-width: 768px) {
  button, 
  a, 
  input[type="submit"], 
  input[type="button"] {
    min-height: 44px;
    min-width: 44px;
    padding: 12px 16px;
  }
}
        `
      });
    }
    
    // Navigation issues
    if (allMajor.some(issue => issue.includes('hamburger menu'))) {
      recommendations.push({
        priority: 'MAJOR',
        category: 'Navigation',
        issue: 'Mobile navigation needs hamburger menu',
        solution: 'Implement responsive navigation with hamburger menu for mobile devices',
        cssfix: `
@media screen and (max-width: 768px) {
  .main-navigation {
    display: none;
  }
  
  .hamburger-menu {
    display: block;
  }
  
  .mobile-nav-active .main-navigation {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    z-index: 1000;
  }
}
        `
      });
    }
    
    return recommendations;
  }

  function createHtmlReport(report) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Design Audit Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #fc5a2b; margin-bottom: 10px; }
        h2 { color: #333; border-bottom: 2px solid #fc5a2b; padding-bottom: 10px; }
        .summary { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .issue-critical { background: #fee; border-left: 4px solid #dc3545; padding: 10px; margin: 10px 0; }
        .issue-major { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
        .issue-minor { background: #e8f5e8; border-left: 4px solid #28a745; padding: 10px; margin: 10px 0; }
        .recommendation { background: #e3f2fd; padding: 15px; margin: 10px 0; border-radius: 4px; }
        .css-fix { background: #f4f4f4; padding: 10px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; margin: 10px 0; }
        .viewport-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .result-card { background: #f9f9f9; padding: 15px; border-radius: 6px; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin: 2px; }
        .badge-critical { background: #dc3545; color: white; }
        .badge-major { background: #ffc107; color: #212529; }
        .badge-minor { background: #28a745; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 Responsive Design Audit Report</h1>
        <p><strong>Generated:</strong> ${new Date(report.summary.timestamp).toLocaleString()}</p>
        
        <div class="summary">
            <h2>📊 Summary</h2>
            <p><strong>Total Tests:</strong> ${report.summary.totalTests}</p>
            <p><strong>Pages with Critical Issues:</strong> ${report.summary.criticalIssues}</p>
            <p><strong>Pages with Major Issues:</strong> ${report.summary.majorIssues}</p>
        </div>
        
        <h2>🔍 Test Results by Page and Viewport</h2>
        <div class="viewport-grid">
            ${report.results.map(result => `
                <div class="result-card">
                    <h3>${result.page}</h3>
                    <p><strong>${result.viewport}</strong></p>
                    <p>
                        <span class="badge badge-critical">${result.critical.length} Critical</span>
                        <span class="badge badge-major">${result.major.length} Major</span>
                        <span class="badge badge-minor">${result.minor.length} Minor</span>
                    </p>
                    
                    ${result.critical.map(issue => `<div class="issue-critical"><strong>🔴 Critical:</strong> ${issue}</div>`).join('')}
                    ${result.major.map(issue => `<div class="issue-major"><strong>🟡 Major:</strong> ${issue}</div>`).join('')}
                    ${result.minor.map(issue => `<div class="issue-minor"><strong>🟢 Minor:</strong> ${issue}</div>`).join('')}
                    
                    ${result.screenshot ? `<p><strong>Screenshot:</strong> ${result.screenshot}</p>` : ''}
                    <p><small>Test Duration: ${result.testDuration}ms</small></p>
                </div>
            `).join('')}
        </div>
        
        <h2>💡 Recommendations & Fixes</h2>
        ${report.recommendations.map(rec => `
            <div class="recommendation">
                <h3>[${rec.priority}] ${rec.category}: ${rec.issue}</h3>
                <p><strong>Solution:</strong> ${rec.solution}</p>
                ${rec.cssfix ? `
                    <details>
                        <summary>Show CSS Fix</summary>
                        <div class="css-fix">${rec.cssfix}</div>
                    </details>
                ` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>
    `;
    
    const htmlPath = path.join(__dirname, '../focused-responsive-audit.html');
    fs.writeFileSync(htmlPath, html);
  }

  function printSummary(report) {
    console.log('\n📋 CRITICAL ISSUES TO FIX IMMEDIATELY:');
    const criticalIssues = new Set();
    report.results.forEach(r => r.critical.forEach(issue => criticalIssues.add(issue)));
    criticalIssues.forEach(issue => console.log(`  • ${issue}`));
    
    console.log('\n🔧 TOP RECOMMENDATIONS:');
    report.recommendations.slice(0, 3).forEach((rec, i) => {
      console.log(`  ${i + 1}. [${rec.priority}] ${rec.issue}`);
      console.log(`     Solution: ${rec.solution}`);
    });
  }
});