# 🖼️ Images Management Guide

Complete guide for adding and managing images in your static site.

## 📁 **Image Folder Structure**

```
/images/
├── hero/               # Hero section images
│   ├── portrait.jpg    # Professional portrait
│   └── background.jpg  # Hero background (optional)
├── team/              # Team member photos
│   ├── edmund-normand.jpg
│   └── default-member.jpg
├── services/          # Service-related images
│   └── services-bg.jpg
├── logos/             # Brand assets
│   ├── logo.svg
│   └── alternate-logo.svg
└── general/           # Other images
```

## 🎯 **How to Add Images - Step by Step**

### **Method 1: Using Content Editor (Recommended)**

1. **Upload images to folders:**
   ```bash
   # Copy your image files to:
   /images/hero/portrait.jpg
   /images/team/member-name.jpg
   ```

2. **Open content editor:**
   ```
   http://localhost:4000/content-editor.html
   ```

3. **Enter image paths in forms:**
   - Hero Portrait: `images/hero/portrait.jpg`
   - Team Photos: `images/team/john-doe.jpg`

4. **Save and replace JSON file:**
   - Click "Save Changes"
   - Move downloaded file to `content/site-content.json`

### **Method 2: Direct JSON Editing**

```json
{
  "hero": {
    "portraitImage": "images/hero/portrait.jpg",
    "backgroundImage": "images/hero/background.jpg"
  },
  "team": {
    "members": [
      {
        "name": "John Doe",
        "photo": "images/team/john-doe.jpg",
        "bio": "..."
      }
    ]
  },
  "images": {
    "hero": {
      "portrait": "images/hero/portrait.jpg"
    },
    "logos": {
      "main": "images/logos/logo.svg"
    }
  }
}
```

## 🎨 **Image Specifications**

### **Hero Portrait**
- **Size:** 800×1200px (2:3 aspect ratio)
- **Format:** JPG (best for photos)
- **Optimize:** Compress to <200KB
- **Style:** Professional headshot, good lighting

### **Team Photos**
- **Size:** 400×500px (4:5 aspect ratio) 
- **Format:** JPG
- **Optimize:** Compress to <100KB
- **Style:** Consistent lighting, professional attire

### **Logos**
- **Format:** SVG (scalable) or PNG (with transparency)
- **Size:** Vector or 400×400px minimum
- **Background:** Transparent

### **Service Images**
- **Size:** 1200×800px (3:2 aspect ratio)
- **Format:** JPG
- **Optimize:** Compress to <300KB

## 🛠️ **Image Optimization Tools**

### **Online Compressors:**
- **TinyPNG** - https://tinypng.com/ (Best for PNG/JPG)
- **Squoosh** - https://squoosh.app/ (Google's tool)
- **Optimizilla** - https://imagecompressor.com/

### **Desktop Tools:**
- **ImageOptim** (Mac)
- **RIOT** (Windows)
- **GIMP** (Free, cross-platform)

## 🚀 **Upload Workflow**

### **Development (Local):**
```bash
# 1. Add images to folders
cp ~/Desktop/portrait.jpg images/hero/

# 2. Update content (via editor or JSON)
# 3. Test locally
python3 -m http.server 4000

# 4. Commit changes
git add .
git commit -m "Add new images"
git push
```

### **Production (Vercel):**
- Images automatically deploy with your site
- No additional setup required
- CDN optimization included

## 📱 **Responsive Images (Advanced)**

For better performance, you can add responsive images:

```css
/* In normandpllc-styles.css */
.hero-portrait {
  background-image: url('images/hero/portrait-mobile.jpg');
}

@media (min-width: 768px) {
  .hero-portrait {
    background-image: url('images/hero/portrait-desktop.jpg');
  }
}
```

## ⚡ **Performance Tips**

1. **Compress all images** before uploading
2. **Use appropriate formats:**
   - JPG for photos
   - PNG for graphics with transparency
   - SVG for logos and icons
3. **Optimize file sizes:**
   - Hero images: <200KB
   - Team photos: <100KB
   - Icons: <50KB

## 🔧 **Troubleshooting**

### **Image not showing?**
- Check file path spelling
- Ensure file exists in correct folder
- Check file permissions
- Clear browser cache

### **Slow loading?**
- Compress images further
- Use appropriate dimensions
- Consider WebP format for modern browsers

## 🎯 **Quick Reference**

| Image Type | Size | Format | Max File Size |
|-----------|------|--------|---------------|
| Hero Portrait | 800×1200px | JPG | 200KB |
| Team Photos | 400×500px | JPG | 100KB |
| Logos | Vector | SVG/PNG | 50KB |
| Backgrounds | 1920×1080px | JPG | 300KB |

## 📋 **Checklist**

- [ ] Create image folders (`/images/hero/`, `/images/team/`)
- [ ] Optimize images before uploading
- [ ] Use consistent naming convention
- [ ] Update JSON with correct paths
- [ ] Test images load correctly
- [ ] Commit and push changes

Your images are now ready to make your site look professional! 🎨