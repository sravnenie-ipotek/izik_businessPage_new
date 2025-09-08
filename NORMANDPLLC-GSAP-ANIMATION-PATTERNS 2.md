# NormandPLLC GSAP Animation Patterns - Complete Implementation Guide

## Overview
Based on professional law firm website standards and analysis of high-end legal sites, here are the exact GSAP animation patterns implemented in your system.

## 1. Hero Section Animation Sequence
**Pattern**: Professional entrance animation with staggered reveals
```javascript
// Timing: 0.3s delay, then staggered animations
const tl = gsap.timeline({ delay: 0.3 });

// Image reveal (1.5s duration)
tl.from('.hero-portrait', {
  scale: 1.2,           // Subtle zoom-out effect
  autoAlpha: 0,
  duration: 1.5,
  ease: 'power2.out'
});

// Text stagger sequence (overlapping timing)
tl.from('.hero-tagline', {
  yPercent: 100,        // Slide up from below
  autoAlpha: 0,
  duration: 1.0
}, '-=0.8')             // Start 0.8s before previous ends

.from('.hero-title', {
  yPercent: 100,
  autoAlpha: 0,
  duration: 1.2,
  ease: 'power3.out'    // Strong easing for main title
}, '-=0.4');
```

## 2. Scroll-Triggered Animations

### Fade In Elements
**Pattern**: Standard fade-up animation
```javascript
// Trigger: When element is 80% visible
ScrollTrigger: {
  trigger: element,
  start: 'top 80%',     // Industry standard trigger point
},
y: 50,                  // 50px upward movement
autoAlpha: 0,
duration: 1,            // 1 second - professional timing
ease: 'power2.out'      // Most used easing in legal sites
```

### Directional Fade Animations
**Pattern**: Left/right entrances for layout balance
```javascript
// Fade in from left
x: -60,                 // 60px horizontal movement
duration: 1.2,          // Slightly longer for sophistication
ease: 'power3.out'

// Fade in from right
x: 60,
duration: 1.2,
ease: 'power3.out'
```

### Scale In Animation
**Pattern**: For important elements (CTAs, awards)
```javascript
scale: 0.8,             // Start at 80% size
autoAlpha: 0,
duration: 1.0,
ease: 'back.out(1.7)'   // Bounce effect for emphasis
```

## 3. Menu Animation System

### Menu Open Sequence
**Pattern**: Professional staggered reveal
```javascript
// Duration: 1-2.7 seconds total
const tl = gsap.timeline();

// Container slide in (1s)
tl.from(menuContainer, {
  xPercent: -100,       // Full width slide from left
  duration: 1,
  ease: 'slow(0.5, 2, false)'  // Custom sophisticated easing
});

// Menu items stagger (starts at 0.3s)
tl.from(menuItems, {
  autoAlpha: 0,
  yPercent: -100,       // Slide down from top
  stagger: 0.2,         // 200ms between items
  duration: 1,
  ease: 'expo.out'      // Exponential easing for elegance
}, 'start+=0.3');
```

### Menu Close Sequence
**Pattern**: Reverse animation with faster timing
```javascript
// Exit stagger (faster)
tl.to(menuItems, {
  autoAlpha: 0,
  yPercent: -100,
  duration: 0.7,
  stagger: 0.05,        // Faster stagger for exit
  ease: 'expo.in'
});
```

## 4. Card Animation Patterns

### Stagger Animation for Card Grids
**Pattern**: Professional card reveal sequence
```javascript
gsap.from(cards, {
  y: 40,                // Subtle upward movement
  autoAlpha: 0,
  duration: 0.8,
  stagger: {
    amount: 0.6,        // Total stagger duration
    from: 'start'       // Sequential from first card
  },
  ease: 'power2.out'
});
```

### Individual Card Hover
**Pattern**: Professional elevation effect
```javascript
// On hover
gsap.to(card, {
  y: -8,                // 8px lift
  scale: 1.02,          // Subtle scale increase
  duration: 0.4,
  ease: 'power2.out'
});

// Shadow reveal
gsap.to(cardShadow, {
  opacity: 1,
  duration: 0.3
});
```

## 5. Text Animations

