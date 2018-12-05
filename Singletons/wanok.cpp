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

#include <QDir>
#include <QJsonObject>
#include <QJsonDocument>
#include <QDebug>
#include <QStandardPaths>
#include <QDirIterator>
#include <math.h>
#include "wanok.h"
#include "common.h"

QSet<int> Wanok::mapsToSave;
QSet<int> Wanok::mapsUndoRedo;

QString Wanok::shadersExtension = "-3.0";

// COLORS
const QColor Wanok::colorGraySelection = QColor(80, 80, 80);
const QColor Wanok::colorGraySelectionBackground = QColor(80, 80, 80, 75);
const QColor Wanok::colorPurpleSelection = QColor(134, 29, 226);
const QColor Wanok::colorPurpleSelectionBackground = QColor(134, 29, 226, 75);
const QColor Wanok::colorGrayHoverBackground = QColor(50, 50, 50, 75);
const QColor Wanok::colorAlmostWhite = QColor(245, 245, 245);
const QColor Wanok::colorAlmostBlack = QColor(25, 25, 25);
const QColor Wanok::colorAlmostTransparent = QColor(0, 0, 0, 20);
const QColor Wanok::colorFortyTransparent = QColor(0, 0, 0, 40);
const QColor Wanok::colorGrey = QColor(90, 90, 90);

// PATHS DATAS
const QString Wanok::pathBasic = Common::pathCombine("Content", "basic");
const QString Wanok::pathBR = Common::pathCombine("Content", "BR");
const QString Wanok::pathDatas = Common::pathCombine("Content", "Datas");
const QString Wanok::pathMaps = Common::pathCombine(pathDatas, "Maps");
const QString Wanok::pathScriptsDir = Common::pathCombine(pathDatas, "Scripts");
const QString Wanok::pathScriptsSystemDir =
        Common::pathCombine(pathScriptsDir, "System");
const QString Wanok::pathScriptsPluginsDir =
        Common::pathCombine(pathScriptsDir, "Plugins");
const QString Wanok::pathCommonEvents =
        Common::pathCombine(pathDatas, "commonEvents.json");
const QString Wanok::pathVariables =
        Common::pathCombine(pathDatas, "variables.json");
const QString Wanok::pathSystem = Common::pathCombine(pathDatas, "system.json");
const QString Wanok::pathBattleSystem =
        Common::pathCombine(pathDatas, "battleSystem.json");
const QString Wanok::pathItems = Common::pathCombine(pathDatas, "items.json");
const QString Wanok::pathSkills = Common::pathCombine(pathDatas, "skills.json");
const QString Wanok::pathWeapons = Common::pathCombine(pathDatas, "weapons.json");
const QString Wanok::pathArmors = Common::pathCombine(pathDatas, "armors.json");
const QString Wanok::pathHeroes = Common::pathCombine(pathDatas, "heroes.json");
const QString Wanok::pathMonsters = Common::pathCombine(pathDatas, "monsters.json");
const QString Wanok::pathTroops = Common::pathCombine(pathDatas, "troops.json");
const QString Wanok::pathClasses = Common::pathCombine(pathDatas, "classes.json");
const QString Wanok::PATH_TILESETS = Common::pathCombine(pathDatas, "tilesets.json");
const QString Wanok::PATH_SPECIAL_ELEMENTS =
        Common::pathCombine(pathDatas, "specialElements.json");
const QString Wanok::pathTreeMap = Common::pathCombine(pathDatas, "treeMap.json");
const QString Wanok::pathLangs = Common::pathCombine(pathDatas, "langs.json");
const QString Wanok::pathScripts = Common::pathCombine(pathDatas, "scripts.json");
const QString Wanok::pathKeyBoard = Common::pathCombine(pathDatas, "keyBoard.json");
const QString Wanok::pathPicturesDatas =
        Common::pathCombine(pathDatas, "pictures.json");
const QString Wanok::pathSongsDatas =
        Common::pathCombine(pathDatas, "songs.json");
const QString Wanok::pathSaves = Common::pathCombine(pathDatas, "saves.json");

// PATHS PICTURES
const QString Wanok::pathPictures = Common::pathCombine("Content", "Pictures");
const QString Wanok::pathHUD = Common::pathCombine(pathPictures, "HUD");
const QString Wanok::pathTextures2D = Common::pathCombine(pathPictures, "Textures2D");
const QString Wanok::pathBars = Common::pathCombine(pathHUD, "Bars");
const QString Wanok::pathIcons = Common::pathCombine(pathHUD, "Icons");
const QString Wanok::pathAutotiles = Common::pathCombine(pathTextures2D, "Autotiles");
const QString Wanok::pathCharacters = Common::pathCombine(pathTextures2D, "Characters");
const QString Wanok::pathReliefs = Common::pathCombine(pathTextures2D, "Reliefs");
const QString Wanok::pathTilesets = Common::pathCombine(pathTextures2D, "Tilesets");
const QString Wanok::PATH_SPRITE_WALLS = Common::pathCombine(pathTextures2D, "Walls");
const QString Wanok::PATH_3D_OBJECT = Common::pathCombine(pathTextures2D, "3DObjects");
const QString Wanok::PATH_RELIEFS = Common::pathCombine(pathTextures2D, "Reliefs");
const QString Wanok::PATH_BATTLERS = Common::pathCombine(pathTextures2D, "Battlers");
const QString Wanok::PATH_SONGS = Common::pathCombine("Content", "Songs");
const QString Wanok::PATH_MUSICS = Common::pathCombine(PATH_SONGS, "Musics");
const QString Wanok::PATH_BACKGROUND_SOUNDS = Common::pathCombine(PATH_SONGS, "BackgroundSounds");
const QString Wanok::PATH_SOUNDS = Common::pathCombine(PATH_SONGS, "Sounds");
const QString Wanok::PATH_MUSIC_EFFECTS = Common::pathCombine(PATH_SONGS, "MusicEffects");

