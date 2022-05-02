#!/bin/bash

SPONSORS_GIST=$(grep "SPONSORS_GIST" ./.env | awk -F "=" '{print $2}')
SPONSORS_URL=$(grep "SPONSORS_URL" ./.env | awk -F "=" '{print $2}')

echo "Updating gist..."
mkdir -p gist
cp sponsors.svg gist
cd gist
git init
git remote add origin "$SPONSORS_GIST"
git add sponsors.svg
git commit -m "init"
git push -f origin master
cd ..
rm -rf gist
echo "Updated gist."

if [ "$SPONSORS_URL" ]; then
  echo "Purging githack cache..."
  curl -X POST http://raw.githack.com/purge -d "files=$SPONSORS_URL"
  echo "Purged githack cache."
fi
