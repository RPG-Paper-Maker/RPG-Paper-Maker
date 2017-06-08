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

#include "controlexport.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ControlExport::ControlExport(Project *project) :
    m_project(project)
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString ControlExport::createDesktop(QString , OSKind , bool){
    return NULL;
}

// -------------------------------------------------------

QString ControlExport::createBrowser(QString location){
    QString message;
    QDir dirLocation(location);
    QString projectName = QDir(m_project->pathCurrentProject()).dirName() +
                          "BROWSER";
    QString path = Wanok::pathCombine(location, projectName);

    // Copying all the project
    message = copyAllProject(location, projectName, path, dirLocation);
    if (message != NULL)
        return message;

    // Remove all the files that are no longer needed here
    removeWebNoNeed(path);

    return generateWebStuff(path);
}

// -------------------------------------------------------

QString ControlExport::copyAllProject(QString location, QString projectName,
                                      QString path, QDir dirLocation){
    if (!QDir::isAbsolutePath(location))
        return "The path location needs to be absolute.";
    if (!dirLocation.exists())
        return "The path location doesn't exists.";
    if (!dirLocation.mkdir(projectName))
        return "The directory " + projectName + " already exists.";
    if (!Wanok::copyPath(m_project->pathCurrentProject(), path))
        return "Error while copying Content directory. Please retry.";

    return NULL;
}

// -------------------------------------------------------

void ControlExport::removeWebNoNeed(QString path){

    // Remove executable
    QFile(Wanok::pathCombine(path, "Game")).remove();
    QFile(Wanok::pathCombine(path, "Game.exe")).remove();
    QFile(Wanok::pathCombine(path, "game.rpm")).remove();

    // Remove useless datas
    QString pathDatas = Wanok::pathCombine(path,
                                           Wanok::pathCombine("Content",
                                                              "Datas"));
    QFile(Wanok::pathCombine(pathDatas, "treeMap.json")).remove();
    QString pathScripts = Wanok::pathCombine(pathDatas, "Scripts");
    QDir(Wanok::pathCombine(pathScripts, "desktop")).removeRecursively();
}

// -------------------------------------------------------

QString ControlExport::generateWebStuff(QString path){
    QString pathWeb = Wanok::pathCombine("Content", "web");

    // Write index.php
    QFile::copy(Wanok::pathCombine(pathWeb, "index.php"),
                Wanok::pathCombine(path, "index.php"));

    // Write include.html
    m_project->scriptsDatas()->writeBrowser(path);

    // Write three.js library
    QDir dir(path);
    if (!dir.mkdir("js"))
        return "The directory js already exists.";
    QString pathJS = Wanok::pathCombine(path, "js");
    QFile::copy(Wanok::pathCombine(pathWeb, "three.js"),
                Wanok::pathCombine(pathJS, "three.js"));

    return NULL;
}
