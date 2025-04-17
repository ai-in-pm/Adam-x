#!/bin/bash

set -euo pipefail

SCRIPT_DIR=$(realpath "$(dirname "$0")")
trap "popd >> /dev/null" EXIT
pushd "$SCRIPT_DIR/.." >> /dev/null || {
  echo "Error: Failed to change directory to $SCRIPT_DIR/.."
  exit 1
}
npm install
npm run build
rm -rf ./dist/adam-adam-x-*.tgz
npm pack --pack-destination ./dist
mv ./dist/adam-adam-x-*.tgz ./dist/adam-x.tgz
docker build -t adam-x -f "./Dockerfile" .
