@echo off
title Update mods

set modsPath=./mods
set localMessage=Local copy: 
set pathRepos=C:\Users\Marie_MSI\Documents\Qt\RPM
set pathMods=%pathRepos%\RPG-Paper-Maker\mods

IF EXIST %pathMods% (
	@RD /S /Q "%pathMods%"
)
mkdir %pathMods%

set path=%pathRepos%\Game-Scripts\Content\Datas\Scripts
set pathModsScript=%pathMods%\Scripts
IF EXIST %path% (
	echo "%localMessage% %path% -> %pathModsScript%"
	echo r | C:\Windows\System32\xcopy.exe %path% %pathModsScript% /E
) ELSE (
	echo "ERROR: The repo Game-Scripts doesn't exists. Clone it (supported only on linux)."
)

set path=%pathRepos%\Basic-Ressources\Content
set pathModsBR=%pathMods%\BR\Content
mkdir %pathMods%\BR
IF EXIST %path% (
	echo "%localMessage% %path% -> %pathModsBR%"
	echo r | C:\Windows\System32\xcopy.exe %path% %pathModsBR% /E
) ELSE (
	echo "ERROR: The repo Basic-Ressources doesn't exists. Clone it (supported only on linux)."
)

set path=%pathRepos%\Dependencies\Game
set pathModsGame=%pathMods%\Game
IF EXIST %path% (
	echo "%localMessage% %path% -> %pathModsGame%"
	echo r | C:\Windows\System32\xcopy.exe %path% %pathModsGame% /E
) ELSE (
	echo "ERROR: The repo Dependencies doesn't exists. Clone it (supported only on linux)."
)