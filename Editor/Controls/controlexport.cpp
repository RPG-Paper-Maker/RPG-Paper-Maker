/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDirIterator>
#include <QMessageBox>
#include <QMimeDatabase>
#include <QFileInfo>
#include "systemplugin.h"
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

QString ControlExport::createDesktop(QString location, OSKind os, bool, int
    major, int minor)
{
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
    QString projectName = QDir(m_project->pathCurrentProject()).dirName() + "-" +
        osMessage + "-v" + QString::number(major) + "." + QString::number(minor);
    QString path = Common::pathCombine(location, projectName);

    // Create the folder
    message = createFolder(location, projectName, path, dirLocation);
    if (message != nullptr || message == "-")
    {
        return message;
    }
    // Copy dependencies
    message = generateDesktopStuff(path, os, major, minor);
    if (message != nullptr)
    {
        return message;
    }

    // Copy Content folder and extra files
    message = copyAllProject(path);
    if (message != nullptr)
    {
        return message;
    }

    // Remove all the files that are no longer needed here
    removeDesktopNoNeed(path);

    // Convert JSON files
    message = this->protectJSON(path);
    if (message != nullptr)
    {
        return message;
    }

    return nullptr;
}

// -------------------------------------------------------

QString ControlExport::createBrowser(QString location) {
    QString message;
    QDir dirLocation(location);
    QString projectName = QDir(m_project->pathCurrentProject()).dirName() +
        "BROWSER";
    QString path = Common::pathCombine(location, projectName);

    // Copying all the project
    message = copyAllProject(path);
    if (message != nullptr)
        return message;

    // Remove all the files that are no longer needed here
    removeWebNoNeed(path);

    return generateWebStuff(path);
}

// -------------------------------------------------------

QString ControlExport::createFolder(QString location, QString projectName,
    QString path, QDir dirLocation)
{
    if (!QDir::isAbsolutePath(location)) {
        return RPM::translate(Translations::PATH_LOCATION_NEEDS_ABSOLUTE) + RPM
            ::DOT;
    }
    if (!dirLocation.exists())
        return RPM::translate(Translations::PATH_LOCATION_DOESNT_EXISTS) + RPM
                ::DOT;
    if (!dirLocation.mkdir(projectName)) {
        QMessageBox::StandardButton box = QMessageBox::question(nullptr,
            RPM::translate(Translations::EXISTING_FOLDER), RPM::translate(
            Translations::THE_DIRECTORY) + RPM::SPACE + projectName + RPM::SPACE
            + RPM::translate(Translations::ALREADY_EXISTS) + RPM::DOT + RPM
            ::NEW_LINE + RPM::translate(Translations
            ::QUESTION_OVERWRITE_EXISTING_FOLDER),
            QMessageBox::Yes | QMessageBox::No);
        if (box == QMessageBox::Yes) {
            QDir(path).removeRecursively();
            dirLocation.mkdir(projectName);
        } else {
            return "-";
        }
    }

    return nullptr;
}

// -------------------------------------------------------

QString ControlExport::copyAllProject(QString path)
{
    // Copy Content
    QDir(m_project->pathCurrentProjectApp()).mkdir(RPM::FOLDER_CONTENT);
    QString pathContentProject = Common::pathCombine(m_project
        ->pathCurrentProjectApp(), RPM::FOLDER_CONTENT);
    QString pathContent = Common::pathCombine(Common::pathCombine(path, RPM
        ::PATH_APP), RPM::FOLDER_CONTENT);
    if (!Common::copyPath(pathContentProject, pathContent)) {
        return RPM::translate(Translations::ERROR_COPYING_CONTENT_DIRECTORY) +
            RPM::DOT + RPM::SPACE + RPM::translate(Translations::PLEASE_RETRY) +
            RPM::DOT;
    }

    // Copy extra files for desktop
    if (!QFile::copy(Common::pathCombine(m_project->pathCurrentProjectApp(), RPM
        ::FILE_MAIN), Common::pathCombine(path, RPM::PATH_MAIN)) || !QFile::copy
        (Common::pathCombine(m_project->pathCurrentProjectApp(), RPM::FILE_INDEX
        ), Common::pathCombine(path, RPM::PATH_INDEX)) || !QFile::copy(Common
        ::pathCombine(m_project->pathCurrentProjectApp(), RPM::FILE_PACKAGE),
        Common::pathCombine(path, RPM::PATH_PACKAGE)))
    {
        return "-";
    }

    return nullptr;
}

// -------------------------------------------------------

