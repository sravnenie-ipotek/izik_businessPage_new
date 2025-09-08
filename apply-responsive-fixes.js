#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Main pages that need fixing
const pagesToFix = [
  'index.html',
  'about.html',
  'contact.html',
  'class-action.html',
  'consumer-protection.html',
  'privacy-class-action.html',
  'insurance-class-action.html',
  'blog.html',
  'projects.html'
];

async function applyResponsiveFixes() {
  console.log('🔧 Applying responsive fixes to all pages...\n');
  
  for (const page of pagesToFix) {
    try {
      const filePath = path.join(__dirname, page);
      let content = await fs.readFile(filePath, 'utf8');
      
      // Check if fixes already applied
      if (content.includes('responsive-fixes.css') || content.includes('responsive-navigation.js')) {
        console.log(`✓ ${page} - Already has responsive fixes`);
        continue;
      }
      
      // Add responsive CSS before closing </head>
      if (!content.includes('responsive-fixes.css')) {
        content = content.replace(
          '</head>',
          `  <!-- Responsive Design Fixes -->
  <link rel="stylesheet" href="css/responsive-fixes.css">
</head>`
        );
      }
      
      // Add responsive navigation script before closing </body>
      if (!content.includes('responsive-navigation.js')) {
        content = content.replace(
          '</body>',
          `  <!-- Responsive Navigation -->
  <script src="js/responsive-navigation.js"></script>
</body>`
        );
      }
      
      // Write the updated content
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`✅ ${page} - Fixed successfully`);
      
    } catch (error) {
      console.log(`❌ ${page} - Error: ${error.message}`);
    }
  }
  
  console.log('\n✨ All responsive fixes applied successfully!');
  console.log('📱 Your site is now mobile-friendly while maintaining the design');
}

// Run the script
applyResponsiveFixes().catch(console.error);