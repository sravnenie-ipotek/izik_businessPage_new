# BackstopJS Configuration

## CI Config
- Scenarios: 15
- Viewports: 4 (390px, 768px, 1024px, 1440px)
- Threshold: 0.2 (20% mismatch allowed)

## Nightly Config
- Scenarios: 28
- Viewports: 4 (390px, 768px, 1024px, 1440px)  
- Threshold: 0.2 (20% mismatch allowed)

## Commands

### CI Testing
```bash
npx backstop reference -c backstop.ci.json
npx backstop test -c backstop.ci.json
```

### Nightly Testing
```bash
npx backstop reference -c backstop.nightly.json
npx backstop test -c backstop.nightly.json
```
