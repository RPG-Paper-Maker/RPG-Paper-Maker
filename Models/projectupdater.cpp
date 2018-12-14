/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#include "projectupdater.h"
#include "rpm.h"
#include "common.h"
#include <QDirIterator>

const int ProjectUpdater::incompatibleVersionsCount = 5;

QString ProjectUpdater::incompatibleVersions[incompatibleVersionsCount]
    {"0.3.1", "0.4.0", "0.4.3", "0.5.2", "0.6.0"};

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ProjectUpdater::ProjectUpdater(Project* project, QString previous) :
    m_project(project),
    m_previousFolderName(previous)
{

}

ProjectUpdater::~ProjectUpdater()
{
    clearListMapPaths();
    clearListMapPortions();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void ProjectUpdater::clearListMapPaths() {
    for (int i = 0; i < m_listMapPortionsPaths.size(); i++)
        delete m_listMapPortionsPaths.at(i);
    m_listMapPortionsPaths.clear();
}

// -------------------------------------------------------

void ProjectUpdater::clearListMapPortions() {
    for (int i = 0; i < m_listMapPortions.size(); i++)
        delete m_listMapPortions.at(i);
    m_listMapPortions.clear();
}

// -------------------------------------------------------

void ProjectUpdater::copyPreviousProject() {
    QDir dirProject(m_project->pathCurrentProject());
    dirProject.cdUp();
    QDir(dirProject.path()).mkdir(m_previousFolderName);
    Common::copyPath(m_project->pathCurrentProject(),
                    Common::pathCombine(dirProject.path(),
                                       m_previousFolderName));
}

// -------------------------------------------------------

void ProjectUpdater::getAllPathsMapsPortions()
{
    QString pathMaps = Common::pathCombine(m_project->pathCurrentProject(),
                                          RPM::pathMaps);
    QDirIterator directories(pathMaps, QDir::Dirs | QDir::NoDotAndDotDot);

    // Clear
    m_listMapPaths.clear();
    m_listMapProperties.clear();
    m_listMapPropertiesPaths.clear();
    clearListMapPaths();
    clearListMapPortions();

    // Fill
    while (directories.hasNext()) {
        directories.next();
        QString mapName = directories.fileName();
        if (mapName != "temp") {
            QString dirMap = Common::pathCombine(pathMaps, mapName);
            m_listMapPaths.append(dirMap);
            QDirIterator files(dirMap, QDir::Files);
            QList<QJsonObject>* mapPortions = new QList<QJsonObject>;
            QList<QString>* paths = new QList<QString>;
            m_listMapPortions.append(mapPortions);
            m_listMapPortionsPaths.append(paths);

            while (files.hasNext()) {
                files.next();
                QString fileName = files.fileName();
                QString path = files.filePath();
                QJsonDocument document;
                if (fileName == "infos.json") {
                    Common::readOtherJSON(path, document);
                    m_listMapProperties.append(document.object());
                    m_listMapPropertiesPaths.append(path);
                }
                else if (fileName != "objects.json") {
                    Common::readOtherJSON(path, document);
                    QJsonObject object = document.object();
                    if (!object.isEmpty()) {
                        paths->append(path);
                        mapPortions->append(object);
                    }
                }
            }
        }
    }
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion(QString& version) {
    getAllPathsMapsPortions();

    QString str = "updateVersion_" + version.replace(".", "_");
    QByteArray ba = str.toLatin1();
    const char *c_str = ba.data();
    QMetaObject::invokeMethod(this, c_str, Qt::DirectConnection);
}

// -------------------------------------------------------

void ProjectUpdater::copyExecutable() {

    // RPM file
    m_project->createRPMFile();

    // Exe
    m_project->removeOSFiles();
    m_project->copyOSFiles();
}

// -------------------------------------------------------

void ProjectUpdater::copySystemScripts() {
    QString pathContent = Common::pathCombine(QDir::currentPath(), "Content");
    QString pathBasic = Common::pathCombine(pathContent, "basic");
    QString pathScripts = Common::pathCombine(pathBasic,
                                             RPM::pathScriptsSystemDir);
    QString pathProjectScripts =
            Common::pathCombine(m_project->pathCurrentProject(),
                               RPM::pathScriptsSystemDir);
    QDir dir(pathProjectScripts);
    dir.removeRecursively();
    dir.cdUp();
    dir.mkdir("System");
    Common::copyPath(pathScripts, pathProjectScripts);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void ProjectUpdater::check() {
    emit progress(10, "Copying the previous project...");
    copyPreviousProject();
    emit progress(80, "Checking incompatible versions...");

    // Updating for incompatible versions
    int index = incompatibleVersionsCount;

    for (int i = 0; i < incompatibleVersionsCount; i++) {
        if (Common::versionDifferent(incompatibleVersions[i],
                                     m_project->version()) == 1)
        {
            index = i;
            break;
        }
    }

    // Updating for each version
    for (int i = index; i < incompatibleVersionsCount; i++) {
        emit progress(80, "Checking version " + incompatibleVersions[i] +
                      "...");
        updateVersion(incompatibleVersions[i]);
    }

    // Copy recent executable and scripts
    emit progress(95, "Copying recent executable and scripts");
    copyExecutable();
    copySystemScripts();
    emit progress(99, "Correcting the BR path");
    QThread::sleep(1);
    m_project->readLangsDatas();
    m_project->readSystemDatas();
    m_project->gameDatas()->systemDatas()->setPathBR(
                Common::pathCombine(QDir::currentPath(), RPM::pathBR));
    m_project->writeSystemDatas();
    emit progress(100, "");
    QThread::sleep(1);

    emit finished();
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_0_3_1() {

    for (int i = 0; i < m_listMapPortions.size(); i++) {
        QList<QJsonObject>* mapPortions = m_listMapPortions.at(i);
        QList<QString>* paths = m_listMapPortionsPaths.at(i);

        for (int j = 0; j < mapPortions->size(); j++) {
            QJsonObject obj = mapPortions->at(j);
            QJsonObject objSprites = obj["sprites"].toObject();
            QJsonArray tabSprites = objSprites["list"].toArray();

            for (int k = 0; k < tabSprites.size(); k++) {
                QJsonObject objSprite = tabSprites.at(k).toObject();

                // Replace Position3D by Position
                QJsonArray tabKey = objSprite["k"].toArray();
                tabKey.append(0);
                objSprite["k"] = tabKey;

                // Remove key layer from sprites objects
                QJsonObject objVal = objSprite["v"].toArray()[0].toObject();
                objVal.remove("l");
                objSprite["v"] = objVal;

                tabSprites[j] = objSprite;
            }

            objSprites["list"] = tabSprites;
            obj["sprites"] = objSprites;
            Common::writeOtherJSON(paths->at(j), obj);
        }
    }
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_0_4_0() {

    // Create walls directory
    QDir(m_project->pathCurrentProject()).mkpath(RPM::PATH_SPRITE_WALLS);

    for (int i = 0; i < m_listMapPortions.size(); i++) {
        QList<QJsonObject>* mapPortions = m_listMapPortions.at(i);
        QList<QString>* paths = m_listMapPortionsPaths.at(i);
        QJsonObject objMapProperties = m_listMapProperties.at(i);

        // Adding ofSprites field for overflow
        objMapProperties["ofsprites"] = QJsonArray();
        QString pathMapProperties = m_listMapPropertiesPaths.at(i);
        Common::writeOtherJSON(pathMapProperties, objMapProperties);

        for (int j = 0; j < mapPortions->size(); j++) {
            QJsonObject obj = mapPortions->at(j);

            // Add lands and floors inside and removing width and angle for
            // each sprite
            QJsonObject objSprites = obj["sprites"].toObject();
            objSprites["walls"] = QJsonArray();
            objSprites["overflow"] = QJsonArray();
            QJsonArray tabSprites = objSprites["list"].toArray();
            for (int k = 0; k < tabSprites.size(); k++){
                QJsonObject obj = tabSprites.at(k).toObject();
                QJsonObject objSprite = obj["v"].toObject();
                objSprite.remove("p");
                objSprite.remove("a");
                obj["v"] = objSprite;
                tabSprites[k] = obj;
            }
            objSprites["list"] = tabSprites;
            obj["sprites"] = objSprites;

            // Add lands and floors inside
            QJsonObject objFloors = obj["floors"].toObject();
            QJsonObject objLands;
            objLands["floors"] = objFloors;
            obj["lands"] = objLands;
            obj.remove("floors");

            Common::writeOtherJSON(paths->at(j), obj);
        }
    }

    // Adding a default special elements datas to the project
    SpecialElementsDatas specialElementsDatas;
    specialElementsDatas.setDefault();
    RPM::writeJSON(Common::pathCombine(
                         m_project->pathCurrentProject(),
                         RPM::PATH_SPECIAL_ELEMENTS), specialElementsDatas);

    // Adding walls into pictures.json
    m_project->readPicturesDatas();
    QList<QString> names;
    m_project->picturesDatas()->setDefaultWalls(names);
    m_project->writePicturesDatas();

    // Updating special elements (empty) in each tileset
    m_project->readTilesetsDatas();
    m_project->writeTilesetsDatas();

    // Limit portion ray
    m_project->readLangsDatas();
    m_project->readSystemDatas();
    m_project->gameDatas()->systemDatas()->setPortionRay(6);
    m_project->writeSystemDatas();
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_0_4_3() {
    // Adding default autotiles
    QList<QString> names;
    m_project->readPicturesDatas();
    m_project->picturesDatas()->setDefaultAutotiles(names);
    m_project->writePicturesDatas();
    m_project->readSpecialsDatas();
    m_project->specialElementsDatas()->setDefaultAutotiles();
    m_project->writeSpecialsDatas();
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_0_5_2() {
    // Adding default songs
    m_project->songsDatas()->setDefault();
    m_project->writeSongsDatas();;
    QDir(m_project->pathCurrentProject()).mkpath(RPM::PATH_SONGS);
    QDir(m_project->pathCurrentProject()).mkpath(RPM::PATH_MUSICS);
    QDir(m_project->pathCurrentProject()).mkpath(RPM::PATH_BACKGROUND_SOUNDS);
    QDir(m_project->pathCurrentProject()).mkpath(RPM::PATH_SOUNDS);
    QDir(m_project->pathCurrentProject()).mkpath(RPM::PATH_MUSIC_EFFECTS);
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_0_6_0() {
    // Write default battle map
    Map::writeDefaultBattleMap(m_project->pathCurrentProject());
    m_project->readLangsDatas();
    m_project->gameDatas()->readSkills(m_project->pathCurrentProject());
    m_project->gameDatas()->readBattleSystem(m_project->pathCurrentProject());
    m_project->gameDatas()->battleSystemDatas()->setDefaultBattleMaps();
    m_project->gameDatas()->writeBattleSystem(m_project->pathCurrentProject());
    m_project->readTreeMapDatas();
    m_project->treeMapDatas()->setDefault();
    m_project->writeTreeMapDatas();

    // Battlers
    QList<QString> names;
    QDir(m_project->pathCurrentProject()).mkpath(RPM::PATH_BATTLERS);
    m_project->readPicturesDatas();
    m_project->picturesDatas()->setDefaultBattlers(names);
    m_project->writePicturesDatas();
}
