#!/bin/bash

echo "==="
echo "Reminder: have you already built ketcher?"
echo "==="

# Allow miew to be embedded in iframe
# Check if GNU sed or macOS sed
if sed --version &>/dev/null; then
    find example/dist/standalone -name "*" | xargs grep -sl "window.top" | xargs --no-run-if-empty sed -i 's/window.top/window/g'
else
    find example/dist/standalone -name "*" | xargs grep -sl "window.top" | xargs --no-run-if-empty sed -i '' 's/window.top/window/g'
fi

docker build -t ketcher .

# Find the image tag from ../digabi2
tag=$(grep -E "image:.*863419159770\.dkr\.ecr\.eu-north-1\.amazonaws\.com/ketcher:" ../digabi2/docker-compose-apps.dev.yml  | sed -E "s/^ +image://" | tr -d ' ')

docker tag ketcher "$tag"