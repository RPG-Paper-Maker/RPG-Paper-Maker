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

#include "mapproperties.h"
#include "wanok.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MapProperties::MapProperties() :
    MapProperties(1,
                  new LangsTranslation(Wanok::generateMapName(1)),
                  16, 16, 16, 0, 1)
{

}

MapProperties::MapProperties(QString path)
{
    Wanok::readJSON(Common::pathCombine(path, Wanok::fileMapInfos), *this);
}

MapProperties::MapProperties(int i, LangsTranslation* names, int l, int w,
                             int h, int d, int idTileset) :
    SystemLang(i, names),
    m_tilesetID(idTileset),
    m_length(l),
    m_width(w),
    m_height(h),
    m_depth(d),
    m_music(nullptr),
    m_backgroundSound(nullptr)
{

}

MapProperties::~MapProperties()
{
    QHash<Portion, QSet<Position>*>::iterator i;
    for (i = m_outOverflowSprites.begin(); i != m_outOverflowSprites.end(); i++)
        delete *i;
    if (m_music != nullptr) {
        delete m_music;
    }
    if (m_backgroundSound != nullptr) {
        delete m_backgroundSound;
    }
}

QString MapProperties::realName() const {
    return Wanok::generateMapName(id());
}

int MapProperties::length() const { return m_length; }

int MapProperties::width() const { return m_width; }

int MapProperties::height() const { return m_height; }

int MapProperties::depth() const { return m_depth; }

SystemTileset* MapProperties::tileset() const {
    return (SystemTileset*) SuperListItem::getById(
                Wanok::get()->project()->gameDatas()->tilesetsDatas()
                ->model()->invisibleRootItem(), m_tilesetID);
}

void MapProperties::setTilesetID(int id) {
    m_tilesetID = id;
}

void MapProperties::setLength(int l) { m_length = l; }

void MapProperties::setWidth(int w) { m_width = w; }

void MapProperties::setHeight(int h) { m_height = h; }

void MapProperties::setDepth(int d) { m_depth = d; }

EventCommand* MapProperties::music() const { return m_music; }

void MapProperties::setMusic(EventCommand* command) {
    m_music = command;
}

EventCommand* MapProperties::backgroundSound() const {
    return m_backgroundSound;
}

void MapProperties::setBackgroundSound(EventCommand* command) {
    m_backgroundSound = command;
}

void MapProperties::addOverflow(Position& p, Portion& portion) {
    QSet<Position>* portions = m_outOverflowSprites.value(portion);

    if (portions == nullptr) {
        portions = new QSet<Position>;
        m_outOverflowSprites.insert(portion, portions);
    }

    portions->insert(p);
}

