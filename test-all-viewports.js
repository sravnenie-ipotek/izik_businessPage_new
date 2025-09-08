const { chromium } = require('playwright');

// Comprehensive viewport testing - Mobile to Ultra-wide
const viewports = [
  // Mobile Devices
  { name: 'iPhone SE', width: 320, height: 568, category: 'Mobile' },
  { name: 'iPhone 12', width: 375, height: 812, category: 'Mobile' },
  { name: 'iPhone 14 Pro Max', width: 414, height: 896, category: 'Mobile' },
  { name: 'Samsung Galaxy S21', width: 360, height: 800, category: 'Mobile' },
  
  // Tablets
  { name: 'iPad', width: 768, height: 1024, category: 'Tablet' },
  { name: 'iPad Pro 11"', width: 834, height: 1194, category: 'Tablet' },
  { name: 'iPad Pro 12.9"', width: 1024, height: 1366, category: 'Tablet' },
  
  // Desktop
  { name: 'Small Desktop', width: 1024, height: 768, category: 'Desktop' },
  { name: 'Standard Desktop', width: 1366, height: 768, category: 'Desktop' },
  { name: 'Large Desktop', width: 1440, height: 900, category: 'Desktop' },
  { name: 'Full HD', width: 1920, height: 1080, category: 'Desktop' },
  
  // Ultra-wide
  { name: '4K Display', width: 2560, height: 1440, category: 'Ultra-wide' },
  { name: 'Ultra-wide 21:9', width: 3440, height: 1440, category: 'Ultra-wide' }
];