QString ControlExport::protectJSON(QString path)
{
    // Datas files
    QString pathDatas = Common::pathCombine(Common::pathCombine(path, RPM
        ::PATH_APP), RPM::PATH_DATAS);
    QDir dirDatas(pathDatas);
    QString currentPath;
    foreach (QFileInfo ifo, dirDatas.entryInfoList(QDir::Files))
    {
        QByteArray saveDatas;
        currentPath = ifo.absoluteFilePath();
        QFile loadFile(currentPath);
        loadFile.open(QIODevice::ReadOnly);
        saveDatas = loadFile.readAll();
        loadFile.close();
        Common::write(currentPath, QString(saveDatas.toBase64()));
    }

    // Maps files
    QString pathMaps = Common::pathCombine(Common::pathCombine(path, RPM
        ::PATH_APP), RPM::PATH_MAPS);
    QDir dirMaps(pathMaps);
    foreach (QFileInfo id, dirMaps.entryInfoList(QDir::Dirs | QDir::NoDotAndDotDot))
    {
        QDir dirMap(id.filePath());
        foreach (QFileInfo ifom, dirMap.entryInfoList(QDir::Files))
        {
            QByteArray saveDatas;
            currentPath = ifom.absoluteFilePath();
            QFile loadFile(currentPath);
            loadFile.open(QIODevice::ReadOnly);
            saveDatas = loadFile.readAll();
            loadFile.close();
            Common::write(currentPath, QString(saveDatas.toBase64()));
        }
    }

    // Plugins files
    QDir dirPlugins(Common::pathCombine(Common::pathCombine(path, RPM::PATH_APP),
        RPM::PATH_SCRIPTS_PLUGINS_DIR));
    foreach (QFileInfo id, dirPlugins.entryInfoList(QDir::Dirs | QDir::NoDotAndDotDot))
    {
        QByteArray saveDatas;
        currentPath = Common::pathCombine(id.filePath(), SystemPlugin::NAME_JSON);
        QFile loadFile(currentPath);
        loadFile.open(QIODevice::ReadOnly);
        saveDatas = loadFile.readAll();
        loadFile.close();
        Common::write(currentPath, QString(saveDatas.toBase64()));
    }


    return nullptr;
}

// -------------------------------------------------------

void ControlExport::removeWebNoNeed(QString path) {

    // Remove useless datas
    QString pathDatas = Common::pathCombine(Common::pathCombine(path, RPM
        ::PATH_APP), RPM::PATH_DATAS);
    QFile(Common::pathCombine(pathDatas, "treeMap.json")).remove();
    QString pathScripts = Common::pathCombine(Common::pathCombine(path, RPM
        ::PATH_APP), RPM::PATH_SCRIPTS_SYSTEM_DIR);
    removeMapsTemp(pathDatas);
}

// -------------------------------------------------------

void ControlExport::removeDesktopNoNeed(QString path) {

    // Remove useless datas
    QString pathDatas = Common::pathCombine(Common::pathCombine(path, RPM
        ::PATH_APP), RPM::PATH_DATAS);
    QString pathContent = Common::pathCombine(Common::pathCombine(path, RPM
        ::PATH_APP), RPM::FOLDER_CONTENT);
    QFile(Common::pathCombine(pathDatas, "treeMap.json")).remove();
    QFile(Common::pathCombine(pathDatas, "pictures.json")).remove();
    QFile(Common::pathCombine(pathDatas, "shapes.json")).remove();
    QFile(Common::pathCombine(pathDatas, "songs.json")).remove();
    QFile(Common::pathCombine(pathDatas, "videos.json")).remove();
    this->copyBRDLC(Common::pathCombine(path, RPM::PATH_APP));
    QDir(Common::pathCombine(pathContent, "Images")).removeRecursively();
    QDir(Common::pathCombine(pathContent, "Shapes")).removeRecursively();
    QDir(Common::pathCombine(pathContent, "Songs")).removeRecursively();

    // Saves
    QDir dir(Common::pathCombine(Common::pathCombine(path, RPM::PATH_APP), RPM
        ::PATH_SAVES));
    foreach (QFileInfo ifo, dir.entryInfoList(QDir::Files))
    {
        QFile(ifo.filePath()).remove();
    }

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
    copyBRDLC(path);

    return nullptr;
}

// -------------------------------------------------------

QString ControlExport::generateDesktopStuff(QString path, OSKind os, int major,
    int minor)
{
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
        executableFolder = "osx";
        break;
    }
    QString pathExecutable = Common::pathCombine("Content", executableFolder);

    if (!Common::copyPath(pathExecutable, path))
        return RPM::translate(Translations::COULD_NOT_COPY_IN) + RPM::SPACE +
            pathExecutable;

    // Save last version
    RPM::get()->project()->gameDatas()->systemDatas()->setLastMajorVersion(major);
    RPM::get()->project()->gameDatas()->systemDatas()->setLastMinorVersion(minor);
    RPM::get()->project()->writeSystemDatas();

    return nullptr;
}

// -------------------------------------------------------

