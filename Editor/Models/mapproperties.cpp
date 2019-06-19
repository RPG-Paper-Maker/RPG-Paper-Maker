/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "mapproperties.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MapProperties::MapProperties() :
    MapProperties(1,
                  new LangsTranslation(RPM::generateMapName(1)),
                  16, 16, 16, 0, 1)
{

}

MapProperties::MapProperties(QString path)
{
    RPM::readJSON(Common::pathCombine(path, RPM::fileMapInfos), *this);
}

MapProperties::MapProperties(int i, LangsTranslation* names, int l, int w,
                             int h, int d, int idTileset) :
    SystemLang(i, names),
    m_tilesetID(idTileset),
    m_length(l),
    m_width(w),
    m_height(h),
    m_depth(d),
    m_music(new SystemPlaySong(-1, SongKind::Music)),
    m_backgroundSound(new SystemPlaySong(-1, SongKind::BackgroundSound)),
    m_skyColorID(new PrimitiveValue(PrimitiveValueKind::DataBase, 1)),
    m_isSkyColor(true)
{
    m_skyColorID->setModelDataBase(RPM::get()
                                   ->project()->gameDatas()->systemDatas()->modelColors());
}

MapProperties::~MapProperties()
{
    QHash<Portion, QSet<Position>*>::iterator i;
    for (i = m_outOverflowSprites.begin(); i != m_outOverflowSprites.end(); i++)
    {
        delete *i;
    }
    for (i = m_outOverflowObjects3D.begin(); i != m_outOverflowObjects3D.end();
         i++)
    {
        delete *i;
    }

    delete m_music;
    delete m_backgroundSound;
    delete m_skyColorID;
}

QString MapProperties::realName() const {
    return RPM::generateMapName(id());
}

int MapProperties::length() const { return m_length; }

int MapProperties::width() const { return m_width; }

int MapProperties::height() const { return m_height; }

int MapProperties::depth() const { return m_depth; }

SystemTileset* MapProperties::tileset() const {
    return reinterpret_cast<SystemTileset *>(SuperListItem::getById(RPM::get()
        ->project()->gameDatas()->tilesetsDatas()->model()->invisibleRootItem(),
        m_tilesetID));
}

void MapProperties::setTilesetID(int id) {
    m_tilesetID = id;
}

void MapProperties::setLength(int l) { m_length = l; }

void MapProperties::setWidth(int w) { m_width = w; }

void MapProperties::setHeight(int h) { m_height = h; }

void MapProperties::setDepth(int d) { m_depth = d; }

SystemPlaySong* MapProperties::music() const { return m_music; }

void MapProperties::setMusic(SystemPlaySong* song) {
    m_music = song;
}

SystemPlaySong* MapProperties::backgroundSound() const {
    return m_backgroundSound;
}

void MapProperties::setBackgroundSound(SystemPlaySong* song) {
    m_backgroundSound = song;
}

PrimitiveValue * MapProperties::skyColorID() const {
    return m_skyColorID;
}

