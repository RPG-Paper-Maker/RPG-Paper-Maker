/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

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
#include "systemtitlecommand.h"
#include "titlesettingkind.h"
#include "systemcommonreaction.h"
#include "systemcommonskillitem.h"
#include "systemevent.h"
#include "systemitem.h"
#include "systemskill.h"
#include "commandmovekind.h"

const int ProjectUpdater::incompatibleVersionsCount = 29;

QString ProjectUpdater::incompatibleVersions[incompatibleVersionsCount]
    {"0.3.1", "0.4.0", "0.4.3", "0.5.2", "1.0.0", "1.1.1", "1.2.0", "1.2.1",
     "1.3.0", "1.4.0", "1.4.1", "1.5.0", "1.5.3", "1.5.6", "1.6.0", "1.6.2",
    "1.6.3", "1.6.4", "1.7.0", "1.7.3", "1.8.0", "1.8.3", "1.9.0", "1.9.1",
    "1.9.2", "1.9.3", "1.10.0", "1.10.1", "2.0.0"};

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
    QString pathMaps = Common::pathCombine(m_project->pathCurrentProjectApp(),
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
    QString pathProjectScripts = Common::pathCombine(m_project
        ->pathCurrentProjectApp(), RPM::PATH_SCRIPTS_SYSTEM_DIR);
    QDir dir(pathProjectScripts);
    dir.removeRecursively();
    dir.cdUp();
    dir.mkdir("System");
    Common::copyPath(Common::pathCombine(pathBasic, RPM::PATH_SCRIPTS_SYSTEM_DIR),
        pathProjectScripts);
    QString pathProjectShaders = Common::pathCombine(m_project
        ->pathCurrentProjectApp(), RPM::PATH_SCRIPTS_SHADERS_DIR);
    dir = QDir(pathProjectShaders);
    dir.removeRecursively();
    dir.cdUp();
    dir.mkdir("Shaders");
    Common::copyPath(Common::pathCombine(pathBasic, RPM::PATH_SCRIPTS_SHADERS_DIR),
        pathProjectShaders);
    QString pathProjectLibs = Common::pathCombine(m_project
        ->pathCurrentProjectApp(), RPM::PATH_SCRIPTS_LIBS_DIR);
    dir = QDir(pathProjectLibs);
    dir.removeRecursively();
    dir.cdUp();
    dir.mkdir("Libs");
    Common::copyPath(Common::pathCombine(pathBasic, RPM::PATH_SCRIPTS_LIBS_DIR),
        pathProjectLibs);
}

// -------------------------------------------------------

void ProjectUpdater::updateCommands() {
    QList<QJsonObject> *mapPortions;
    QList<QString> *paths;
    QList<QStandardItem *> list;
    QStandardItemModel *model;
    MapPortion *mapPortion;
    MapProperties *properties;
    Portion portion;
    QJsonObject obj;
    int i, j, k, l, ll, lll;

    // Map portions
    for (i = 0, l = m_listMapPortionsPaths.size(); i < l; i++) {
        mapPortions = m_listMapPortions.at(i);
        paths = m_listMapPortionsPaths.at(i);
        for (j = 0, ll = paths->size(); j < ll; j++) {
            obj = mapPortions->at(j);
            mapPortion = new MapPortion(portion);
            mapPortion->read(obj);
            list = mapPortion->mapObjects()->getAllCommandsList();
            for (k = 0, lll = list.size(); k < lll; k++) {
                emit updatingCommands(list.at(k));
            }
            obj = QJsonObject();
            mapPortion->write(obj);
            mapPortions->replace(j, obj);
            delete mapPortion;
            Common::writeOtherJSON(paths->at(j), obj);
        }
    }

    // Map startups
    for (i = 0, l = m_listMapPropertiesPaths.size(); i < l; i++) {
        properties = new MapProperties;
        properties->read(m_listMapProperties.at(i));
        list = properties->startupObject()->getAllCommandsList();
        for (j = 0, ll = list.size(); j < ll; j++) {
            emit updatingCommands(list.at(j));
        }
        obj = QJsonObject();
        properties->write(obj);
        m_listMapProperties.replace(i, obj);
        delete properties;
        Common::writeOtherJSON(m_listMapPropertiesPaths.at(i), obj);
    }

    // Common reactions
    model = m_project->gameDatas()->commonEventsDatas()->modelCommonReactors();
    for (i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        emit updatingCommands(reinterpret_cast<SystemCommonReaction *>(model
            ->item(i)->data().value<quintptr>())->modelCommands()
            ->invisibleRootItem());
    }

    // Models
    model = m_project->gameDatas()->commonEventsDatas()->modelCommonObjects();
    for (i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        list = reinterpret_cast<SystemCommonObject *>(model->item(i)->data()
            .value<quintptr>())->getAllCommandsList();
        for (j = 0, ll = list.size(); j < ll; j++) {
            emit updatingCommands(list.at(j));
        }
    }

    m_project->writeCommonEvents();
}

// -------------------------------------------------------