void ControlExport::removeMapsTemp(QString pathDatas) {
    QString pathMaps = Common::pathCombine(pathDatas, "Maps");

    QDirIterator directories(pathMaps, QDir::Dirs | QDir::NoDotAndDotDot);

    while (directories.hasNext()) {
        directories.next();
        if (directories.fileName() == "temp")
        {
            QDir(directories.filePath()).removeRecursively();
        } else
        {
            QDir(Common::pathCombine(Common::pathCombine(pathMaps, directories
                .fileName()), "temp")).removeRecursively();
            QDir(Common::pathCombine(Common::pathCombine(pathMaps, directories
                .fileName()), "tempUndoRedo")).removeRecursively();
        }
    }
}

// -------------------------------------------------------

void ControlExport::copyBRDLC(QString path) {
    this->copyBRDLCKind(path, 0, static_cast<int>(PictureKind::Bars),
        static_cast<int>(PictureKind::Last));
    this->copyBRDLCKind(path, 1, static_cast<int>(SongKind::Music),
        static_cast<int>(SongKind::Last));
    this->copyBRDLCKind(path, 2, static_cast<int>(CustomShapeKind::OBJ),
        static_cast<int>(CustomShapeKind::Last));
    this->copyBRDLCKind(path, 3, 0, 1);
}

// -------------------------------------------------------

void ControlExport::copyBRDLCKind(QString path, int kind, int start, int end)
{
    QStandardItemModel *model, *newModel;
    SystemResource *resource, *newResource;
    PicturesDatas *newPicturesDatas = new PicturesDatas;
    SongsDatas *newSongsDatas = new SongsDatas;
    ShapesDatas *newShapesDatas = new ShapesDatas;
    VideosDatas *newVideosDatas = new VideosDatas;
    QString type;
    QMimeDatabase db;
    QString pathResource;
    // Iterate all the pictures kind
    for (int k = start; k != end; k++)
    {
        newModel = new QStandardItemModel;
        switch (kind)
        {
        case 0:
            model = m_project->picturesDatas()->model(static_cast<PictureKind>(k));
            newPicturesDatas->setModel(static_cast<PictureKind>(k), newModel);
            break;
        case 1:
            model = m_project->songsDatas()->model(static_cast<SongKind>(k));
            newSongsDatas->setModel(static_cast<SongKind>(k), newModel);
            break;
        case 2:
            model = m_project->shapesDatas()->model(static_cast<CustomShapeKind>
                (k));
            newShapesDatas->setModel(static_cast<CustomShapeKind>(k), newModel);
            break;
        case 3:
            model = m_project->videosDatas()->model();
            newVideosDatas->setModel(newModel);
            break;
        default:
            model = newModel;
            break;
        }
        for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++)
        {
            resource = reinterpret_cast<SystemResource *>(model->item(i)->data()
                .value<qintptr>());
            newResource = reinterpret_cast<SystemResource *>(resource
                ->createCopy());
            newResource->setId(resource->id());

            // If is from BR or DLC, we need to copy it in the project
            if (kind == 3)
            {
                if ((resource->isBR() || !resource->dlc().isEmpty()))
                {
                    QString pathBR = resource->getPath();
                    QString pathProject = Common::pathCombine(path, resource
                        ->getLocalPath());
                    if (QFile(pathProject).exists())
                    {
                        QFileInfo fileInfo(resource->name());
                        QString extension = fileInfo.completeSuffix();
                        QString baseName = fileInfo.baseName();
                        newResource->setName(baseName + (resource->isBR() ? "_br" :
                            "_dlc_" + resource->dlc()) + RPM::DOT + extension);
                            pathProject = Common::pathCombine(path, newResource
                            ->getLocalPath());
                    }
                    QFile::copy(pathBR, pathProject);
                    newResource->setIsBR(false);
                    newResource->setDlc("");
                }
            } else {
                QByteArray saveDatas;
                pathResource = resource->getPath();
                if (!pathResource.isEmpty())
                {
                    QFile loadFile(resource->getPath());
                    loadFile.open(QIODevice::ReadOnly);
                    saveDatas = loadFile.readAll();
                    loadFile.close();
                }
                newResource->setBase64((kind == 2 || resource->id() == -1 ? "" :
                    "data:" + db.mimeTypeForFile(resource->getPath()).name() +
                    ";base64,") + QString(saveDatas.toBase64()));
            }
            newModel->appendRow(newResource->getModelRow());
        }
    }

    // Copy the new resources datas without BR and DLC
    QString pathDatas = Common::pathCombine(path, RPM::PATH_DATAS);
    switch (kind)
    {
    case 0:
        RPM::writeJSON(Common::pathCombine(pathDatas, "pictures.json"),
            *newPicturesDatas);
        break;
    case 1:
        RPM::writeJSON(Common::pathCombine(pathDatas, "songs.json"),
            *newSongsDatas);
        break;
    case 2:
        RPM::writeJSON(Common::pathCombine(pathDatas, "shapes.json"),
            *newShapesDatas);
        break;
    case 3:
        RPM::writeJSON(Common::pathCombine(pathDatas, "videos.json"),
            *newVideosDatas);
        break;
    }
    delete newPicturesDatas;
    delete newSongsDatas;
    delete newShapesDatas;
    delete newVideosDatas;
}
