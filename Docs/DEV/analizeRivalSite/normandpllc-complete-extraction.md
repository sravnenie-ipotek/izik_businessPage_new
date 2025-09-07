# Normand PLLC - Ultra-Detailed Site Extraction

## COMPLETE TEXT CONTENT (WORD-FOR-WORD)

### Navigation Structure
```
Primary Navigation:
- Home
- Class Action
  ├── Privacy
  ├── Consumer Protection  
  └── Insurance
- Status & Results
- Our Team
- News & Articles
- Contact Us
  ├── Disclaimer
  └── Privacy Policy
```

### Hero Section Text
```
Main Tagline: "We Are Results"
Secondary Tagline: "Confidence Advocacy Victory Results" 
Primary Heading: "Experts in Class Action"
```

### Complete Section Content

#### Section 1: We Are Class Action
**Heading:** "We Are Class Action"
**Text:** "Normand PLLC attorneys represent consumers around the world in important and often unprecedented complex class actions."

#### Section 2: Service Areas

**Privacy Class Action**
- **Icon:** Shield with lock
- **Heading:** "Privacy Class Action"
- **Text:** "You have a right to privacy in your home, in your personal life and with your private information."

**Consumer Protection Class Action**  
- **Icon:** Person with protective shield
- **Heading:** "Consumer Protection Class Action"
- **Text:** "False advertising, bait and switch practices, unconscionable or illegal pricing schemes, deceptive credit reporting, identity theft, violations of consumer protection laws, debt collection violations, and other consumer rights violations."

**Insurance Class Action**
- **Icon:** Umbrella protection symbol
- **Heading:** "Insurance Class Action" 
- **Text:** "When you pay your insurance premium and the time comes to make a claim you have a right to any and all benefits provided by the insurance policy."

#### Section 3: Case Studies Section
**Heading:** "Case Studies"
**Subheading:** "5 Won Cases"
**Years Range:** "2021 - 2024"

#### Section 4: Testimonial
**Quote:** "We are not insular: we are compassion. We know that when one is cheated we all suffer."
**Attribution:** Client testimonial

#### Section 5: Our Team
**Heading:** "Our Team"
**Founder Bio:** "Edmund Normand started his practice in 1991, specializing in personal injury law."

### Contact Information Section
```
Orlando Office:
Phone: 407-603-6031
Email: office@normandpllc.com
Fax: 888-974-2175
Address: 3165 McCrory Place Suite 175, Orlando, FL 32803
```

### Footer Content
```
Copyright © Normand PLLC 2025
Website by ultramodern ✨
```

## EXACT TYPOGRAPHY SPECIFICATIONS

### Font Families
```css
--global-font-family: "Gotham-Medium", serif
--highlight-font-family: "Knockout", sans-serif
--h1-special-font: "Knockout-Full", sans-serif
--body-font-alt: "Gotham-Book", serif
```

### Font Sizes (Responsive)
```css
/* Base Variables */
--global-font-size: 14px
--global-font-line-height: 1.7
--heading-line-height: 1.1

/* Heading Sizes (Fluid) */
--h1-font-size: calc(75px + (6500vw - 24375px)/1065)
--h2-font-size: calc(65px + (5500vw - 20625px)/1065)  
--h3-font-size: calc(48px + (3200vw - 12000px)/1065)
--h4-font-size: calc(28px + (1200vw - 4500px)/1065)
--h5-font-size: calc(18px + (200vw - 750px)/1065)
--h6-font-size: calc(14px + (400vw - 1500px)/1065)

/* Standard Sizes */
--font-size-small: 14px
--font-size-regular: 16px  
--font-size-medium: 20px
--font-size-large: 41px
--font-size-x-large: 42px
--font-size-larger: 55px
```

