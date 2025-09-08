# Visual Parity Notes

## Remaining Differences > 2px

Based on the extracted design tokens and visual analysis, here are the remaining differences that may need manual adjustment:

### Typography
- **Heading Font**: Original uses "Knockout-Full" (proprietary) → Replaced with "Bebas Neue" (open alternative)
  - Letter-spacing difference: ~0.5px at large sizes
  - Slight weight variation in bold text

- **Body Font**: Original uses "Gotham-Medium" (proprietary) → Replaced with "Inter" (open alternative)
  - Line-height variance: ~1-2px in paragraph spacing
  - Letter-spacing: Minimal difference (<0.5px)

### Layout
- **Container Max Width**: Detected as 100% → Set to 1440px standard
  - May need adjustment based on actual content containment

- **Section Padding**: Original varies (0-120px) → Standardized to 80px (sectionY)
  - Some sections may need custom padding overrides

### Colors
- **Black**: Exact match (#010101)
- **Orange**: Using #fc5a2b (matches brand orange)
- **Grays**: Approximated with Tailwind defaults

### Controls
- **Input/Button Heights**: Set to 48px standard
  - Original may vary between 44-52px depending on context
  - Border radius: Set to 0 (sharp corners)

### Responsive Breakpoints
- Using standard breakpoints (390/768/1024/1440)
- Original may have custom breakpoints at different values

## Recommendations for Perfect Parity

1. **Font Loading**: Ensure web fonts load before paint to avoid FOUT
2. **Animation Timing**: GSAP animations may need fine-tuning for exact match
3. **Shadow/Border Effects**: Some subtle shadows may need manual adjustment
4. **Hover States**: Interactive states approximated, test with actual interaction

## Notes on Ethical Constraints

- All text content replaced with placeholders
- No images or icons copied
- CSS written from scratch using Tailwind utilities
- Color values extracted but implementation independent