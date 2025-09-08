import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

async function generateCode() {
  console.log('🚀 Starting code generation...');
  
  // Load data
  const tokens = JSON.parse(await fs.readFile(path.join(ROOT_DIR, 'output', 'tokens.global.json'), 'utf8'));
  const templates = JSON.parse(await fs.readFile(path.join(ROOT_DIR, 'output', 'templates.json'), 'utf8'));
  const sitemap = JSON.parse(await fs.readFile(path.join(ROOT_DIR, 'output', 'sitemap.json'), 'utf8'));
  
  // Generate Tailwind config
  await generateTailwindConfig(tokens);
  
  // Generate HTML scaffolds for each template
  for (const template of templates) {
    await generateTemplateScaffolds(template, tokens);
  }
  
  // Generate global partials
  await generatePartials(tokens);
  
  
  // Generate BackstopJS configs
  await generateBackstopConfigs(sitemap);
  
  console.log('✅ Code generation complete!');
}

async function generateTailwindConfig(tokens) {
  console.log('  Generating Tailwind config...');
  
  // Extract values from tokens
  const hero = tokens.hero || {};
  const footer = tokens.footer || {};
  
  // Determine font alternatives
  const headingFont = hero.typography?.heading?.family || 'sans-serif';
  const bodyFont = hero.typography?.body?.family || 'sans-serif';
  
  let headingFontFamily = "'Bebas Neue', 'Impact', sans-serif"; // Default for Knockout
  let bodyFontFamily = "'Inter', 'Roboto', sans-serif"; // Default for Gotham
  
  if (headingFont.toLowerCase().includes('din')) {
    headingFontFamily = "'Barlow', 'DIN', sans-serif";
  } else if (headingFont.toLowerCase().includes('futura')) {
    headingFontFamily = "'Bebas Neue', 'Futura', sans-serif";
  }
  
  const config = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./scaffold/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBg: '#010101',
        brandText: '#ffffff',
        brandMuted: '#b3b3b3',
        brandLink: '#ffffff',
        brandLinkHover: 'rgba(255, 255, 255, 0.8)',
        brandBtn: '#fc5a2b',
        brandBtnText: '#ffffff',
        brandBtnBorder: '#fc5a2b',
        brandOrange: '#fc5a2b',
        brandGray: '#b3b3b3',
      },
      fontFamily: {
        heading: [${headingFontFamily}],
        body: [${bodyFontFamily}],
      },
      fontSize: {
        'heading-xl': '140px',
        'heading-lg': '100px',
        'heading-md': '60px',
        'heading-sm': '40px',
        'heading-xs': '24px',
      },
      letterSpacing: {
        tightXs: '-0.01em',
        tightSm: '-0.02em',
        wideSm: '0.05em',
        wideMd: '0.1em',
        wideLg: '0.15em',
      },
      lineHeight: {
        'heading': '1.1',
        'body': '1.7',
      },
      maxWidth: {
        'container': '1440px',
      },
      spacing: {
        'sectionY': '5rem', // 80px
        'sectionYLg': '7.5rem', // 120px
        'innerGap': '2rem', // 32px
      },
      height: {
        'input': '48px',
        'button': '45px',
        'buttonSm': '40px',
      },
      borderRadius: {
        'input': '0px',
        'button': '0px',
      },
      borderWidth: {
        'input': '1px',
        'button': '0px',
      },
      animation: {
        'slideInUp': 'slideInUp 0.6s ease-out',
        'fadeIn': 'fadeIn 0.8s ease-out',
        'rotateIn': 'rotateIn 0.5s ease-out',
      },
      keyframes: {
        slideInUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        rotateIn: {
          '0%': { transform: 'rotate(-90deg)', opacity: '0' },
          '100%': { transform: 'rotate(0)', opacity: '1' },
        },
      },
      screens: {
        'xs': '390px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1440px',
      },
    },
  },
  plugins: [],
}`;
  
  await fs.writeFile(path.join(ROOT_DIR, 'tailwind.config.js'), config);
}

async function generateTemplateScaffolds(template, tokens) {
  console.log(`  Generating scaffolds for ${template.id}...`);
  
  const templateDir = path.join(ROOT_DIR, 'scaffold', 'templates', template.id);
  const sectionsDir = path.join(templateDir, 'sections');
  
  // Create directories
  await fs.mkdir(templateDir, { recursive: true });
  await fs.mkdir(sectionsDir, { recursive: true });
  
  // Generate section files
  const sectionIncludes = [];
  
  for (let i = 0; i < template.sampleBlocks.length; i++) {
    const block = template.sampleBlocks[i];
    const sectionHtml = generateSectionHtml(block, i + 1);
    const sectionFile = `section-${i + 1}.html`;
    
    await fs.writeFile(path.join(sectionsDir, sectionFile), sectionHtml);
    sectionIncludes.push(`    <!-- Section ${i + 1}: ${block.color} block -->\n    <include src="./sections/${sectionFile}"></include>`);
  }
  
  // Generate main page template
  const pageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.id} Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Header -->
  <include src="../../partials/header.html"></include>
  
  <!-- Main Content -->
  <main>
${sectionIncludes.join('\n')}
  </main>
  
  <!-- Footer -->
  <include src="../../partials/footer.html"></include>
</body>
</html>`;
  
  await fs.writeFile(path.join(templateDir, 'page.html'), pageHtml);
}

