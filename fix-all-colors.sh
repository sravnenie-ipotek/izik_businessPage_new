#!/bin/bash

# Fix all page colors to match normandpllc.com exactly
# White backgrounds, no gradients, orange accent only

echo "Fixing all page colors to match normandpllc.com..."

# Fix Privacy Page
sed -i '' 's/background: linear-gradient.*privacy.*$/background: #ffffff;/g' privacy-class-action.html
sed -i '' 's/color: #2c5aa0/color: #fc5a2b/g' privacy-class-action.html
sed -i '' 's/background: #2c5aa0/background: #fc5a2b/g' privacy-class-action.html
sed -i '' 's/background-color: #2c5aa0/background-color: #fc5a2b/g' privacy-class-action.html
sed -i '' 's/border-color: #2c5aa0/border-color: #fc5a2b/g' privacy-class-action.html
sed -i '' 's/--privacy-blue: #2c5aa0/--privacy-blue: #fc5a2b/g' privacy-class-action.html

# Fix Consumer Protection Page
sed -i '' 's/background: linear-gradient.*consumer.*$/background: #ffffff;/g' consumer-protection.html
sed -i '' 's/color: #2e7d32/color: #fc5a2b/g' consumer-protection.html
sed -i '' 's/background: #2e7d32/background: #fc5a2b/g' consumer-protection.html
sed -i '' 's/background-color: #2e7d32/background-color: #fc5a2b/g' consumer-protection.html
sed -i '' 's/border-color: #2e7d32/border-color: #fc5a2b/g' consumer-protection.html
sed -i '' 's/--consumer-green: #2e7d32/--consumer-green: #fc5a2b/g' consumer-protection.html

# Fix Insurance Page
sed -i '' 's/background: linear-gradient.*insurance.*$/background: #ffffff;/g' insurance-class-action.html
sed -i '' 's/color: #00695c/color: #fc5a2b/g' insurance-class-action.html
sed -i '' 's/background: #00695c/background: #fc5a2b/g' insurance-class-action.html
sed -i '' 's/background-color: #00695c/background-color: #fc5a2b/g' insurance-class-action.html
sed -i '' 's/border-color: #00695c/border-color: #fc5a2b/g' insurance-class-action.html
sed -i '' 's/--insurance-teal: #00695c/--insurance-teal: #fc5a2b/g' insurance-class-action.html

echo "Color fixes applied!"