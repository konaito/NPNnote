#!/usr/bin/env bash
# NPNnote: build the web app for GitHub Pages and stage it in $OUT_DIR
#   PUBLIC_PATH  path the site is served from (default: /NPNnote/)
#   OUT_DIR      where the publishable files go (default: .npnnote-pages)
set -euo pipefail

cd "$(dirname "$0")/.."
PUBLIC_PATH="${PUBLIC_PATH:-/NPNnote/}"
OUT_DIR="${OUT_DIR:-.npnnote-pages}"
DIST=packages/frontend/apps/web/dist

rm -rf "$DIST"
BUILD_TYPE=stable PUBLIC_PATH="$PUBLIC_PATH" CI=1 yarn affine @affine/web build

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"
# source maps are not needed to run the app and double the size;
# the .gitignore copied from core/public would drop every .js from the pages branch
rsync -a --exclude '*.map' --exclude '.gitignore' "$DIST/" "$OUT_DIR/"
# GitHub Pages answers unknown paths with 404.html, which lets deep links boot the SPA
cp "$OUT_DIR/index.html" "$OUT_DIR/404.html"
touch "$OUT_DIR/.nojekyll"

du -sh "$OUT_DIR"
