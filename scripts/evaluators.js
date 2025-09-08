// VIPS-like block mapper
export const BLOCK_EXTRACTOR_JS = () => {
  const blocks = [];
  const processedElements = new Set();
  
  // Find all potential block containers
  const blockSelectors = [
    'header', 'nav', 'main', 'section', 'article', 'aside', 'footer',
    '[class*="hero"]', '[class*="banner"]', '[class*="section"]',
    'div[class*="container"]', 'div[class*="wrapper"]'
  ];
  
  const potentialBlocks = [];
  blockSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      if (!processedElements.has(el)) {
        potentialBlocks.push(el);
        processedElements.add(el);
      }
    });
  });
  
  // Also check for visual boundaries (large padding/margin changes)
  document.querySelectorAll('div, section, article').forEach(el => {
    if (processedElements.has(el)) return;
    
    const rect = el.getBoundingClientRect();
    const styles = window.getComputedStyle(el);
    const paddingTop = parseFloat(styles.paddingTop);
    const paddingBottom = parseFloat(styles.paddingBottom);
    const marginTop = parseFloat(styles.marginTop);
    const marginBottom = parseFloat(styles.marginBottom);
    
    // Check for significant vertical spacing or height
    if (rect.height >= 200 || (paddingTop + paddingBottom) >= 60 || (marginTop + marginBottom) >= 60) {
      potentialBlocks.push(el);
      processedElements.add(el);
    }
  });
  
  // Process each block
  potentialBlocks.forEach(el => {
    const rect = el.getBoundingClientRect();
    const styles = window.getComputedStyle(el);
    
    // Skip invisible or tiny elements
    if (rect.height < 50 || styles.display === 'none' || styles.visibility === 'hidden') return;
    
    // Extract block properties
    const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingSample = headings.length > 0 ? 
      Array.from(headings).map(h => h.textContent.trim()).join(' ').substring(0, 100) : null;
    
    // Find CTAs (links that look like buttons)
    const ctas = [];
    el.querySelectorAll('a, button').forEach(link => {
      const linkStyles = window.getComputedStyle(link);
      const isButton = link.tagName === 'BUTTON' ||
        linkStyles.display.includes('inline-block') ||
        linkStyles.display === 'block' ||
        link.classList.toString().toLowerCase().includes('btn') ||
        link.classList.toString().toLowerCase().includes('button') ||
        parseFloat(linkStyles.padding) > 5;
      
      if (isButton && ctas.length < 5) {
        ctas.push({
          label: 'CTA Placeholder',
          href: link.getAttribute('href') || '#',
          type: link.tagName.toLowerCase()
        });
      }
    });
    
    // Determine color category
    let colorCategory = 'white';
    const bg = styles.backgroundColor;
    const bgImage = styles.backgroundImage;
    
    if (bg.includes('0, 0, 0') || bg.includes('rgb(0') || bg.includes('#000')) {
      colorCategory = 'black';
    } else if (bg.includes('252') || bg.includes('fc5') || bg.includes('orange')) {
      colorCategory = 'orange';
    } else if (bg.includes('248') || bg.includes('249') || bg.includes('250')) {
      colorCategory = 'gray';
    } else if (bgImage && bgImage !== 'none') {
      colorCategory = 'image';
    }
    
    // Check for forms
    const hasForms = el.querySelectorAll('form, input, textarea, select').length > 0;
    
    // Check for specific components
    const hasHero = el.classList.toString().toLowerCase().includes('hero') || 
                    el.querySelector('[class*="hero"]') !== null;
    const hasFAQ = el.classList.toString().toLowerCase().includes('faq') ||
                   el.classList.toString().toLowerCase().includes('accordion');
    const hasGallery = el.querySelectorAll('img, picture, video').length >= 3;
    
    blocks.push({
      order: blocks.length + 1,
      selector: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ')[0] : ''),
      color: colorCategory,
      headingSample: headingSample,
      approxHeight: Math.round(rect.height),
      approxTop: Math.round(rect.top + window.scrollY),
      ctas: ctas,
      hasForms: hasForms,
      hasHero: hasHero,
      hasFAQ: hasFAQ,
      hasGallery: hasGallery,
      rawBg: bg,
      paddingY: parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom),
      marginY: parseFloat(styles.marginTop) + parseFloat(styles.marginBottom)
    });
  });
  
  // Sort by position and remove overlaps
  blocks.sort((a, b) => a.approxTop - b.approxTop);
  
  // Merge adjacent similar blocks
  const mergedBlocks = [];
  let currentBlock = null;
  
  blocks.forEach(block => {
    if (!currentBlock) {
      currentBlock = block;
    } else {
      const gap = block.approxTop - (currentBlock.approxTop + currentBlock.approxHeight);
      if (gap < 50 && block.color === currentBlock.color && !block.hasHero && !currentBlock.hasHero) {
        // Merge blocks
        currentBlock.approxHeight = (block.approxTop + block.approxHeight) - currentBlock.approxTop;
        currentBlock.ctas = [...currentBlock.ctas, ...block.ctas].slice(0, 5);
        currentBlock.hasForms = currentBlock.hasForms || block.hasForms;
        currentBlock.hasFAQ = currentBlock.hasFAQ || block.hasFAQ;
        currentBlock.hasGallery = currentBlock.hasGallery || block.hasGallery;
      } else {
        mergedBlocks.push(currentBlock);
        currentBlock = block;
      }
    }
  });
  if (currentBlock) mergedBlocks.push(currentBlock);
  
  // Re-number blocks
  mergedBlocks.forEach((block, i) => {
    block.order = i + 1;
  });
  
  return mergedBlocks;
};

