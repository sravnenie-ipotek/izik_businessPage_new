# NORMANDPLLC Class Action Page - Exact Color Map

## URL: https://www.normandpllc.com/class-action

## Extracted Color Scheme (EXACT VALUES)

### Core Brand Colors
```css
--color-theme-primary: #fc5a2b;    /* Bright coral/orange - main brand accent */
--color-theme-black: #010101;      /* Near-black for text and headers */
--color-theme-white: #ffffff;      /* Pure white backgrounds */
--color-theme-grey: #cccccc;       /* Medium grey for subtle elements */
--color-theme-secondary: #f2f2f2;  /* Light grey for section backgrounds */
```

### Page-Specific Background Colors

#### 1. Body/Main Container
- Background: `#ffffff` (white)
- No gradients or patterns

#### 2. Header/Navigation Bar
- Background: `#ffffff` (white)
- Border/shadow: subtle shadow on scroll
- Text color: `#010101` (near-black)
- Hover accent: `#fc5a2b` (orange)

#### 3. Hero Section
- Background: `#ffffff` (white)
- Title text: `#010101` (near-black)
- Subtitle: `#010101` (near-black)
- No background image or gradient

#### 4. Content Sections Pattern
- Section 1: `#ffffff` (white)
- Section 2: `#f2f2f2` (light grey)
- Section 3: `#ffffff` (white)
- Section 4: `#f2f2f2` (light grey)
- **Alternating pattern for visual separation**

#### 5. Practice Area Cards
- Card background: `#ffffff` (white)
- Card border/shadow: subtle grey shadow
- Icon color: `#fc5a2b` (orange)
- Text: `#010101` (near-black)

#### 6. CTA Buttons
- Primary button bg: `#fc5a2b` (orange)
- Primary button text: `#ffffff` (white)
- Hover state: Darker orange or black (`#010101`)

#### 7. Footer
- Background: `#f2f2f2` (light grey)
- Text: `#010101` (near-black)
- Links: `#fc5a2b` (orange)

### Typography Colors
- Headings (H1-H6): `#010101` (near-black)
- Body text: `#010101` (near-black)
- Muted text: `#666666` (dark grey)
- Link color: `#fc5a2b` (orange)
- Link hover: `#010101` (near-black)

### Special Elements
- Divider lines: `#e5e5e5` (very light grey)
- Input borders: `#cccccc` (medium grey)
- Focus states: `#fc5a2b` (orange)
- Success messages: Green (specific shade TBD)
- Error messages: Red (specific shade TBD)

## Implementation Requirements

### CRITICAL: All Pages Must Use These EXACT Colors
1. **NO GRADIENTS** on main backgrounds
2. **NO COLOR THEMES** per practice area
3. **CONSISTENT** white/grey alternating sections
4. **ORANGE ONLY** for accents and CTAs
5. **BLACK/WHITE** base with grey variations

### Current Issues to Fix
Our implementation currently has:
- ❌ Orange gradient in hero (should be white)
- ❌ Different color themes per page (blue for privacy, green for consumer)
- ❌ Gradient overlays (should be solid colors)
- ❌ Colored backgrounds in hero sections

### Correct Implementation
```css
/* Base backgrounds - ALL PAGES */
body {
  background: #ffffff;
}

.hero-section {
  background: #ffffff; /* NOT gradients */
}

.content-section:nth-child(even) {
  background: #f2f2f2;
}

.content-section:nth-child(odd) {
  background: #ffffff;
}

/* Only orange for accents */
.cta-button {
  background: #fc5a2b;
  color: #ffffff;
}

/* Text always dark */
h1, h2, h3, h4, h5, h6, p {
  color: #010101;
}
```

## Visual Hierarchy
1. **White space** creates separation (not colors)
2. **Typography size** creates hierarchy
3. **Orange accents** draw attention to CTAs
4. **Subtle shadows** define card boundaries
5. **Alternating grey** sections for visual rhythm

## Notes
- The site uses a **minimal, professional color palette**
- **NO rainbow of colors** for different practice areas
- **Consistency** is key across all pages
- **High contrast** for accessibility
- **Clean and modern** aesthetic

---
*Generated from live site analysis*
*Date: November 2024*