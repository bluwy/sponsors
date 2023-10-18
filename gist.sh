#!/bin/bash

SPONSORS_GIST=$(grep "SPONSORS_GIST" ./.env | awk -F "=" '{print $2}')

echo "Updating gist..."
mkdir -p gist
cp sponsorkit/sponsors.svg gist
cd gist
git init
git remote add origin "$SPONSORS_GIST"
git add sponsors.svg
git commit -m "init"
git push -f origin master
cd ..
rm -rf gist
echo "Updated gist."