void MapProperties::setSkyColorID(PrimitiveValue *skyColorID) {
    m_skyColorID = skyColorID;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void MapProperties::addOverflow(Position& p, Portion& portion, QHash<Portion,
    QSet<Position>*> &hash)
{
    QSet<Position>* portions = hash.value(portion);

    if (portions == nullptr) {
        portions = new QSet<Position>;
        hash.insert(portion, portions);
    }

    portions->insert(p);
}

// -------------------------------------------------------

void MapProperties::removeOverflow(Position& p, Portion& portion, QHash<Portion,
    QSet<Position>*> &hash)
{
    QSet<Position>* portions = hash.value(portion);

    if (portions != nullptr) {
        portions->remove(p);
        if (portions->isEmpty()) {
            hash.remove(portion);
            delete portions;
        }
    }
}

// -------------------------------------------------------

void MapProperties::addOverflowSprites(Position& p, Portion& portion) {
    addOverflow(p, portion, m_outOverflowSprites);
}

// -------------------------------------------------------

void MapProperties::removeOverflowSprites(Position& p, Portion& portion) {
    removeOverflow(p, portion, m_outOverflowSprites);
}

// -------------------------------------------------------

void MapProperties::addOverflowObjects3D(Position &p, Portion& portion) {
    addOverflow(p, portion, m_outOverflowObjects3D);
}

// -------------------------------------------------------

void MapProperties::removeOverflowObjects3D(Position& p, Portion& portion) {
    removeOverflow(p, portion, m_outOverflowObjects3D);
}

// -------------------------------------------------------

bool MapProperties::isInGrid(Position3D& position, int squareSize, int offset)
const
{
    int y = position.getY(squareSize);
    int d = m_depth * squareSize;
    int h = m_height * squareSize + squareSize - 1;

    return (position.x() >= -offset && position.x() < m_length + offset &&
            y >= -d && y <= h && position.z() >= -offset &&
            position.z() < m_width + offset);
}

// -------------------------------------------------------

void MapProperties::getPortionsNumber(int& lx, int& ld, int& lh, int& lz) {
    lx = (length() - 1) / RPM::portionSize;
    ld = (depth() - 1) / RPM::portionSize;
    if (depth() > 0) {
        ld++;
    }
    lh = (height() - 1) / RPM::portionSize;
    lz = (width() - 1) / RPM::portionSize;
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
        path = Common::pathCombine(path, RPM::TEMP_MAP_FOLDER_NAME);
    RPM::writeJSON(Common::pathCombine(path, RPM::fileMapInfos), *this);
}

// -------------------------------------------------------

void MapProperties::updateRaycastingOverflowSprites(Portion &portion,
                                                    float &finalDistance,
                                                    Position &finalPosition,
                                                    QRay3D& ray,
                                                    double cameraHAngle)
{
    Map* map = RPM::get()->project()->currentMap();
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

void MapProperties::updateRaycastingOverflowObjects3D(Portion& portion, float
    &finalDistance, Position &finalPosition, QRay3D &ray)
{
    Map* map = RPM::get()->project()->currentMap();
    QSet<Position>* positions = m_outOverflowObjects3D.value(portion);
    if (positions != nullptr) {
        QSet<Position>::iterator i;
        for (i = positions->begin(); i != positions->end(); i++) {
            Position position = *i;
            Portion portion;
            map->getLocalPortion(position, portion);
            MapPortion* mapPortion = map->mapPortion(portion);
            if (mapPortion != nullptr) {
                mapPortion->updateRaycastingOverflowObject3D(position,
                    finalDistance, finalPosition, ray);
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

    // Musics
    m_music = new SystemPlaySong(-1, SongKind::Music);
    m_music->read(json["music"].toObject());
    m_backgroundSound = new SystemPlaySong(-1, SongKind::BackgroundSound);
    m_backgroundSound->read(json["bgs"].toObject());

    // Sky
    m_skyColorID = new PrimitiveValue(PrimitiveValueKind::DataBase, 1);
    m_isSkyColor = json.contains("isky") ? json["isky"].toBool() : true;
    if (m_isSkyColor) {
        m_skyColorID->read(json["sky"].toObject());
    }
    m_skyColorID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->systemDatas()->modelColors());

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
    tabOverflow = json["of3d"].toArray();
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
        m_outOverflowObjects3D.insert(portion, positions);
    }
}

// -------------------------------------------------------

void MapProperties::write(QJsonObject &json) const{
    SystemLang::write(json);
    QJsonObject obj;

    json["tileset"] = m_tilesetID;
    json["l"] = m_length;
    json["w"] = m_width;
    json["h"] = m_height;
    json["d"] = m_depth;

    // Musics
    obj = QJsonObject();
    m_music->write(obj);
    json["music"] = obj;
    obj = QJsonObject();
    m_backgroundSound->write(obj);
    json["bgs"] = obj;

    // Sky
    json["isky"] = m_isSkyColor;
    if (m_isSkyColor) {
        QJsonObject jsonObj;
        m_skyColorID->write(jsonObj);
        json["sky"] = jsonObj;
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
    for (i = m_outOverflowObjects3D.begin(); i != m_outOverflowObjects3D.end();
         i++)
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
    json["of3d"] = tabOverflow;
}
