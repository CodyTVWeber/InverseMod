#!/bin/bash

# Setup script for InverseMod Algorithm project
# Sets up Node.js environment and dependencies

echo "Setting up InverseMod Algorithm project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js >= 14.0.0"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "Warning: Node.js version $NODE_VERSION is below recommended 14.0.0"
fi

echo "Node.js version: $(node -v)"

# Navigate to code directory
cd "$(dirname "$0")/.."

# Install dependencies (if package.json exists)
if [ -f "package.json" ]; then
    echo "Installing dependencies..."
    npm install
    echo "Dependencies installed successfully."
else
    echo "Warning: package.json not found. Skipping npm install."
fi

# Check if BigInt is supported (Node.js 10.4+)
echo "Checking BigInt support..."
node -e "console.log('BigInt support:', typeof BigInt !== 'undefined');"

# Create test output directory if it doesn't exist
mkdir -p test-output

# Run quick test to verify setup
echo "Running quick verification test..."
if node src/demo.js > /dev/null 2>&1; then
    echo "✓ Setup verification successful"
else
    echo "⚠️  Setup verification failed - check for errors above"
fi

echo ""
echo "Setup complete! You can now:"
echo "  npm run demo              # Run the demonstration"
echo "  npm run test:quick        # Run quick tests"
echo "  npm run test:scenarios    # Run scenario tests"
echo "  npm run analysis          # Run mathematical analysis"
echo ""
echo "For more options, see: npm run --help"