/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "mapproperties.h"
#include "rpm.h"
#include "common.h"

const QString MapProperties::JSON_TILESET_ID = "tileset";
const QString MapProperties::JSON_LENGTH = "l";
const QString MapProperties::JSON_WIDTH = "w";
const QString MapProperties::JSON_HEIGHT = "h";
const QString MapProperties::JSON_DEPTH = "d";
const QString MapProperties::JSON_MUSIC = "music";
const QString MapProperties::JSON_BACKGROUND_SOUND = "bgs";
const QString MapProperties::JSON_CAMERA_PROPERTIES = "cp";
const QString MapProperties::JSON_IS_SKY_COLOR = "isky";
const QString MapProperties::JSON_SKY_COLOR_ID = "sky";
const QString MapProperties::JSON_IS_SKY_IMAGE = "isi";
const QString MapProperties::JSON_SKY_PICTURE_ID = "ipid";
const QString MapProperties::JSON_SKY_BOX_ID = "sbid";
const QString MapProperties::JSON_STARTUP_OBJECT = "so";
const QString MapProperties::JSON_OVERFLOW_SPRITES = "ofsprites";
const QString MapProperties::JSON_OVERFLOW_OBJECTS3D = "of3d";
const QString MapProperties::JSON_OVERFLOW_MOUNTAINS = "ofmoun";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MapProperties::MapProperties() :
    MapProperties(1, new LangsTranslation(Map::generateMapName(1)), 16, 16, 16,
        0, 1)
{

}

MapProperties::MapProperties(QString path) {
    RPM::readJSON(Common::pathCombine(path, RPM::FILE_MAP_INFOS), *this);
}

MapProperties::MapProperties(int i, LangsTranslation* names, int l, int w, int h
    , int d, int idTileset) :
    SystemLang(i, names),
    m_tilesetID(idTileset),
    m_length(l),
    m_width(w),
    m_height(h),
    m_depth(d),
    m_music(new SystemPlaySong(-1, SongKind::Music)),
    m_backgroundSound(new SystemPlaySong(-1, SongKind::BackgroundSound)),
    m_cameraProperties(new PrimitiveValue(PrimitiveValueKind::DataBase, 1)),
    m_isSkyColor(true),
    m_skyColorID(new PrimitiveValue(PrimitiveValueKind::DataBase, 1)),
    m_isSkyImage(false),
    m_skyPictureID(new SuperListItem(-1)),
    m_skyboxID(new PrimitiveValue(PrimitiveValueKind::DataBase, 1)),
    m_startupObject(new SystemCommonObject)
{
    m_cameraProperties->setModelDataBase(RPM::get()->project()->gameDatas()
        ->systemDatas()->modelcameraProperties());
    m_skyColorID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->systemDatas()->modelColors());
    m_skyboxID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->systemDatas()->modelSkyBoxes());
    m_startupObject->setDefaultStartupObject();
}

MapProperties::~MapProperties() {
    this->clearOverflowSprites();
    this->clearOverflowObjects3D();
    this->clearOverflowMountains();
    delete m_music;
    delete m_backgroundSound;
    delete m_cameraProperties;
    delete m_skyColorID;
    delete m_skyPictureID;
    delete m_skyboxID;
    delete m_startupObject;
}

SystemTileset * MapProperties::tileset() const {
    return reinterpret_cast<SystemTileset *>(SuperListItem::getById(RPM::get()
        ->project()->gameDatas()->tilesetsDatas()->model()->invisibleRootItem(),
        m_tilesetID));
}

void MapProperties::setTilesetID(int id) {
    m_tilesetID = id;
}

int MapProperties::length() const {
    return m_length;
}

void MapProperties::setLength(int l) {
    m_length = l;
}

int MapProperties::width() const {
    return m_width;
}

void MapProperties::setWidth(int w) {
    m_width = w;
}

int MapProperties::height() const {
    return m_height;
}

void MapProperties::setHeight(int h) {
    m_height = h;
}

int MapProperties::depth() const {
    return m_depth;
}

void MapProperties::setDepth(int d) {
    m_depth = d;
}

SystemPlaySong * MapProperties::music() const {
    return m_music;
}

void MapProperties::setMusic(SystemPlaySong *song) {
    m_music = song;
}

SystemPlaySong * MapProperties::backgroundSound() const {
    return m_backgroundSound;
}

void MapProperties::setBackgroundSound(SystemPlaySong *song) {
    m_backgroundSound = song;
}