async function testAllViewports() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  
  console.log('🖥️  COMPREHENSIVE VIEWPORT TESTING');
  console.log('=' .repeat(60));
  
  const results = {};
  
  for (const viewport of viewports) {
    console.log(`\n📺 Testing ${viewport.name} (${viewport.width}x${viewport.height}) - ${viewport.category}`);
    console.log('-'.repeat(50));
    
    const page = await context.newPage();
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    
    // Test homepage
    await page.goto('file://' + __dirname + '/index.html');
    await page.waitForTimeout(1000);
    
    // Analyze layout issues
    const issues = await page.evaluate((vw, vh, category) => {
      const problems = [];
      
      // Check hero section layout
      const heroSection = document.querySelector('.hero-section');
      const heroContent = document.querySelector('.hero-content');
      const heroPortrait = document.querySelector('.hero-portrait');
      
      if (heroSection && heroContent) {
        const heroRect = heroSection.getBoundingClientRect();
        const contentRect = heroContent.getBoundingClientRect();
        
        // Check if content is visible
        if (contentRect.height === 0 || contentRect.width === 0) {
          problems.push('Hero content has zero dimensions');
        }
        
        // Check text overflow
        if (contentRect.right > vw || contentRect.bottom > vh) {
          problems.push('Hero content overflows viewport');
        }
        
        // Desktop-specific checks
        if (category === 'Desktop' && vw >= 1024) {
          if (heroPortrait) {
            const portraitRect = heroPortrait.getBoundingClientRect();
            // Check if portrait overlaps content
            if (contentRect.right > portraitRect.left && portraitRect.width > 0) {
              problems.push('Hero portrait overlaps text content on desktop');
            }
          }
          
          // Check if hero content takes appropriate width
          if (contentRect.width > vw * 0.7) {
            problems.push('Hero content too wide on desktop (should be ~60% max)');
          }
        }
        
        // Mobile-specific checks
        if (category === 'Mobile' && vw <= 414) {
          if (heroPortrait && heroPortrait.offsetWidth > 0) {
            problems.push('Hero portrait should be hidden on mobile');
          }
        }
      }
      
      // Check hero text sizing
      const heroTitle = document.querySelector('.hero-title, h1');
      if (heroTitle) {
        const fontSize = parseFloat(window.getComputedStyle(heroTitle).fontSize);
        
        if (category === 'Mobile' && fontSize > 60) {
          problems.push(`Hero title too large on mobile: ${fontSize}px`);
        }
        
        if (category === 'Desktop' && fontSize < 60) {
          problems.push(`Hero title too small on desktop: ${fontSize}px`);
        }
      }
      
      // Check horizontal scrolling
      if (document.body.scrollWidth > vw) {
        problems.push(`Horizontal scroll: body width ${document.body.scrollWidth}px > viewport ${vw}px`);
      }
      
      // Check navigation menu
      const menuToggle = document.querySelector('.menu-toggle');
      const navbar = document.querySelector('.navbar, .main-navigation');
      
      if (category === 'Mobile' && vw <= 768) {
        if (!menuToggle || menuToggle.offsetHeight === 0) {
          problems.push('Mobile menu toggle not visible');
        }
      } else if (category === 'Desktop') {
        // Check if desktop navigation is properly positioned
        if (menuToggle && menuToggle.offsetWidth === vw) {
          problems.push('Menu toggle taking full width on desktop (should be sidebar)');
        }
      }
      
      // Check orange services section
      const servicesSection = document.querySelector('.services-orange-section');
      if (servicesSection) {
        const servicesRect = servicesSection.getBoundingClientRect();
        if (servicesRect.width > vw) {
          problems.push('Orange services section overflows viewport');
        }
        
        // Check content wrapper on desktop
        if (category === 'Desktop') {
          const contentWrapper = servicesSection.querySelector('.services-content-wrapper');
          if (contentWrapper) {
            const wrapperStyles = window.getComputedStyle(contentWrapper);
            if (wrapperStyles.flexDirection !== 'row' && vw >= 1024) {
              problems.push('Services content should be horizontal on desktop');
            }
          }
        }
      }
      
      // Check touch targets (only on touch devices)
      if (category === 'Mobile' || category === 'Tablet') {
        const buttons = document.querySelectorAll('button, a, input[type="submit"]');
        let smallTargets = 0;
        buttons.forEach(btn => {
          const rect = btn.getBoundingClientRect();
          if (rect.height < 44 || rect.width < 44) {
            smallTargets++;
          }
        });
        if (smallTargets > 5) {
          problems.push(`${smallTargets} touch targets smaller than 44px`);
        }
      }
      
      // Check language switcher positioning
      const langSwitcher = document.querySelector('.language-switcher');
      if (langSwitcher) {
        const switcherRect = langSwitcher.getBoundingClientRect();
        if (switcherRect.right > vw || switcherRect.bottom < 0) {
          problems.push('Language switcher positioned incorrectly');
        }
      }
      
      return problems;
    }, viewport.width, viewport.height, viewport.category);
    
    results[viewport.name] = {
      viewport,
      issues,
      status: issues.length === 0 ? '✅ GOOD' : '❌ ISSUES'
    };
    
    // Report results
    console.log(`Status: ${results[viewport.name].status}`);
    if (issues.length > 0) {
      issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log('   No layout issues detected');
    }
    
    // Take screenshot for visual verification
    await page.screenshot({ 
      path: `screenshots/viewport-test-${viewport.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${viewport.width}x${viewport.height}.png`,
      fullPage: false 
    });
    
    await page.close();
  }
  
  await browser.close();
  
  // Summary report
  console.log('\n' + '=' .repeat(60));
  console.log('📊 VIEWPORT TEST SUMMARY');
  console.log('=' .repeat(60));
  
  const categories = ['Mobile', 'Tablet', 'Desktop', 'Ultra-wide'];
  
  categories.forEach(category => {
    console.log(`\n📱 ${category} Devices:`);
    const categoryResults = Object.values(results).filter(r => r.viewport.category === category);
    
    categoryResults.forEach(result => {
      console.log(`   ${result.status} ${result.viewport.name} (${result.viewport.width}x${result.viewport.height})`);
      if (result.issues.length > 0) {
        result.issues.slice(0, 2).forEach(issue => console.log(`      - ${issue}`));
      }
    });
  });
  
  // Critical issues summary
  const criticalIssues = Object.values(results).filter(r => r.issues.length > 0);
  
  console.log('\n🚨 CRITICAL ISSUES TO FIX:');
  console.log('-'.repeat(40));
  
  if (criticalIssues.length === 0) {
    console.log('✅ No critical issues found - all viewports working correctly!');
  } else {
    const issuesByType = {};
    criticalIssues.forEach(result => {
      result.issues.forEach(issue => {
        if (!issuesByType[issue]) issuesByType[issue] = [];
        issuesByType[issue].push(result.viewport.name);
      });
    });
    
    Object.entries(issuesByType).forEach(([issue, viewports]) => {
      console.log(`❌ ${issue}`);
      console.log(`   Affected: ${viewports.join(', ')}`);
    });
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log(`📈 Results: ${Object.keys(results).length - criticalIssues.length}/${Object.keys(results).length} viewports working correctly`);
  console.log('=' .repeat(60));
}

// Create screenshots directory
const fs = require('fs');
if (!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots');
}

// Run comprehensive test
testAllViewports().catch(console.error);