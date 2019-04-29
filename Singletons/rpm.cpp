/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include <QDir>
#include <QJsonObject>
#include <QJsonDocument>
#include <QDebug>
#include <QStandardPaths>
#include <QDirIterator>
#include <cmath>
#include "rpm.h"
#include "common.h"

QSet<int> RPM::mapsToSave;
QSet<int> RPM::mapsUndoRedo;

QString RPM::shadersExtension = "-3.0";

// COLORS
const QColor RPM::colorGraySelectionDarker = QColor(60, 60, 60);
const QColor RPM::colorGraySelection = QColor(80, 80, 80);
const QColor RPM::colorGraySelectionLighter = QColor(220, 220, 220);
const QColor RPM::colorGraySelectionBackground = QColor(80, 80, 80, 75);
const QColor RPM::colorPurpleSelection = QColor(134, 29, 226);
const QColor RPM::colorPurpleSelectionBackground = QColor(134, 29, 226, 75);
const QColor RPM::colorGrayHoverBackground = QColor(50, 50, 50, 75);
const QColor RPM::colorAlmostWhite = QColor(245, 245, 245);
const QColor RPM::colorAlmostBlack = QColor(25, 25, 25);
const QColor RPM::colorAlmostTransparent = QColor(0, 0, 0, 20);
const QColor RPM::colorFortyTransparent = QColor(0, 0, 0, 40);
const QColor RPM::colorGrey = QColor(90, 90, 90);
const QColor RPM::colorMenuSelectionBlue = QColor(47, 139, 196);

// PATHS DATAS
const QString RPM::pathBasic = Common::pathCombine("Content", "basic");
const QString RPM::pathBR = Common::pathCombine("Content", "BR");
const QString RPM::pathDatas = Common::pathCombine("Content", "Datas");
const QString RPM::pathMaps = Common::pathCombine(pathDatas, "Maps");
const QString RPM::pathScriptsDir = Common::pathCombine(pathDatas, "Scripts");
const QString RPM::pathScriptsSystemDir =
        Common::pathCombine(pathScriptsDir, "System");
const QString RPM::pathScriptsPluginsDir =
        Common::pathCombine(pathScriptsDir, "Plugins");
const QString RPM::pathCommonEvents =
        Common::pathCombine(pathDatas, "commonEvents.json");
const QString RPM::pathVariables =
        Common::pathCombine(pathDatas, "variables.json");
const QString RPM::pathSystem = Common::pathCombine(pathDatas, "system.json");
const QString RPM::pathBattleSystem =
        Common::pathCombine(pathDatas, "battleSystem.json");
const QString RPM::pathItems = Common::pathCombine(pathDatas, "items.json");
const QString RPM::pathSkills = Common::pathCombine(pathDatas, "skills.json");
const QString RPM::pathWeapons = Common::pathCombine(pathDatas, "weapons.json");
const QString RPM::pathArmors = Common::pathCombine(pathDatas, "armors.json");
const QString RPM::pathHeroes = Common::pathCombine(pathDatas, "heroes.json");
const QString RPM::pathMonsters = Common::pathCombine(pathDatas, "monsters.json");
const QString RPM::pathTroops = Common::pathCombine(pathDatas, "troops.json");
const QString RPM::pathClasses = Common::pathCombine(pathDatas, "classes.json");
const QString RPM::PATH_TILESETS = Common::pathCombine(pathDatas, "tilesets.json");
const QString RPM::PATH_ANIMATIONS = Common::pathCombine(pathDatas, "animations.json");
const QString RPM::PATH_STATUS = Common::pathCombine(pathDatas, "status.json");
const QString RPM::PATH_SPECIAL_ELEMENTS =
        Common::pathCombine(pathDatas, "specialElements.json");
const QString RPM::PATH_TITLE_SCREEN_GAME_OVER = Common::pathCombine(pathDatas,
    "titlescreenGameover.json");
const QString RPM::pathTreeMap = Common::pathCombine(pathDatas, "treeMap.json");
const QString RPM::pathLangs = Common::pathCombine(pathDatas, "langs.json");
const QString RPM::pathScripts = Common::pathCombine(pathDatas, "scripts.json");
const QString RPM::pathKeyBoard = Common::pathCombine(pathDatas, "keyBoard.json");
const QString RPM::pathPicturesDatas =
        Common::pathCombine(pathDatas, "pictures.json");
const QString RPM::pathSongsDatas =
        Common::pathCombine(pathDatas, "songs.json");
const QString RPM::pathSaves = Common::pathCombine(pathDatas, "saves.json");

