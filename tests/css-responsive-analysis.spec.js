const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test.describe('CSS Responsive Design Analysis', () => {
  let cssAnalysis = {
    mediaQueries: {},
    responsiveUnits: {},
    fixedUnits: {},
    webflowClasses: {},
    potentialIssues: [],
    recommendations: []
  };

  test('Analyze CSS files for responsive design patterns', async () => {
    const cssDir = path.join(__dirname, '../css');
    const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
    
    for (const file of cssFiles) {
      const filePath = path.join(cssDir, file);
      const cssContent = fs.readFileSync(filePath, 'utf8');
      
      console.log(`Analyzing ${file}...`);
      
      // Extract media queries
      const mediaQueryRegex = /@media\s+([^{]+)\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
      let match;
      
      while ((match = mediaQueryRegex.exec(cssContent)) !== null) {
        const condition = match[1].trim();
        const rules = match[2];
        
        if (!cssAnalysis.mediaQueries[file]) {
          cssAnalysis.mediaQueries[file] = [];
        }
        
        cssAnalysis.mediaQueries[file].push({
          condition,
          rules: rules.trim(),
          lineNumber: cssContent.substring(0, match.index).split('\n').length
        });
      }
      
      // Analyze units used
      const responsiveUnits = ['%', 'vw', 'vh', 'vmin', 'vmax', 'rem', 'em'];
      const fixedUnits = ['px', 'pt', 'cm', 'mm', 'in'];
      
      responsiveUnits.forEach(unit => {
        const regex = new RegExp(`\\d+${unit}`, 'g');
        const matches = cssContent.match(regex);
        if (matches) {
          if (!cssAnalysis.responsiveUnits[file]) cssAnalysis.responsiveUnits[file] = {};
          cssAnalysis.responsiveUnits[file][unit] = matches.length;
        }
      });
      
      fixedUnits.forEach(unit => {
        const regex = new RegExp(`\\d+${unit}`, 'g');
        const matches = cssContent.match(regex);
        if (matches) {
          if (!cssAnalysis.fixedUnits[file]) cssAnalysis.fixedUnits[file] = {};
          cssAnalysis.fixedUnits[file][unit] = matches.length;
        }
      });
      
      // Find Webflow-specific classes
      const webflowClassRegex = /\.(w-[a-z-]+)/g;
      let webflowMatch;
      while ((webflowMatch = webflowClassRegex.exec(cssContent)) !== null) {
        const className = webflowMatch[1];
        if (!cssAnalysis.webflowClasses[file]) cssAnalysis.webflowClasses[file] = {};
        cssAnalysis.webflowClasses[file][className] = (cssAnalysis.webflowClasses[file][className] || 0) + 1;
      }
      
      // Check for potential responsive issues
      
      // Fixed max-widths that might be too restrictive
      const maxWidthRegex = /max-width:\s*(\d+)px/g;
      let maxWidthMatch;
      while ((maxWidthMatch = maxWidthRegex.exec(cssContent)) !== null) {
        const width = parseInt(maxWidthMatch[1]);
        if (width < 320) {
          cssAnalysis.potentialIssues.push({
            file,
            issue: `Very small max-width (${width}px) might break mobile layouts`,
            line: cssContent.substring(0, maxWidthMatch.index).split('\n').length,
            severity: 'critical'
          });
        }
      }
      
      // Font sizes that might be too small on mobile
      const fontSizeRegex = /font-size:\s*(\d+)px/g;
      let fontMatch;
      while ((fontMatch = fontSizeRegex.exec(cssContent)) !== null) {
        const fontSize = parseInt(fontMatch[1]);
        if (fontSize < 14) {
          cssAnalysis.potentialIssues.push({
            file,
            issue: `Font size ${fontSize}px might be too small for mobile readability (minimum 14px recommended)`,
            line: cssContent.substring(0, fontMatch.index).split('\n').length,
            severity: 'major'
          });
        }
      }
      
      // Check for overflow hidden that might clip content
      const overflowHiddenRegex = /overflow:\s*hidden/g;
      const overflowMatches = cssContent.match(overflowHiddenRegex);
      if (overflowMatches && overflowMatches.length > 10) {
        cssAnalysis.potentialIssues.push({
          file,
          issue: `Many overflow:hidden rules (${overflowMatches.length}) - check for content clipping`,
          severity: 'minor'
        });
      }
      
      // Check for position fixed elements without responsive consideration
      const positionFixedRegex = /position:\s*fixed[^}]*(?!.*@media)/g;
      const fixedMatches = cssContent.match(positionFixedRegex);
      if (fixedMatches && fixedMatches.length > 0) {
        cssAnalysis.potentialIssues.push({
          file,
          issue: `${fixedMatches.length} fixed position elements found - ensure they work on mobile`,
          severity: 'major'
        });
      }
    }
    
    // Generate recommendations based on analysis
    generateRecommendations();
    
    // Write analysis report
    const reportPath = path.join(__dirname, '../css-responsive-analysis.json');
    fs.writeFileSync(reportPath, JSON.stringify(cssAnalysis, null, 2));
    
    console.log('\n🎨 CSS RESPONSIVE ANALYSIS COMPLETE');
    console.log('====================================');
    console.log(`📄 Analyzed ${cssFiles.length} CSS files`);
    console.log(`📱 Media queries found: ${Object.values(cssAnalysis.mediaQueries).flat().length}`);
    console.log(`⚠️ Potential issues: ${cssAnalysis.potentialIssues.length}`);
    console.log(`💡 Recommendations: ${cssAnalysis.recommendations.length}`);
    console.log(`📋 Full analysis saved to: ${reportPath}`);
    
    // Print key findings
    printKeyFindings();
  });

  function generateRecommendations() {
    const totalMediaQueries = Object.values(cssAnalysis.mediaQueries).flat().length;
    const totalResponsiveUnits = Object.values(cssAnalysis.responsiveUnits).reduce((acc, file) => {
      return acc + Object.values(file).reduce((sum, count) => sum + count, 0);
    }, 0);
    const totalFixedUnits = Object.values(cssAnalysis.fixedUnits).reduce((acc, file) => {
      return acc + Object.values(file).reduce((sum, count) => sum + count, 0);
    }, 0);
    
    if (totalMediaQueries < 10) {
      cssAnalysis.recommendations.push({
        priority: 'high',
        category: 'Media Queries',
        recommendation: 'Consider adding more media query breakpoints for better responsive design',
        details: `Only ${totalMediaQueries} media queries found. Recommended: mobile (480px), tablet (768px), desktop (1024px, 1366px, 1920px)`
      });
    }
    
    if (totalFixedUnits > totalResponsiveUnits * 2) {
      cssAnalysis.recommendations.push({
        priority: 'high',
        category: 'Responsive Units',
        recommendation: 'Convert more fixed pixel values to responsive units',
        details: `${totalFixedUnits} fixed units vs ${totalResponsiveUnits} responsive units. Use rem, em, %, vw, vh for better scalability`
      });
    }
    
    // Check for missing mobile-first breakpoints
    const mobileFirst = Object.values(cssAnalysis.mediaQueries).flat().some(mq => 
      mq.condition.includes('min-width') && mq.condition.includes('480px')
    );
    
    if (!mobileFirst) {
      cssAnalysis.recommendations.push({
        priority: 'medium',
        category: 'Mobile-First',
        recommendation: 'Consider implementing mobile-first responsive design',
        details: 'Use min-width media queries starting from mobile sizes for better performance'
      });
    }
    
    // Check for missing high-DPI support
    const hasRetina = Object.values(cssAnalysis.mediaQueries).flat().some(mq =>
      mq.condition.includes('device-pixel-ratio') || mq.condition.includes('resolution')
    );
    
    if (!hasRetina) {
      cssAnalysis.recommendations.push({
        priority: 'low',
        category: 'High-DPI',
        recommendation: 'Add support for high-DPI displays',
        details: 'Use media queries for device-pixel-ratio or resolution for crisp images on retina displays'
      });
    }
  }
  
  function printKeyFindings() {
    console.log('\n🔍 KEY FINDINGS:');
    console.log('================');
    
    // Media query breakdown
    console.log('\n📱 Media Query Breakpoints:');
    Object.entries(cssAnalysis.mediaQueries).forEach(([file, queries]) => {
      console.log(`  ${file}:`);
      queries.forEach(mq => {
        console.log(`    • ${mq.condition}`);
      });
    });
    
    // Unit usage
    console.log('\n📏 Unit Usage:');
    ['responsive', 'fixed'].forEach(type => {
      const units = type === 'responsive' ? cssAnalysis.responsiveUnits : cssAnalysis.fixedUnits;
      const total = Object.values(units).reduce((acc, file) => {
        return acc + Object.values(file).reduce((sum, count) => sum + count, 0);
      }, 0);
      console.log(`  ${type.charAt(0).toUpperCase() + type.slice(1)} units: ${total}`);
    });
    
    // Top issues
    if (cssAnalysis.potentialIssues.length > 0) {
      console.log('\n⚠️ Top Issues:');
      cssAnalysis.potentialIssues.slice(0, 5).forEach((issue, index) => {
        console.log(`  ${index + 1}. [${issue.severity.toUpperCase()}] ${issue.issue} (${issue.file})`);
      });
    }
    
    // Key recommendations
    if (cssAnalysis.recommendations.length > 0) {
      console.log('\n💡 Key Recommendations:');
      cssAnalysis.recommendations.slice(0, 3).forEach((rec, index) => {
        console.log(`  ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.recommendation}`);
      });
    }
  }
});