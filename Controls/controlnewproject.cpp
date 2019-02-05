/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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
#include "rpm.h"
#include "map.h"
#include "gamedatas.h"
#include "common.h"

// All the forbidden symbols in a folder name
QChar ControlNewproject::forbiddenSymbols[10]{'/', '\\', ':', '?', '*', '|',
    '<', '>', '"', '.'};

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ControlNewproject::ControlNewproject() {

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString ControlNewproject::filterDirectoryName(const QString &s) {

    //  check if the given string contains forbidden symbols
    QString directory = "";

    // Setting entered value for directory name and escaping forbidden symbols
    for (int i = 0; i < s.size(); i++) {
        if (std::find(std::begin(forbiddenSymbols), std::end(forbiddenSymbols),
            s[i]) == std::end(forbiddenSymbols))
        {
            directory += (s[i] == ' ') ? '-' : s[i]; // Don't accept spaces
        }
    }

    return directory;
}

// -------------------------------------------------------

QString ControlNewproject::createNewProject(QString dirName, QString location) {

    //  main function generating project folder. Returns a string if errors.
    QDir pathLocation(location);
    QString pathDir(Common::pathCombine(location, dirName));

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

    // Copying a basic project content
    QString pathContent = Common::pathCombine(QDir::currentPath(), "Content");
    QString pathBasicContent = Common::pathCombine( Common::pathCombine(
        pathContent, "basic"), "Content");
    if (!Common::copyPath(pathBasicContent, Common::pathCombine(pathDir,
        "Content")))
    {
        return "Error while copying Content directory. Please verify if " +
            pathBasicContent + " folder exists.";
    }

    // Create folders
    QDir(pathDir).mkpath(RPM::pathBars);
    QDir(pathDir).mkpath(RPM::pathIcons);
    QDir(pathDir).mkpath(RPM::PATH_FACESETS);
    QDir(pathDir).mkpath(RPM::PATH_WINDOW_SKINS);
    QDir(pathDir).mkpath(RPM::pathAutotiles);
    QDir(pathDir).mkpath(RPM::pathCharacters);
    QDir(pathDir).mkpath(RPM::pathReliefs);
    QDir(pathDir).mkpath(RPM::pathTilesets);
    QDir(pathDir).mkpath(RPM::PATH_SPRITE_WALLS);
    QDir(pathDir).mkpath(RPM::PATH_BATTLERS);
    QDir(pathDir).mkpath(RPM::PATH_SONGS);
    QDir(pathDir).mkpath(RPM::PATH_MUSICS);
    QDir(pathDir).mkpath(RPM::PATH_BACKGROUND_SOUNDS);
    QDir(pathDir).mkpath(RPM::PATH_SOUNDS);
    QDir(pathDir).mkpath(RPM::PATH_MUSIC_EFFECTS);

    // Create the default datas
    Project *previousProject = RPM::get()->project();
    Project *project = new Project;
    RPM::get()->setProject(project);
    project->setDefault();
    project->write(pathDir);
    QString error = project->createRPMFile();
    if (error != nullptr)
        return error;

    // Copying a basic project content
    if (!project->copyOSFiles()) {
        return "Error while copying excecutable and libraries. "
            "Please retry with a new project.";
    }

    // Create saves
    QJsonArray tab;
    tab.append(QJsonValue());
    tab.append(QJsonValue());
    tab.append(QJsonValue());
    tab.append(QJsonValue());
    Common::writeArrayJSON(Common::pathCombine(pathDir, RPM::pathSaves), tab);

    // Creating first empty map
    QDir(pathDir).mkdir(RPM::pathMaps);
    QDir(pathDir).mkdir(Common::pathCombine(RPM::pathMaps,
        RPM::TEMP_MAP_FOLDER_NAME));
    Map::writeDefaultMap(pathDir);
    Map::writeDefaultBattleMap(pathDir);

    // Restoring project
    RPM::get()->setProject(previousProject);
    delete project;

    return nullptr; // return NULL for no errors
}
