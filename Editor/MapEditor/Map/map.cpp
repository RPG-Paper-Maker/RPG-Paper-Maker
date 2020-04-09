/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QtMath>
#include <QDirIterator>
#include "map.h"
#include "rpm.h"
#include "systemmapobject.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Map::Map() :
    m_mapProperties(new MapProperties),
    m_mapPortions(nullptr),
    m_cursor(nullptr),
    m_modelObjects(new QStandardItemModel),
    m_saved(true),
    m_detection(nullptr),
    m_programStatic(nullptr),
    m_programFaceSprite(nullptr),
    m_textureTileset(nullptr),
    m_textureObjectSquare(nullptr),
    m_textureMissing(nullptr),
    m_textureDetection(nullptr)
{

}

Map::Map(int id) :
    m_mapPortions(nullptr),
    m_cursor(nullptr),
    m_modelObjects(new QStandardItemModel),
    m_detection(nullptr),
    m_programStatic(nullptr),
    m_programFaceSprite(nullptr),
    m_textureTileset(nullptr),
    m_textureObjectSquare(nullptr),
    m_textureMissing(nullptr),
    m_textureDetection(nullptr)
{
    QString realName = Map::generateMapName(id);
    QString pathMaps = Common::pathCombine(RPM::get()->project()
                                          ->pathCurrentProject(),
                                          RPM::PATH_MAPS);
    m_pathMap = Common::pathCombine(pathMaps, realName);

    // Temp map files
    if (!RPM::mapsToSave.contains(id)) {
        QString pathTemp = Common::pathCombine(m_pathMap,
                                              RPM::FOLDER_TEMP_MAP);
        Common::deleteAllFiles(pathTemp);
        QFile(Common::pathCombine(m_pathMap, RPM::FILE_MAP_OBJECTS)).copy(
                    Common::pathCombine(pathTemp, RPM::FILE_MAP_OBJECTS));
    }
    if (!RPM::mapsUndoRedo.contains(id)) {
        Common::deleteAllFiles(
           Common::pathCombine(m_pathMap, RPM::FOLDER_UNDO_REDO_TEMP_MAP));
    }

    m_mapProperties = new MapProperties(m_pathMap);
    readObjects();
    m_saved = !RPM::mapsToSave.contains(id);
    m_portionsRay = RPM::get()->getPortionsRay() + 1;
    m_squareSize = RPM::get()->getSquareSize();

    // Loading textures
    loadTextures();
}

Map::Map(MapProperties* properties, SystemDetection *detection) :
    m_mapProperties(properties),
    m_mapPortions(nullptr),
    m_cursor(nullptr),
    m_modelObjects(new QStandardItemModel),
    m_saved(true),
    m_detection(detection),
    m_programStatic(nullptr),
    m_programFaceSprite(nullptr),
    m_textureTileset(nullptr),
    m_textureObjectSquare(nullptr),
    m_textureMissing(nullptr),
    m_textureDetection(nullptr)
{
    m_portionsRay = RPM::get()->getPortionsRay() + 1;
    m_squareSize = RPM::get()->getSquareSize();

    // Loading textures
    loadTextures();
}

Map::~Map() {
    delete m_cursor;
    delete m_mapProperties;
    deletePortions();
    SuperListItem::deleteModel(m_modelObjects);

    if (m_programStatic != nullptr)
        delete m_programStatic;
    if (m_programFaceSprite != nullptr)
        delete m_programFaceSprite;

    deleteTextures();
}

MapProperties* Map::mapProperties() const { return m_mapProperties; }

void Map::setMapProperties(MapProperties* p) { m_mapProperties = p; }

Cursor* Map::cursor() const { return m_cursor; }

int Map::squareSize() const { return m_squareSize; }

int Map::portionsRay() const { return m_portionsRay; }

bool Map::saved() const { return m_saved; }

void Map::setSaved(bool b){ m_saved = b; }

QStandardItemModel* Map::modelObjects() const { return m_modelObjects; }

MapPortion* Map::mapPortion(Portion &p) const {
    return mapPortion(p.x(), p.y(), p.z());
}

MapPortion* Map::mapPortion(int x, int y, int z) const {
    int index = portionIndex(x, y, z);

    return mapPortionBrut(index);
}

MapPortion* Map::mapPortionFromGlobal(Portion& p) const {
    Portion portion = getLocalFromGlobalPortion(p);

    return mapPortion(portion);
}

MapPortion* Map::mapPortionBrut(int index) const {
    return m_mapPortions[index];
}