// Token extractor for hero and footer
export const TOKEN_EXTRACTOR_JS = (mode = 'footer') => {
  const tokens = {
    colors: {},
    typography: {
      heading: {},
      body: {}
    },
    layout: {},
    controls: {
      input: {},
      button: {}
    },
    decor: {
      rotatedMenuLabel: { exists: false }
    }
  };
  
  if (mode === 'hero') {
    // Extract from hero/header section
    const hero = document.querySelector('header, .hero, [class*="hero"], section:first-of-type, main > div:first-child');
    if (hero) {
      const heroStyles = window.getComputedStyle(hero);
      tokens.colors.bg = heroStyles.backgroundColor;
      tokens.colors.text = heroStyles.color;
      
      // Find main heading
      const heading = hero.querySelector('h1, h2');
      if (heading) {
        const hStyles = window.getComputedStyle(heading);
        tokens.typography.heading.family = hStyles.fontFamily;
        tokens.typography.heading.weight = hStyles.fontWeight;
        tokens.typography.heading.size = hStyles.fontSize;
        tokens.typography.heading.lineHeight = hStyles.lineHeight;
        tokens.typography.heading.letterSpacing = hStyles.letterSpacing;
        tokens.typography.heading.transform = hStyles.textTransform;
      }
      
      // Find body text
      const bodyText = hero.querySelector('p, .subtitle, .description');
      if (bodyText) {
        const bStyles = window.getComputedStyle(bodyText);
        tokens.typography.body.family = bStyles.fontFamily;
        tokens.typography.body.weight = bStyles.fontWeight;
        tokens.typography.body.size = bStyles.fontSize;
        tokens.typography.body.lineHeight = bStyles.lineHeight;
        tokens.typography.body.letterSpacing = bStyles.letterSpacing;
      }
      
      // Find buttons in hero
      const heroButton = hero.querySelector('a.btn, a.button, button, [class*="btn"]');
      if (heroButton) {
        const btnStyles = window.getComputedStyle(heroButton);
        tokens.colors.btnBg = btnStyles.backgroundColor;
        tokens.colors.btnText = btnStyles.color;
        tokens.colors.btnBorder = btnStyles.borderColor;
        tokens.controls.button.height = btnStyles.height;
        tokens.controls.button.radius = btnStyles.borderRadius;
        tokens.controls.button.padding = btnStyles.padding;
      }
    }
  } else if (mode === 'footer') {
    // Extract from footer section
    const footer = document.querySelector('footer, .footer, [class*="footer"]');
    if (footer) {
      const footerStyles = window.getComputedStyle(footer);
      tokens.colors.footerBg = footerStyles.backgroundColor;
      tokens.colors.footerText = footerStyles.color;
      
      // Find links
      const link = footer.querySelector('a');
      if (link) {
        const linkStyles = window.getComputedStyle(link);
        tokens.colors.link = linkStyles.color;
        // Simulate hover if possible
        const hoverColor = link.dataset.hoverColor || linkStyles.color;
        tokens.colors.linkHover = hoverColor;
      }
      
      // Find inputs
      const input = footer.querySelector('input[type="text"], input[type="email"], input[type="tel"]');
      if (input) {
        const iStyles = window.getComputedStyle(input);
        tokens.controls.input.height = iStyles.height;
        tokens.controls.input.radius = iStyles.borderRadius;
        tokens.controls.input.borderWidth = iStyles.borderWidth;
        tokens.controls.input.borderColor = iStyles.borderColor;
        tokens.controls.input.padding = iStyles.padding;
        tokens.controls.input.bg = iStyles.backgroundColor;
      }
      
      // Find submit button
      const submitBtn = footer.querySelector('button[type="submit"], input[type="submit"], .submit-btn');
      if (submitBtn) {
        const bStyles = window.getComputedStyle(submitBtn);
        tokens.controls.button.height = bStyles.height;
        tokens.controls.button.radius = bStyles.borderRadius;
        tokens.controls.button.borderWidth = bStyles.borderWidth;
        tokens.controls.button.shadow = bStyles.boxShadow;
        tokens.controls.button.padding = bStyles.padding;
      }
    }
  }
  
  // Global layout tokens
  const container = document.querySelector('.container, .wrapper, main > div, [class*="container"]');
  if (container) {
    const cStyles = window.getComputedStyle(container);
    tokens.layout.maxWidth = cStyles.maxWidth;
    tokens.layout.padding = cStyles.padding;
  }
  
  // Check for sections to get padding patterns
  const sections = document.querySelectorAll('section, .section, [class*="section"]');
  if (sections.length > 0) {
    const paddings = [];
    sections.forEach(section => {
      const sStyles = window.getComputedStyle(section);
      paddings.push(parseFloat(sStyles.paddingTop));
      paddings.push(parseFloat(sStyles.paddingBottom));
    });
    // Get most common padding
    const sortedPaddings = paddings.filter(p => p > 20).sort((a, b) => a - b);
    if (sortedPaddings.length > 0) {
      tokens.layout.sectionPaddingY = sortedPaddings[Math.floor(sortedPaddings.length / 2)] + 'px';
    }
  }
  
  // Check for rotated elements
  document.querySelectorAll('[style*="rotate"], [style*="transform"], [class*="rotate"]').forEach(el => {
    const styles = window.getComputedStyle(el);
    if (styles.transform && styles.transform.includes('rotate') && 
        el.textContent.toLowerCase().includes('menu')) {
      tokens.decor.rotatedMenuLabel.exists = true;
      tokens.decor.rotatedMenuLabel.angle = -90;
      tokens.decor.rotatedMenuLabel.text = el.textContent.trim();
    }
  });
  
  return tokens;
};