### Typography Styling
```css
/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--highlight-font-family);
  font-weight: 400;
  font-stretch: condensed;
  line-height: var(--heading-line-height);
  text-transform: uppercase;
}

/* H1 Special */
h1 {
  font-family: var(--h1-special-font);
}

/* Body Text */
body {
  font-family: var(--global-font-family);
  font-size: var(--font-size-small);
  line-height: var(--global-font-line-height);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

## COMPLETE COLOR PALETTE

### Primary Theme Colors
```css
--color-theme-primary: #fc5a2b    /* Bright Orange */
--color-theme-secondary: #f2f2f2  /* Light Gray */
--color-theme-black: #010101      /* Near Black */
--color-theme-white: #fff         /* Pure White */
--color-theme-grey: #ccc          /* Medium Gray */
--color-theme-red: #f03           /* Red Accent */
```

### Functional Colors
```css
--global-font-color: #000         /* Text Black */
--color-link: #fc5a2b            /* Primary Orange */
--color-link-visited: #ccc       /* Gray */
--color-link-active: #fc5a2b     /* Primary Orange */
--color-quote-border: #000       /* Black */
--color-quote-citation: #666     /* Dark Gray */
--color-highlight: #fff9c0       /* Light Yellow */
--color-menu-items-grey: grey    /* Menu Text */
--color-nav-toggle-grey: #b3b3b3 /* Navigation Toggle */
--border-color-dark: #000        /* Dark Borders */
--border-color-light: #ccc       /* Light Borders */
```

## LAYOUT SPECIFICATIONS

### Container Widths
```css
--content-width-static: 45rem
--content-width: 45rem

/* Responsive Breakpoints */
@media screen and (min-width: 1200px) {
  --content-width: 55rem
}

@media screen and (min-width: 1440px) {
  --content-width: 67rem  
}
```

### Spacing System
```css
--spacing-20: 0.44rem
--spacing-30: 0.67rem
--spacing-40: 1rem
--spacing-50: 1.5rem
--spacing-60: 2.25rem
--spacing-70: 3.38rem
--spacing-80: 5.06rem
```

### Grid & Layout
```css
/* Site Structure */
.site {
  margin: 0 auto;
  max-width: 100%;
}

.site-main {
  padding-top: 45px;
  overflow-x: hidden;
}

/* Content Containers */
.entry-content > div:last-of-type {
  padding-bottom: calc(80px + 20vmin);
}

@media screen and (min-width: 960px) {
  .site-main {
    padding-top: 0;
  }
  
  .entry-content > div:last-of-type {
    padding-bottom: 20vmin;
  }
}
```

## EXACT BUTTON SPECIFICATIONS

### Primary Button Style
```css
a[role="button"] {
  position: relative;
  border: none;
  color: var(--global-font-color);
  background-color: var(--color-theme-black);
  font-size: 12px;
  text-transform: uppercase;
  padding: 10px 40px;
  overflow: hidden;
  z-index: 1;
  transition-property: color;
  transition-duration: 0.7s;
  transition-timing-function: var(--transition-timing-function);
}

/* Button Hover Effect */
a[role="button"]:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-theme-primary);
  transition-property: transform;
  transition-duration: 0.7s;
  transition-timing-function: var(--transition-timing-function);
  z-index: -1;
}

a[role="button"]:hover:before {
  transform: translate3d(0, -100%, 0);
}

a[role="button"]:hover {
  color: var(--color-theme-white);
}

/* Secondary Button */
a[role="button"].secondary {
  color: var(--color-theme-white);
  background-color: var(--color-theme-secondary);
}

a[role="button"].secondary:before {
  background-color: var(--color-theme-black);
}

a[role="button"].secondary:hover {
  color: var(--color-theme-black);
}
```

## NAVIGATION SPECIFICATIONS

### Header Structure
```css
.site-header {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  padding: 0;
  z-index: 1000;
}

@media screen and (min-width: 960px) {
  .site-header {
    width: auto;
    height: 100%;
  }
}
```

### Mobile Navigation Toggle
```css
.nav--toggle-small .menu-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 1em 0;
  font-stretch: condensed;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 0;
  color: var(--color-nav-toggle-grey);
  background: var(--color-theme-black);
  z-index: 1;
}

