#!/bin/bash

rm -rf build
mkdir -p build/assets build/lib
cp assets/globaltab.min.js build/assets/globaltab.min.js
cp assets/globaltab.min.css build/assets/globaltab.min.css
cp lib/minimasonry.min.js build/lib/minimasonry.min.js
cp globaltab.html build/globaltab.html
cp LICENSE build/LICENSE
cp README.md build/README.md

# Chrome

cp manifest.chrome.json build/manifest.json
cd build
zip -r GlobalTab.Chrome.zip . -x "*.zip"
rm manifest.json
cd ..

# Firefox

cp manifest.firefox.json build/manifest.json
cd build
zip -r GlobalTab.Firefox.zip . -x "*.zip"
cd ..

# Firefox Source

cp assets/globaltab.js build/assets/globaltab.js
cp assets/globaltab.scss build/assets/globaltab.scss
cd build/assets
zip -r GlobalTab.Firefox.Source.zip . -x "*.zip"
mv GlobalTab.Firefox.Source.zip ..

echo "Done"
