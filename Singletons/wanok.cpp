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

QSet<int> Wanok::mapsToSave;
QSet<int> Wanok::mapsUndoRedo;

// PATHS DATAS
const QString Wanok::pathBasic = pathCombine("Content", "basic");
const QString Wanok::pathBR = pathCombine("Content", "BR");
const QString Wanok::pathDatas = pathCombine("Content", "Datas");
const QString Wanok::pathMaps = pathCombine(pathDatas, "Maps");
const QString Wanok::pathScriptsDir = pathCombine(pathDatas, "Scripts");
const QString Wanok::pathScriptsSystemDir =
        pathCombine(pathScriptsDir, "System");
const QString Wanok::pathScriptsPluginsDir =
        pathCombine(pathScriptsDir, "Plugins");
const QString Wanok::pathCommonEvents =
        pathCombine(pathDatas, "commonEvents.json");
const QString Wanok::pathVariables =
        pathCombine(pathDatas, "variables.json");
const QString Wanok::pathSystem = pathCombine(pathDatas, "system.json");
const QString Wanok::pathBattleSystem =
        pathCombine(pathDatas, "battleSystem.json");
const QString Wanok::pathItems = pathCombine(pathDatas, "items.json");
const QString Wanok::pathSkills = pathCombine(pathDatas, "skills.json");
const QString Wanok::pathWeapons = pathCombine(pathDatas, "weapons.json");
const QString Wanok::pathArmors = pathCombine(pathDatas, "armors.json");
const QString Wanok::pathHeroes = pathCombine(pathDatas, "heroes.json");
const QString Wanok::pathMonsters = pathCombine(pathDatas, "monsters.json");
const QString Wanok::pathTroops = pathCombine(pathDatas, "troops.json");
const QString Wanok::pathClasses = pathCombine(pathDatas, "classes.json");
const QString Wanok::PATH_TILESETS = pathCombine(pathDatas, "tilesets.json");
const QString Wanok::PATH_SPECIAL_ELEMENTS =
        pathCombine(pathDatas, "specialElements.json");
const QString Wanok::pathTreeMap = pathCombine(pathDatas, "treeMap.json");
const QString Wanok::pathLangs = pathCombine(pathDatas, "langs.json");
const QString Wanok::pathScripts = pathCombine(pathDatas, "scripts.json");
const QString Wanok::pathKeyBoard = pathCombine(pathDatas, "keyBoard.json");
const QString Wanok::pathPicturesDatas =
        pathCombine(pathDatas, "pictures.json");
const QString Wanok::pathSaves = pathCombine(pathDatas, "saves.json");

// PATHS PICTURES
const QString Wanok::pathPictures = pathCombine("Content", "Pictures");
const QString Wanok::pathHUD = pathCombine(pathPictures, "HUD");
const QString Wanok::pathTextures2D = pathCombine(pathPictures, "Textures2D");
const QString Wanok::pathBars = pathCombine(pathHUD, "Bars");
const QString Wanok::pathIcons = pathCombine(pathHUD, "Icons");
const QString Wanok::pathAutotiles = pathCombine(pathTextures2D, "Autotiles");
const QString Wanok::pathCharacters = pathCombine(pathTextures2D, "Characters");
const QString Wanok::pathReliefs = pathCombine(pathTextures2D, "Reliefs");
const QString Wanok::pathTilesets = pathCombine(pathTextures2D, "Tilesets");
const QString Wanok::PATH_SPRITE_WALLS = pathCombine(pathTextures2D, "Walls");
const QString Wanok::PATH_3D_OBJECT = pathCombine(pathTextures2D, "3DObjects");
const QString Wanok::PATH_RELIEFS = pathCombine(pathTextures2D, "Reliefs");

const QString Wanok::pathEngineSettings =
        pathCombine("Content", "engineSettings.json");
const QString Wanok::fileMapInfos = "infos.json";
const QString Wanok::fileMapObjects = "objects.json";
const QString Wanok::gamesFolderName = "RPG Paper Maker Games";
const QString Wanok::TEMP_MAP_FOLDER_NAME = "temp";
const QString Wanok::TEMP_UNDOREDO_MAP_FOLDER_NAME = "tempUndoRedo";
const QString Wanok::dirGames = Wanok::pathCombine(
            QStandardPaths::writableLocation(
                QStandardPaths::StandardLocation::DocumentsLocation),
            gamesFolderName);
const QString Wanok::dirDesktop = "desktop";

const int Wanok::portionSize = 16;
const int Wanok::BASIC_SQUARE_SIZE = 32;

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

