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