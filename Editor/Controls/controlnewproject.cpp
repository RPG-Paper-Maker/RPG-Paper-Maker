/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

QString ControlNewproject::createNewProject(QString projectName, QString dirName,
    QString location)
{
    //  main function generating project folder. Returns a string if errors.
    QDir pathLocation(location);
    QString pathDir(Common::pathCombine(location, dirName));
    QDir dir(pathDir);

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
    dir.mkpath(RPM::PATH_BARS);
    dir.mkpath(RPM::PATH_ICONS);
    dir.mkpath(RPM::PATH_FACESETS);
    dir.mkpath(RPM::PATH_WINDOW_SKINS);
    dir.mkpath(RPM::PATH_TITLE_SCREEN);
    dir.mkpath(RPM::PATH_AUTOTILES);
    dir.mkpath(RPM::PATH_CHARACTERS);
    dir.mkpath(RPM::PATH_MOUNTAINS);
    dir.mkpath(RPM::PATH_TILESETS);
    dir.mkpath(RPM::PATH_SPRITE_WALLS);
    dir.mkpath(RPM::PATH_BATTLERS);
    dir.mkpath(RPM::PATH_TEXTURES_OBJECT_3D);
    dir.mkpath(RPM::PATH_VIDEOS);
    dir.mkpath(RPM::PATH_SONGS);
    dir.mkpath(RPM::PATH_MUSICS);
    dir.mkpath(RPM::PATH_BACKGROUND_SOUNDS);
    dir.mkpath(RPM::PATH_SOUNDS);
    dir.mkpath(RPM::PATH_MUSIC_EFFECTS);
    dir.mkpath(RPM::PATH_SHAPES);
    dir.mkpath(RPM::PATH_OBJ);
    dir.mkpath(RPM::PATH_MTL);
    dir.mkpath(RPM::PATH_COLLISIONS);

    // Create the default datas
    Project *previousProject = RPM::get()->project();
    Project *project = new Project();
    RPM::get()->setProject(project);
    project->setDefault();
    project->gameDatas()->systemDatas()->projectName()->setAllNames(projectName);
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
    Common::writeArrayJSON(Common::pathCombine(pathDir, RPM::PATH_SAVES), tab);

    // Creating first empty map
    dir.mkdir(RPM::PATH_MAPS);
    dir.mkdir(Common::pathCombine(RPM::PATH_MAPS,
        RPM::FOLDER_TEMP_MAP));
    Map::writeDefaultMap(pathDir);
    Map::writeDefaultBattleMap(pathDir);

    // Restoring project
    RPM::get()->setProject(previousProject);
    delete project;

    return nullptr; // return NULL for no errors
}
