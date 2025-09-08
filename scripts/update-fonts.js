#!/usr/bin/env node

/**
 * Update all scaffold HTML files to use fonts that better match normandpllc.com
 * 
 * Original normandpllc.com fonts:
 * - Knockout/Knockout-Full for headings (condensed, uppercase)
 * - Gotham-Medium/Gotham-Book for body text
 * 
 * Our alternatives:
 * - Oswald/Barlow Condensed for headings (closest to Knockout)
 * - Montserrat for body text (closest to Gotham)
 */

const fs = require('fs');
const path = require('path');

const scaffoldDir = path.join(__dirname, '..', 'scaffold');

// New font configuration that better matches normandpllc.com
const newFontConfig = `
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brandBg: '#010101',
            brandText: '#ffffff',
            brandGray: '#b3b3b3',
            brandLightGray: '#f2f2f2',
            brandOrange: '#fc5a2b',
          },
          fontFamily: {
            // Oswald is the closest free alternative to Knockout (condensed, bold)
            'knockout': ['Oswald', 'Arial Narrow', 'Impact', 'sans-serif'],
            // Barlow Condensed as secondary heading font
            'knockout-alt': ['Barlow Condensed', 'Arial Narrow', 'sans-serif'],
            // Montserrat is closest to Gotham Medium
            'gotham': ['Montserrat', 'Helvetica Neue', 'Arial', 'sans-serif'],
            // For navigation (Gotham Book equivalent)
            'gotham-book': ['Nunito Sans', 'Helvetica', 'Arial', 'sans-serif'],
          },
          fontSize: {
            'heading-xl': ['72px', '1'],
            'heading-lg': ['48px', '1.1'],
            'heading-md': ['36px', '1.2'],
            'heading-sm': ['24px', '1.2'],
            'heading-xs': ['18px', '1.3'],
            'body-sm': ['14px', '1.7'],
            'body-xs': ['12px', '1.5'],
          },
          letterSpacing: {
            'knockout': '0.02em',
            'gotham': '0.01em',
          },
          fontWeight: {
            'knockout': '700',
            'gotham': '500',
          }
        }
      }
    }`;

// New Google Fonts link
const newFontLink = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Montserrat:wght@400;500;600;700&family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet">`;

// Additional CSS for font rendering
const additionalStyles = `
  <style>
    body { 
      font-size: 14px; 
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    /* Make headings more like Knockout */
    .font-knockout, h1, h2, h3, h4 {
      font-stretch: condensed;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    /* Body text like Gotham */
    .font-gotham {
      letter-spacing: 0.01em;
    }
  </style>`;

// Process each HTML file
fs.readdirSync(scaffoldDir).forEach(file => {
  if (file.endsWith('.html') && !file.includes('font-update')) {
    const filePath = path.join(scaffoldDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace Tailwind config
    content = content.replace(
      /tailwind\.config = \{[\s\S]*?\}/m,
      newFontConfig.trim()
    );
    
    // Replace Google Fonts link
    content = content.replace(
      /<link[^>]*fonts\.googleapis\.com[^>]*>/,
      newFontLink
    );
    
    // Add additional styles if not present
    if (!content.includes('-webkit-font-smoothing')) {
      content = content.replace(
        '</head>',
        additionalStyles + '\n</head>'
      );
    }
    
    // Update font classes in HTML
    // Replace font-heading with font-knockout
    content = content.replace(/font-heading/g, 'font-knockout');
    // Replace font-body with font-gotham
    content = content.replace(/font-body(?!-)/g, 'font-gotham');
    
    // Update specific text elements
    content = content.replace(
      /class="([^"]*)\bfont-heading\b([^"]*)"/g,
      'class="$1font-knockout$2"'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${file}`);
  }
});

console.log('\nFont update complete!');
console.log('Fonts now match normandpllc.com style:');
console.log('- Oswald (Knockout alternative) for headings');
console.log('- Montserrat (Gotham alternative) for body text');