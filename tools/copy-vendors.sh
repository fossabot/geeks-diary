#!/usr/bin/env bash

mkdir -p app/assets/vendors/

# Copy line awesome icon
mkdir -p app/assets/vendors/line-awesome/
cp -R node_modules/line-awesome/dist/ app/assets/vendors/line-awesome/


# Copy open sans font
mkdir -p app/assets/vendors/open-sans/
mkdir -p app/assets/vendors/open-sans/files/

cp -R node_modules/typeface-open-sans/files/ app/assets/vendors/open-sans/files/
cp node_modules/typeface-open-sans/index.css app/assets/vendors/open-sans/index.css


# Copy zilla slab font
mkdir -p app/assets/vendors/zilla-slab/
mkdir -p app/assets/vendors/zilla-slab/files/

cp -R node_modules/typeface-zilla-slab/files/ app/assets/vendors/zilla-slab/files/
cp node_modules/typeface-zilla-slab/index.css app/assets/vendors/zilla-slab/index.css
