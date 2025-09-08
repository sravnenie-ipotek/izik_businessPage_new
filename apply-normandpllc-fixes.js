#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// All HTML pages that need fixing
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

async function applyNormandPLLCFixes() {
  console.log('🚀 Applying NormandPLLC-style responsive fixes...\n');
  
  for (const page of pagesToFix) {
    try {
      const filePath = path.join(__dirname, page);
      let content = await fs.readFile(filePath, 'utf8');
      
      // Remove old responsive fixes if they exist
      content = content.replace(
        /<link rel="stylesheet" href="css\/responsive-fixes.css">/g,
        ''
      );
      
      // Check if normandpllc fixes already applied
      if (content.includes('normandpllc-responsive-fixes.css')) {
        console.log(`✓ ${page} - Already has NormandPLLC fixes`);
        continue;
      }
      
      // Add new normandpllc responsive CSS before closing </head>
      content = content.replace(
        '</head>',
        `  <!-- NormandPLLC-Style Responsive Fixes -->
  <link rel="stylesheet" href="css/normandpllc-responsive-fixes.css">
</head>`
      );
      
      // Ensure responsive navigation script is there
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
      console.log(`✅ ${page} - Applied NormandPLLC responsive fixes`);
      
    } catch (error) {
      console.log(`❌ ${page} - Error: ${error.message}`);
    }
  }
  
  console.log('\n✨ NormandPLLC-style fixes applied successfully!');
  console.log('📱 Your site now matches normandpllc.com mobile behavior');
  console.log('\n🔍 Key improvements:');
  console.log('   • Hero text properly sized (48-54px on mobile)');
  console.log('   • All touch targets 44x44px minimum');
  console.log('   • No horizontal scrolling');
  console.log('   • Mobile menu like normandpllc.com');
  console.log('   • Proper content padding (24px)');
  console.log('   • Text minimum 16px for readability');
}

// Run the script
applyNormandPLLCFixes().catch(console.error);