#!/bin/bash

# Create a new release with proper versioning and bundling

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 TPRT Site Switcher Plugin Release Creator${NC}"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}Error: You have uncommitted changes. Please commit or stash them first.${NC}"
    exit 1
fi

# Get current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "Current version: ${GREEN}$CURRENT_VERSION${NC}"

# Determine release type
if [ -z "$1" ]; then
    echo ""
    echo "What type of release is this?"
    echo "1) patch (bug fixes)"
    echo "2) minor (new features, backward compatible)"
    echo "3) major (breaking changes)"
    echo -n "Enter choice [1-3]: "
    read choice

    case $choice in
        1) RELEASE_TYPE="patch";;
        2) RELEASE_TYPE="minor";;
        3) RELEASE_TYPE="major";;
        *) echo -e "${RED}Invalid choice${NC}"; exit 1;;
    esac
else
    RELEASE_TYPE=$1
fi

# Create new version
echo ""
echo -e "${BLUE}Creating $RELEASE_TYPE version bump...${NC}"
pnpm version $RELEASE_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo -e "New version: ${GREEN}$NEW_VERSION${NC}"

# Update plugin file version
echo ""
echo -e "${BLUE}Updating plugin file version...${NC}"
node scripts/updatePluginVersion.js

# Build the production bundle
echo ""
echo -e "${BLUE}Building production bundle...${NC}"
pnpm run bundle

# Verify the bundle was created
if [ ! -f ".release/tprt-site-switcher-$NEW_VERSION.zip" ]; then
    echo -e "${RED}Error: Bundle was not created${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Bundle created: .release/tprt-site-switcher-$NEW_VERSION.zip${NC}"

# Add the version changes
echo ""
echo -e "${BLUE}Committing version changes...${NC}"
git add package.json tprt-site-switcher.php
git commit -m "chore(release): bump version to $NEW_VERSION"

# Create and push the tag
echo ""
echo -e "${BLUE}Creating tag v$NEW_VERSION...${NC}"
git tag -a "v$NEW_VERSION" -m "Release version $NEW_VERSION"

# Push changes
echo ""
echo -e "${BLUE}Pushing to GitHub...${NC}"
git push origin $(git branch --show-current)
git push origin "v$NEW_VERSION"

echo ""
echo -e "${GREEN}✅ Release created successfully!${NC}"
echo ""
echo "Next steps:"
echo "  1. Go to GitHub and create a new release from tag v$NEW_VERSION"
echo "  2. Upload the .release/tprt-site-switcher-$NEW_VERSION.zip file"
echo "  3. Add release notes describing the changes"
echo ""
echo -e "${BLUE}Plugin bundle: .release/tprt-site-switcher-$NEW_VERSION.zip${NC}"