@media screen and (min-width: 960px) {
  .nav--toggle-small .menu-toggle {
    width: 130px;
    padding: 1em 0;
    position: absolute;
    top: 50%;
    background: transparent;
    transform: translateY(-50%) rotate(-90deg);
  }
}

@media screen and (min-width: 1440px) {
  .nav--toggle-small .menu-toggle {
    width: 212px;
    padding: 1em 1.75em;
  }
}
```

### Navigation Menu
```css
.main-navigation a {
  display: block;
  position: relative;
  padding: 0.15em 0.25em;
  font-family: var(--global-font-family);
  font-size: calc(21px + (400vw - 1500px)/1065);
  line-height: 1.4;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--color-menu-items-grey);
  transition-property: color;
  transition-duration: 0.7s;
  transition-timing-function: var(--transition-timing-function);
  z-index: 1;
  overflow: hidden;
}

/* Menu Hover Effect */
.main-navigation a:after {
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: var(--color-theme-primary);
  transform: scaleX(0) scaleY(1.2);
  transform-origin: center right;
  transition-property: transform;
  transition-duration: 0.7s;
  transition-timing-function: var(--transition-timing-function);
  z-index: -1;
}

.main-navigation a:hover {
  color: var(--color-theme-black);
}

.main-navigation a:hover:after {
  transform: scaleX(1) scaleY(1.2);
  transform-origin: center left;
}

/* Current Menu Item */
.main-navigation .current-menu-item > a {
  color: var(--color-theme-primary);
}
```

## ANIMATION SPECIFICATIONS

### Transition Variables
```css
--transition-timing-function: cubic-bezier(0, 0.55, 0.45, 1);
--transition-duration: 250ms;
```

### Key Animations

#### Button Slide Animation
```css
/* Duration: 0.7s */
/* Easing: cubic-bezier(0, 0.55, 0.45, 1) */
/* Effect: Background slides up from bottom on hover */
```

#### Menu Item Reveal
```css
/* Duration: 0.7s */
/* Easing: cubic-bezier(0, 0.55, 0.45, 1) */  
/* Effect: Orange background scales from right to left on hover */
```

#### Preloader Animation
```css
.preloader {
  background: var(--color-theme-primary);
  /* GSAP-based loading animation */
}
```

## RESPONSIVE BREAKPOINTS

### Mobile First Approach
```css
/* Base: Mobile (up to 767px) */
/* Tablet: 768px and up */
/* Desktop: 960px and up */  
/* Large Desktop: 1200px and up */
/* XL Desktop: 1440px and up */
```

### Key Responsive Changes

#### 768px and up
```css
@media screen and (min-width: 768px) {
  .site {
    margin: 0 auto 10vh;
  }
  
  .nav--toggle-small .contact-links,
  .nav--toggle-small .menu {
    max-width: var(--content-width);
    margin: 0 auto 0 220px;
  }
}
```

#### 960px and up
```css
@media screen and (min-width: 960px) {
  .site-main {
    padding-top: 0;
  }
  
  .site-header {
    width: auto;
    height: 100%;
  }
  
  .nav--toggle-small .menu-toggle {
    width: 130px;
    position: absolute;
    top: 50%;
    background: transparent;
    transform: translateY(-50%) rotate(-90deg);
  }
}
```

#### 1200px and up
```css
@media screen and (min-width: 1200px) {
  :root {
    --content-width: 55rem;
  }
}
```

#### 1440px and up
```css
@media screen and (min-width: 1440px) {
  :root {
    --content-width: 67rem;
  }
  
  .nav--toggle-small .menu-toggle {
    width: 212px;
    padding: 1em 1.75em;
  }
}
```

## IMAGES AND ASSETS

### Key Images
```
Hero Background: Team/office photo (high-res)
Edmund Normand Headshot: 730x730px (various sizes available)
Service Icons: 
  - Shield with lock (Privacy)
  - Person with shield (Consumer Protection)
  - Umbrella (Insurance)
