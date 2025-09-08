# Strapi CMS Integration

## Overview
Complete Strapi CMS setup for managing all homepage sections dynamically.

## Structure

### Content Types
- **Homepage** (Single Type) - Main homepage content management
  - SEO metadata
  - All section components

### Section Components
- `hero` - Hero section with tagline and title
- `services-orange` - Orange services section with privacy overlay
- `service-cards` - Grid of service offering cards
- `case-studies` - Case study showcase
- `testimonials` - Client testimonials carousel
- `team` - Team members grid
- `media-logos` - Media mentions and press logos
- `news` - Latest news and updates
- `contact` - Contact form and information

### Shared Components
- `seo` - SEO metadata management
- `meta-social` - Social media meta tags
- `service-card` - Individual service card
- `case-study` - Individual case study
- `testimonial` - Individual testimonial
- `team-member` - Individual team member
- `news-article` - Individual news article

## Setup Instructions

### 1. Create Strapi Project
```bash
npx create-strapi-app@latest my-strapi-backend --quickstart
```

### 2. Copy Component Schemas
```bash
# Copy all component schemas to Strapi project
cp -r strapi/components/* path/to/strapi/src/components/

# Copy content type
cp strapi/content-types/homepage.json path/to/strapi/src/api/homepage/content-types/homepage/schema.json
```

### 3. Register Components
In your Strapi admin:
1. Restart Strapi server
2. Components will auto-register
3. Navigate to Content Manager > Homepage
4. Add content for each section

### 4. Import Seed Data
```bash
# Use Strapi import/export plugin or manually add via admin
strapi import -f strapi/seeds/homepage.seed.json
```

## API Endpoints

### Get Homepage Data
```javascript
// Fetch with all populated fields
GET /api/homepage?populate=deep

// Response includes all sections with nested components
{
  "data": {
    "id": 1,
    "attributes": {
      "hero": { ... },
      "servicesOrange": { ... },
      "serviceCards": { ... },
      // ... all other sections
    }
  }
}
```

## Frontend Integration

### Example: Fetching Homepage Data
```javascript
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

async function getHomepage() {
  const res = await fetch(`${STRAPI_URL}/api/homepage?populate=deep`);
  const data = await res.json();
  return data.data.attributes;
}

// Usage
const homepage = await getHomepage();
console.log(homepage.hero.title); // "WE ARE RESULTS"
```

### Dynamic Section Rendering
```javascript
function renderSection(section, type) {
  switch(type) {
    case 'hero':
      return `<section class="hero">
        <h1>${section.title}</h1>
        <p>${section.subtitle}</p>
      </section>`;
    
    case 'servicesOrange':
      return `<section class="services-orange">
        <h2>${section.title}</h2>
        <p>${section.description}</p>
      </section>`;
    
    // Add other section types...
  }
}
```

## Environment Variables
```env
# .env
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token-here
```

## Permissions
1. Go to Settings > Roles > Public
2. Enable find permission for Homepage
3. Save changes

## Color Palette
Maintain consistency with these colors:
- Orange: `#fc5a2b`
- Black: `#010101`
- White: `#ffffff`
- Light Grey: `#f2f2f2`
- Dark Grey: `#333333`

## Notes
- All components are modular and reusable
- Images use Strapi Media Library
- Rich text fields support markdown
- SEO component includes social media meta tags
- Seed data provides example content

## Troubleshooting

### Components Not Showing
- Restart Strapi server after adding components
- Check file paths match expected structure
- Verify JSON syntax in component files

### API Returns 403
- Check public permissions in admin panel
- Ensure homepage find permission is enabled

### Missing Data in Response
- Use `populate=deep` or specify nested populations
- Check component relationships are properly defined
