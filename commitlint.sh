#!/usr/bin/env bash
set -euxo pipefail

# cd to directory of this script
cd "$(dirname "$0")"
npm install
npm install @commitlint/{cli,config-conventional}
npx commitlint --version
npx commitlint $@
cd ..
