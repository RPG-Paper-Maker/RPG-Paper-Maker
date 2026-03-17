#!/bin/bash

cd ./ || exit 1
git log master..develop --pretty=format:"%s"
printf "\n"
cd ../Game-Scripts || exit 1
git log master..develop --pretty=format:"%s"