QString Wanok::pathCombine(const QString & p1, const QString & p2){
    return QDir::cleanPath(p1 + QDir::separator() + p2);
}

// -------------------------------------------------------

void Wanok::writeJSON(QString path, const Serializable &obj){
    QJsonObject gameObject;
    obj.write(gameObject);
    writeOtherJSON(path, gameObject);
}

// -------------------------------------------------------

void Wanok::readJSON(QString path, Serializable &obj){
    QJsonDocument loadDoc;
    readOtherJSON(path, loadDoc);
    obj.read(loadDoc.object());
}

// -------------------------------------------------------

void Wanok::writeOtherJSON(QString path, const QJsonObject &obj,
                           QJsonDocument::JsonFormat format)
{
    QFile saveFile(path);
    if (!saveFile.open(QIODevice::WriteOnly)) { return; }
    QJsonDocument saveDoc(obj);
    saveFile.write(saveDoc.toJson(format));
}

// -------------------------------------------------------

void Wanok::readOtherJSON(QString path, QJsonDocument& loadDoc){
    QFile loadFile(path);
    loadFile.open(QIODevice::ReadOnly);
    QByteArray saveData = loadFile.readAll();
    loadDoc = QJsonDocument::fromJson(saveData);
}

// -------------------------------------------------------

void Wanok::writeArrayJSON(QString path, const QJsonArray &tab){
    QFile saveFile(path);
    if (!saveFile.open(QIODevice::WriteOnly)) { return; }
    QJsonDocument saveDoc(tab);
    saveFile.write(saveDoc.toJson(QJsonDocument::Compact));
}

// -------------------------------------------------------

void Wanok::readArrayJSON(QString path, QJsonDocument& loadDoc){
    QFile loadFile(path);
    loadFile.open(QIODevice::ReadOnly);
    QByteArray saveData = loadFile.readAll();
    loadDoc = QJsonDocument::fromJson(saveData);
}

// -------------------------------------------------------

bool Wanok::copyPath(QString src, QString dst)
{
    QDir dir(src);
    if (!dir.exists())
        return false;

    foreach (QString d, dir.entryList(QDir::Dirs | QDir::NoDotAndDotDot)) {
        QString dst_path = pathCombine(dst, d);
        if (!dir.mkpath(dst_path)) return false;
        if (!copyPath(pathCombine(src, d), dst_path)) return false;
    }

    foreach (QString f, dir.entryList(QDir::Files)) {
        if (!QFile::copy(pathCombine(src, f), pathCombine(dst, f)))
            return false;
    }

    return true;
}

// -------------------------------------------------------

QString Wanok::getDirectoryPath(QString& file){
    return QFileInfo(file).dir().absolutePath();
}

// -------------------------------------------------------

bool Wanok::isDirEmpty(QString path){
    return QDir(path).entryInfoList(QDir::NoDotAndDotDot |
                                    QDir::AllEntries).count() == 0;
}

// -------------------------------------------------------

void Wanok::copyAllFiles(QString pathSource, QString pathTarget){
    QDirIterator files(pathSource, QDir::Files);
    QString path;

    while (files.hasNext()){
        files.next();
        path = Wanok::pathCombine(pathTarget, files.fileName());
        QFile::remove(path);
        QFile::copy(files.filePath(), path);
    }
}

// -------------------------------------------------------

void Wanok::deleteAllFiles(QString pathSource){
    QDirIterator files(pathSource, QDir::Files);

    while (files.hasNext()){
        files.next();
        QFile(files.filePath()).remove();
    }
}

// -------------------------------------------------------

QString Wanok::getFormatNumber(int number, int format, int type){
    return QString("%1").arg(number, format, type, QChar('0'));
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
    QDirIterator directories(Wanok::pathCombine(Wanok::get()->project()
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
    QDir dir(Wanok::pathCombine(Wanok::get()->project()->pathCurrentProject(),
                                Wanok::pathMaps));
    dir.setFilter(QDir::Dirs | QDir::NoDotAndDotDot);
    int nbMaps = dir.count();

    for (id = 1; id <= nbMaps + 1; id++)
        if (!isMapIdExisting(id)) break;

    return id;
}

// -------------------------------------------------------

QString Wanok::generateMapName(int id){
    return "MAP" + Wanok::getFormatNumber(id);
}


// -------------------------------------------------------

bool Wanok::isPressingEnter(QKeyEvent* event) {
    return event->key() == Qt::Key_Space || event->key() == Qt::Key_Enter ||
           event->key() == Qt::Key_Return;
}
