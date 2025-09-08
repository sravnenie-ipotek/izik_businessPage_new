# Actual normandpllc.com Structure Analysis

## The REAL "We Are Class Action" Section

### Structure from normandpllc.com:
```html
<div class="wp-block-normand-services alignfull normand-services">
  <p class="normand-services--subtitle">Our Services</p>
  <h2 class="normand-services--title">We Are Class Action</h2>
  <div class="services-grid">
    <!-- Main content paragraph -->
    <p class="normand-services--content">...</p>
    
    <!-- Privacy Class Action -->
    <figure class="service-top--figure">
      <img src="consumer-protection-470x336.png" alt="Privacy Class Action">
    </figure>
    <div class="service-top--text">
      <h3>Privacy Class Action</h3>
      <p>Description...</p>
      <a href="/privacy/">Learn More</a>
    </div>
    
    <!-- Consumer Protection -->
    <figure class="service-middle--figure">
      <img src="Consumer-Protection-Class-Action-Image.png">
    </figure>
    <div class="service-middle--text">
      <h3>Consumer Protection Class Action</h3>
      <p>Description...</p>
      <a href="/consumer-protection/">Learn More</a>
    </div>
    
    <!-- Insurance Class Action -->
    <figure class="service-bottom--figure">
      <img src="Insurance-Disputes-Class-Action-Image.png">
    </figure>
    <div class="service-bottom--text">
      <h3>Insurance Class Action</h3>
      <p>Description...</p>
      <a href="/insurance/">Learn More</a>
    </div>
  </div>
</div>
```

## Key Differences from Our Implementation:

### ❌ WRONG (Our Current):
- Orange background section
- Single image on right
- Overlapping "PRIVACY CLASS ACTION" text

### ✅ CORRECT (Should Be):
- White/light background
- Grid layout with 3 service areas
- Each service has: image + title + description + Learn More button
- Services are: Privacy, Consumer Protection, Insurance
- Main description paragraph at top of grid

## Layout Pattern:
```
[Our Services - subtitle]
[We Are Class Action - main title]

[Main Description Paragraph]

[Privacy Image]        [Consumer Image]       [Insurance Image]
[Privacy Title]        [Consumer Title]       [Insurance Title]
[Privacy Desc]         [Consumer Desc]        [Insurance Desc]
[Learn More]           [Learn More]           [Learn More]
```

## CSS Classes Pattern:
- `normand-services` - main container
- `services-grid` - grid container
- `service-top--*` - Privacy section
- `service-middle--*` - Consumer section  
- `service-bottom--*` - Insurance section
- All elements have `normand-st-reveal` for scroll animations