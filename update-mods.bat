@echo off
title Update mods

set modsPath=./mods
set localMessage=Local copy: 
set pathRepos=..
set pathMods=%pathRepos%\RPG-Paper-Maker\mods

IF EXIST %pathMods% (
	@RD /S /Q "%pathMods%"
)
mkdir %pathMods%

set path=%pathRepos%\Game-Scripts\Content\Datas\Scripts
set pathModsScript=%pathMods%\Scripts
IF EXIST %path% (
	echo "%localMessage% %path% -> %pathModsScript%"
	C:\Windows\System32\xcopy.exe %path% %pathModsScript% /E /I
) ELSE (
	echo "ERROR: Could not find repo Game-Scripts in %path%. Please clone it manually to that location before running this script (cloning via update-mods is supported only on Linux)"
)

set path=%pathRepos%\Basic-Ressources\Content
set pathModsBR=%pathMods%\BR\Content
mkdir %pathMods%\BR
IF EXIST %path% (
	echo "%localMessage% %path% -> %pathModsBR%"
	C:\Windows\System32\xcopy.exe %path% %pathModsBR% /E /I
) ELSE (
	echo "ERROR: Could not find repo Basic-Ressources in %path%. Please clone it manually to that location before running this script (cloning via update-mods is supported only on Linux)"
)

set path=%pathRepos%\Dependencies\Game
set pathModsGame=%pathMods%\Game
IF EXIST %path% (
	echo "%localMessage% %path% -> %pathModsGame%"
	C:\Windows\System32\xcopy.exe %path% %pathModsGame% /E /I
) ELSE (
	echo "ERROR: Could not find repo Dependencies in %path%. Please clone it manually to that location before running this script (cloning via update-mods is supported only on Linux)"
)
