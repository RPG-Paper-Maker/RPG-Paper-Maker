#!/bin/sh

cd ../Game-Scripts
git checkout master
git pull --rebase origin develop
git push origin master
git checkout develop
cd ../Basic-Ressources
git checkout master
git pull --rebase origin develop
git push origin master
git checkout develop
cd ../Dependencies
git checkout master
git pull --rebase origin develop
git push origin master
git checkout develop
cd ../RPG-Paper-Maker
git checkout master
git pull --rebase origin develop
git push origin master
git checkout develop