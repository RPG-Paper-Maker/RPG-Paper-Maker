#!/bin/bash

cd ./ || exit 1
git log web-3.0.0-master..web-3.0.0 --pretty=format:"%s"
printf "\n"
cd ../Game-Scripts || exit 1
git log web-3.0.0-master..web-3.0.0 --pretty=format:"%s"