function generateSectionHtml(block, index) {
  // Determine background class based on color
  let bgClass = 'bg-white text-gray-900';
  if (block.color === 'black') {
    bgClass = 'bg-black text-white';
  } else if (block.color === 'orange') {
    bgClass = 'bg-brandOrange text-white';
  } else if (block.color === 'gray') {
    bgClass = 'bg-gray-50 text-gray-900';
  }
  
  // Generate appropriate content based on block features
  let content = '';
  
  if (block.hasHero) {
    content = `
    <div class="text-center lg:text-left">
      <h1 class="font-heading text-heading-sm md:text-heading-md lg:text-heading-lg xl:text-heading-xl uppercase leading-heading tracking-tightSm mb-6">
        Placeholder<br/>
        <span class="text-brandOrange">Hero Text</span>
      </h1>
      <p class="text-lg font-body leading-body max-w-2xl mx-auto lg:mx-0 mb-8">
        Placeholder description text demonstrating typography and spacing.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
        ${block.ctas.map((cta, i) => `
        <a href="${cta.href}" class="inline-block px-8 py-3 ${i === 0 ? 'bg-brandOrange text-white' : 'border border-current'} font-body uppercase tracking-wideSm hover:opacity-90 transition-opacity">
          ${cta.label}
        </a>`).join('')}
      </div>
    </div>`;
  } else if (block.hasForms) {
    content = `
    <div class="grid lg:grid-cols-2 gap-12">
      <div>
        <h2 class="font-heading text-heading-sm md:text-heading-md uppercase leading-heading tracking-tightSm mb-6">
          Contact Form
        </h2>
        <form class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" class="w-full h-input px-4 bg-transparent border ${block.color === 'black' ? 'border-gray-600' : 'border-gray-300'} focus:border-brandOrange focus:outline-none transition-colors">
            <input type="text" placeholder="Last Name" class="w-full h-input px-4 bg-transparent border ${block.color === 'black' ? 'border-gray-600' : 'border-gray-300'} focus:border-brandOrange focus:outline-none transition-colors">
          </div>
          <input type="email" placeholder="Email" class="w-full h-input px-4 bg-transparent border ${block.color === 'black' ? 'border-gray-600' : 'border-gray-300'} focus:border-brandOrange focus:outline-none transition-colors">
          <textarea placeholder="Message" rows="4" class="w-full px-4 py-3 bg-transparent border ${block.color === 'black' ? 'border-gray-600' : 'border-gray-300'} focus:border-brandOrange focus:outline-none transition-colors resize-none"></textarea>
          <button type="submit" class="h-button px-8 bg-brandOrange text-white font-body uppercase tracking-wideSm hover:opacity-90 transition-opacity">
            Submit
          </button>
        </form>
      </div>
      <div>
        <h3 class="font-heading text-2xl uppercase mb-4">Information</h3>
        <p class="font-body leading-body mb-4">
          Placeholder contact information and details.
        </p>
      </div>
    </div>`;
  } else if (block.hasFAQ) {
    content = `
    <div>
      <h2 class="font-heading text-heading-sm md:text-heading-md uppercase leading-heading tracking-tightSm mb-8 text-center">
        Frequently Asked Questions
      </h2>
      <div class="max-w-3xl mx-auto space-y-4">
        ${[1,2,3].map(i => `
        <details class="border-b ${block.color === 'black' ? 'border-gray-700' : 'border-gray-200'} pb-4">
          <summary class="font-heading text-xl uppercase cursor-pointer hover:text-brandOrange transition-colors">
            Question ${i}
          </summary>
          <p class="mt-4 font-body leading-body">
            Placeholder answer to frequently asked question number ${i}.
          </p>
        </details>`).join('')}
      </div>
    </div>`;
  } else if (block.hasGallery) {
    content = `
    <div>
      <h2 class="font-heading text-heading-sm md:text-heading-md uppercase leading-heading tracking-tightSm mb-8 text-center">
        Gallery
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        ${[1,2,3,4,5,6].map(i => `
        <div class="aspect-square bg-gray-200 flex items-center justify-center">
          <span class="text-gray-500">Image ${i}</span>
        </div>`).join('')}
      </div>
    </div>`;
  } else {
    // Default content block
    content = `
    <div>
      ${block.headingSample ? `
      <h2 class="font-heading text-heading-sm md:text-heading-md uppercase leading-heading tracking-tightSm mb-6">
        ${block.headingSample.substring(0, 30)}...
      </h2>` : ''}
      <p class="font-body leading-body mb-6">
        Placeholder content for section ${index}. This section uses ${block.color} background with appropriate text colors.
      </p>
      ${block.ctas.length > 0 ? `
      <div class="flex flex-wrap gap-4">
        ${block.ctas.map((cta, i) => `
        <a href="${cta.href}" class="inline-block px-6 py-2 ${i === 0 ? 'bg-brandOrange text-white' : 'border border-current'} font-body uppercase tracking-wideSm hover:opacity-90 transition-opacity">
          ${cta.label}
        </a>`).join('')}
      </div>` : ''}
    </div>`;
  }
  
  return `<!-- Section ${index}: ${block.color} block (${Math.round(block.approxHeight)}px) -->
<section class="${bgClass} py-sectionY">
  <div class="max-w-container mx-auto px-4 md:px-6">
    ${content}
  </div>
</section>`;
}