// PATHS PICTURES
const QString RPM::pathPictures = Common::pathCombine("Content", "Pictures");
const QString RPM::pathHUD = Common::pathCombine(pathPictures, "HUD");
const QString RPM::pathTextures2D = Common::pathCombine(pathPictures, "Textures2D");
const QString RPM::pathBars = Common::pathCombine(pathHUD, "Bars");
const QString RPM::pathIcons = Common::pathCombine(pathHUD, "Icons");
const QString RPM::PATH_FACESETS = Common::pathCombine(pathHUD, "Facesets");
const QString RPM::PATH_WINDOW_SKINS = Common::pathCombine(pathHUD, "WindowSkins");
const QString RPM::PATH_TITLE_SCREEN = Common::pathCombine(pathHUD, "TitleScreen");
const QString RPM::pathAutotiles = Common::pathCombine(pathTextures2D, "Autotiles");
const QString RPM::pathCharacters = Common::pathCombine(pathTextures2D, "Characters");
const QString RPM::pathReliefs = Common::pathCombine(pathTextures2D, "Reliefs");
const QString RPM::pathTilesets = Common::pathCombine(pathTextures2D, "Tilesets");
const QString RPM::PATH_SPRITE_WALLS = Common::pathCombine(pathTextures2D, "Walls");
const QString RPM::PATH_3D_OBJECT = Common::pathCombine(pathTextures2D, "3DObjects");
const QString RPM::PATH_RELIEFS = Common::pathCombine(pathTextures2D, "Reliefs");
const QString RPM::PATH_BATTLERS = Common::pathCombine(pathTextures2D, "Battlers");
const QString RPM::PATH_SONGS = Common::pathCombine("Content", "Songs");
const QString RPM::PATH_MUSICS = Common::pathCombine(PATH_SONGS, "Musics");
const QString RPM::PATH_BACKGROUND_SOUNDS = Common::pathCombine(PATH_SONGS, "BackgroundSounds");
const QString RPM::PATH_SOUNDS = Common::pathCombine(PATH_SONGS, "Sounds");
const QString RPM::PATH_MUSIC_EFFECTS = Common::pathCombine(PATH_SONGS, "MusicEffects");

const QString RPM::pathEngineSettings =
        Common::pathCombine("Content", "engineSettings.json");
const QString RPM::fileMapInfos = "infos.json";
const QString RPM::fileMapObjects = "objects.json";
const QString RPM::gamesFolderName = "RPG Paper Maker Games";
const QString RPM::TEMP_MAP_FOLDER_NAME = "temp";
const QString RPM::TEMP_UNDOREDO_MAP_FOLDER_NAME = "tempUndoRedo";
const QString RPM::dirGames = Common::pathCombine(
            QStandardPaths::writableLocation(
                QStandardPaths::StandardLocation::DocumentsLocation),
            gamesFolderName);
const QString RPM::dirDesktop = "desktop";

const int RPM::portionSize = 16;
const int RPM::BASIC_SQUARE_SIZE = 32;
const int RPM::MAX_PIXEL_SIZE = 4096;

bool RPM::isInConfig = false;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

RPM::RPM() :
    p_project(nullptr),
    m_engineSettings(nullptr)
{

}

RPM::~RPM()
{
    if (p_project != nullptr){
        delete p_project;
        p_project = nullptr;
    }

    delete m_engineSettings;
}

Project* RPM::project() const { return p_project; }

EngineSettings* RPM::engineSettings() const { return m_engineSettings; }

int RPM::getPortionsRay() const {
    return project()->gameDatas()->systemDatas()->portionsRay();
}

int RPM::getSquareSize() const {
    return project()->gameDatas()->systemDatas()->squareSize();
}

void RPM::setProject(Project* p) { p_project = p; }

void RPM::setEngineSettings(EngineSettings* e) { m_engineSettings = e; }

void RPM::saveEngineSettings() const{
    m_engineSettings->write();
}

