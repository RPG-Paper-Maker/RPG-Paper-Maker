@echo off
title Update mods

setlocal

set modsPath=./mods
set localMessage=Local copy: 
set pathRepos=..
set pathMods=%pathRepos%\RPG-Paper-Maker\mods

IF EXIST %pathMods% (
	@RD /S /Q "%pathMods%"
)
mkdir %pathMods%

set sourcePathModsScript=%pathRepos%\Game-Scripts\Content\Datas\Scripts
set pathModsScript=%pathMods%\Scripts
CALL :copy_mod %sourcePathModsScript% %pathModsScript% Game-Scripts

set sourceFile=%pathRepos%\Game-Scripts\main.js
set destinationFile=%pathMods%\main.js
copy /Y %sourceFile% %destinationFile%
set sourceFile=%pathRepos%\Game-Scripts\index.html
set destinationFile=%pathMods%\index.html
copy /Y %sourceFile% %destinationFile%
set sourceFile=%pathRepos%\Game-Scripts\package.json
set destinationFile=%pathMods%\package.json
copy /Y %sourceFile% %destinationFile%

set sourcePathModsBR=%pathRepos%\Basic-Ressources\Content
set pathModsBR=%pathMods%\BR\Content
mkdir %pathMods%\BR
CALL :copy_mod %sourcePathModsBR% %pathModsBR% Basic-Ressources

set sourcePathModsGame=%pathRepos%\Dependencies\Game
set pathModsGame=%pathMods%\Game
CALL :copy_mod %sourcePathModsGame% %pathModsGame% Dependencies

EXIT /B 0

:: Copy a mod directory to a target directory
:copy_mod

setlocal

set source=%~1
set target=%~2
set modName=%~3

IF EXIST %source% (
	echo "%localMessage% %source% -> %target%"
	C:\Windows\System32\xcopy.exe %source% %target% /E /I
) ELSE (
	echo "ERROR: Could not find directory %source%. Please manually clone %modName% manually to %pathRepos% before running this script (cloning via update-mods is supported only on Linux)"
)

EXIT /B 0