async function generatePartials(tokens) {
  console.log('  Generating partials...');
  
  // Header partial
  const headerHtml = `<!-- Global Header -->
<header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
  <nav class="max-w-container mx-auto px-4 md:px-6 py-4">
    <div class="flex justify-between items-center">
      <div class="font-heading text-2xl uppercase">Logo</div>
      
      <!-- Mobile menu button -->
      <button class="lg:hidden">
        <span class="block w-6 h-0.5 bg-brandBg mb-1"></span>
        <span class="block w-6 h-0.5 bg-brandBg mb-1"></span>
        <span class="block w-6 h-0.5 bg-brandBg"></span>
      </button>
      
      <!-- Desktop navigation -->
      <div class="hidden lg:flex items-center space-x-8">
        <a href="/" class="font-body text-brandBg hover:text-brandOrange transition-colors">Home</a>
        <a href="/class-action" class="font-body text-brandBg hover:text-brandOrange transition-colors">Class Action</a>
        <a href="/our-team" class="font-body text-brandBg hover:text-brandOrange transition-colors">Our Team</a>
        <a href="/news-articles" class="font-body text-brandBg hover:text-brandOrange transition-colors">News</a>
        <a href="/contact-us" class="font-body text-brandBg hover:text-brandOrange transition-colors">Contact</a>
      </div>
    </div>
  </nav>
</header>
<div class="h-16"></div><!-- Spacer for fixed header -->`;
  
  // Footer partial
  const footerHtml = `<!-- Global Footer -->
<footer class="bg-brandBg text-brandText py-sectionY">
  <div class="max-w-container mx-auto px-4 md:px-6">
    <div class="grid lg:grid-cols-2 gap-12">
      <!-- Contact Form -->
      <div>
        <h2 class="font-heading text-heading-sm uppercase tracking-wideSm mb-8">
          Get In Touch
        </h2>
        <form class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" class="w-full h-input px-4 bg-transparent border border-gray-600 text-brandText placeholder-gray-500 focus:border-brandOrange focus:outline-none transition-colors">
            <input type="text" placeholder="Last Name" class="w-full h-input px-4 bg-transparent border border-gray-600 text-brandText placeholder-gray-500 focus:border-brandOrange focus:outline-none transition-colors">
          </div>
          <input type="email" placeholder="Email" class="w-full h-input px-4 bg-transparent border border-gray-600 text-brandText placeholder-gray-500 focus:border-brandOrange focus:outline-none transition-colors">
          <textarea placeholder="Message" rows="4" class="w-full px-4 py-3 bg-transparent border border-gray-600 text-brandText placeholder-gray-500 focus:border-brandOrange focus:outline-none transition-colors resize-none"></textarea>
          <button type="submit" class="h-button px-8 bg-brandOrange text-brandText font-body uppercase tracking-wideSm hover:opacity-90 transition-all">
            Send Message
          </button>
        </form>
      </div>
      
      <!-- Info -->
      <div class="space-y-8">
        <div>
          <h3 class="font-heading text-2xl uppercase tracking-wideSm mb-4">Office</h3>
          <p class="font-body text-gray-400 leading-body">
            123 Placeholder Street<br/>
            Suite 456<br/>
            City, State 12345
          </p>
        </div>
        
        <div>
          <h3 class="font-heading text-2xl uppercase tracking-wideSm mb-4">Contact</h3>
          <p class="font-body text-gray-400 leading-body">
            <a href="tel:+1234567890" class="text-brandText hover:text-brandOrange transition-colors">
              (123) 456-7890
            </a><br/>
            <a href="mailto:info@example.com" class="text-brandText hover:text-brandOrange transition-colors">
              info@example.com
            </a>
          </p>
        </div>
        
        <div>
          <h3 class="font-heading text-2xl uppercase tracking-wideSm mb-4">Quick Links</h3>
          <div class="space-y-2">
            <a href="/privacy-policy" class="block font-body text-gray-400 hover:text-brandOrange transition-colors">Privacy Policy</a>
            <a href="/disclaimer" class="block font-body text-gray-400 hover:text-brandOrange transition-colors">Disclaimer</a>
            <a href="/status-results" class="block font-body text-gray-400 hover:text-brandOrange transition-colors">Case Status</a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Bottom Bar -->
    <div class="mt-12 pt-8 border-t border-gray-800">
      <p class="font-body text-sm text-gray-500 text-center">
        © 2024 Placeholder Law Firm. All rights reserved.
      </p>
    </div>
  </div>
</footer>`;
  
  await fs.writeFile(path.join(ROOT_DIR, 'scaffold', 'partials', 'header.html'), headerHtml);
  await fs.writeFile(path.join(ROOT_DIR, 'scaffold', 'partials', 'footer.html'), footerHtml);
}