void MapProperties::removeOverflow(Position& p, Portion& portion) {
    QSet<Position>* portions = m_outOverflowSprites.value(portion);

    if (portions != nullptr) {
        portions->remove(p);
        if (portions->isEmpty()) {
            m_outOverflowSprites.remove(portion);
            delete portions;
        }
    }
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool MapProperties::isInGrid(Position3D& position, int squareSize, int offset)
const
{
    int y = position.getY(squareSize);
    int d = m_depth * squareSize;
    int h = m_height * squareSize;

    return (position.x() >= -offset && position.x() < m_length + offset &&
            y >= -d && y < h && position.z() >= -offset &&
            position.z() < m_width + offset);
}

// -------------------------------------------------------

void MapProperties::getPortionsNumber(int& lx, int& ly, int& lz) {
    lx = (length() - 1) / Wanok::portionSize;
    ly = (depth() + height() - 1) / Wanok::portionSize;;
    lz = (width() - 1) / Wanok::portionSize;
}

// -------------------------------------------------------

void MapProperties::setCopy(const MapProperties& super){
    SystemLang::setCopy(super);

    m_length = super.m_length;
    m_width = super.m_width;
    m_height = super.m_height;
    m_depth = super.m_depth;
}

// -------------------------------------------------------

void MapProperties::save(QString path, bool temp){
    if (temp)
        path = Common::pathCombine(path, Wanok::TEMP_MAP_FOLDER_NAME);
    Wanok::writeJSON(Common::pathCombine(path, Wanok::fileMapInfos), *this);
}

// -------------------------------------------------------

void MapProperties::updateRaycastingOverflowSprites(Portion &portion,
                                                    float &finalDistance,
                                                    Position &finalPosition,
                                                    QRay3D& ray,
                                                    double cameraHAngle)
{
    Map* map = Wanok::get()->project()->currentMap();
    QSet<Position>* positions = m_outOverflowSprites.value(portion);
    if (positions != nullptr) {
        QSet<Position>::iterator i;
        for (i = positions->begin(); i != positions->end(); i++) {
            Position position = *i;
            Portion portion;
            map->getLocalPortion(position, portion);
            MapPortion* mapPortion = map->mapPortion(portion);
            if (mapPortion != nullptr) {
                mapPortion->updateRaycastingOverflowSprite(map->squareSize(),
                                                           position,
                                                           finalDistance,
                                                           finalPosition, ray,
                                                           cameraHAngle);
            }
        }
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void MapProperties::read(const QJsonObject &json){
    SystemLang::read(json);
    QJsonObject obj;

    setTilesetID(json["tileset"].toInt());
    m_length = json["l"].toInt();
    m_width = json["w"].toInt();
    m_height = json["h"].toInt();
    m_depth = json["d"].toInt();
    m_music = nullptr;
    if (json.contains("music")) {
        m_music = new EventCommand(EventCommandKind::PlayMusic);
        obj = json["music"].toObject();
        m_music->read(obj);
    }
    m_backgroundSound = nullptr;
    if (json.contains("bgs")) {
        m_backgroundSound = new EventCommand(
            EventCommandKind::PlayBackgroundSound);
        obj = json["bgs"].toObject();
        m_backgroundSound->read(obj);
    }

    // Overflow
    QJsonArray tabOverflow = json["ofsprites"].toArray();
    for (int i = 0; i < tabOverflow.size(); i++) {
        QJsonObject objHash = tabOverflow.at(i).toObject();
        QJsonArray tabKey = objHash["k"].toArray();
        QJsonArray tabValue = objHash["v"].toArray();
        Portion portion;
        portion.read(tabKey);
        QSet<Position>* positions = new QSet<Position>;

        for (int j = 0; j < tabValue.size(); j++) {
            QJsonArray tabPosition = tabValue.at(j).toArray();
            Position position;
            position.read(tabPosition);
            positions->insert(position);
        }
        m_outOverflowSprites.insert(portion, positions);
    }
}

// -------------------------------------------------------

void MapProperties::write(QJsonObject &json) const{
    SystemLang::write(json);

    json["tileset"] = m_tilesetID;
    json["l"] = m_length;
    json["w"] = m_width;
    json["h"] = m_height;
    json["d"] = m_depth;
    if (m_music != nullptr) {
        json["music"] = m_music->getJSON();
    }
    if (m_backgroundSound != nullptr) {
        json["bgs"] = m_backgroundSound->getJSON();
    }

    // Overflow
    QHash<Portion, QSet<Position>*>::const_iterator i;
    QJsonArray tabOverflow;
    for (i = m_outOverflowSprites.begin(); i != m_outOverflowSprites.end(); i++)
    {
        Portion portion = i.key();
        QSet<Position>* positions = i.value();
        QJsonObject objHash;
        QJsonArray tabKey;
        QJsonArray tabValue;

        portion.write(tabKey);
        QSet<Position>::iterator j;
        for (j = positions->begin(); j != positions->end(); j++) {
            Position position = *j;
            QJsonArray tabPosition;
            position.write(tabPosition);
            tabValue.append(tabPosition);
        }

        objHash["k"] = tabKey;
        objHash["v"] = tabValue;
        tabOverflow.append(objHash);
    }
    json["ofsprites"] = tabOverflow;
}
