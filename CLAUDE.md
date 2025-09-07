# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Oranzon Webflow E-commerce Website Template - a static HTML website exported from Webflow with a bold orange and black design palette. The site is a fully functional e-commerce template with product pages, checkout flow, blog, and project showcase sections.

## Architecture & Structure

### Core Components
- **Static HTML Pages**: All pages are pre-generated HTML files exported from Webflow
- **Webflow Integration**: Uses Webflow's CSS framework and JavaScript library for interactions
- **E-commerce Flow**: Includes checkout, PayPal integration, order confirmation, and membership pages
- **Content Management**: Detail pages for products, SKUs, categories, blog posts, and work projects

### Page Types
1. **Main Pages**: index.html, about.html, projects.html, blog.html, contact.html
2. **E-commerce Pages**: checkout.html, paypal-checkout.html, order-confirmation.html, membership.html
3. **Detail/Dynamic Pages**: detail_product.html, detail_sku.html, detail_category.html, detail_blog-posts.html, detail_work.html
4. **Error Pages**: 401.html, 404.html
5. **Template Documentation**: template-info/ directory containing style-guide.html, changelog.html, licenses.html

### Asset Structure
- `css/`: Three main stylesheets
  - `normalize.css`: CSS reset
  - `webflow.css`: Core Webflow framework styles
  - `aiziks-stellar-site.webflow.css`: Custom template styles
- `js/webflow.js`: Webflow interactions and animations library (large file ~788KB)
- `images/`: Template images and assets
- `fonts/`: Custom font files
- `documents/`: Document assets

## Development Commands

Since this is a static Webflow export, there are no build processes or package managers. To work with this template:

```bash
# Open the site locally (use any static server)
python3 -m http.server 8000
# or
npx serve .
# or simply open index.html in a browser
```

## Key Technical Details

- **Webflow Attributes**: Pages use Webflow-specific data attributes (data-wf-page, data-wf-site) for functionality
- **Responsive Design**: All pages include viewport meta tags and responsive CSS
- **Interactions**: JavaScript-based animations are controlled via Webflow's interaction system
- **Font Smoothing**: Custom CSS applies antialiasing for better text rendering
- **Form Handling**: Forms likely require Webflow hosting or custom backend integration

## Working with Webflow Exports

When modifying this codebase:
1. Preserve Webflow data attributes to maintain functionality
2. Custom CSS should be added after the existing stylesheets to ensure proper cascade
3. JavaScript modifications should account for Webflow's initialization scripts
4. The site structure assumes Webflow's hosting environment for dynamic content and form submissions

## Limitations

- Dynamic content (CMS items) are rendered as static detail pages
- Form submissions require backend implementation
- E-commerce functionality needs integration with payment processors
- Some Webflow features may not work outside of Webflow hosting environment