int Map::portionIndex(int x, int y, int z) const {
    int size = getMapPortionSize();

    return ((x + m_portionsRay) * size * size) +
           ((y + m_portionsRay) * size) +
           (z + m_portionsRay);
}

int Map::getMapPortionSize() const {
    return m_portionsRay * 2 + 1;
}

int Map::getMapPortionTotalSize() const {
    int size = getMapPortionSize();

    return size * size * size;
}

void Map::setMapPortion(int x, int y, int z, MapPortion* mapPortion) {
    int index = portionIndex(x, y, z);

    m_mapPortions[index] = mapPortion;
}

void Map::setMapPortion(Portion &p, MapPortion* mapPortion) {
    setMapPortion(p.x(), p.y(), p.z(), mapPortion);
}

MapObjects* Map::objectsPortion(Portion &p){
    return objectsPortion(p.x(), p.y(), p.z());
}

MapObjects* Map::objectsPortion(int x, int y, int z){
    MapPortion* mapPortion = this->mapPortion(x, y, z);
    if (mapPortion != nullptr)
        return mapPortion->mapObjects();

    return nullptr;
}

QOpenGLTexture * Map::textureMissing() const {
    return m_textureMissing;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Map::addOverflowSprites(Position& p, Portion &portion) {
    m_mapProperties->addOverflowSprites(p, portion);
}

// -------------------------------------------------------

void Map::removeOverflowSprites(Position& p, Portion &portion) {
    m_mapProperties->removeOverflowSprites(p, portion);
}

// -------------------------------------------------------

void Map::addOverflowObjects3D(Position &p, Portion &portion) {
    m_mapProperties->addOverflowObjects3D(p, portion);
}

// -------------------------------------------------------

void Map::removeOverflowObjects3D(Position &p, Portion &portion) {
    m_mapProperties->removeOverflowObjects3D(p, portion);
}

// -------------------------------------------------------

void Map::addOverflowMountains(Position& p, Portion& portion) {
    m_mapProperties->addOverflowMountains(p, portion);
}

// -------------------------------------------------------

void Map::removeOverflowMountains(Position& p, Portion& portion) {
    m_mapProperties->removeOverflowMountains(p, portion);
}

// -------------------------------------------------------

void Map::initializeCursor(QVector3D *position) {
    m_cursor = new Cursor(position);
    m_cursor->loadTexture(":/textures/Ressources/editor_cursor.png");
    m_cursor->initialize();
}

// -------------------------------------------------------

QString Map::getPortionPathMap(int i, int j, int k){
    return QString::number(i) + "_" + QString::number(j) + "_" +
            QString::number(k) + ".json";
}

// -------------------------------------------------------

QString Map::getPortionPath(int i, int j, int k) {
    QString tempPath = getPortionPathTemp(i, j, k);
    if (QFile(tempPath).exists())
        return tempPath;
    else
        return Common::pathCombine(m_pathMap, getPortionPathMap(i, j, k));
}

// -------------------------------------------------------

QString Map::getPortionPathTemp(int i, int j, int k) {
    return Common::pathCombine(m_pathMap, Common::pathCombine(
                                  RPM::FOLDER_TEMP_MAP,
                                  getPortionPathMap(i, j, k)));
}

// -------------------------------------------------------

void Map::setModelObjects(QStandardItemModel* model){
    QStandardItem* item;
    SystemMapObject* super;

    item = new QStandardItem;
    Position3D position;
    super = new SystemMapObject(-1, RPM::translate(Translations::THIS_OBJECT),
        position);
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
    item->setText(super->name());
    model->appendRow(item);
    item = new QStandardItem;
    super = new SystemMapObject(0, RPM::translate(Translations::HERO), position);
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
    item->setText(super->name());
    model->appendRow(item);
}

// -------------------------------------------------------

MapPortion* Map::loadPortionMap(int i, int j, int k, bool force)
{
    int lx = (m_mapProperties->length() - 1) / RPM::PORTION_SIZE;
    int ld = (m_mapProperties->depth() - 1) / RPM::PORTION_SIZE;
    if (m_mapProperties->depth() > 0) {
        ld++;
    }
    int lh = (m_mapProperties->height() - 1) / RPM::PORTION_SIZE;
    int lz = (m_mapProperties->width() - 1) / RPM::PORTION_SIZE;

    if (force || (i >= 0 && i <= lx && j >= -ld && j <= lh && k >= 0 && k <= lz))
    {
        Portion portion(i, j, k);
        QString path = getPortionPath(i, j, k);
        MapPortion* mapPortion = new MapPortion(portion);
        loadPortionThread(mapPortion, path);
        return mapPortion;
    }

    return nullptr;
}


// -------------------------------------------------------

void Map::savePortionMap(MapPortion* mapPortion){
    Portion portion;
    mapPortion->getGlobalPortion(portion);
    QString path = getPortionPathTemp(portion.x(), portion.y(), portion.z());
    if (mapPortion->isEmpty()) {
        QJsonObject obj;
        Common::writeOtherJSON(path, obj);
    }
    else
        RPM::writeJSON(path, *mapPortion);
}

// -------------------------------------------------------

void Map::saveMapProperties() {
    m_mapProperties->save(m_pathMap, true);
}

// -------------------------------------------------------

QString Map::getMapInfosPath() const{
    return Common::pathCombine(m_pathMap, RPM::FILE_MAP_INFOS);
}

// -------------------------------------------------------

QString Map::getMapObjectsPath() const{
    return Common::pathCombine(m_pathMap,
                              Common::pathCombine(RPM::FOLDER_TEMP_MAP,
                                                 RPM::FILE_MAP_OBJECTS));
}

// -------------------------------------------------------

void Map::loadPortion(int realX, int realY, int realZ, int x, int y, int z,
    bool visible)
{
    MapPortion* newMapPortion = loadPortionMap(realX, realY, realZ, false);
    if (newMapPortion != nullptr)
        newMapPortion->setIsVisible(visible);

    setMapPortion(x, y, z, newMapPortion);
}

// -------------------------------------------------------

void Map::loadPortionThread(MapPortion* mapPortion, QString &path)
{
    if (m_detection == nullptr) {
        RPM::readJSON(path, *mapPortion);
    } else {
        Portion portion;
        mapPortion->getGlobalPortion(portion);
        if (portion.y() == 0) {
            mapPortion->fillWithFloor(m_mapProperties);
        }
        mapPortion->setDetection(m_detection);
        mapPortion->initializeDetection();
    }
    mapPortion->initializeVertices(m_squareSize, m_textureTileset,
        m_texturesAutotiles, m_texturesMountains, m_texturesCharacters,
        m_texturesSpriteWalls, nullptr, nullptr);
    mapPortion->updateEmpty();
    if (!mapPortion->isEmpty()) {
        mapPortion->initializeGL(m_programStatic, m_programFaceSprite);
        mapPortion->updateGL();
    }
}

// -------------------------------------------------------

void Map::replacePortion(Portion& previousPortion, Portion& newPortion,
                         bool visible)
{
    MapPortion* mapPortion = this->mapPortion(newPortion);
    if (mapPortion != nullptr)
        mapPortion->setIsVisible(visible);

    setMapPortion(previousPortion, mapPortion);
}

// -------------------------------------------------------

void Map::updatePortion(MapPortion* mapPortion, MapElement *elementExcludeSprite
    , MapElement *elementExcludeObject3D)
{
    mapPortion->updateSpriteWalls();
    mapPortion->initializeVertices(m_squareSize, m_textureTileset,
        m_texturesAutotiles, m_texturesMountains, m_texturesCharacters,
        m_texturesSpriteWalls, elementExcludeSprite, elementExcludeObject3D);
    mapPortion->initializeGL(m_programStatic, m_programFaceSprite);
    mapPortion->updateGL();
    mapPortion->updateEmpty();
}

// -------------------------------------------------------

void Map::updateMapObjects() {

    // First, we need to reload only the characters textures
    deleteCharactersTextures();
    loadCharactersTextures();

    // And for each portion, update vertices of only map objects
    int totalSize = getMapPortionTotalSize();
    MapPortion* mapPortion;

    for (int i = 0; i < totalSize; i++) {
        mapPortion = this->mapPortionBrut(i);
        if (mapPortion != nullptr) {
            mapPortion->initializeVerticesObjects(m_squareSize,
                m_texturesCharacters, m_textureTileset);
            mapPortion->initializeGLObjects(m_programStatic,
                                            m_programFaceSprite);
            mapPortion->updateGLObjects();
            mapPortion->updateEmpty();
        }
    }
}

// -------------------------------------------------------

void Map::loadPortions(Portion portion) {
    deletePortions();

    m_mapPortions = new MapPortion*[getMapPortionTotalSize()];

    // Load visible portions
    for (int i = -m_portionsRay + 1; i <= m_portionsRay - 1; i++) {
        for (int j = -m_portionsRay + 1; j <= m_portionsRay - 1; j++) {
            for (int k = -m_portionsRay + 1; k <= m_portionsRay - 1; k++) {
                loadPortion(i + portion.x(), j + portion.y(), k + portion.z(),
                            i, j, k, true);
            }
        }
    }

    // Load not visible portions
    QList<int> list;
    list << -m_portionsRay << m_portionsRay;

    for (int l = 0; l < list.size(); l++) {
        int i = list.at(l);

        // Vertical bar
        for (int j = -m_portionsRay; j <= m_portionsRay; j++) {
            for (int k = -m_portionsRay; k <= m_portionsRay; k++) {
                loadPortion(i + portion.x(), j + portion.y(), k + portion.z(),
                            i, j, k, false);
            }
        }

        // Horizontal bar
        int k = i;
        for (i = -m_portionsRay + 1; i <= m_portionsRay - 1; i++) {
            for (int j = -m_portionsRay; j <= m_portionsRay; j++) {
                loadPortion(i + portion.x(), j + portion.y(), k + portion.z(),
                            i, j, k, false);
            }
        }

        // Height
        int j = k;
        for (i = -m_portionsRay + 1; i <= m_portionsRay - 1; i++) {
            for (int k = -m_portionsRay + 1; k <= m_portionsRay - 1; k++) {
                loadPortion(i + portion.x(), j + portion.y(), k + portion.z(),
                            i, j, k, false);
            }
        }
    }
}

// -------------------------------------------------------

void Map::deletePortions(){
    if (m_mapPortions != nullptr) {
        int totalSize = getMapPortionTotalSize();
        for (int i = 0; i < totalSize; i++)
            delete this->mapPortionBrut(i);
        delete[] m_mapPortions;
    }
}

// -------------------------------------------------------

bool Map::isInGrid(Position3D &position, int offset) const {
    return m_mapProperties->isInGrid(position, m_squareSize, offset);
}

// -------------------------------------------------------

bool Map::isPortionInGrid(Portion& portion) const {
    int l = m_mapProperties->length() / RPM::PORTION_SIZE;
    int w = m_mapProperties->width() / RPM::PORTION_SIZE;
    int d = m_mapProperties->depth() / RPM::PORTION_SIZE;
    int h = m_mapProperties->height() / RPM::PORTION_SIZE;

    return (portion.x() >= 0 && portion.x() < l && portion.y() >= -d &&
            portion.y() < h && portion.z() >= 0 && portion.z() < w);
}

// -------------------------------------------------------

bool Map::isInPortion(Portion& portion, int offset) const{
    return (portion.x() <= (m_portionsRay + offset) &&
            portion.x() >= -(m_portionsRay + offset) &&
            portion.y() <= (m_portionsRay + offset) &&
            portion.y() >= -(m_portionsRay + offset) &&
            portion.z() <= (m_portionsRay + offset) &&
            portion.z() >= -(m_portionsRay + offset));
}

// -------------------------------------------------------

bool Map::isInSomething(Position3D& position, Portion& portion,
                        int offset) const
{
    return isInGrid(position) && isInPortion(portion, offset);
}

// -------------------------------------------------------

void Map::getGlobalPortion(Position3D& position, Portion &portion){
    portion.setX(position.x() / RPM::PORTION_SIZE);
    portion.setY(position.y() / RPM::PORTION_SIZE);
    portion.setZ(position.z() / RPM::PORTION_SIZE);

    if (position.x() < 0)
        portion.addX(-1);
    if (position.y() < 0)
        portion.addY(-1);
    if (position.z() < 0)
        portion.addZ(-1);
}

// -------------------------------------------------------

bool Map::isInGlobalPortion(Position3D &position, Portion& portion) {
    return position.x() >= (portion.x() * RPM::PORTION_SIZE) && position.x() <
        ((portion.x() + 1) * RPM::PORTION_SIZE) && position.y() >= (portion.y()
        * RPM::PORTION_SIZE) && position.y() < ((portion.y() + 1) * RPM
        ::PORTION_SIZE) && position.z() >= (portion.z() * RPM::PORTION_SIZE) &&
        position.z() < ((portion.z() + 1) * RPM::PORTION_SIZE);
}

// -------------------------------------------------------

void Map::getLocalPortion(Position3D& position, Portion& portion) const {
    portion.setCoords((position.x() / RPM::PORTION_SIZE) - (m_cursor
        ->getSquareX() / RPM::PORTION_SIZE), qFloor(static_cast<qreal>(position
        .y()) / RPM::PORTION_SIZE) - qFloor(static_cast<qreal>(this->cursor()
        ->getSquareY()) / RPM::PORTION_SIZE), (position.z() / RPM::PORTION_SIZE)
        - (m_cursor->getSquareZ() / RPM::PORTION_SIZE));
}

// -------------------------------------------------------

Portion Map::getGlobalFromLocalPortion(Portion& portion) const{
    return Portion(
                portion.x() + (cursor()->getSquareX() / RPM::PORTION_SIZE),
                portion.y() + (cursor()->getSquareY() / RPM::PORTION_SIZE),
                portion.z() + (cursor()->getSquareZ() / RPM::PORTION_SIZE));
}

// -------------------------------------------------------

Portion Map::getLocalFromGlobalPortion(Portion& portion) const {
    return Portion(
                portion.x() - (cursor()->getSquareX() / RPM::PORTION_SIZE),
                portion.y() - (cursor()->getSquareY() / RPM::PORTION_SIZE),
                portion.z() - (cursor()->getSquareZ() / RPM::PORTION_SIZE));
}

// -------------------------------------------------------

bool Map::addObject(Position &p, MapPortion *mapPortion, SystemCommonObject
    *object, QJsonObject &previous, MapEditorSubSelectionKind &previousType)
{
    SystemMapObject *newObject;
    QStandardItem *item;
    int row;
    bool b;

    b = mapPortion->addObject(p, object, previous, previousType);
    row = Map::removeObject(m_modelObjects, p);
    newObject = new SystemMapObject(object->id(), object->name(), p);
    item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(newObject)));
    item->setText(newObject->toString());
    m_modelObjects->insertRow(row, item);

    return b;
}