### Section Title with Line Reveal
**Pattern**: Professional title treatment
```javascript
gsap.timeline({
  scrollTrigger: {
    trigger: title,
    start: 'top 85%'
  }
})
.from(title, {
  yPercent: 50,
  autoAlpha: 0,
  duration: 1.0,
  ease: 'power2.out'
})
.to(underline, {
  width: '60px',        // Fixed width underline
  duration: 0.8,
  ease: 'power2.inOut'
}, '-=0.3');            // Overlap timing
```

### Counter Animation
**Pattern**: Counting effect for statistics
```javascript
gsap.to(counter, {
  innerHTML: endValue,
  duration: 2.5,        // Slow count for impact
  ease: 'power2.out',
  snap: { innerHTML: 1 }, // Snap to whole numbers
  onUpdate: function() {
    counter.innerHTML = Math.round(this.progress() * endValue);
  }
});
```

## 6. Preloader System

### SVG Path Animation
**Pattern**: Professional loading sequence
```javascript
const pathAnimation = gsap.timeline({ repeat: -1 });

pathAnimation
  .to(svgPaths, {
    scaleX: 1,
    autoAlpha: 1,
    stagger: 0.1,       // Sequential path reveal
    duration: 0.8,
    ease: 'circ.out'
  })
  .to(svgPaths, {
    scaleX: 0,
    autoAlpha: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: 'circ.out'
  });
```

### Preloader Exit
**Pattern**: Elegant departure
```javascript
gsap.timeline()
  .to('.preloader svg', { 
    scale: 0, 
    rotation: 180,      // Rotation for sophistication
    duration: 0.5
  })
  .to(preloader, { 
    yPercent: -100,     // Slide up exit
    duration: 0.8,
    ease: 'circ.out'
  });
```

## 7. Parallax Effects

### Subtle Image Parallax
**Pattern**: Professional background movement
```javascript
gsap.to(img, {
  yPercent: -15,        // Subtle 15% movement
  scrollTrigger: {
    trigger: img,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1.2,         // Smooth scrub timing
  }
});
```

## 8. Locomotive Scroll Integration

### ScrollTrigger Proxy Setup
**Pattern**: Professional smooth scroll integration
```javascript
ScrollTrigger.scrollerProxy(scrollContainer, {
  scrollTop(value) {
    return arguments.length 
      ? locomotiveScroll.scrollTo(value, 0, 0) 
      : locomotiveScroll.scroll.instance.scroll.y;
  },
  pinType: scrollContainer.style.transform ? 'transform' : 'fixed'
});
```

## 9. Timing Standards

### Professional Duration Guidelines
- **Quick interactions**: 0.3s (hovers, clicks)
- **Standard animations**: 0.8-1.0s (fades, slides)
- **Hero animations**: 1.2-1.5s (important elements)
- **Menu animations**: 1.0-2.7s (complex sequences)
- **Counters/statistics**: 2.0-2.5s (impact timing)

### Easing Standards
- **power2.out**: Most common, professional standard
- **power3.out**: For important elements (titles, CTAs)
- **expo.out**: For menu systems and sophisticated elements
- **back.out(1.7)**: For emphasis elements (scale animations)
- **circ.out**: For smooth, organic movements

## 10. Stagger Patterns

### Professional Stagger Timing
- **Menu items**: 0.2s intervals (readable sequence)
- **Cards/grid items**: 0.1s intervals or 0.6s total amount
- **Text lines**: 0.05-0.1s intervals (quick readable flow)
- **Exit animations**: 0.02-0.05s intervals (faster departure)

## 11. Mobile Considerations

### Responsive Animation Adjustments
```javascript
const isMobile = window.innerWidth <= 768;

if (isMobile) {
  // Reduce animation complexity
  duration: duration * 0.7,  // 30% faster on mobile
  // Disable Locomotive Scroll
  smooth: false
}
```

## 12. Performance Optimization

### Force3D Hardware Acceleration
```javascript
force3D: true,  // Enable GPU acceleration for transforms
```

### Kill Unused Animations
```javascript
gsap.killTweensOf('*');  // Clean up on page transitions
```

This implementation provides professional-grade animations that match high-end law firm websites while maintaining performance and accessibility standards.