#!/usr/bin/env bash

rm -rf app/assets/vendors/
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


# Copy monaco editor
mkdir -p app/assets/vendors/monaco-editor/

cp -R node_modules/monaco-editor/min/vs/ app/assets/vendors/monaco-editor/vs/
cp node_modules/monaco-editor/monaco.d.ts app/assets/vendors/monaco-editor/monaco.d.ts


# Copy devicon
mkdir -p app/assets/vendors/devicon/
cp -R node_modules/devicon/icons/ app/assets/vendors/devicon/
cp node_modules/devicon/devicon.json app/assets/vendors/devicon/devicon.json
cp node_modules/devicon/devicon.min.css app/assets/vendors/devicon/devicon.min.css