// -------------------------------------------------------

int Map::removeObject(QStandardItemModel *model, Position3D &p) {
    SystemMapObject *super;
    int i, l;

    for (i = 2, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        super = reinterpret_cast<SystemMapObject *>(model->item(i)->data().value
            <quintptr>());
        if (p == super->position()) {
            model->removeRow(i);
            delete super;
            return i;
        }
    }

    return model->invisibleRootItem()->rowCount();
}

// -------------------------------------------------------

bool Map::deleteObject(Position &p, MapPortion *mapPortion, QJsonObject
    &previous, MapEditorSubSelectionKind &previousType)
{
    Map::removeObject(m_modelObjects, p);

    return mapPortion->deleteObject(p, previous, previousType);
}

// -------------------------------------------------------

bool Map::isObjectIdExisting(int id) const {
    SystemMapObject* super;
    int i;

    for (i = 0; i < m_modelObjects->invisibleRootItem()->rowCount(); i++) {
        super = reinterpret_cast<SystemMapObject *>(m_modelObjects->item(i)
            ->data().value<quintptr>());
        if (id == super->id()) {
            return true;
        }
    }

    return false;
}

// -------------------------------------------------------

int Map::generateObjectId() const {
    int id, l;

    l = m_modelObjects->invisibleRootItem()->rowCount();
    for (id = 1; id < l + 1; id++) {
        if (!isObjectIdExisting(id)) {
            break;
        }
    }

    return id;
}