// Form detection
export const DETECT_FORMS_JS = () => {
  const forms = [];
  
  // Find all forms on the page
  document.querySelectorAll('form').forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');
    const submitBtn = form.querySelector('[type="submit"], button[type="submit"], button.submit');
    
    if (inputs.length > 0) {
      const formData = {
        id: form.id || 'form-' + forms.length,
        action: form.action || '#',
        method: form.method || 'POST',
        fields: [],
        hasSubmit: submitBtn !== null
      };
      
      inputs.forEach(input => {
        formData.fields.push({
          type: input.type || input.tagName.toLowerCase(),
          name: input.name || input.id || 'field',
          required: input.required || input.hasAttribute('required'),
          placeholder: input.placeholder || ''
        });
      });
      
      forms.push(formData);
    }
  });
  
  // Also check for input groups that might not be in a form tag
  if (forms.length === 0) {
    const inputGroups = document.querySelectorAll('[class*="contact"], [class*="form"], [class*="newsletter"]');
    inputGroups.forEach(group => {
      const inputs = group.querySelectorAll('input, textarea, select');
      if (inputs.length >= 2) {
        forms.push({
          id: 'pseudo-form-' + forms.length,
          action: '#',
          method: 'POST',
          fields: Array.from(inputs).map(input => ({
            type: input.type || input.tagName.toLowerCase(),
            name: input.name || input.id || 'field',
            required: false,
            placeholder: input.placeholder || ''
          })),
          hasSubmit: group.querySelector('button, [type="submit"]') !== null
        });
      }
    });
  }
  
  return {
    hasForms: forms.length > 0,
    formCount: forms.length,
    forms: forms,
    isContactPage: document.title.toLowerCase().includes('contact') || 
                   window.location.pathname.includes('contact'),
    isCheckoutPage: window.location.pathname.includes('checkout') ||
                    window.location.pathname.includes('cart')
  };
};