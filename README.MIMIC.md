# Visual Parity Implementation Guide

## Overview

This project provides a JAMstack scaffold that matches the visual structure of normandpllc.com without copying any proprietary content. It includes:

- Static HTML scaffolds with Tailwind CSS
- Strapi CMS schema definitions
- Visual regression testing with BackstopJS
- Extracted design tokens for exact visual parity

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
npx playwright install
```

### 2. Build Tailwind CSS

First, install Tailwind CSS:

```bash
npm install -D tailwindcss
npx tailwindcss init
```

Then build your CSS:

```bash
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
```

Create `src/input.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Serve Static HTML

```bash
npm run dev
```

This serves the site on http://localhost:3000

## Strapi Integration

### Setting up Dynamic Zones

1. Install Strapi:
```bash
npx create-strapi-app@latest my-project --quickstart
```

2. Import the schemas from `strapi/schemas/`:
   - `components.json` - Component definitions
   - `collections.json` - Content type definitions

3. Map sections to HTML scaffolds:

| Strapi Component | HTML Scaffold |
|-----------------|---------------|
| hero_section | scaffold/hero.html |
| contact_band | scaffold/footer.html |
| feature_band | scaffold/sections/home-block-4.html |
| cta_band | scaffold/sections/home-block-4.html |

### Creating Pages in Strapi

1. Create a new Page entry
2. Add sections using the dynamic zone
3. Configure each section's theme (black/white/orange)
4. Map CTAs to appropriate URLs

## Visual Testing with BackstopJS

### Initial Setup

1. Capture reference screenshots from the original site:
```bash
npm run visual:ref
```

2. Test your implementation:
```bash
npm run visual:test
```

3. View the report (opens automatically):
```bash
npm run backstop:open
```

### Workflow

1. Make changes to your HTML/CSS
2. Run `npm run visual:test` to see differences
3. If changes are intentional, approve them:
```bash
npm run backstop:approve
```

## File Structure

```
project/
├── scaffold/               # Static HTML templates
│   ├── hero.html          # Hero section template
│   ├── footer.html        # Footer/contact template
│   └── sections/          # Individual page sections
├── strapi/
│   └── schemas/           # Strapi content schemas
├── output/                # Generated analysis files
│   ├── sitemap.json       # Discovered pages
│   ├── *.blocks.json      # Page segmentation data
│   ├── tokens.json        # Extracted design tokens
│   └── site-flow.png      # Site navigation diagram
├── backstop.json          # Visual testing config
└── tailwind.config.js     # Tailwind configuration
```

## Design Tokens

The extracted design tokens are available in:
- `output/tokens.json` - Primary tokens (xl viewport)
- `output/tokens.breakpoints.json` - Responsive variations
- `tailwind.config.js` - Tailwind implementation

### Key Token Mappings

| Token | Original | Implementation |
|-------|----------|----------------|
| Heading Font | Knockout-Full | Bebas Neue |
| Body Font | Gotham-Medium | Inter |
| Brand Orange | #fc5a2b | brandOrange |
| Brand Black | #010101 | brandBg |
| Container | 1440px | max-w-container |

## Exact Class Stacks

### Section Wrapper
```html
<section class="bg-white text-gray-900 py-sectionY">
  <div class="max-w-[1440px] mx-auto px-4 md:px-6">
```

### Heading
```html
<h1 class="font-heading text-heading-xl uppercase leading-heading tracking-tightSm">
```

### Link
```html
<a href="#" class="text-brandOrange hover:underline transition-colors">
```

### Input
```html
<input class="w-full h-[48px] px-4 bg-transparent border border-gray-600 text-brandText placeholder-gray-500 focus:border-brandOrange focus:outline-none transition-colors">
```

### Button
```html
<button class="h-[48px] px-8 bg-brandOrange text-brandText font-body uppercase tracking-wideSm hover:bg-opacity-90 transition-all">
```

## Page Analysis Summary

### Homepage (/)
- **Blocks**: 4
- **Color Rhythm**: white → white → black → white
- **CTAs**: 6 total (3 in hero, 3 in practice areas)
- **Height**: ~12,400px total

### Contact (/contact-us)
- **Blocks**: 3
- **Color Rhythm**: white → black → white
- **CTAs**: 2 (form submit, phone link)
- **Layout**: Two-column at ≥1024px

## Development Workflow

1. **Start local server**: `npm run dev`
2. **Edit scaffolds**: Modify HTML files in `scaffold/`
3. **Test visually**: `npm run visual:test`
4. **Update Strapi**: Import content via admin panel
5. **Deploy**: Build static site or connect to Strapi API

## Deployment

### Static Deployment
```bash
# Build Tailwind CSS
npx tailwindcss -o dist/styles.css --minify

# Deploy to Netlify/Vercel
# Point to scaffold/ directory
```

### Strapi + Static Frontend
1. Deploy Strapi to Heroku/DigitalOcean
2. Build static site with API calls to Strapi
3. Use CDN for assets
4. Enable caching for performance

## Created Files List

- `/backstop.json` - Visual testing configuration
- `/tailwind.config.js` - Tailwind design system
- `/scaffold/hero.html` - Hero section template
- `/scaffold/footer.html` - Footer template
- `/scaffold/sections/*.html` - Page section templates
- `/strapi/schemas/components.json` - Strapi components
- `/strapi/schemas/collections.json` - Strapi collections
- `/output/sitemap.json` - Discovered pages
- `/output/*.blocks.json` - Page segmentation
- `/output/tokens.json` - Design tokens
- `/output/site-flow.dot` - Site flow diagram
- `/output/site-flow.png` - Site flow visualization
- `/output/parity-notes.md` - Visual differences
- `/README.MIMIC.md` - This guide

## Notes

- All content is placeholder text
- No images, icons, or proprietary assets copied
- CSS written from scratch using Tailwind
- Fonts replaced with open-source alternatives
- Colors extracted but independently implemented