Social Share Image: 1200x630px
```

### Icon Assets
```
Navigation Icons:
  - Chevron down (SVG)
  - Menu hamburger (SVG)
  - Check mark (SVG) for forms

Footer Logo: Normand brand mark
```

## FORMS AND INTERACTIONS

### Form Styling
```css
input[type="text"],
input[type="email"],
textarea {
  width: 100%;
  color: var(--global-font-color);
  border: 1px solid var(--color-theme-black);
  border-radius: 0;
  line-height: 1;
  padding: 10px 15px;
}

input:focus,
textarea:focus {
  color: var(--color-theme-black);
  outline: none;
}

/* Error States */
.gfield_error input,
.gfield_error textarea {
  outline-color: var(--color-highlight);
  outline-style: dotted;
  outline-width: 1px;
  outline-offset: 5px;
}
```

### Custom Cursor (Desktop)
```css
@media (any-pointer: fine) {
  .cursor {
    width: 160px;
    height: 160px;
    position: fixed;
    display: block;
    pointer-events: none;
    z-index: 999999;
    mix-blend-mode: luminosity;
  }
  
  .cursor__inner {
    fill: var(--color-theme-primary);
    opacity: 0.3;
  }
  
  .cursor__inner__small {
    fill: var(--color-theme-black);
    opacity: 0.3;
  }
}
```

## ACCESSIBILITY FEATURES

### Screen Reader Support
```css
.screen-reader-text {
  clip: rect(1px, 1px, 1px, 1px);
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
}

.screen-reader-text:focus {
  background-color: var(--color-theme-white);
  border-radius: 3px;
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.6);
  clip: auto !important;
  color: var(--color-theme-primary);
  display: block;
  font-weight: 700;
  height: auto;
  padding: 15px 23px 14px;
  width: auto;
  z-index: 100000;
}
```

### Focus Management
```css
a:focus-visible,
button:focus-visible {
  outline: 2px dotted var(--color-link-visited);
  outline-offset: 3px;
}

#primary[tabindex="-1"]:focus {
  outline: 0;
}
```

## SCROLL AND PERFORMANCE

### Smooth Scrolling Implementation
```css
html.has-scroll-smooth {
  overflow: hidden;
}

.has-scroll-smooth body {
  overflow: hidden;
}

.has-scroll-smooth [data-scroll-container] {
  min-height: 100vh;
}
```

### Custom Scrollbar
```css
.c-scrollbar {
  position: absolute;
  right: 0;
  top: 0;
  width: 11px;
  height: 100%;
  transform-origin: center right;
  transition: transform 0.3s, opacity 0.3s;
  opacity: 0;
}

.c-scrollbar:hover {
  transform: scaleX(1.45);
}

.has-scroll-scrolling .c-scrollbar,
.has-scroll-dragging .c-scrollbar {
  opacity: 1;
}
```

## FOOTER SPECIFICATIONS

### Footer Structure
```css
.site-footer {
  width: 100%;
  min-height: 10vh;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-theme-black);
}

.site-info {
  margin: 0;
  padding: 1em 0;
  font-size: 12px;
  line-height: 1.6;
  text-align: center;
  color: var(--color-theme-white);
}

.footer-scroller-space {
  width: 100%;
  height: 10vh;
  background: var(--color-theme-black);
}
```

## IMPLEMENTATION NOTES

### WordPress Integration
- Built on WordPress with custom theme
- Uses Gravity Forms for contact forms
- Implements custom post types for case studies
- SEO optimized with Rank Math

### Performance Optimizations
- Font files: WOFF2, WOFF, OTF formats
- Minified CSS and JavaScript  
- Lazy loading for images
- GSAP for smooth animations

### Browser Support
- Modern browsers with CSS Grid and Flexbox
- Progressive enhancement for older browsers
- WebP image support with fallbacks

This extraction provides everything needed to create an exact replica of the Normand PLLC website, including all text content, typography, colors, layouts, animations, and responsive behaviors.