void ProjectUpdater::updateObjects() {
    QList<QJsonObject> *mapPortions;
    QList<QString> *paths;
    QList<SystemCommonObject *> list;
    QStandardItemModel *model;
    MapPortion *mapPortion;
    MapProperties *properties;
    Portion portion;
    QJsonObject obj;
    int i, j, k, l, ll, lll;

    // Map portions
    for (i = 0, l = m_listMapPortionsPaths.size(); i < l; i++) {
        mapPortions = m_listMapPortions.at(i);
        paths = m_listMapPortionsPaths.at(i);
        for (j = 0, ll = paths->size(); j < ll; j++) {
            obj = mapPortions->at(j);
            mapPortion = new MapPortion(portion);
            mapPortion->read(obj);
            list = mapPortion->mapObjects()->getObjects();
            for (k = 0, lll = list.size(); k < lll; k++) {
                emit updatingObject(list.at(k));
            }
            obj = QJsonObject();
            mapPortion->write(obj);
            mapPortions->replace(j, obj);
            delete mapPortion;
            Common::writeOtherJSON(paths->at(j), obj);
        }
    }

    // Map startups
    for (i = 0, l = m_listMapPropertiesPaths.size(); i < l; i++) {
        properties = new MapProperties;
        properties->read(m_listMapProperties.at(i));
        emit updatingObject(properties->startupObject());
        obj = QJsonObject();
        properties->write(obj);
        m_listMapProperties.replace(i, obj);
        delete properties;
        Common::writeOtherJSON(m_listMapPropertiesPaths.at(i), obj);
    }

    // Models
    model = m_project->gameDatas()->commonEventsDatas()->modelCommonObjects();
    for (i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        emit updatingObject(reinterpret_cast<SystemCommonObject *>(model->item(i)
            ->data().value<quintptr>()));
    }

    m_project->writeCommonEvents();
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void ProjectUpdater::check() {
    emit progress(10, RPM::translate(Translations::COPYING_PREVIOUS_PROJECT) +
        RPM::DOT_DOT_DOT);
    copyPreviousProject();
    emit progress(80, RPM::translate(Translations
        ::CHECKING_INCOMPATIBLE_VERSIONS) + RPM::DOT_DOT_DOT);

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
    if (Common::versionDifferent(m_project->version(), "1.5.3") == -1)
    {
        m_project->setPathCurrentProjectApp(m_project->pathCurrentProject());
    }
    m_project->readAll();
    for (int i = index; i < incompatibleVersionsCount; i++) {
        emit progress(80, RPM::translate(Translations::CHECKING_VERSION) + RPM
            ::SPACE + incompatibleVersions[i] + RPM::DOT_DOT_DOT);
        updateVersion(incompatibleVersions[i]);
    }

    // Copy recent executable and scripts
    emit progress(95, RPM::translate(Translations
        ::COPYING_RECENT_EXECUTABLE_SCRIPTS));
    copyExecutable();
    copySystemScripts();
    emit progress(99, RPM::translate(Translations::CORRECTING_BR_PATH));
    QThread::sleep(1);
    m_project->gameDatas()->systemDatas()->setPathBR(
                Common::pathCombine(QDir::currentPath(), RPM::PATH_BR));
    m_project->writeAll();
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
    m_project->gameDatas()->systemDatas()->setPortionRayEditor(6);
    m_project->writeSystemDatas();
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_0_4_3() {

    // Adding default autotiles
    QList<QString> names;
    m_project->readPicturesDatas();
    m_project->picturesDatas()->setDefaultAutotiles(names);
    m_project->writePicturesDatas();
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_0_5_2() {

    // Adding default songs
    m_project->songsDatas()->setDefault();
    m_project->writeSongsDatas();
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
    picture->setKind(PictureKind::Characters);
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
    m_project->readTilesetsDatas();
    m_project->writeTilesetsDatas();
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_3_0() {
    QStandardItem *item;
    SuperListItem *super;
    int i, l;

    // Update command condition and sendEvent
    connect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_3_0_commands(QStandardItem *)));
    this->updateCommands();
    disconnect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_3_0_commands(QStandardItem *)));

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
    m_project->gameDatas()->systemDatas()->setDefaultCameraProperties();
    m_project->writeBattleSystemDatas();

    // Detections
    m_project->gameDatas()->systemDatas()->setDefaultDetections();

    // Videos
    m_project->videosDatas()->setDefault();
    m_project->writeVideosDatas();

    // Title screen commands
    m_project->gameDatas()->titleScreenGameOverDatas()->modelTitleCommands()
        ->appendRow((new SystemTitleCommand(-1, "New game", TitleCommandKind
        ::NewGame))->getModelRow());
    m_project->gameDatas()->titleScreenGameOverDatas()->modelTitleCommands()
        ->appendRow((new SystemTitleCommand(-1, "Load game", TitleCommandKind
        ::LoadGame))->getModelRow());
    m_project->gameDatas()->titleScreenGameOverDatas()->modelTitleCommands()
        ->appendRow((new SystemTitleCommand(-1, "Settings", TitleCommandKind
        ::Settings))->getModelRow());
    m_project->gameDatas()->titleScreenGameOverDatas()->modelTitleCommands()
        ->appendRow((new SystemTitleCommand(-1, "Exit", TitleCommandKind::Exit))
        ->getModelRow());

    // Title screen settings
    item = new QStandardItem;
    super = new SuperListItem(0, RPM::ENUM_TO_STRING_TITLE_SETTINGS.at(
        static_cast<int>(TitleSettingKind::KeyboardAssignment)));
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(super->toStringName());
    item->setCheckable(true);
    item->setCheckState(Qt::Checked);
    m_project->gameDatas()->titleScreenGameOverDatas()->modelTitleSettings()
        ->appendRow(item);
    m_project->writeTitleScreenGameOver();

    // Speed frequency
    m_project->gameDatas()->systemDatas()->setDefaultSpeed();
    m_project->writeSystemDatas();
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_3_0_commands(QStandardItem *commands) {
    QStandardItem *child;
    EventCommand *command;
    QVector<QString> list;
    EventCommandKind kind;
    int i, l;

    for (i = 0, l = commands->rowCount(); i < l; i++) {
        child = commands->child(i);
        this->updateVersion_1_3_0_commands(child);
        command = reinterpret_cast<EventCommand *>(child->data().value<quintptr>());
        kind = command->kind();
        list = command->commands();
        if (kind == EventCommandKind::If) {
            int idVariable;
            PrimitiveValueKind numberKind;

            idVariable = list.at(2).toInt();
            list.replace(2, QString::number(static_cast<int>(PrimitiveValueKind
                ::Variable)));
            list.insert(3, QString::number(idVariable));
            numberKind = static_cast<PrimitiveValueKind>(list.at(5).toInt());
            if (numberKind == PrimitiveValueKind::Number) {
                list.replace(5, QString::number(static_cast<int>(
                    PrimitiveValueKind::NumberDouble)));
            }
            command->setCommands(list);
        } else if (kind == EventCommandKind::SendEvent) {
            int target;

            target = list.at(0).toInt();
            if (target == 1) {
                list.insert(1, QString::number(static_cast<int>(
                    PrimitiveValueKind::DataBase)));
                list.insert(3, RPM::TRUE_BOOL_STRING);
                command->setCommands(list);
            }
        }
    }
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_4_0() {
    QList<QString> names;

    m_project->gameDatas()->systemDatas()->setDefaultSounds();
    m_project->picturesDatas()->setDefaultHUDPictures(names);
    m_project->gameDatas()->systemDatas()->setDefaultFontSizes();
    m_project->gameDatas()->systemDatas()->setDefaultFontNames();
    m_project->gameDatas()->systemDatas()->setDefaultDialogBoxOptions();

    // Update command time for primitive
    connect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_4_0_commands(QStandardItem *)));
    this->updateCommands();
    disconnect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_4_0_commands(QStandardItem *)));
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_4_0_commands(QStandardItem *commands) {
    QStandardItem *child;
    EventCommand *command;
    QVector<QString> list;
    int i, l;

    for (i = 0, l = commands->rowCount(); i < l; i++) {
        child = commands->child(i);
        this->updateVersion_1_4_0_commands(child);
        command = reinterpret_cast<EventCommand *>(child->data().value<quintptr>());
        list = command->commands();
        if (command->kind() == EventCommandKind::Wait) {
            double time;

            // Transform time to primitive value
            time = list.at(0).toDouble();
            list.replace(0, QString::number(static_cast<int>(PrimitiveValueKind
                ::NumberDouble)));
            list.append(QString::number(time));
            command->setCommands(list);
        } else if (command->kind() == EventCommandKind::ShowText) {
            list.insert(0, QString::number(static_cast<int>(PrimitiveValueKind
                ::Message)));
            list.insert(1, "");
            list.insert(2, "-1");
            command->setCommands(list);
        }
    }
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_4_1() {
    QDir dir(m_project->pathCurrentProject());
    QDir dirImages(Common::pathCombine(m_project
        ->pathCurrentProject(), RPM::FOLDER_CONTENT));

    // Replace pictures folder name by images
    dirImages.rename("Pictures", "Images");

    // Create pictures folder
    if (!dir.exists(RPM::PATH_HUD_PICTURES)) {
        dir.mkpath(RPM::PATH_HUD_PICTURES);
    }

    // Update display choice index command
    connect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_4_1_commands(QStandardItem *)));
    this->updateCommands();
    disconnect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_4_1_commands(QStandardItem *)));
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_4_1_commands(QStandardItem *commands) {
    QStandardItem *child;
    EventCommand *command;
    QVector<QString> list;
    int i, l;

    for (i = 0, l = commands->rowCount(); i < l; i++) {
        child = commands->child(i);
        this->updateVersion_1_4_1_commands(child);
        command = reinterpret_cast<EventCommand *>(child->data().value<quintptr>());
        list = command->commands();
        if (command->kind() == EventCommandKind::DisplayChoice) {
            PrimitiveValueKind kind;

            kind = static_cast<PrimitiveValueKind>(list.at(0).toInt());
            if (kind == PrimitiveValueKind::Number) {
                int value;

                value = list.at(1).toInt();
                list.replace(1, QString::number(value + 1));
            }
            command->setCommands(list);
        }
    }
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_5_0() {
    QDir dir(m_project->pathCurrentProject());
    QList<QString> names;

    m_project->gameDatas()->systemDatas()->setDefaultFrequencies();
    m_project->picturesDatas()->setDefaultAnimations(names);
    SuperListItem::deleteModel(m_project->gameDatas()->animationsDatas()
        ->model(), false);
    QFile::remove(Common::pathCombine(m_project->pathCurrentProject(), RPM
        ::PATH_ANIMATIONS));
    QFile::copy(Common::pathCombine(Common::pathCombine(QDir::currentPath(), RPM
        ::PATH_BASIC), RPM::PATH_ANIMATIONS), Common::pathCombine(m_project
        ->pathCurrentProject(), RPM::PATH_ANIMATIONS));
    m_project->gameDatas()->readAnimations(m_project->pathCurrentProject());
    m_project->gameDatas()->animationsDatas()->setDefault();
    dir.mkpath(RPM::PATH_HUD_ANIMATIONS);
    dir.mkpath(RPM::PATH_SKY_BOXES);
    m_project->picturesDatas()->setDefaultSkyBoxes(names);
    m_project->writeAll();
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_5_3() {
    QDir dir(m_project->pathCurrentProject());
    QList<QString> names;
    QString path = m_project->pathCurrentProject();
    m_project->setPathCurrentProject(path);

    // Change Content folder location
    #ifdef Q_OS_MACOS
        path = Common::pathCombine(path, "Game.app");
        QDir(path).removeRecursively();
        dir.mkdir("Game.app");
        path = Common::pathCombine(path, "Contents");
    #endif
    QDir(path).mkdir(RPM::FOLDER_RESOURCES);
    path = Common::pathCombine(path, RPM::FOLDER_RESOURCES);
    QDir(path).mkdir(RPM::FOLDER_APP);
    path = Common::pathCombine(path, RPM::FOLDER_APP);
    Common::copyPath(Common::pathCombine(m_project->pathCurrentProject(), RPM
        ::FOLDER_CONTENT), Common::pathCombine(path, RPM::FOLDER_CONTENT));

    // Read content again
    m_project->readAll();
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_5_6()
{
    // Update change state command + modify inventory + pictures
    connect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_5_6_commands(QStandardItem *)));
    this->updateCommands();
    disconnect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_5_6_commands(QStandardItem *)));

    // DLCs
    m_project->gameDatas()->dlcsDatas()->setDefault();
    m_project->writeDlcs();
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_5_6_commands(QStandardItem *commands)
{
    QStandardItem *child;
    EventCommand *command;
    QVector<QString> list;
    int i, l;

    for (i = 0, l = commands->rowCount(); i < l; i++)
    {
        child = commands->child(i);
        this->updateVersion_1_5_6_commands(child);
        command = reinterpret_cast<EventCommand *>(child->data().value<quintptr>());
        list = command->commands();
        if (command->kind() == EventCommandKind::ChangeState)
        {
            list.insert(0, QString::number(static_cast<int>(PrimitiveValueKind
                ::DataBase)));
            list.insert(1, "-1");
            list.insert(2, QString::number(static_cast<int>(PrimitiveValueKind
                ::DataBase)));
            list.insert(3, "-1");
            command->setCommands(list);
        } else if (command->kind() == EventCommandKind::ModifyInventory)
        {
            list.insert(1, QString::number(static_cast<int>(PrimitiveValueKind
                ::DataBase)));
            command->setCommands(list);
        } else if (command->kind() == EventCommandKind::DisplayAPicture)
        {
            list.insert(0, QString::number(static_cast<int>(PrimitiveValueKind
                ::Number)));
            list.insert(2, RPM::boolToString(false));
            command->setCommands(list);
        } else if (command->kind() == EventCommandKind::SetMoveTurnAPicture)
        {
            if (RPM::stringToBool(list.at(2)))
            {
                list.insert(3, QString::number(static_cast<int>(
                    PrimitiveValueKind::Number)));
                list.insert(5, RPM::boolToString(false));
            }
            command->setCommands(list);
        }
    }
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_6_0()
{
    QFile(Common::pathCombine(Common::pathCombine(m_project
        ->pathCurrentProjectApp(), RPM::PATH_DATAS), "saves.json")).remove();
    QDir(m_project->pathCurrentProjectApp()).mkpath(RPM::PATH_SAVES);
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_6_2()
{
    // Plugins
    SuperListItem::deleteModel(m_project->scriptsDatas()->modelPlugins(), false);

    // Update 3D objects scale
    QStandardItemModel *model = m_project->specialElementsDatas()->model(
        PictureKind::Object3D);
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++)
    {
        SystemObject3D *obj = reinterpret_cast<SystemObject3D *>(SuperListItem
            ::getItemModelAt(model, i));
        if (obj != nullptr && obj->shapeKind() == ShapeKind::Custom)
        {
            obj->setScale(obj->scale() / RPM::getSquareSize());
        }
    }

    // Remove include.js and add path.js
    QFile(Common::pathCombine(Common::pathCombine(m_project->pathCurrentProjectApp(),
        RPM::PATH_SCRIPTS_PLUGINS_DIR), "includes.js")).remove();
    QFile::copy(Common::pathCombine(Common::pathCombine(Common::pathCombine(
        Common::pathCombine(QDir::currentPath(), "Content"), "basic"), RPM
        ::PATH_SCRIPTS_PLUGINS_DIR), "path.js"), Common::pathCombine(Common
        ::pathCombine(m_project->pathCurrentProjectApp(), RPM
        ::PATH_SCRIPTS_PLUGINS_DIR), "path.js"));

    // Rename sapphire
    model = m_project->picturesDatas()->model(PictureKind::Icons);
    SystemPicture *picture;
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++)
    {
        picture = reinterpret_cast<SystemPicture *>(SuperListItem::getItemModelAt(
            model, i));
        if (picture != nullptr && picture->isBR())
        {
            if (picture->name() == "saphirRing.png")
            {
                picture->setName("sapphireRing.png");
            } else if (picture->name() == "saphirNecklace.png")
            {
                picture->setName("sapphireNecklace.png");
            }
        }
    }
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_6_3()
{
    // Status
    m_project->gameDatas()->statusDatas()->setDefault();

    // Update send event commands
    connect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_6_3_commands(QStandardItem *)));
    this->updateCommands();
    disconnect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_6_3_commands(QStandardItem *)));
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_6_3_commands(QStandardItem *commands)
{
    EventCommand *command;
    QVector<QString> list;
    QString type;
    int i, l;
    if (commands->rowCount() == 0)
    {
        command = reinterpret_cast<EventCommand *>(commands->data().value<quintptr>());
        list = command->commands();
        if (command->kind() == EventCommandKind::SendEvent)
        {
            type = list.at(0);
            if (type == "1")
            {
                list.insert(4, RPM::FALSE_BOOL_STRING);
            }
            command->setCommands(list);
        }
    }
    for (i = 0, l = commands->rowCount(); i < l; i++)
    {
        this->updateVersion_1_6_3_commands(commands->child(i));
    }
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_6_4()
{
    // Change chest opened name
    QStandardItemModel *model = m_project->picturesDatas()->model(PictureKind::Object3D);
    SystemPicture *picture;
    int i, l;
    for (i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++)
    {
        picture = reinterpret_cast<SystemPicture *>(SuperListItem::getItemModelAt(
            model, i));
        if (picture != nullptr && picture->name() == "chest-opened.png" && picture->isBR())
        {
            picture->setName("chest-opened1.png");
        }
    }
    // Change hero to check ignore if impossible
    SystemCommonObject *hero = reinterpret_cast<SystemCommonObject *>(SuperListItem
        ::getById(m_project->gameDatas()->commonEventsDatas()->modelCommonObjects()
        ->invisibleRootItem(), 2));
    if (hero != nullptr)
    {
        SystemObjectEvent *objectEvent;
        SystemReaction *reaction;
        EventCommand *command;
        QVector<QString> list;
        for (i = 0, l = 4; i < l; i++)
        {
            objectEvent = reinterpret_cast<SystemObjectEvent *>(SuperListItem
                ::getItemModelAt(hero->modelEvents(), i));
            if (objectEvent != nullptr)
            {
                reaction = objectEvent->reactionAt(1);
                command = reinterpret_cast<EventCommand *>(SuperListItem
                    ::getItemModelAt(reaction->modelCommands(), 0));
                if (command != nullptr && command->kind() == EventCommandKind::MoveObject)
                {
                    list = command->commands();
                    list.replace(2, RPM::TRUE_BOOL_STRING);
                    command->setCommands(list);
                }
            }
        }
    }
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_7_0()
{
    // Fonts
    QDir dir = QDir(m_project->pathCurrentProjectApp());
    dir.mkpath(RPM::PATH_FONTS);
    dir.mkpath(RPM::PATH_STYLES);
    m_project->fontsDatas()->setDefault();

    // Kind
    m_project->gameDatas()->systemDatas()->setdefaultEnterNameOptions();
    m_project->gameDatas()->systemDatas()->setDefaultItemsTypes();
    m_project->gameDatas()->systemDatas()->setDefaultInventoryFilters();
    m_project->gameDatas()->systemDatas()->setDefaultMainMenuCommands();
    m_project->gameDatas()->systemDatas()->setDefaultHeroesStatistics();

    // Languages
    m_project->langsDatas()->setDefault();
    m_project->gameDatas()->titleScreenGameOverDatas()->setDefaultTitleSettings();

    // Languages update description json
    this->updateVersion_1_7_0_json(RPM::PATH_ITEMS, "items");
    this->updateVersion_1_7_0_json(RPM::PATH_WEAPONS, "weapons");
    this->updateVersion_1_7_0_json(RPM::PATH_ARMORS, "armors");
    this->updateVersion_1_7_0_json(RPM::PATH_SKILLS, "skills");
    m_project->gameDatas()->readItems(m_project->pathCurrentProjectApp());
    m_project->gameDatas()->readWeapons(m_project->pathCurrentProjectApp());
    m_project->gameDatas()->readArmors(m_project->pathCurrentProjectApp());
    m_project->gameDatas()->readSkills(m_project->pathCurrentProjectApp());

    // Update show text commands
    connect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_7_0_commands(QStandardItem *)));
    this->updateCommands();
    disconnect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_7_0_commands(QStandardItem *)));
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_7_0_commands(QStandardItem *commands)
{
    EventCommand *command;
    QVector<QString> list;
    QString text;
    int i, l;
    if (commands->rowCount() == 0)
    {
        command = reinterpret_cast<EventCommand *>(commands->data().value<quintptr>());
        list = command->commands();
        if (command->kind() == EventCommandKind::ShowText)
        {
            list.insert(3, QString::number(m_project->langsDatas()->mainLang()));
            command->setCommands(list);
        } else if (command->kind() == EventCommandKind::DisplayChoice)
        {
            i = 0;
            while (i < list.size())
            {
                if (list.at(i) == RPM::DASH)
                {
                    list.removeAt(i + 1);
                }
                i++;
            }
            command->setCommands(list);
        }
    }
    for (i = 0, l = commands->rowCount(); i < l; i++)
    {
        this->updateVersion_1_7_0_commands(commands->child(i));
    }
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_7_0_json(QString path, QString listName)
{
    QJsonDocument loadDoc;
    path = Common::pathCombine(m_project->pathCurrentProjectApp(), path);
    Common::readOtherJSON(path, loadDoc);
    QJsonObject json = loadDoc.object();
    QJsonArray tab = json[listName].toArray();
    QJsonObject obj, dObj;
    for (int i = 0, l = tab.size(); i < l; i++)
    {
        obj = tab.at(i).toObject();
        dObj = QJsonObject();
        dObj["names"] = obj["d"].toObject();
        obj["d"] = dObj;
        tab[i] = obj;
    }
    json[listName] = tab;
    Common::writeOtherJSON(path, json);
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_7_3()
{
    // Update display choice for max number of box to display
    connect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_7_3_commands(QStandardItem *)));
    this->updateCommands();
    disconnect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_7_3_commands(QStandardItem *)));
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_7_3_commands(QStandardItem *commands)
{
    EventCommand *command;
    QVector<QString> list;
    QString text;
    int i, l;
    if (commands->rowCount() == 0)
    {
        command = reinterpret_cast<EventCommand *>(commands->data().value<quintptr>());
        list = command->commands();
        if (command->kind() == EventCommandKind::DisplayChoice)
        {
            list.insert(2, "3");
            list.insert(3, "5");
            command->setCommands(list);
        } else if (command->kind() == EventCommandKind::ChangeAStatistic)
        {
            list.append(RPM::boolToString(false));
            command->setCommands(list);
        }
    }
    for (i = 0, l = commands->rowCount(); i < l; i++)
    {
        this->updateVersion_1_7_3_commands(commands->child(i));
    }
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_8_0()
{
    SystemCommonSkillItem *skill;
    for (int i = 1; i <= 4; i++)
    {
        skill = reinterpret_cast<SystemCommonSkillItem *>(SuperListItem
            ::getItemModelAt(m_project->gameDatas()->skillsDatas()->model(), i));
        if (skill != nullptr)
        {
            skill->setTargetKind(TargetKind::User);
        }
    }

    // Update modify team
    connect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_8_0_commands(QStandardItem *)));
    this->updateCommands();
    disconnect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_8_0_commands(QStandardItem *)));

    // Chronometer system event
    SystemEvent *event = reinterpret_cast<SystemEvent *>(SuperListItem
        ::getItemModelAt(m_project->gameDatas()->commonEventsDatas()
        ->modelEventsSystem(), 1));
    event->setName("Chronometer finished");
    reinterpret_cast<SystemCreateParameter *>(SuperListItem::getItemModelAt(event
        ->modelParameters(), 0))->setName("ID");
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_8_0_commands(QStandardItem *commands)
{
    EventCommand *command;
    QVector<QString> list;
    QString text;
    int i, l;
    if (commands->rowCount() == 0)
    {
        command = reinterpret_cast<EventCommand *>(commands->data().value<quintptr>());
        list = command->commands();
        if (command->kind() == EventCommandKind::ModifyTeam)
        {
            list.insert(4, QString::number(static_cast<int>(PrimitiveValueKind::Variable)));
            list.insert(7, QString::number(static_cast<int>(PrimitiveValueKind::DataBase)));
            command->setCommands(list);
        }
    }
    for (i = 0, l = commands->rowCount(); i < l; i++)
    {
        this->updateVersion_1_8_0_commands(commands->child(i));
    }
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_8_3()
{
    QJsonDocument loadDoc;
    QString path = Common::pathCombine(m_project->pathCurrentProjectApp(), RPM
        ::PATH_TROOPS);
    Common::readOtherJSON(path, loadDoc);
    QJsonObject json = loadDoc.object();
    QJsonArray tab = json["troops"].toArray();
    QJsonObject objTroop, dObj, objMonster, objLevel;
    QJsonArray tabMonster;
    PrimitiveValue v;
    for (int i = 0, l = tab.size(); i < l; i++)
    {
        objTroop = tab.at(i).toObject();
        tabMonster = objTroop["l"].toArray();
        for (int j = 0, m = tabMonster.size(); j < m; j++)
        {
            objMonster = tabMonster.at(j).toObject();
            objLevel = QJsonObject();
            v.setKind(PrimitiveValueKind::Number);
            v.setNumberValue(objMonster["l"].toInt());
            v.write(objLevel);
            objMonster["l"] = objLevel;
            tabMonster[j] = objMonster;
        }
        objTroop["l"] = tabMonster;
        tab[i] = objTroop;
    }
    json["troops"] = tab;
    Common::writeOtherJSON(path, json);
    m_project->gameDatas()->readTroops(m_project->pathCurrentProjectApp());
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_9_0()
{
    QStandardItemModel *model = m_project->gameDatas()->commonEventsDatas()
        ->modelEventsSystem();
    QJsonArray eventsSystem = QJsonDocument::fromJson(QString("[{\"id\":5,\"name\":\"MouseDown\",\"p\":[{\"d\":{\"k\":3,\"v\":0},\"id\":1,\"name\":\"x\"},{\"d\":{\"k\":3,\"v\":0},\"id\":2,\"name\":\"y\"},{\"d\":{\"k\":10,\"v\":true},\"id\":3,\"name\":\"Left\"},{\"d\":{\"k\":10,\"v\":false},\"id\":4,\"name\":\"Repeat\"}]},{\"id\":6,\"name\":\"MouseUp\",\"p\":[{\"d\":{\"k\":3,\"v\":0},\"id\":1,\"name\":\"x\"},{\"d\":{\"k\":3,\"v\":0},\"id\":2,\"name\":\"y\"},{\"d\":{\"k\":10,\"v\":true},\"id\":3,\"name\":\"Left\"}]},{\"id\":7,\"name\":\"MouseMove\",\"p\":[{\"d\":{\"k\":3,\"v\":0},\"id\":1,\"name\":\"x\"},{\"d\":{\"k\":3,\"v\":0},\"id\":2,\"name\":\"y\"}]}]").toUtf8()).array();
    SystemEvent *event = new SystemEvent;
    event->read(eventsSystem.at(0).toObject());
    model->appendRow(event->getModelRow());
    event = new SystemEvent;
    event->read(eventsSystem.at(1).toObject());
    model->appendRow(event->getModelRow());
    event = new SystemEvent;
    event->read(eventsSystem.at(2).toObject());
    model->appendRow(event->getModelRow());
    QJsonObject mouseDownReaction = QJsonDocument::fromJson(QString("{\"id\":5,\"name\":\"MouseDown\",\"p\":[{\"id\":1,\"name\":\"x\",\"v\":{\"k\":1,\"v\":null}},{\"id\":2,\"name\":\"y\",\"v\":{\"k\":1,\"v\":null}},{\"id\":3,\"name\":\"Left\",\"v\":{\"k\":2,\"v\":null}},{\"id\":4,\"name\":\"Repeat\",\"v\":{\"k\":10,\"v\":true}}],\"r\":{\"1\":{\"bh\":false,\"c\":[{\"children\":[{\"command\":[7,-1,1,1,1,2,1],\"kind\":21}],\"command\":[0,7,8,\"Core.ReactionInterpreter.currentParameters[1].getValue() <= (Common.ScreenResolution.CANVAS_WIDTH - Common.ScreenResolution.getScreenX(64)) / 2\"],\"kind\":8},{\"command\":[],\"kind\":10},{\"children\":[{\"command\":[7,-1,1,1,1,3,1],\"kind\":21}],\"command\":[0,7,8,\"Core.ReactionInterpreter.currentParameters[1].getValue() >= (Common.ScreenResolution.CANVAS_WIDTH + Common.ScreenResolution.getScreenX(64)) / 2\"],\"kind\":8},{\"command\":[],\"kind\":10},{\"children\":[{\"command\":[7,-1,1,1,1,0,1],\"kind\":21}],\"command\":[0,7,8,\"Core.ReactionInterpreter.currentParameters[2].getValue() <= (Common.ScreenResolution.CANVAS_HEIGHT - Common.ScreenResolution.getScreenY(64)) / 2\"],\"kind\":8},{\"command\":[],\"kind\":10},{\"children\":[{\"command\":[7,-1,1,1,1,1,1],\"kind\":21}],\"command\":[0,7,8,\"Core.ReactionInterpreter.currentParameters[2].getValue() >= (Common.ScreenResolution.CANVAS_HEIGHT + Common.ScreenResolution.getScreenY(64)) / 2\"],\"kind\":8},{\"command\":[],\"kind\":10},{\"command\":[1,7,2,1,0,1,2],\"kind\":19}]}},\"sys\":true}").toUtf8()).object();
    SystemObjectEvent *reaction = new SystemObjectEvent;
    reaction->read(mouseDownReaction);
    model = m_project->gameDatas()->commonEventsDatas()->modelCommonObjects();
    SystemCommonObject *object = reinterpret_cast<SystemCommonObject *>(
        SuperListItem::getItemModelAt(model, 1));
    object->modelEvents()->appendRow(reaction->getModelRow());
    m_project->gameDatas()->systemDatas()->setDefaultInitialPartyMembers();
    QDir(m_project->pathCurrentProject()).mkpath(RPM::PATH_PARTICLES);
    QStringList names;
    m_project->picturesDatas()->setDefaultParticles(names);
    QDir(m_project->pathCurrentProject()).mkpath(RPM::PATH_GAME_OVER);
    m_project->picturesDatas()->setDefaultGameOver(names);
    m_project->gameDatas()->titleScreenGameOverDatas()->setDefaultGameOver();
    m_project->gameDatas()->titleScreenGameOverDatas()->setDefaultGameOverCommands();
    model = m_project->gameDatas()->itemsDatas()->model();
    SystemItem *item;
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++)
    {
        item = reinterpret_cast<SystemItem *>(SuperListItem::getItemModelAt(model, i));
        if (item != nullptr)
        {
            item->battleMessage()->setAllNames(SystemItem::DEFAULT_BATTLE_MESSAGE);
        }
    }
    model = m_project->gameDatas()->skillsDatas()->model();
    SystemSkill *skill;
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++)
    {
        skill = reinterpret_cast<SystemSkill *>(SuperListItem::getItemModelAt(model, i));
        if (skill != nullptr)
        {
            skill->battleMessage()->setAllNames(SystemSkill::DEFAULT_BATTLE_MESSAGE);
        }
    }
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_9_1()
{
    QDir(m_project->pathCurrentProject()).mkpath(RPM::PATH_GAME_OVER);
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_9_2()
{
    // Update time event parameter to seconds
    connect(this, SIGNAL(updatingObject(SystemCommonObject *)), this, SLOT(
        updateVersion_1_9_2_objects(SystemCommonObject *)));
    this->updateObjects();
    disconnect(this, SIGNAL(updatingObject(SystemCommonObject *)), this, SLOT(
        updateVersion_1_9_2_objects(SystemCommonObject *)));

    // Change variables command deciaml
    connect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_9_2_commands(QStandardItem *)));
    this->updateCommands();
    disconnect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_9_2_commands(QStandardItem *)));
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_9_2_objects(SystemCommonObject *object)
{
    SystemObjectEvent *event;
    SystemParameter *parameter;
    for (int i = 0, l = object->modelEvents()->invisibleRootItem()->rowCount();
         i < l; i++)
    {
        event = reinterpret_cast<SystemObjectEvent *>(SuperListItem::getItemModelAt(
            object->modelEvents(), i));
        if (event != nullptr && event->isSystem() && event->id() == 1)
        {
            parameter = reinterpret_cast<SystemParameter *>(SuperListItem
                ::getItemModelAt(event->modelParameters(), 0));
            if (parameter != nullptr)
            {
                parameter->value()->setNumberDoubleValue(parameter->value()
                    ->numberDoubleValue() / 1000.0f);
            }
        }
    }
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_9_2_commands(QStandardItem *commands)
{
    EventCommand *command;
    QVector<QString> list;
    QString text;
    int i, l;
    if (commands->rowCount() == 0)
    {
        command = reinterpret_cast<EventCommand *>(commands->data().value<quintptr>());
        list = command->commands();
        if (command->kind() == EventCommandKind::ChangeVariables)
        {
            int index = 3;
            if (list.at(0).toInt() == 1)
            {
                index++;
            }
            if (list.at(index++).toInt() == 0)
            {
                if (static_cast<PrimitiveValueKind>(list.at(index).toInt()) ==
                    PrimitiveValueKind::Number)
                {
                    list.replace(index, QString::number(static_cast<int>(
                        PrimitiveValueKind::NumberDouble)));
                }
            }
            command->setCommands(list);
        }
    }
    for (i = 0, l = commands->rowCount(); i < l; i++)
    {
        this->updateVersion_1_9_2_commands(commands->child(i));
    }
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_9_3()
{
    // Show text command changed with facesets in one file
    connect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_9_3_commands(QStandardItem *)));
    this->updateCommands();
    disconnect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_9_3_commands(QStandardItem *)));
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_9_3_commands(QStandardItem *commands)
{
    EventCommand *command;
    QVector<QString> list;
    QString text;
    int i, l;
    if (commands->rowCount() == 0)
    {
        command = reinterpret_cast<EventCommand *>(commands->data().value<quintptr>());
        list = command->commands();
        if (command->kind() == EventCommandKind::ShowText)
        {
            list.insert(3, "0");
            list.insert(4, "0");
            command->setCommands(list);
        } else if (command->kind() == EventCommandKind::MoveObject)
        {
            int j = 5;
            while (j < list.size())
            {
                CommandMoveKind kind = static_cast<CommandMoveKind>(list.at(j++)
                    .toInt());
                switch (kind)
                {
                case CommandMoveKind::MoveNorth:
                case CommandMoveKind::MoveSouth:
                case CommandMoveKind::MoveWest:
                case CommandMoveKind::MoveEast:
                case CommandMoveKind::MoveNorthWest:
                case CommandMoveKind::MoveNorthEast:
                case CommandMoveKind::MoveSouthWest:
                case CommandMoveKind::MoveSouthEast:
                case CommandMoveKind::MoveRandom:
                case CommandMoveKind::MoveHero:
                case CommandMoveKind::MoveOppositeHero:
                case CommandMoveKind::MoveFront:
                case CommandMoveKind::MoveBack:
                    break;
                case CommandMoveKind::ChangeGraphics:
                    list.insert(j + 1, RPM::boolToString(false));
                    list.insert(j + 2, "2");
                    list.insert(j + 5, RPM::boolToString(static_cast<PrimitiveValueKind>(
                        list.at(j + 3).toInt()) != PrimitiveValueKind::Number));
                    j += 10;
                    break;
                case CommandMoveKind::Jump:
                    j += 15;
                    break;
                case CommandMoveKind::TurnNorth:
                case CommandMoveKind::TurnSouth:
                case CommandMoveKind::TurnWest:
                case CommandMoveKind::TurnEast:
                case CommandMoveKind::Turn90Right:
                case CommandMoveKind::Turn90Left:
                case CommandMoveKind::LookAtHero:
                case CommandMoveKind::LookAtHeroOpposite:
                    j += 0;
                    break;
                case CommandMoveKind::ChangeSpeed:
                case CommandMoveKind::ChangeFrequency:
                    j += 3;
                    break;
                case CommandMoveKind::MoveAnimation:
                case CommandMoveKind::StopAnimation:
                case CommandMoveKind::ClimbAnimation:
                case CommandMoveKind::FixDirection:
                case CommandMoveKind::Through:
                case CommandMoveKind::SetWithCamera:
                case CommandMoveKind::PixelOffset:
                case CommandMoveKind::KeepPosition:
                    j += 2;
                    break;
                case CommandMoveKind::Wait:
                    j += 2;
                    break;
                case CommandMoveKind::PlayASound:
                    j += 12;
                    break;
                case CommandMoveKind::Script:
                    j += RPM::stringToBool(command->valueCommandAt(1)) ? 3 : 2;
                    break;
                }
            }
            command->setCommands(list);
        } else if (command->kind() == EventCommandKind::DisplayAPicture)
        {
            list.append(RPM::FALSE_BOOL_STRING);
            command->setCommands(list);
        }
    }
    for (i = 0, l = commands->rowCount(); i < l; i++)
    {
        this->updateVersion_1_9_3_commands(commands->child(i));
    }
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion_1_10_0()
{
    RPM::get()->engineSettings()->setRotationLeftRightClick(true);
    RPM::get()->engineSettings()->setTranslationLeftRightClick(true);
    RPM::get()->engineSettings()->setTranslationBySquare(true);
    RPM::get()->engineSettings()->setTranslationValue(AxisKind::X, 0);
    RPM::get()->engineSettings()->setTranslationValue(AxisKind::Y, 0);
    RPM::get()->engineSettings()->setTranslationValue(AxisKind::Z, 0);
    RPM::get()->engineSettings()->setScalingLeftRightClick(true);
    RPM::get()->engineSettings()->setScalingBySquare(true);
    RPM::get()->engineSettings()->setScalingValue(AxisKind::X, 1);
    RPM::get()->engineSettings()->setScalingValue(AxisKind::Y, 1);
    RPM::get()->engineSettings()->setScalingValue(AxisKind::Z, 1);
    RPM::get()->engineSettings()->write();

    // Bars
    QStandardItemModel *model = m_project->picturesDatas()->model(PictureKind::Bars);
    SystemResource *super;
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        super = reinterpret_cast<SystemResource *>(SuperListItem::getItemModelAt(model, i));
        if (super != nullptr && super->isBR()) {
            if (super->name() == "spBar.png") {
                super->setName("tpBar.png");
            }
        }
    }
    // Facesets
    model = m_project->picturesDatas()->model(PictureKind::Facesets);
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        super = reinterpret_cast<SystemResource *>(SuperListItem::getItemModelAt(model, i));
        if (super != nullptr && super->isBR()) {
            if (super->name() == "general1.png") {
                super->setName("heroes.png");
            }
        }
    }
    // Icons
    model = m_project->picturesDatas()->model(PictureKind::Icons);
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        super = reinterpret_cast<SystemResource *>(SuperListItem::getItemModelAt(model, i));
        if (super != nullptr && super->isBR()) {
            if (super->name() == "general.png") {
                super->setName("items.png");
            }
        }
    }
    // Titlescreen
    model = m_project->picturesDatas()->model(PictureKind::TitleScreen);
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        super = reinterpret_cast<SystemResource *>(SuperListItem::getItemModelAt(model, i));
        if (super != nullptr && super->isBR()) {
            if (super->name() == "background.png") {
                super->setName("background-logo.png");
            }
        }
    }
    // Windowskin
    model = m_project->picturesDatas()->model(PictureKind::WindowSkins);
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        super = reinterpret_cast<SystemResource *>(SuperListItem::getItemModelAt(model, i));
        if (super != nullptr && super->isBR()) {
            if (super->name() == "default.png") {
                super->setName("blue.png");
            }
        }
    }
    // Character
    model = m_project->picturesDatas()->model(PictureKind::Characters);
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        super = reinterpret_cast<SystemResource *>(SuperListItem::getItemModelAt(model, i));
        if (super != nullptr && super->isBR()) {
            if (super->name() == "chicken.png") {
                super->setName("chicken-white.png");
            }
            if (super->name() == "chicken2.png") {
                super->setName("chicken-brown.png");
            }
            if (super->name() == "cow.png") {
                super->setName("cow-white.png");
            }
            if (super->name() == "cow2.png") {
                super->setName("cow-brown.png");
            }
            if (super->name() == "flames1.png") {
                super->setName("fires.png");
            }
            if (super->name() == "gustav.png") {
                super->setName("lucas.png");
            }
            if (super->name() == "keaton.png") {
                super->setName("lucas.png");
            }
            if (super->name() == "plants1.png") {
                super->setName("lucas.png");
            }
            if (super->name() == "slime.png") {
                super->setName("slime-blue.png");
            }
        }
    }
    // Character
    model = m_project->picturesDatas()->model(PictureKind::Mountains);
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        super = reinterpret_cast<SystemResource *>(SuperListItem::getItemModelAt(model, i));
        if (super != nullptr && super->isBR()) {
            if (super->name() == "blue-roof.png") {
                super->setName("roof-blue.png");
            }
            if (super->name() == "cave1.png") {
                super->setName("cave.png");
            }
            if (super->name() == "desert-noborders.png") {
                super->setName("cave.png");
            }
            if (super->name() == "desert.png") {
                super->setName("cave.png");
            }
            if (super->name() == "gray-roof.png") {
                super->setName("roof-white.png");
            }
            if (super->name() == "green-roof.png") {
                super->setName("roof-green.png");
            }
            if (super->name() == "halloween-noborders.png") {
                super->setName("haunted.png");
            }
            if (super->name() == "halloween.png") {
                super->setName("haunted.png");
            }
            if (super->name() == "ref-roof.png") {
                super->setName("roof-red.png");
            }
            if (super->name() == "wood-stairs.png") {
                super->setName("grass.png");
            }
        }
    }
    // Objects 3D
    model = m_project->picturesDatas()->model(PictureKind::Object3D);
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        super = reinterpret_cast<SystemResource *>(SuperListItem::getItemModelAt(model, i));
        if (super != nullptr && super->isBR()) {
            if (super->name() == "bed.png") {
                super->setName("bed-blue.png");
            }
            if (super->name() == "big-bed.png") {
                super->setName("big-bed-green.png");
            }
            if (super->name() == "big-brick-building.png") {
                super->setName("building-brick-big.png");
            }
            if (super->name() == "big-log.png") {
                super->setName("log-big.png");
            }
            if (super->name() == "bottom-chair.png") {
                super->setName("chest.png");
            }
            if (super->name() == "brick-building.png") {
                super->setName("building-brick.png");
            }
            if (super->name() == "brick-chimney.png") {
                super->setName("chimney-brick.png");
            }
            if (super->name() == "chair-back.png") {
                super->setName("chest.png");
            }
            if (super->name() == "cobblestone-cube.png") {
                super->setName("cube-cobblestone.png");
            }
            if (super->name() == "cube-table.png") {
                super->setName("chest.png");
            }
            if (super->name() == "cupboard.png") {
                super->setName("bookshelf.png");
            }
            if (super->name() == "dining-table.png") {
                super->setName("chest.png");
            }
            if (super->name() == "fancy-house.png") {
                super->setName("chest.png");
            }
            if (super->name() == "giant-wood-building.png") {
                super->setName("building-wood-big.png");
            }
            if (super->name() == "green-building-with-door.png") {
                super->setName("chest.png");
            }
            if (super->name() == "green-building.png") {
                super->setName("chest.png");
            }
            if (super->name() == "macrowave.png") {
                super->setName("chest.png");
            }
            if (super->name() == "roof-texture.png") {
                super->setName("chest.png");
            }
            if (super->name() == "shop-stand1.png") {
                super->setName("shop-stand-green.png");
            }
            if (super->name() == "shop-stand2.png") {
                super->setName("shop-stand-red.png");
            }
            if (super->name() == "small-bookshelf.png") {
                super->setName("bookshelf-small.png");
            }
            if (super->name() == "small-log.png") {
                super->setName("log-small");
            }
            if (super->name() == "small-television.png") {
                super->setName("tv-small.png");
            }
            if (super->name() == "small-wood-post.png") {
                super->setName("chest.png");
            }
            if (super->name() == "stone-chimney.png") {
                super->setName("chimney-stone.png");
            }
            if (super->name() == "television.png") {
                super->setName("tv.png");
            }
            if (super->name() == "tiny-log.png") {
                super->setName("log-small.png");
            }
            if (super->name() == "wood-building.png") {
                super->setName("building-wood.png");
            }
            if (super->name() == "wood-deck.png") {
                super->setName("chest.png");
            }
            if (super->name() == "wood-post.png") {
                super->setName("chest.png");
            }
        }
    }
    // Objects 3D
    model = m_project->picturesDatas()->model(PictureKind::Tilesets);
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        super = reinterpret_cast<SystemResource *>(SuperListItem::getItemModelAt(model, i));
        if (super != nullptr && super->isBR()) {
            if (super->name() == "beach.png") {
                super->setName("beach-desert.png");
            }
            if (super->name() == "cave.png") {
                super->setName("dungeon-mines.png");
            }
            if (super->name() == "dungeon.png") {
                super->setName("dungeon-mines.png");
            }
            if (super->name() == "halloween.png") {
                super->setName("plains-woods-haunted.png");
            }
            if (super->name() == "plains.png") {
                super->setName("plains-woods.png");
            }
        }
    }
    // Walls
    model = m_project->picturesDatas()->model(PictureKind::Walls);
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        super = reinterpret_cast<SystemResource *>(SuperListItem::getItemModelAt(model, i));
        if (super != nullptr && super->isBR()) {
            if (super->name() == "cave2.png") {
                super->setName("cave1.png");
            }
            if (super->name() == "cave3.png") {
                super->setName("cave1.png");
            }
            if (super->name() == "inside2.png") {
                super->setName("inside1.png");
            }
            if (super->name() == "wood2.png") {
                super->setName("wood.png");
            }
        }
    }
    // Shapes obj
    model = m_project->shapesDatas()->model(CustomShapeKind::OBJ);
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        super = reinterpret_cast<SystemResource *>(SuperListItem::getItemModelAt(model, i));
        if (super != nullptr && super->isBR()) {
            if (super->name() == "Roof.obj") {
                super->setName("tent.obj");
            }
        }
    }
    // Statistics bars
    model = m_project->gameDatas()->battleSystemDatas()->modelCommonStatistics();
    SystemStatistic *statistic;
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        statistic = reinterpret_cast<SystemStatistic *>(SuperListItem::getItemModelAt(model, i));
        if (statistic != nullptr) {
            if (statistic->abbreviation() == "hp") {
                statistic->pictureBarID()->setId(1);
            }
            if (statistic->abbreviation() == "mp") {
                statistic->pictureBarID()->setId(2);
            }
            if (statistic->abbreviation() == "tp") {
                statistic->pictureBarID()->setId(3);
            }
        }
    }
}

void ProjectUpdater::updateVersion_1_10_1()
{
    QJsonObject obj;
    for (int i = 0, l = m_listMapProperties.size(); i < l; i++) {
        Map map(m_listMapProperties.at(i)["id"].toInt(), false);
        map.syncObjects();
        map.writeObjects();
    }
}

void ProjectUpdater::updateVersion_2_0_0()
{
    m_project->langsDatas()->setDefaultTranslations();
}
