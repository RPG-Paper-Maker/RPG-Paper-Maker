#!/bin/bash

cp -r dist/assets ../Dependencies/dist/
cp dist/fileManifest.json dist/index.html ../Dependencies/dist/

cd ../Dependencies
git add *
git commit -m "Update dist build"
git push