PrimitiveValue * MapProperties::cameraProperties() const {
    return m_cameraProperties;
}

bool MapProperties::isSkyColor() const
{
    return m_isSkyColor;
}

void MapProperties::setIsSkyColor(bool isc)
{
    m_isSkyColor = isc;
}

PrimitiveValue * MapProperties::skyColorID() const {
    return m_skyColorID;
}

void MapProperties::setSkyColorID(PrimitiveValue *skyColorID) {
    m_skyColorID = skyColorID;
}

bool MapProperties::isSkyImage() const
{
    return m_isSkyImage;
}

void MapProperties::setIsSkyImage(bool isi)
{
    m_isSkyImage = isi;
}

SuperListItem * MapProperties::skyPictureID() const
{
    return m_skyPictureID;
}

PrimitiveValue * MapProperties::skyboxID() const
{
    return m_skyboxID;
}

SystemCommonObject * MapProperties::startupObject() const {
    return m_startupObject;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString MapProperties::realName() const {
    return Map::generateMapName(this->id());
}

// -------------------------------------------------------

void MapProperties::clearOverflowSprites() {
    QHash<Portion, QSet<Position>*>::iterator i;
    for (i = m_outOverflowSprites.begin(); i != m_outOverflowSprites.end(); i++)
    {
        delete *i;
    }
    m_outOverflowSprites.clear();
}

// -------------------------------------------------------

void MapProperties::clearOverflowObjects3D() {
    QHash<Portion, QSet<Position>*>::iterator i;
    for (i = m_outOverflowObjects3D.begin(); i != m_outOverflowObjects3D.end();
         i++)
    {
        delete *i;
    }
    m_outOverflowObjects3D.clear();
}

// -------------------------------------------------------


void MapProperties::clearOverflowMountains() {
    QHash<Portion, QSet<Position>*>::iterator i;
    for (i = m_outOverflowMountains.begin(); i != m_outOverflowMountains.end();
         i++)
    {
        delete *i;
    }
    m_outOverflowMountains.clear();
}

// -------------------------------------------------------

void MapProperties::addOverflow(Position &p, Portion &portion, QHash<Portion,
    QSet<Position> *> &hash)
{
    QSet<Position> *portions;

    portions = hash.value(portion);
    if (portions == nullptr) {
        portions = new QSet<Position>;
        hash.insert(portion, portions);
    }
    portions->insert(p);
}

// -------------------------------------------------------

void MapProperties::removeOverflow(Position &p, Portion &portion, QHash<Portion,
    QSet<Position> *> &hash)
{
    QSet<Position> *portions;

    portions = hash.value(portion);
    if (portions != nullptr) {
        portions->remove(p);
        if (portions->isEmpty()) {
            hash.remove(portion);
            delete portions;
        }
    }
}

// -------------------------------------------------------

void MapProperties::addOverflowSprites(Position &p, Portion &portion) {
    this->addOverflow(p, portion, m_outOverflowSprites);
}

// -------------------------------------------------------

void MapProperties::removeOverflowSprites(Position &p, Portion &portion) {
    this->removeOverflow(p, portion, m_outOverflowSprites);
}

// -------------------------------------------------------

void MapProperties::addOverflowObjects3D(Position &p, Portion &portion) {
    this->addOverflow(p, portion, m_outOverflowObjects3D);
}

// -------------------------------------------------------

void MapProperties::removeOverflowObjects3D(Position &p, Portion &portion) {
    this->removeOverflow(p, portion, m_outOverflowObjects3D);
}

// -------------------------------------------------------

void MapProperties::addOverflowMountains(Position &p, Portion &portion) {
    this->addOverflow(p, portion, m_outOverflowMountains);
}

// -------------------------------------------------------

void MapProperties::removeOverflowMountains(Position &p, Portion &portion) {
    this->removeOverflow(p, portion, m_outOverflowMountains);
}

// -------------------------------------------------------

bool MapProperties::isInGrid(Position3D &position, int squareSize, int offset)
const
{
    int y, d, h;

    y = position.getY(squareSize);
    d = m_depth * squareSize;
    h = m_height * squareSize + squareSize - 1;

    return (position.x() >= -offset && position.x() < m_length + offset && y >=
        -d && y <= h && position.z() >= -offset && position.z() < m_width +
        offset);
}

// -------------------------------------------------------

void MapProperties::getPortionsNumber(int &lx, int &ld, int &lh, int &lz) {
    lx = (length() - 1) / RPM::PORTION_SIZE;
    ld = (depth() - 1) / RPM::PORTION_SIZE;
    if (depth() > 0) {
        ld++;
    }
    lh = (height() - 1) / RPM::PORTION_SIZE;
    lz = (width() - 1) / RPM::PORTION_SIZE;
}

// -------------------------------------------------------

void MapProperties::setCopy(const SuperListItem &super) {
    QHash<Portion, QSet<Position> *>::const_iterator i;
    QSet<Position>::iterator j;
    QSet<Position> *set, *superSet;
    const MapProperties *properties;

    properties = reinterpret_cast<const MapProperties *>(&super);
    SystemLang::setCopy(*properties);
    m_length = properties->m_length;
    m_width = properties->m_width;
    m_height = properties->m_height;
    m_depth = properties->m_depth;
    m_music->setId(properties->m_music->id());
    m_backgroundSound->setId(properties->m_backgroundSound->id());
    m_isSkyColor = properties->m_isSkyColor;
    m_skyColorID->setCopy(*properties->m_skyColorID);
    m_isSkyImage = properties->m_isSkyImage;
    m_skyPictureID->setId(properties->m_skyPictureID->id());
    m_skyboxID->setCopy(*properties->m_skyboxID);
    this->clearOverflowSprites();
    for (i = properties->m_outOverflowSprites.begin(); i != properties
         ->m_outOverflowSprites.end(); i++)
    {
        set = new QSet<Position>();
        superSet = i.value();
        for (j = superSet->begin(); j != superSet->end(); j++) {
            set->insert(*j);
        }
        m_outOverflowSprites.insert(i.key(), set);
    }
    this->clearOverflowObjects3D();
    for (i = properties->m_outOverflowObjects3D.begin(); i != properties
         ->m_outOverflowObjects3D.end(); i++)
    {
        set = new QSet<Position>();
        superSet = i.value();
        for (j = superSet->begin(); j != superSet->end(); j++) {
            set->insert(*j);
        }
        m_outOverflowObjects3D.insert(i.key(), set);
    }
    this->clearOverflowMountains();
    for (i = properties->m_outOverflowMountains.begin(); i != properties
         ->m_outOverflowMountains.end(); i++)
    {
        set = new QSet<Position>();
        superSet = i.value();
        for (j = superSet->begin(); j != superSet->end(); j++) {
            set->insert(*j);
        }
        m_outOverflowMountains.insert(i.key(), set);
    }
}

// -------------------------------------------------------

void MapProperties::save(QString path, bool temp) {
    if (temp) {
        path = Common::pathCombine(path, RPM::FOLDER_TEMP_MAP);
    }
    RPM::writeJSON(Common::pathCombine(path, RPM::FILE_MAP_INFOS), *this);
}

// -------------------------------------------------------

void MapProperties::setDefaultStartupObject() {
    m_startupObject->setDefaultStartupObject();
}

// -------------------------------------------------------

void MapProperties::adjustPosition(QVector3D *position) {
    if (position->x() / RPM::getSquareSize() >= m_length) {
        position->setX((m_length - 1) * RPM::getSquareSize());
    }
    if (position->z() / RPM::getSquareSize() >= m_width) {
        position->setZ((m_width - 1) * RPM::getSquareSize());
    }
    if (position->y() / RPM::getSquareSize() >= m_height) {
        position->setY((m_height - 1) * RPM::getSquareSize());
    }
    if (position->y() / RPM::getSquareSize() < -m_depth) {
        position->setY(-m_depth * RPM::getSquareSize());
    }
}

// -------------------------------------------------------

MapElement * MapProperties::updateRaycastingOverflowSprites(Portion &portion,
    float &finalDistance, Position &finalPosition, QRay3D &ray, double
    cameraHAngle)
{
    QSet<Position> *positions;
    MapElement *element;
    QSet<Position>::iterator i;
    Map *map;
    Position position;
    MapPortion *mapPortion;

    map = RPM::get()->project()->currentMap();
    positions = m_outOverflowSprites.value(portion);
    element = nullptr;
    if (positions != nullptr) {
        for (i = positions->begin(); i != positions->end(); i++) {
            position = *i;
            map->getLocalPortion(position, portion);
            mapPortion = map->mapPortion(portion);
            if (mapPortion != nullptr) {
                element = mapPortion->updateRaycastingOverflowSprite(map
                    ->squareSize(), position, finalDistance, finalPosition, ray,
                    cameraHAngle);
                if (element != nullptr) {
                    return element;
                }
            }
        }
    }

    return element;
}

// -------------------------------------------------------

MapElement * MapProperties::updateRaycastingOverflowObjects3D(Portion& portion,
    float &finalDistance, Position &finalPosition, QRay3D &ray)
{
    QSet<Position> *positions;
    MapElement *element;
    QSet<Position>::iterator i;
    Map *map;
    Position position;
    MapPortion *mapPortion;

    map = RPM::get()->project()->currentMap();
    positions = m_outOverflowObjects3D.value(portion);
    element = nullptr;
    if (positions != nullptr) {
        for (i = positions->begin(); i != positions->end(); i++) {
            position = *i;
            map->getLocalPortion(position, portion);
            mapPortion = map->mapPortion(portion);
            if (mapPortion != nullptr) {
                element = mapPortion->updateRaycastingOverflowObject3D(position,
                    finalDistance, finalPosition, ray);
                if (element != nullptr) {
                    return element;
                }
            }
        }
    }

    return element;
}

// -------------------------------------------------------

MapElement * MapProperties::updateRaycastingOverflowMountains(Portion& portion,
    float &finalDistance, Position &finalPosition, QRay3D &ray)
{
    QSet<Position> *positions;
    MapElement *element;
    QSet<Position>::iterator i;
    Map *map;
    Position position;
    MapPortion *mapPortion;

    map = RPM::get()->project()->currentMap();
    positions = m_outOverflowMountains.value(portion);
    element = nullptr;
    if (positions != nullptr) {
        for (i = positions->begin(); i != positions->end(); i++) {
            position = *i;
            map->getLocalPortion(position, portion);
            mapPortion = map->mapPortion(portion);
            if (mapPortion != nullptr) {
                element = mapPortion->updateRaycastingOverflowMountain(position
                    , finalDistance, finalPosition, ray);
                if (element != nullptr) {
                    return element;
                }
            }
        }
    }

    return element;
}

// -------------------------------------------------------

void MapProperties::readOverflow(const QJsonArray &tab, QHash<Portion, QSet<
    Position> *> &overflow)
{
    QJsonObject objHash;
    QJsonArray tabKey;
    QJsonArray tabValue;
    QSet<Position> *positions;
    QJsonArray tabPosition;
    int i, j, l, ll;

    for (i = 0, l = tab.size(); i < l; i++) {
        objHash = tab.at(i).toObject();
        tabKey = objHash[RPM::JSON_KEY].toArray();
        tabValue = objHash[RPM::JSON_VALUE].toArray();
        Portion portion;
        portion.read(tabKey);
        positions = new QSet<Position>;

        for (j = 0, ll = tabValue.size(); j < ll; j++) {
            tabPosition = tabValue.at(j).toArray();
            Position position;
            position.read(tabPosition);
            positions->insert(position);
        }
        overflow.insert(portion, positions);
    }
}

// -------------------------------------------------------

void MapProperties::writeOverflow(QJsonObject &json, const QHash<Portion, QSet<
    Position> *> &overflow, QString jsonLabel) const
{
    QHash<Portion, QSet<Position>*>::const_iterator i;
    QSet<Position>::iterator j;
    QJsonArray tabOverflow;
    QSet<Position> *positions;
    Portion portion;
    QJsonObject objHash;
    QJsonArray tabKey;
    QJsonArray tabValue;
    Position position;

    for (i = overflow.begin(); i != overflow.end(); i++) {
        portion = i.key();
        positions = i.value();
        portion.write(tabKey);
        for (j = positions->begin(); j != positions->end(); j++) {
            position = *j;
            QJsonArray tabPosition;
            position.write(tabPosition);
            tabValue.append(tabPosition);
        }

        objHash[RPM::JSON_KEY] = tabKey;
        objHash[RPM::JSON_VALUE] = tabValue;
        tabOverflow.append(objHash);
    }
    json[jsonLabel] = tabOverflow;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void MapProperties::read(const QJsonObject &json){
    SystemLang::read(json);
    QJsonObject obj;

    setTilesetID(json[JSON_TILESET_ID].toInt());
    m_length = json[JSON_LENGTH].toInt();
    m_width = json[JSON_WIDTH].toInt();
    m_height = json[JSON_HEIGHT].toInt();
    m_depth = json[JSON_DEPTH].toInt();

    // Musics
    m_music = new SystemPlaySong(-1, SongKind::Music);
    m_music->read(json[JSON_MUSIC].toObject());
    m_backgroundSound = new SystemPlaySong(-1, SongKind::BackgroundSound);
    m_backgroundSound->read(json[JSON_BACKGROUND_SOUND].toObject());

    // Camera properties
    m_cameraProperties = new PrimitiveValue(PrimitiveValueKind::DataBase, 1);
    if (json.contains(JSON_CAMERA_PROPERTIES)) {
        m_cameraProperties->read(json[JSON_CAMERA_PROPERTIES].toObject());
    }
    m_cameraProperties->setModelDataBase(RPM::get()->project()->gameDatas()
        ->systemDatas()->modelcameraProperties());

    // Sky
    m_isSkyColor = json.contains(JSON_IS_SKY_COLOR) ? json[JSON_IS_SKY_COLOR]
        .toBool() : true;
    m_skyColorID = new PrimitiveValue(PrimitiveValueKind::DataBase, 1);
    if (m_isSkyColor) {
        m_skyColorID->read(json[JSON_SKY_COLOR_ID].toObject());
    }
    m_skyColorID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->systemDatas()->modelColors());
    m_isSkyImage = json.contains(JSON_IS_SKY_IMAGE) ? json[JSON_IS_SKY_IMAGE]
        .toBool() : false;
    m_skyPictureID = new SuperListItem(-1);
    if (m_isSkyImage) {
        m_skyPictureID->setId(json[JSON_SKY_PICTURE_ID].toInt());
    }
    m_skyboxID = new PrimitiveValue(PrimitiveValueKind::DataBase, 1);
    if (!m_isSkyColor && !m_isSkyImage)
    {
        m_skyboxID->read(json[JSON_SKY_BOX_ID].toObject());
    }
    m_skyboxID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->systemDatas()->modelSkyBoxes());

    // Invisible object
    m_startupObject = new SystemCommonObject;
    m_startupObject->read(json[JSON_STARTUP_OBJECT].toObject());

    // Overflow
    this->readOverflow(json[JSON_OVERFLOW_SPRITES].toArray(),
        m_outOverflowSprites);
    this->readOverflow(json[JSON_OVERFLOW_OBJECTS3D].toArray(),
        m_outOverflowObjects3D);
    this->readOverflow(json[JSON_OVERFLOW_MOUNTAINS].toArray(),
        m_outOverflowMountains);
}

