#!/bin/bash

# E2E Test Setup Script
# Run this once to set up your test environment

echo "🚀 Setting up E2E tests for AI Marketplace..."

# Check if Playwright is installed
if ! npx playwright --version > /dev/null 2>&1; then
    echo "📦 Installing Playwright..."
    npm install -D @playwright/test
fi

# Install browser
echo "🌐 Installing Chromium browser..."
npx playwright install chromium

# Create .env.test if it doesn't exist
if [ ! -f .env.test ]; then
    echo "📝 Creating .env.test from example..."
    cp .env.test.example .env.test
    echo "⚠️  Please edit .env.test with your test credentials!"
else
    echo "✅ .env.test already exists"
fi

# Create e2e directory if needed
mkdir -p e2e/helpers

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.test with your test user credentials"
echo "2. Create a test user in your database"
echo "3. Generate a JWT token for the test user"
echo "4. Run tests: npm run test:e2e"
echo ""
echo "See e2e/README.md for detailed instructions"
