#!/usr/bin/env bash
# NPNnote: build favicons and the app icon from the chosen logo (logo-b.png)
set -euo pipefail
cd "$(dirname "$0")"
SRC=logo-b.png
PUB=../../packages/frontend/core/public
TMP=$(mktemp -d)

# crop to the mark, then put it on a white square with 12% margin on each side
magick "$SRC" -fuzz 8% -trim +repage "$TMP/mark.png"
read -r W H < <(magick identify -format '%w %h\n' "$TMP/mark.png")
SIDE=$(( (W > H ? W : H) * 100 / 76 ))
magick "$TMP/mark.png" -background white -gravity center -extent "${SIDE}x${SIDE}" -resize 1024x1024 icon-1024.png

for s in 32 36 48 72 96 144 192; do
  magick icon-1024.png -resize "${s}x${s}" "$PUB/favicon-$s.png"
done
magick icon-1024.png -resize 180x180 "$PUB/apple-touch-icon.png"
magick icon-1024.png -define icon:auto-resize=48,32,16 "$PUB/favicon.ico"
magick icon-1024.png -define icon:auto-resize=256,128,64,48,32,16 "$PUB/imgs/app-icon-stable.ico"
rm -rf "$TMP"
