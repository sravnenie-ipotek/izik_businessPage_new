# Visual Testing Guide with BackstopJS

## Overview
This project now includes visual regression testing using BackstopJS to compare our site against the reference site (normandpllc.com).

## Quick Start

### 1. Serve your site locally
```bash
npm run dev
```
This serves the site on http://localhost:3000

### 2. Run visual comparison tests
```bash
npm run visual:test
```
This will:
- Start the local server
- Compare your local site against the reference screenshots
- Open the visual diff report in your browser

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Serve the site locally on port 3000 |
| `npm run backstop:reference` | Capture new reference screenshots from normandpllc.com |
| `npm run backstop:test` | Run visual comparison tests |
| `npm run backstop:approve` | Approve current test screenshots as new reference |
| `npm run backstop:open` | Open the latest test report |
| `npm run visual:test` | Full workflow: serve → test → open report |
| `npm run visual:ref` | Capture new reference screenshots with server running |

## Test Coverage

The visual tests cover:
- **Full page comparisons**: Homepage, Class Action, Privacy Class Action, Consumer Protection, Insurance Class Action
- **Component comparisons**: Hero Section, Practice Areas, Footer
- **Responsive breakpoints**: Phone (320px), Tablet (768px), Desktop (1440px)

## Working with Test Results

### Understanding the Report
- **Green**: No visual differences detected
- **Yellow**: Minor differences within threshold (0.1%)
- **Red**: Significant visual differences detected

### Approving Changes
If you've made intentional visual changes:
```bash
npm run backstop:approve
```
This will update the reference screenshots with your current version.

## Configuration

The visual testing configuration is in `backstop.json`:
- **misMatchThreshold**: 0.1 (allows 0.1% pixel difference)
- **delay**: 2000ms (waits for animations to complete)
- **viewports**: Phone, Tablet, Desktop

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Kill the process using port 3000: `lsof -ti:3000 | xargs kill -9`

2. **Reference screenshots outdated**
   - Update references: `npm run backstop:reference`

3. **Tests failing on animations**
   - Increase delay in backstop.json

## Integration with Existing Tests

This visual testing complements our existing Playwright functional tests:
- **Playwright**: Tests functionality, interactions, and behavior
- **BackstopJS**: Tests visual consistency and layout

Run all tests:
```bash
npm test           # Run Playwright functional tests
npm run visual:test  # Run BackstopJS visual tests
```