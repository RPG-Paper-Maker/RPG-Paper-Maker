/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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

QString ControlNewproject::filterDirectoryName(const QString &s, bool space)
{
    //  check if the given string contains forbidden symbols
    QString directory = "";

    // Setting entered value for directory name and escaping forbidden symbols
    for (int i = 0; i < s.size(); i++) {
        if (std::find(std::begin(forbiddenSymbols), std::end(forbiddenSymbols),
            s[i]) == std::end(forbiddenSymbols))
        {
            directory += (!space && s[i] == ' ') ? '-' : s[i]; // Don't accept spaces
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
        return RPM::translate(Translations::DIRECTORY_NAME_CANT_EMPTY) + RPM
            ::DOT;
    if (!QDir::isAbsolutePath(location))
        return RPM::translate(Translations::THE_PATH_LOCATION) + RPM::SPACE +
            location + RPM::SPACE + RPM::translate(Translations
            ::NEEDS_TO_BE_ABSOLUTE) + RPM::DOT;
    if (!pathLocation.exists())
        return RPM::translate(Translations::THE_PATH_LOCATION) + RPM::SPACE +
            location + RPM::SPACE + RPM::translate(Translations::DOESNT_EXISTS)
            + RPM::DOT;
    if (!pathLocation.mkdir(dirName)) {
        return RPM::translate(Translations::THE_DIRECTORY) + RPM::SPACE +
            dirName + RPM::SPACE + RPM::translate(Translations
            ::ALREADY_EXISTS_IN) + RPM::SPACE + location + RPM::DOT;
    }

    // If all is ok, then let's fill the project folder

    // Copying a basic project content
    QString pathContent = Common::pathCombine(QDir::currentPath(), RPM
        ::FOLDER_CONTENT);
    QString pathBasicContent = Common::pathCombine(Common::pathCombine(
        pathContent, "basic"), RPM::FOLDER_CONTENT);
    QString pathApp = Common::pathCombine(pathDir, RPM::PATH_APP);
    Project *previousProject = RPM::get()->project();
    Project *project = new Project();
    RPM::get()->setProject(project);
    project->setPathCurrentProject(pathDir);

    // Copying a basic project content
    if (!project->copyOSFiles()) {
        return RPM::translate(Translations::ERROR_COPYING_EXECUTABLE_LIBRARIES)
            + RPM::DOT + RPM::SPACE + RPM::translate(Translations
            ::PLEASE_RETRY_WITH_NEW_PROJECT);
    }
    if (!Common::copyPath(pathBasicContent, Common::pathCombine(pathApp,
        RPM::FOLDER_CONTENT)))
    {
        return RPM::translate(Translations::ERROR_COPYING_CONTENT_DIRECTORY) +
            RPM::DOT + RPM::SPACE + RPM::translate(Translations
            ::PLEASE_VERIFY_IF) + RPM::SPACE + pathBasicContent + RPM::SPACE +
            RPM::translate(Translations::FOLDER_EXISTS);
    }

    // Create folders
    dir = QDir(pathApp);
    dir.mkpath(RPM::PATH_BARS);
    dir.mkpath(RPM::PATH_ICONS);
    dir.mkpath(RPM::PATH_FACESETS);
    dir.mkpath(RPM::PATH_WINDOW_SKINS);
    dir.mkpath(RPM::PATH_TITLE_SCREEN);
    dir.mkpath(RPM::PATH_HUD_ANIMATIONS);
    dir.mkpath(RPM::PATH_HUD_PICTURES);
    dir.mkpath(RPM::PATH_AUTOTILES);
    dir.mkpath(RPM::PATH_CHARACTERS);
    dir.mkpath(RPM::PATH_MOUNTAINS);
    dir.mkpath(RPM::PATH_TILESETS);
    dir.mkpath(RPM::PATH_SPRITE_WALLS);
    dir.mkpath(RPM::PATH_BATTLERS);
    dir.mkpath(RPM::PATH_TEXTURES_OBJECT_3D);
    dir.mkpath(RPM::PATH_SKY_BOXES);
    dir.mkpath(RPM::PATH_VIDEOS);
    dir.mkpath(RPM::PATH_SONGS);
    dir.mkpath(RPM::PATH_MUSICS);
    dir.mkpath(RPM::PATH_BACKGROUND_SOUNDS);
    dir.mkpath(RPM::PATH_SOUNDS);
    dir.mkpath(RPM::PATH_MUSIC_EFFECTS);
    dir.mkpath(RPM::PATH_SHAPES);
    dir.mkpath(RPM::PATH_FONTS);
    dir.mkpath(RPM::PATH_STYLES);
    dir.mkpath(RPM::PATH_OBJ);
    dir.mkpath(RPM::PATH_MTL);
    dir.mkpath(RPM::PATH_COLLISIONS);
    dir.mkpath(RPM::PATH_HUD_PICTURES);
    dir.mkpath(RPM::PATH_SAVES);

    // Create the default datas
    project->setDefault();
    project->readCommonEvents();
    project->gameDatas()->systemDatas()->projectName()->setAllNames(projectName);
    project->write(pathDir);
    QString error = project->createRPMFile();
    if (error != nullptr)
    {
        return error;
    }

    // Creating first empty map
    dir.mkdir(RPM::PATH_MAPS);
    dir.mkdir(Common::pathCombine(RPM::PATH_MAPS, RPM::FOLDER_TEMP));
    Map::writeDefaultMap(pathApp);
    Map::writeDefaultBattleMap(pathApp);

    // Restoring project
    RPM::get()->setProject(previousProject);
    delete project;

    return nullptr; // return NULL for no errors
}