// -------------------------------------------------------

bool Map::isOKPositionID(Position3D &p, int id) const {
    SystemMapObject *super;
    int i, l;

    for (i = 0, l = m_modelObjects->invisibleRootItem()->rowCount(); i < l; i++)
    {
        super = reinterpret_cast<SystemMapObject *>(m_modelObjects->item(i)
            ->data().value<quintptr>());
        if (super->id() == id) {
            return super->position() == p;
        }
    }

    return true;
}

// -------------------------------------------------------

QString Map::generateObjectName(int id) {
    return "OBJ" + Common::getFormatNumber(id);
}

bool Map::isMapIdExisting(int id){
    QDirIterator directories(Common::pathCombine(RPM::get()->project()
                                                ->pathCurrentProject(),
                                                RPM::PATH_MAPS),
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

int Map::generateMapId(){
    int id;
    QDir dir(Common::pathCombine(RPM::get()->project()->pathCurrentProject(),
                                RPM::PATH_MAPS));
    dir.setFilter(QDir::Dirs | QDir::NoDotAndDotDot);
    int nbMaps = static_cast<int>(dir.count());

    for (id = 1; id <= nbMaps + 1; id++)
        if (!isMapIdExisting(id)) break;

    return id;
}

// -------------------------------------------------------

QString Map::generateMapName(int id){
    return "MAP" + Common::getFormatNumber(id);
}
