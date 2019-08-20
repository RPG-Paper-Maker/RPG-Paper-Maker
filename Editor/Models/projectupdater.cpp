/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDirIterator>
#include <QThread>
#include "projectupdater.h"
#include "rpm.h"
#include "common.h"
#include "systembattlemap.h"

const int ProjectUpdater::incompatibleVersionsCount = 9;

QString ProjectUpdater::incompatibleVersions[incompatibleVersionsCount]
    {"0.3.1", "0.4.0", "0.4.3", "0.5.2", "1.0.0", "1.1.1", "1.2.0", "1.2.1",
     "1.3.0"};

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
                                          RPM::PATH_MAPS);
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
                                             RPM::PATH_SCRIPTS_SYSTEM_DIR);
    QString pathProjectScripts =
            Common::pathCombine(m_project->pathCurrentProject(),
                               RPM::PATH_SCRIPTS_SYSTEM_DIR);
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
        if (Project::versionDifferent(incompatibleVersions[i],
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
                Common::pathCombine(QDir::currentPath(), RPM::PATH_BR));
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
    Common::writeJSON(Common::pathCombine(
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

void ProjectUpdater::updateVersion_1_0_0() {
    QJsonObject obj, objRes;
    EventCommand eventCommand;
    SystemPlaySong song;
    PrimitiveValue primitiveValue;
    int i, l, mapID;

    // Write default battle map
    mapID = Map::writeDefaultBattleMap(m_project->pathCurrentProject());
    m_project->readLangsDatas();
    m_project->readSongsDatas();
    m_project->songsDatas()->setDefault();
    m_project->writeSongsDatas();
    m_project->gameDatas()->setDefaultItemsCharacters();
    m_project->gameDatas()->writeItems(m_project->pathCurrentProject());
    m_project->gameDatas()->writeSkills(m_project->pathCurrentProject());
    m_project->gameDatas()->writeWeapons(m_project->pathCurrentProject());
    m_project->gameDatas()->writeArmors(m_project->pathCurrentProject());
    m_project->gameDatas()->writeHeroes(m_project->pathCurrentProject());
    m_project->gameDatas()->writeMonsters(m_project->pathCurrentProject());
    m_project->gameDatas()->writeTroops(m_project->pathCurrentProject());
    m_project->gameDatas()->writeClasses(m_project->pathCurrentProject());
    m_project->gameDatas()->readBattleSystem(m_project->pathCurrentProject());
    m_project->gameDatas()->battleSystemDatas()->setDefaultBattleMaps();
    m_project->gameDatas()->battleSystemDatas()->setDefaultOptions();
    m_project->gameDatas()->writeBattleSystem(m_project->pathCurrentProject());
    m_project->readTreeMapDatas();
    m_project->treeMapDatas()->addDefaultBattleMap(mapID);
    m_project->writeTreeMapDatas();

    // Battlers, windowskins, titlescreen
    QList<QString> names;
    m_project->readPicturesDatas();
    m_project->picturesDatas()->setDefaultBattlers(names);
    m_project->picturesDatas()->setDefaultFacesets(names);
    m_project->picturesDatas()->setDefaultWindowSkins(names);
    m_project->picturesDatas()->setDefaultTitleScreen(names);
    m_project->picturesDatas()->setDefaultIcons(names);
    m_project->writePicturesDatas();

    // System update
    QDir(m_project->pathCurrentProject()).mkpath(RPM::PATH_BATTLERS);
    QDir(m_project->pathCurrentProject()).mkpath(RPM::PATH_FACESETS);
    QDir(m_project->pathCurrentProject()).mkpath(RPM::PATH_WINDOW_SKINS);
    QDir(m_project->pathCurrentProject()).mkpath(RPM::PATH_TITLE_SCREEN);
    m_project->readSystemDatas();
    m_project->gameDatas()->systemDatas()->setDefaultColors();
    m_project->gameDatas()->systemDatas()->setDefaultWindowSkins();
    m_project->gameDatas()->systemDatas()->setIdWindowSkin(1);
    m_project->writeSystemDatas();

    // Keyboard
    m_project->keyBoardDatas()->setDefaultGame();
    m_project->writeKeyBoardDatas();

    // Map properties songs
    for (i = 0, l = m_listMapProperties.length(); i < l; i++) {
        obj = m_listMapProperties.at(i);
        if (obj.contains("music")) {
            eventCommand.read(obj["music"].toObject());
            song.fromEventCommand(eventCommand);
        } else {
            song.setDefault();
        }
        objRes = QJsonObject();
        song.write(objRes);
        obj["music"] = objRes;
        if (obj.contains("bgs")) {
            eventCommand.read(obj["bgs"].toObject());
            song.fromEventCommand(eventCommand);
        } else {
            song.setDefault();
        }
        objRes = QJsonObject();
        song.write(objRes);
        obj["bgs"] = objRes;
        obj["isky"] = true;
        primitiveValue = PrimitiveValue(PrimitiveValueKind::DataBase, 1);
        objRes = QJsonObject();
        primitiveValue.write(objRes);
        obj["sky"] = objRes;
        Common::writeOtherJSON(m_listMapPropertiesPaths.at(i), obj);
    }

    // Animations & status
    m_project->gameDatas()->writeAnimations(m_project->pathCurrentProject());
    m_project->gameDatas()->writeStatus(m_project->pathCurrentProject());

    // TitleScreen
    m_project->gameDatas()->titleScreenGameOverDatas()->setDefault();
    m_project->gameDatas()->writeTitleScreenGameOver(m_project
        ->pathCurrentProject());
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_1_1() {
    SystemPicture *picture;

    // Tileset
    m_project->readPicturesDatas();
    picture = new SystemPicture;
    picture->setDefaultCharacterTileset();
    m_project->picturesDatas()->model(PictureKind::Characters)->insertRow(1,
        picture->getModelRow());
    m_project->writePicturesDatas();

    // Screen size
    m_project->readLangsDatas();
    m_project->readSystemDatas();
    m_project->gameDatas()->systemDatas()->setScreenWidth(640);
    m_project->gameDatas()->systemDatas()->setScreenHeight(480);
    m_project->gameDatas()->systemDatas()->setIsScreenWinow(true);
    m_project->writeSystemDatas();
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_2_0() {
    QList<QString> names;
    QDir dir(m_project->pathCurrentProject());

    // Shapes default
    m_project->readShapesDatas();
    m_project->shapesDatas()->setDefault();
    m_project->writeShapesDatas();
    dir.mkpath(RPM::PATH_SHAPES);
    dir.mkpath(RPM::PATH_OBJ);
    dir.mkpath(RPM::PATH_MTL);
    dir.mkpath(RPM::PATH_COLLISIONS);
    dir.mkpath(RPM::PATH_TEXTURES_OBJECT_3D);

    m_project->readPicturesDatas();
    m_project->picturesDatas()->setDefaultObjects3D(names);
    m_project->writePicturesDatas();

    // Objects 3D default
    m_project->readSpecialsDatas();
    m_project->specialElementsDatas()->setDefaulObjects3D();
    m_project->writeSpecialsDatas();
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_2_1() {
    QList<QString> names;
    QDir dir(m_project->pathCurrentProject());

    // Shapes default
    dir.remove(RPM::PATH_RELIEFS);
    dir.mkpath(RPM::PATH_MOUNTAINS);

    // Default Mountains
    m_project->readShapesDatas();
    m_project->readSpecialsDatas();
    m_project->specialElementsDatas()->setDefaulMountains();
    m_project->writeSpecialsDatas();
    m_project->readTilesetsDatas();
    m_project->writeTilesetsDatas();
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_3_0() {
    int i, l;

    // Update command condition
    for (i = 0; i < m_listMapPortions.size(); i++) {
        QList<QJsonObject>* mapPortions = m_listMapPortions.at(i);
        QList<QString>* paths = m_listMapPortionsPaths.at(i);

        for (int j = 0; j < mapPortions->size(); j++) {
            QJsonObject obj = mapPortions->at(j);
            QJsonObject objObject = obj[MapPortion::JSON_OBJECT].toObject();
            QJsonObject objTempObjects = objObject;
            QJsonArray tabObjects = objObject["list"].toArray();

            for (int k = 0; k < tabObjects.size(); k++) {
                QJsonArray tabEvents = tabObjects.at(k).toObject()["v"]
                    .toObject()["events"].toArray();

                for (int l = 0; l < tabEvents.size(); l++) {
                    QJsonObject objReactions = tabEvents.at(l).toObject()["r"]
                        .toObject();
                    QStringList eventKeys = objReactions.keys();
                    for (int m = 0; m < eventKeys.size(); m++) {
                        QString key = eventKeys.at(m);
                        QJsonArray tabCommands = objReactions[key]
                            .toObject()["c"].toArray();
                        QString path = "list." + QString::number(k) +
                            ".v.events." + QString::number(l) + "." + key + ".c";
                        this->updateVersion_1_3_0_command(tabCommands,
                            objTempObjects, path);
                    }
                }
            }


            obj[MapPortion::JSON_OBJECT] = objTempObjects;
            Common::writeOtherJSON(paths->at(j), obj);
        }
    }

    // Map properties invisible object
    QJsonObject objInvisible;
    SystemCommonObject invisible;
    invisible.setDefaultStartupObject();
    for (i = 0, l = m_listMapProperties.size(); i < l; i++) {
        MapProperties properties;
        objInvisible = QJsonObject();
        properties.read(m_listMapProperties.at(i));
        properties.startupObject()->setDefaultStartupObject();
        properties.write(objInvisible);
        Common::writeOtherJSON(m_listMapPropertiesPaths.at(i), objInvisible);
    }

    // Camera properties + battle map default camera properties
    m_project->readSystemDatas();
    m_project->gameDatas()->systemDatas()->setDefaultCameraProperties();
    m_project->writeSystemDatas();
    m_project->readBattleSystemDatas();
    QStandardItemModel *modelBattleMaps = m_project->gameDatas()
        ->battleSystemDatas()->modelBattleMaps();
    for (i = 0, l = modelBattleMaps->invisibleRootItem()->rowCount(); i < l; i++)
    {
        reinterpret_cast<SystemBattleMap *>(modelBattleMaps->item(i)->data()
            .value<quintptr>())->cameraPropertiesID()->setNumberValue(2);
    }
    m_project->writeBattleSystemDatas();
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_3_0_command(QJsonArray &children,
    QJsonObject &root, QString path)
{
    QJsonObject objCommand;
    QJsonArray nextchildren;
    int i, l, k;
    QString newPath;

    for (i = 0, l = children.size(); i < l; i++) {
        objCommand = children.at(i).toObject();
        nextchildren = objCommand["children"].toArray();
        newPath = path + QString::number(i);
        k = objCommand["kind"].toInt();
        if (k == static_cast<int>(EventCommandKind::If)) {
            QJsonArray newArray = objCommand["command"].toArray();
            int idVariable = newArray.at(3).toInt();
            newArray.replace(3, static_cast<int>(PrimitiveValueKind::Variable));
            newArray.insert(4, idVariable);
            Common::modifyJSONValue(root, newPath + ".command", newArray);
        } else if (k == static_cast<int>(EventCommandKind::SendEvent)) {

        }

        this->updateVersion_1_3_0_command(nextchildren, root, newPath +
            ".children");
    }
}
