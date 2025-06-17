#!/bin/bash

# Script to set up your data branch
echo "Setting up Van Gogh data branch..."

# Create a new branch for data management
git checkout -b data-management

# Create the required directories
mkdir -p public/paintings/real
mkdir -p public/paintings/ai
mkdir -p data

# Create a README for the data branch
cat > DATA-README.md << 'EOF'
# Van Gogh Game Data Branch

This branch is specifically for managing your Van Gogh painting dataset.

## Quick Setup:

1. Visit `/data-manager` in your app
2. Drag and drop your real Van Gogh images to the green area
3. Drag and drop your AI-generated images to the red area
4. Click "Create Pairs" to automatically match them
5. Click "Generate & Download Data Files"
6. Follow the instructions in the downloaded files

## File Structure:
