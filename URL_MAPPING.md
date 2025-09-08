# URL Mapping Documentation

## Scaffold URLs (Local Development)
Base URL: `http://localhost:3000/`

### Generated Scaffold Pages

#### Main Pages
- `http://localhost:3000/index.html` - Homepage with all sections (hero, services, team, contact)
- `http://localhost:3000/contact-us.html` - Contact page with form and office information
- `http://localhost:3000/our-team.html` - Team members and leadership page
- `http://localhost:3000/news-articles.html` - News and articles listing page

#### Class Action Pages
- `http://localhost:3000/class-action.html` - Main class action overview page
- `http://localhost:3000/class-action-privacy.html` - Privacy class action details
- `http://localhost:3000/class-action-consumer-protection.html` - Consumer protection class action
- `http://localhost:3000/class-action-insurance.html` - Insurance class action information

#### Legal Pages
- `http://localhost:3000/privacy-policy.html` - Privacy policy page
- `http://localhost:3000/disclaimer.html` - Legal disclaimer page
- `http://localhost:3000/status-results.html` - Case status and results page

#### Team Detail Pages
- `http://localhost:3000/our-team-edmund-normand.html` - Founder's profile page

---

## Reference URLs (normandpllc.com)
Base URL: `https://www.normandpllc.com/`

### Pages Used for Visual Reference

#### Main Navigation
- `https://www.normandpllc.com/` - Homepage (source for layout structure)
- `https://www.normandpllc.com/contact-us/` - Contact page (source for form design)
- `https://www.normandpllc.com/our-team/` - Team page (source for team grid layout)
- `https://www.normandpllc.com/class-action/` - Class action main page

#### Service Pages
- `https://www.normandpllc.com/class-action/privacy/` - Privacy class action services
- `https://www.normandpllc.com/class-action/consumer-protection/` - Consumer protection services
- `https://www.normandpllc.com/class-action/insurance/` - Insurance class action services

#### Team Profiles
- `https://www.normandpllc.com/our-team/edmund-normand/` - Founder profile
- `https://www.normandpllc.com/our-team/alex-couch/` - Team member profile
- `https://www.normandpllc.com/our-team/christopher-hudon/` - Team member profile
- `https://www.normandpllc.com/our-team/amy-judkins/` - Team member profile

#### Legal/Utility Pages
- `https://www.normandpllc.com/privacy-policy/` - Privacy policy
- `https://www.normandpllc.com/disclaimer/` - Legal disclaimer
- `https://www.normandpllc.com/status-results/` - Case status page
- `https://www.normandpllc.com/news-articles/` - News and updates

#### Article Pages (Examples)
- `https://www.normandpllc.com/john-richard-collection-data-breach/` - Data breach article
- `https://www.normandpllc.com/fidelity-national-information-services-data-breach-are-you-at-risk/` - FIS breach article

---

## BackstopJS Test Configuration

### Test Scenarios Mapping
Each scaffold page is tested against its corresponding live URL:

```json
{
  "scenarios": [
    {
      "label": "Homepage",
      "url": "http://localhost:3000/index.html",
      "referenceUrl": "https://www.normandpllc.com/"
    },
    {
      "label": "contact-us",
      "url": "http://localhost:3000/contact-us.html",
      "referenceUrl": "https://www.normandpllc.com/contact-us/"
    },
    {
      "label": "class-action",
      "url": "http://localhost:3000/class-action.html",
      "referenceUrl": "https://www.normandpllc.com/class-action/"
    },
    // ... and so on for all 13 pages
  ]
}
```

---

## API/Form Endpoints

### Contact Form Submission
- **Original**: `https://www.normandpllc.com/wp-admin/admin-ajax.php` (Gravity Forms)
- **Scaffold**: Form structure ready, needs backend implementation

### External Links
- **Google Maps**: `https://maps.app.goo.gl/xc98brULtFBbmwLL7` - Office location
- **Phone**: `tel:4076036031` - Main office number
- **Toll-Free**: `tel:8889742175` - Toll-free number
- **Email**: `mailto:office@normandpllc.com` - Contact email

### Social Media Links (Placeholders in scaffold)
- Facebook: `https://www.facebook.com/normandlawpllc`
- Instagram: `https://www.instagram.com/normandlawpllc/`
- LinkedIn: `https://www.linkedin.com/company/normand-law-pllc/`

---

## Development Tools URLs

### Local Development Servers
- **Scaffold Server**: `http://localhost:3000` (via npx serve)
- **BackstopJS Report**: `file:///backstop_data/html_report/index.html`

### CDN Resources Used
- **Tailwind CSS**: `https://cdn.tailwindcss.com`
- **Google Fonts**: `https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600`

---

## URL Patterns Analysis

### Template Categories Identified
1. **Homepage Template**: Single page with all sections
2. **Service Template**: Class action category pages
3. **Team Template**: Team listing and individual profiles
4. **Article Template**: News and blog posts
5. **Legal Template**: Privacy, disclaimer, terms
6. **Contact Template**: Contact form and information

### URL Structure Pattern
- **Main sections**: `/section-name/`
- **Sub-sections**: `/section-name/sub-section/`
- **Articles**: `/article-slug/` (flat structure)
- **Team profiles**: `/our-team/member-name/`
- **Service details**: `/class-action/service-type/`

---

## Notes

- All scaffold URLs use `.html` extension for static serving
- Original site uses WordPress permalinks without extensions
- Form actions need backend implementation for production
- Social media links are placeholders and need updating
- Phone/email links are functional in scaffold