# Vercel Deployment Guide for Oranzon

## Quick Deploy

1. **Push to GitHub**
```bash
git add .
git commit -m "Add normandpllc-style animations with GSAP"
git push origin main
```

2. **Deploy to Vercel**
```bash
npx vercel --prod
```

Or use Vercel Dashboard:
- Connect GitHub repo
- Auto-deploy on push

## Project Structure

```
/
├── index.html              # Homepage with preloader
├── css/
│   ├── webflow.css        # Core Webflow styles
│   ├── aiziks-stellar-site.webflow.css
│   └── normandpllc-styles.css  # New clean animations
├── js/
│   ├── webflow.js         # Webflow interactions
│   └── normandpllc-animations.js  # GSAP animations
└── images/                # Static assets
```

## Features Implemented

✅ **Custom Cursor** - Blend modes, element interactions
✅ **Preloader** - 0-100% counter (homepage only)
✅ **Navigation** - Staggered reveals, scroll hide/show
✅ **Hero Animations** - Scale, translate, fade effects
✅ **Scroll Triggers** - Parallax, fade-ins
✅ **Mobile Optimized** - Reduced animations on mobile
✅ **Clean Design** - normandpllc-inspired professional flow

## Performance Notes

- GSAP loaded from CDN (cached)
- Hardware acceleration enabled
- Mobile-first responsive
- Lazy loading ready

## Testing Locally

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .

# Open http://localhost:8000
```

## Environment Variables

None required - pure static site.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Mobile optimized for iOS 14+ and Android 10+