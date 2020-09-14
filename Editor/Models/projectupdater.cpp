/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

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

const int ProjectUpdater::incompatibleVersionsCount = 14;

QString ProjectUpdater::incompatibleVersions[incompatibleVersionsCount]
    {"0.3.1", "0.4.0", "0.4.3", "0.5.2", "1.0.0", "1.1.1", "1.2.0", "1.2.1",
     "1.3.0", "1.4.0", "1.4.1", "1.5.0", "1.5.3", "1.5.6"};

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
    QString pathScripts = Common::pathCombine(pathBasic,
                                             RPM::PATH_SCRIPTS_SYSTEM_DIR);
    QString pathProjectScripts =
            Common::pathCombine(m_project->pathCurrentProjectApp(),
                               RPM::PATH_SCRIPTS_SYSTEM_DIR);
    QDir dir(pathProjectScripts);
    dir.removeRecursively();
    dir.cdUp();
    dir.mkdir("System");
    Common::copyPath(pathScripts, pathProjectScripts);
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
        ->appendRow((new SystemTitleCommand(-1, new LangsTranslation("New game")
        , TitleCommandKind::NewGame))->getModelRow());
    m_project->gameDatas()->titleScreenGameOverDatas()->modelTitleCommands()
        ->appendRow((new SystemTitleCommand(-1, new LangsTranslation("Load game"
        ), TitleCommandKind::LoadGame))->getModelRow());
    m_project->gameDatas()->titleScreenGameOverDatas()->modelTitleCommands()
        ->appendRow((new SystemTitleCommand(-1, new LangsTranslation("Settings"),
        TitleCommandKind::Settings))->getModelRow());
    m_project->gameDatas()->titleScreenGameOverDatas()->modelTitleCommands()
        ->appendRow((new SystemTitleCommand(-1, new LangsTranslation("Exit"),
        TitleCommandKind::Exit))->getModelRow());

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
    // Update change state command
    connect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_5_6_commands(QStandardItem *)));
    this->updateCommands();
    disconnect(this, SIGNAL(updatingCommands(QStandardItem *)), this, SLOT(
        updateVersion_1_5_6_commands(QStandardItem *)));
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

    // DLCs
    m_project->gameDatas()->dlcsDatas()->setDefault();
    m_project->writeDlcs();
}
