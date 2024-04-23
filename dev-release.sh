#!/usr/bin/env bash

BRANCH_TO_RELEASE_FROM="release/2.16"
FILES_TO_INCLUDE_IN_RELEASE_COMMITS="package.json package-lock.json"

# Show help message if no arguments are given or -h/--help flag is used
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
  echo "Usage: dev-release.sh"
  exit 0
fi

# Check git branch and abort if not on correct release branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$BRANCH_TO_RELEASE_FROM" ]; then
  echo "You are on branch $CURRENT_BRANCH. Releases only from $BRANCH_TO_RELEASE_FROM branch."
  exit 1
fi

echo ""
OLD_NPM_VERSION=v$(npm pkg get version | tr -d \") # version is printed without v prefix, so it is added here
echo "Old version: $OLD_NPM_VERSION"

NEW_NPM_VERSION=$(npm version --git-tag-version=false --preid=digabi prerelease)
echo "New version: $NEW_NPM_VERSION"


echo ""
echo "Do you want to commit, tag and push the above changes? (y/n)"
read -r answer

# Commit and push changes if the user answered y
if [ "$answer" = "y" ]; then
  git add $FILES_TO_INCLUDE_IN_RELEASE_COMMITS
  git commit -m "Release $NEW_NPM_VERSION"
  if ! git tag -m "Release $NEW_NPM_VERSION" "$NEW_NPM_VERSION"; then
    git reset --soft HEAD~1
    echo "Failed to create tag $NEW_NPM_VERSION. Release aborted and commit reverted."
    exit 1
  fi
  echo ""
  git push --atomic origin $BRANCH_TO_RELEASE_FROM "$NEW_NPM_VERSION"
  echo ""
  echo "Release commit and tag $NEW_NPM_VERSION pushed."
else
  echo "Release aborted. Please revert incorrect changes."
fi