async function generateBackstopConfigs(sitemap) {
  console.log('  Generating BackstopJS configs...');
  
  // Load nav links and form pages
  const navLinks = JSON.parse(await fs.readFile(path.join(ROOT_DIR, 'output', 'nav-links.json'), 'utf8'));
  let formPages = [];
  try {
    formPages = JSON.parse(await fs.readFile(path.join(ROOT_DIR, 'output', 'form-pages.json'), 'utf8'));
  } catch (e) {
    // If form-pages.json doesn't exist, use empty array
  }
  
  // CI config - limited set
  const ciPages = new Set();
  
  // Add top nav pages
  navLinks.topNav.forEach(link => {
    try {
      const url = new URL(link.url);
      ciPages.add(url.pathname);
    } catch (e) {}
  });
  
  // Add footer nav pages
  navLinks.footerNav.slice(0, 10).forEach(link => {
    try {
      const url = new URL(link.url);
      ciPages.add(url.pathname);
    } catch (e) {}
  });
  
  // Add form pages
  formPages.slice(0, 5).forEach(page => {
    try {
      const url = new URL(page.url);
      ciPages.add(url.pathname);
    } catch (e) {}
  });
  
  const ciScenarios = Array.from(ciPages).slice(0, 40).map(path => ({
    label: path === '/' ? 'Homepage' : path.replace(/\//g, ' ').trim(),
    url: `http://localhost:3000${path}`,
    referenceUrl: `https://www.normandpllc.com${path}`,
    delay: 2000,
    misMatchThreshold: 0.2,
    requireSameDimensions: false,
    selectors: ["document"]
  }));
  
  const ciConfig = {
    id: "normandpllc_ci",
    viewports: [
      { label: "xl", width: 1440, height: 900 },
      { label: "lg", width: 1024, height: 800 },
      { label: "md", width: 768, height: 900 },
      { label: "sm", width: 390, height: 844 }
    ],
    scenarios: ciScenarios,
    paths: {
      bitmaps_reference: "backstop_data/bitmaps_reference",
      bitmaps_test: "backstop_data/bitmaps_test",
      engine_scripts: "backstop_data/engine_scripts",
      html_report: "backstop_data/html_report",
      ci_report: "backstop_data/ci_report"
    },
    report: ["browser"],
    engine: "playwright",
    engineOptions: {
      args: ["--no-sandbox", "--disable-font-subpixel-positioning"],
      headless: true,
      gotoTimeout: 30000
    },
    asyncCaptureLimit: 5,
    asyncCompareLimit: 50,
    debug: false
  };
  
  // Nightly config - all pages
  const nightlyScenarios = sitemap.slice(0, 300).map(page => {
    const url = new URL(page.url);
    return {
      label: url.pathname === '/' ? 'Homepage' : url.pathname.replace(/\//g, ' ').trim(),
      url: `http://localhost:3000${url.pathname}`,
      referenceUrl: page.url,
      delay: 2000,
      misMatchThreshold: 0.2,
      requireSameDimensions: false,
      selectors: ["document"]
    };
  });
  
  const nightlyConfig = { ...ciConfig, id: "normandpllc_nightly", scenarios: nightlyScenarios };
  
  await fs.writeFile(path.join(ROOT_DIR, 'backstop.ci.json'), JSON.stringify(ciConfig, null, 2));
  await fs.writeFile(path.join(ROOT_DIR, 'backstop.nightly.json'), JSON.stringify(nightlyConfig, null, 2));
  
  // Write summary
  const summary = `# BackstopJS Configuration

## CI Config
- Scenarios: ${ciScenarios.length}
- Viewports: 4 (390px, 768px, 1024px, 1440px)
- Threshold: 0.2 (20% mismatch allowed)

## Nightly Config
- Scenarios: ${nightlyScenarios.length}
- Viewports: 4 (390px, 768px, 1024px, 1440px)  
- Threshold: 0.2 (20% mismatch allowed)

## Commands

### CI Testing
\`\`\`bash
npx backstop reference -c backstop.ci.json
npx backstop test -c backstop.ci.json
\`\`\`

### Nightly Testing
\`\`\`bash
npx backstop reference -c backstop.nightly.json
npx backstop test -c backstop.nightly.json
\`\`\`
`;
  
  await fs.writeFile(path.join(ROOT_DIR, 'output', 'backstop-pages.md'), summary);
}

generateCode().catch(console.error);