const QString Wanok::pathEngineSettings =
        Common::pathCombine("Content", "engineSettings.json");
const QString Wanok::fileMapInfos = "infos.json";
const QString Wanok::fileMapObjects = "objects.json";
const QString Wanok::gamesFolderName = "RPG Paper Maker Games";
const QString Wanok::TEMP_MAP_FOLDER_NAME = "temp";
const QString Wanok::TEMP_UNDOREDO_MAP_FOLDER_NAME = "tempUndoRedo";
const QString Wanok::dirGames = Common::pathCombine(
            QStandardPaths::writableLocation(
                QStandardPaths::StandardLocation::DocumentsLocation),
            gamesFolderName);
const QString Wanok::dirDesktop = "desktop";

const int Wanok::portionSize = 16;
const int Wanok::BASIC_SQUARE_SIZE = 32;
const int Wanok::MAX_PIXEL_SIZE = 4096;

bool Wanok::isInConfig = false;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Wanok::Wanok() :
    p_project(nullptr),
    m_engineSettings(nullptr)
{

}

Wanok::~Wanok()
{
    if (p_project != nullptr){
        delete p_project;
        p_project = nullptr;
    }

    delete m_engineSettings;
}

Project* Wanok::project() const { return p_project; }

EngineSettings* Wanok::engineSettings() const { return m_engineSettings; }

int Wanok::getPortionsRay() const {
    return project()->gameDatas()->systemDatas()->portionsRay();
}

int Wanok::getSquareSize() const {
    return project()->gameDatas()->systemDatas()->squareSize();
}

void Wanok::setProject(Project* p) { p_project = p; }

void Wanok::setEngineSettings(EngineSettings* e) { m_engineSettings = e; }

void Wanok::saveEngineSettings() const{
    m_engineSettings->write();
}

void Wanok::loadEngineSettings(){
    delete m_engineSettings;

    m_engineSettings = new EngineSettings;
    m_engineSettings->read();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Wanok::writeJSON(QString path, const Serializable &obj){
    QJsonObject gameObject;
    obj.write(gameObject);
    Common::writeOtherJSON(path, gameObject);
}

// -------------------------------------------------------

void Wanok::readJSON(QString path, Serializable &obj){
    QJsonDocument loadDoc;
    Common::readOtherJSON(path, loadDoc);
    obj.read(loadDoc.object());
}

// -------------------------------------------------------

QKeySequence Wanok::getKeySequence(QKeyEvent *event){
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

QString Wanok::keyToString(int keyInt){
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

int Wanok::mod(int x, int m) {
    int r = x % m;
    return r < 0 ? r + m : r;
}

// -------------------------------------------------------

float Wanok::coefSquareSize() {
    return Wanok::get()->getSquareSize() / ((float) Wanok::BASIC_SQUARE_SIZE);
}

// -------------------------------------------------------

float Wanok::coefReverseSquareSize() {
    return ((float) Wanok::BASIC_SQUARE_SIZE) / Wanok::get()->getSquareSize();
}

// -------------------------------------------------------

QString Wanok::osToString(OSKind os) {
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

bool Wanok::getMinDistance(float& finalDistance, float newDistance) {
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

bool Wanok::isMapIdExisting(int id){
    QDirIterator directories(Common::pathCombine(Wanok::get()->project()
                                                ->pathCurrentProject(),
                                                Wanok::pathMaps),
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

int Wanok::generateMapId(){
    int id;
    QDir dir(Common::pathCombine(Wanok::get()->project()->pathCurrentProject(),
                                Wanok::pathMaps));
    dir.setFilter(QDir::Dirs | QDir::NoDotAndDotDot);
    int nbMaps = dir.count();

    for (id = 1; id <= nbMaps + 1; id++)
        if (!isMapIdExisting(id)) break;

    return id;
}

// -------------------------------------------------------

QString Wanok::generateMapName(int id){
    return "MAP" + Common::getFormatNumber(id);
}


// -------------------------------------------------------

bool Wanok::isPressingEnter(QKeyEvent* event) {
    return event->key() == Qt::Key_Space || event->key() == Qt::Key_Enter ||
           event->key() == Qt::Key_Return;
}

// -------------------------------------------------------

PictureKind Wanok::subSelectionToPictureKind(MapEditorSubSelectionKind subKind)
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
