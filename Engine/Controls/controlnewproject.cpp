/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include <QString>
#include <QDir>
#include <QTextStream>
#include <QJsonObject>
#include <QJsonDocument>
#include "controlnewproject.h"
#include "wanok.h"
#include "map.h"
#include "gamedatas.h"

// All the forbidden symbols in a folder name
QChar ControlNewproject::forbiddenSymbols[10]{'/', '\\', ':', '?', '*', '|',
                                              '<', '>', '"', '.'};

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ControlNewproject::ControlNewproject(){}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

// -------------------------------------------------------
//  check if the given string contains forbidden symbols

QString ControlNewproject::filterDirectoryName(const QString & s){
    QString directory = "";

    // Setting entered value for directory name and escaping forbidden symbols
    for (int i = 0; i < s.size(); i++){
        if (std::find(std::begin(forbiddenSymbols), std::end(forbiddenSymbols),
                      s[i]) == std::end(forbiddenSymbols)){
            directory += (s[i] == ' ') ? '-' : s[i]; // Don't accept spaces
        }
    }

    return directory;
}

// -------------------------------------------------------
//  main function generating project folder. Returns a string if errors.

QString ControlNewproject::createNewProject(QString dirName, QString location){
    QDir pathLocation(location);
    QString pathDir(Wanok::pathCombine(location,dirName));

    // Checking if the project can be created
    if (dirName.count() == 0)
        return "The directory name can't be empty.";
    if (!QDir::isAbsolutePath(location))
        return "The path location needs to be absolute.";
    if (!pathLocation.exists())
        return "The path location doesn't exists.";
    if (!pathLocation.mkdir(dirName))
        return "The directory " + dirName + " already exists.";

    // If all is ok, then let's fill the project folder

    // Creating file game.rpm
    QFile file(Wanok::pathCombine(pathDir, "game.rpm"));
    if (!file.open(QIODevice::WriteOnly | QIODevice::Text))
        return "Error while creating game.rpm file";
    QTextStream out(&file);
    out << Project::VERSION;

    // Copying a basic project content
    if (!Wanok::copyPath(Wanok::pathCombine(
                             Wanok::pathCombine("Content", "basic"), "Content"),
                         Wanok::pathCombine(pathDir, "Content")))
    {
        return "Error while copying Content directory. "
               "Please retry with a new project.";
    }

    // Copy excecutable and libraries according to current OS
    QString strOS = "";
    #ifdef Q_OS_WIN
        strOS = "win32";
    #elif __linux__
        strOS = "linux";
    #else
        return "Error your current opperating system is not supported.";
    #endif

    // Copying a basic project content
    if (!Wanok::copyPath(Wanok::pathCombine("Content", strOS), pathDir)){
        return "Error while copying excecutable and libraries. "
               "Please retry with a new project.";
    }

    // Create the default datas
    Project project;
    project.setDefault();
    project.write(pathDir);

    // Create saves
    QJsonArray tab;
    tab.append(QJsonValue());
    tab.append(QJsonValue());
    tab.append(QJsonValue());
    tab.append(QJsonValue());
    Wanok::writeArrayJSON(Wanok::pathCombine(pathDir, Wanok::pathSaves), tab);

    // Includes scripts
    project.scriptsDatas()->writeDesktop(pathDir);

    // Creating first empty map
    QDir(pathDir).mkdir(Wanok::pathMaps);
    Map::writeDefaultMap(pathDir);

    return NULL; // return NULL for no errors
}