// -------------------------------------------------------

void MapProperties::write(QJsonObject &json) const {
    SystemLang::write(json);
    QJsonObject obj;

    json[JSON_TILESET_ID] = m_tilesetID;
    json[JSON_LENGTH] = m_length;
    json[JSON_WIDTH] = m_width;
    json[JSON_HEIGHT] = m_height;
    json[JSON_DEPTH] = m_depth;

    // Musics
    obj = QJsonObject();
    m_music->write(obj);
    json[JSON_MUSIC] = obj;
    obj = QJsonObject();
    m_backgroundSound->write(obj);
    json[JSON_BACKGROUND_SOUND] = obj;

    // Camera properties
    if (!m_cameraProperties->isDefaultDataBaseValue()) {
        obj = QJsonObject();
        m_cameraProperties->write(obj);
        json[JSON_CAMERA_PROPERTIES] = obj;
    }

    // Sky
    json[JSON_IS_SKY_COLOR] = m_isSkyColor;
    if (m_isSkyColor) {
        obj = QJsonObject();
        m_skyColorID->write(obj);
        json[JSON_SKY_COLOR_ID] = obj;
    }
    json[JSON_IS_SKY_IMAGE] = m_isSkyImage;
    if (m_isSkyImage) {
        json[JSON_SKY_PICTURE_ID] = m_skyPictureID->id();
    }
    if (!m_isSkyColor & !m_isSkyImage) {
        obj = QJsonObject();
        m_skyboxID->write(obj);
        json[JSON_SKY_BOX_ID] = obj;
    }

    // Invisible object
    obj = QJsonObject();
    m_startupObject->write(obj);
    json[JSON_STARTUP_OBJECT] = obj;

    // Overflow
    this->writeOverflow(json, m_outOverflowSprites, JSON_OVERFLOW_SPRITES);
    this->writeOverflow(json, m_outOverflowObjects3D, JSON_OVERFLOW_OBJECTS3D);
    this->writeOverflow(json, m_outOverflowMountains, JSON_OVERFLOW_MOUNTAINS);
}
