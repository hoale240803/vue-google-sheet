#!/bin/bash

# Ignore build if only .github/workflows files changed
if git diff --name-only $VERCEL_GIT_COMMIT_REF $VERCEL_GIT_PREVIOUS_SHA | grep -vE '^\.github/workflows/' | grep -q .; then
    exit 1
else
    echo "Only workflow files changed, skipping build."
    exit 0
fi
