#!/bin/bash

# Create a new release with proper versioning and bundling
# Usage:
#   ./create-release.sh [patch|minor|major]  - Full release with versioning and git operations
#   ./create-release.sh --zip-only           - Just create a zip of the current version

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

BUNDLE_DIR=".release"

echo -e "${BLUE}🚀 TPRT Site Switcher Plugin Release Creator${NC}"
echo ""

# Check for --zip-only flag
if [ "$1" == "--zip-only" ]; then
    echo -e "${YELLOW}📦 Zip-only mode: Creating zip from current version${NC}"
    echo ""

    # Get current version from package.json
    CURRENT_VERSION=$(node -p "require('./package.json').version")
    echo -e "Current version: ${GREEN}$CURRENT_VERSION${NC}"

    # Build the production bundle
    echo ""
    echo -e "${BLUE}Building production bundle...${NC}"
    pnpm run bundle

    # Verify the bundle was created
    BUNDLE_NAME="$BUNDLE_DIR/tprt-site-switcher-${CURRENT_VERSION}.zip"
    if [ ! -f "$BUNDLE_NAME" ]; then
        echo -e "${RED}Error: Bundle was not created${NC}"
        exit 1
    fi

    echo ""
    echo -e "${GREEN}✅ Zip file created successfully!${NC}"
    echo -e "${BLUE}Plugin bundle: $BUNDLE_NAME${NC}"
    exit 0
fi

# Full release mode - check git requirements
echo -e "${YELLOW}🏷️  Full release mode: Creating new version with git operations${NC}"
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
BUNDLE_NAME="$BUNDLE_DIR/tprt-site-switcher-${NEW_VERSION}.zip"
if [ ! -f "$BUNDLE_NAME" ]; then
    echo -e "${RED}Error: Bundle was not created${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Bundle created: $BUNDLE_NAME${NC}"

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

# Create GitHub release with auto-generated notes and attach the zip
echo ""
echo -e "${BLUE}Creating GitHub release...${NC}"
if command -v gh &> /dev/null; then
    gh release create "v$NEW_VERSION" "$BUNDLE_NAME" \
        --title "v$NEW_VERSION" \
        --generate-notes
    echo -e "${GREEN}✅ Release v$NEW_VERSION created and $BUNDLE_NAME uploaded${NC}"
else
    echo -e "${YELLOW}⚠️  gh CLI not installed. Skipping GitHub release creation.${NC}"
    echo ""
    echo "Manual steps:"
    echo "  1. Go to GitHub and create a new release from tag v$NEW_VERSION"
    echo "  2. Upload the $BUNDLE_NAME file"
    echo "  3. Add release notes describing the changes"
fi

echo ""
echo -e "${GREEN}✅ Release v$NEW_VERSION complete!${NC}"
echo -e "${BLUE}Plugin bundle: $BUNDLE_NAME${NC}"