void RPM::loadEngineSettings(){
    delete m_engineSettings;

    m_engineSettings = new EngineSettings;
    m_engineSettings->read();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void RPM::writeJSON(QString path, const Serializable &obj){
    QJsonObject gameObject;
    obj.write(gameObject);
    Common::writeOtherJSON(path, gameObject);
}

// -------------------------------------------------------

void RPM::readJSON(QString path, Serializable &obj){
    QJsonDocument loadDoc;
    Common::readOtherJSON(path, loadDoc);
    obj.read(loadDoc.object());
}

// -------------------------------------------------------

void RPM::writeRect(QJsonArray &json, const QRect &rect) {
    json.append(rect.x());
    json.append(rect.y());
    json.append(rect.width());
    json.append(rect.height());
}

// -------------------------------------------------------

void RPM::readRect(QJsonArray&json, QRect& rect) {
    rect.setX(json[0].toInt());
    rect.setY(json[1].toInt());
    rect.setWidth(json[2].toInt());
    rect.setHeight(json[3].toInt());
}

// -------------------------------------------------------

void RPM::writeRectF(QJsonArray &json, const QRectF &rect) {
    json.append(rect.x());
    json.append(rect.y());
    json.append(rect.width());
    json.append(rect.height());
}

// -------------------------------------------------------

void RPM::readRectF(QJsonArray&json, QRectF& rect) {
    rect.setX(json[0].toDouble());
    rect.setY(json[1].toDouble());
    rect.setWidth(json[2].toDouble());
    rect.setHeight(json[3].toDouble());
}

// -------------------------------------------------------

QKeySequence RPM::getKeySequence(QKeyEvent *event){
    int keyInt = event->key();
    Qt::Key key = static_cast<Qt::Key>(keyInt);

    if(key != Qt::Key_unknown){

        // the user have clicked just and only the special keys Ctrl, Shift,
        // Alt, Meta.
        if(key != Qt::Key_Control &&
            key != Qt::Key_Shift &&
            key != Qt::Key_Alt &&
            key != Qt::Key_Meta)
        {
            // check for a combination of user clicks
            Qt::KeyboardModifiers modifiers = event->modifiers();
            if(modifiers & Qt::ShiftModifier)
                keyInt += Qt::SHIFT;
            if(modifiers & Qt::ControlModifier)
                keyInt += Qt::CTRL;
            if(modifiers & Qt::AltModifier)
                keyInt += Qt::ALT;
            if(modifiers & Qt::MetaModifier)
                keyInt += Qt::META;

            return QKeySequence(keyInt);
        }
    }

    return QKeySequence();
}

// -------------------------------------------------------

QString RPM::keyToString(int keyInt){
    QKeySequence seq(keyInt);
    Qt::Key key = static_cast<Qt::Key>(keyInt);

    if (key != Qt::Key_unknown){
        switch (key) {
        case Qt::Key_Control:
            return "CTRL";
        case Qt::Key_Shift:
            return "SHIFT";
        case Qt::Key_Alt:
            return "ALT";
        case Qt::Key_Meta:
            return "META";
        case Qt::Key_AltGr:
            return "ALTGR";
        default:
            return seq.toString();
        }
    }

    return "?";
}

// -------------------------------------------------------

int RPM::mod(int x, int m) {
    int r = x % m;
    return r < 0 ? r + m : r;
}

// -------------------------------------------------------

float RPM::coefSquareSize() {
    return RPM::get()->getSquareSize() / ((float) RPM::BASIC_SQUARE_SIZE);
}

// -------------------------------------------------------

float RPM::coefReverseSquareSize() {
    return ((float) RPM::BASIC_SQUARE_SIZE) / RPM::get()->getSquareSize();
}

// -------------------------------------------------------

QString RPM::osToString(OSKind os) {
    switch (os) {
    case OSKind::Window:
        return "Window";
    case OSKind::Linux:
        return "Linux";
    case OSKind::Mac:
        return "Mac";
    }

    return "";
}

// -------------------------------------------------------

bool RPM::getMinDistance(float& finalDistance, float newDistance) {
    if (std::isnan(finalDistance))
        finalDistance = 0;
    if (std::isnan(newDistance))
        newDistance = 0;

    if (finalDistance == 0) {
        if (newDistance > 0) {
            finalDistance = newDistance;
            return true;
        }
    }
    else {
        if (newDistance > 0) {
            if (newDistance < finalDistance) {
                finalDistance = newDistance;
                return true;
            }
        }
    }

    return false;
}

// -------------------------------------------------------
// check if a directory with that id in Maps folder already exists

bool RPM::isMapIdExisting(int id){
    QDirIterator directories(Common::pathCombine(RPM::get()->project()
                                                ->pathCurrentProject(),
                                                RPM::pathMaps),
                             QDir::Dirs | QDir::NoDotAndDotDot);

    while (directories.hasNext()){
        directories.next();
        if (directories.fileName() == generateMapName(id))
            return true;
    }

    return false;
}

// -------------------------------------------------------
// generate an id for a new map according to the ids of the already existing
// maps

int RPM::generateMapId(){
    int id;
    QDir dir(Common::pathCombine(RPM::get()->project()->pathCurrentProject(),
                                RPM::pathMaps));
    dir.setFilter(QDir::Dirs | QDir::NoDotAndDotDot);
    int nbMaps = dir.count();

    for (id = 1; id <= nbMaps + 1; id++)
        if (!isMapIdExisting(id)) break;

    return id;
}

// -------------------------------------------------------

QString RPM::generateMapName(int id){
    return "MAP" + Common::getFormatNumber(id);
}


// -------------------------------------------------------

bool RPM::isPressingEnter(QKeyEvent* event) {
    return event->key() == Qt::Key_Space || event->key() == Qt::Key_Enter ||
           event->key() == Qt::Key_Return;
}

// -------------------------------------------------------

PictureKind RPM::subSelectionToPictureKind(MapEditorSubSelectionKind subKind)
{
    switch (subKind) {
    case MapEditorSubSelectionKind::Autotiles:
        return PictureKind::Autotiles;
    case MapEditorSubSelectionKind::SpritesWall:
        return PictureKind::Walls;
    default:
        return PictureKind::None;
    }
}
