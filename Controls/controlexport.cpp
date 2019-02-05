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

#include <QDirIterator>
#include "controlexport.h"
#include "rpm.h"
#include "common.h"

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

QString ControlExport::createDesktop(QString location, OSKind os, bool) {
    QString message;
    QString osMessage;

    switch(os) {
    case OSKind::Window:
        osMessage = "WINDOWS"; break;
    case OSKind::Linux:
        osMessage = "LINUX"; break;
    case OSKind::Mac:
        osMessage = "MAC"; break;
    }

    QDir dirLocation(location);
    QString projectName = QDir(m_project->pathCurrentProject()).dirName() +
        osMessage;
    QString path = Common::pathCombine(location, projectName);

    // Copying all the project
    message = copyAllProject(location, projectName, path, dirLocation);
    if (message != nullptr)
        return message;

    // Remove all the files that are no longer needed here
    removeDesktopNoNeed(path);

    return generateDesktopStuff(path, os);
}

// -------------------------------------------------------

QString ControlExport::createBrowser(QString location) {
    QString message;
    QDir dirLocation(location);
    QString projectName = QDir(m_project->pathCurrentProject()).dirName() +
        "BROWSER";
    QString path = Common::pathCombine(location, projectName);

    // Copying all the project
    message = copyAllProject(location, projectName, path, dirLocation);
    if (message != nullptr)
        return message;

    // Remove all the files that are no longer needed here
    removeWebNoNeed(path);

    return generateWebStuff(path);
}

// -------------------------------------------------------

QString ControlExport::copyAllProject(QString location, QString projectName,
    QString path, QDir dirLocation)
{
    if (!QDir::isAbsolutePath(location))
        return "The path location needs to be absolute.";
    if (!dirLocation.exists())
        return "The path location doesn't exists.";
    if (!dirLocation.mkdir(projectName))
        return "The directory " + projectName + " already exists.";

    // Copy Content
    QDir(m_project->pathCurrentProject()).mkdir("Content");
    QString pathContentProject = Common::pathCombine(m_project
        ->pathCurrentProject(), "Content");
    QString pathContent = Common::pathCombine(path, "Content");
    if (!Common::copyPath(pathContentProject, pathContent))
        return "Error while copying Content directory. Please retry.";

    return nullptr;
}

// -------------------------------------------------------

void ControlExport::removeWebNoNeed(QString path) {

    // Remove useless datas
    QString pathDatas = Common::pathCombine(path, RPM::pathDatas);
    QFile(Common::pathCombine(pathDatas, "treeMap.json")).remove();
    QFile(Common::pathCombine(pathDatas, "scripts.json")).remove();
    QString pathScripts = Common::pathCombine(path, RPM::pathScriptsSystemDir);
    QDir(Common::pathCombine(pathScripts, "desktop")).removeRecursively();
    removeMapsTemp(pathDatas);
}

// -------------------------------------------------------

void ControlExport::removeDesktopNoNeed(QString path) {

    // Remove useless datas
    QString pathDatas = Common::pathCombine(path, RPM::pathDatas);
    QFile(Common::pathCombine(pathDatas, "treeMap.json")).remove();
    QFile(Common::pathCombine(pathDatas, "scripts.json")).remove();
    QFile(Common::pathCombine(pathDatas, "pictures.json")).remove();
    removeMapsTemp(pathDatas);
}

// -------------------------------------------------------

QString ControlExport::generateWebStuff(QString path) {
    QString pathWeb = Common::pathCombine("Content", "web");

    // Write index.php
    QFile::copy(Common::pathCombine(pathWeb, "index.php"), Common::pathCombine(
        path, "index.php"));

    // Write include.html
    m_project->scriptsDatas()->writeBrowser(path);

    // Write three.js library and other .js files to include
    QDir dir(path);
    if (!dir.mkdir("js"))
        return "The directory js already exists.";
    QString pathJS = Common::pathCombine(path, "js");
    QFile::copy(Common::pathCombine(pathWeb, "three.js"), Common::pathCombine(
        pathJS, "three.js"));
    QFile::copy(Common::pathCombine(pathWeb, "index.js"), Common::pathCombine(
        pathJS, "index.js"));
    QFile::copy(Common::pathCombine(pathWeb, "utilities.js"),
        Common::pathCombine(pathJS, "utilities.js"));

    // Pictures
    copyBRPictures(path);

    return nullptr;
}

// -------------------------------------------------------

QString ControlExport::generateDesktopStuff(QString path, OSKind os) {

    // Copy excecutable folder
    QString executableFolder;

    switch(os) {
    case OSKind::Window:
        executableFolder = "win32";
        break;
    case OSKind::Linux:
        executableFolder = "linux";
        break;
    case OSKind::Mac:
        executableFolder = "mac";
        break;
    }
    QString pathExecutable = Common::pathCombine("Content", executableFolder);

    if (!Common::copyPath(pathExecutable, path))
        return "Could not copy in " + pathExecutable;

    // Pictures
    copyBRPictures(path);

    return nullptr;
}

// -------------------------------------------------------

void ControlExport::removeMapsTemp(QString pathDatas) {
    QString pathMaps = Common::pathCombine(pathDatas, "Maps");

    QDirIterator directories(pathMaps, QDir::Dirs | QDir::NoDotAndDotDot);

    while (directories.hasNext()) {
        directories.next();
        QDir(Common::pathCombine(Common::pathCombine(pathMaps, directories
            .fileName()), "temp")).removeRecursively();
    }
}

// -------------------------------------------------------

void ControlExport::copyBRPictures(QString path) {
    PictureKind kind;
    QStandardItemModel *model, *newModel;
    SystemPicture *picture, *newPicture;
    PicturesDatas newPicturesDatas;

    // Iterate all the pictures kind
    for (int k = static_cast<int>(PictureKind::Bars); k != static_cast<int>(
         PictureKind::Last); k++)
    {
       kind = static_cast<PictureKind>(k);
       model = m_project->picturesDatas()->model(kind);
       newModel = new QStandardItemModel;
       newPicturesDatas.setModel(kind, newModel);
       for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++) {
           picture = reinterpret_cast<SystemPicture *>(model->item(i)->data()
               .value<qintptr>());
           newPicture = new SystemPicture;
           newPicture->setCopy(*picture);
           newPicture->setId(picture->id());

           // If the picture is from BR, we need to copy it in the project
           if (picture->isBR()) {
                QString pathBR = picture->getPath(kind);
                QString pathProject = Common::pathCombine(path, picture
                    ->getLocalPath(kind));
                if (QFile(pathProject).exists()) {
                    QFileInfo fileInfo(picture->name());
                    QString extension = fileInfo.completeSuffix();
                    QString baseName = fileInfo.baseName();
                    newPicture->setName(baseName + "_br" + extension);
                    pathProject = Common::pathCombine(path, newPicture
                        ->getLocalPath(kind));
                }
                QFile::copy(pathBR, pathProject);
                newPicture->setIsBR(false);
           }
           newPicturesDatas.model(kind)->appendRow(newPicture->getModelRow());
       }
    }

    // Copy the new picutres datas without BR
    QString pathDatas = Common::pathCombine(path, RPM::pathDatas);
    RPM::writeJSON(Common::pathCombine(pathDatas, "pictures.json"),
        newPicturesDatas);
}
