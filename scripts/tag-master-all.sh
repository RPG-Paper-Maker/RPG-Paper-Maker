#!/bin/bash

tagName="$1"

git tag ${tagName}
git push origin ${tagName}
cd ../Game-Scripts
git tag ${tagName}
git push origin ${tagName}
cd ../Basic-Ressources
git tag ${tagName}
git push origin ${tagName}
cd ../Dependencies
git tag ${tagName}
git push origin ${tagName}
cd ../Game-Scripts-Build
git tag ${tagName}
git push origin ${tagName}
cd ../RPG-Paper-Maker
git tag ${tagName}
git push origin ${tagName}

sleep 60

git checkout web-3.0.0-master
git pull --rebase origin web-3.0.0
git push origin web-3.0.0-master
git checkout web-3.0.0