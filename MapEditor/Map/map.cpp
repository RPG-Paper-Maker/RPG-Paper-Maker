/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

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
    m_programStatic(nullptr),
    m_programFaceSprite(nullptr),
    m_textureTileset(nullptr),
    m_textureObjectSquare(nullptr)
{

}

Map::Map(int id) :
    m_mapPortions(nullptr),
    m_cursor(nullptr),
    m_modelObjects(new QStandardItemModel),
    m_programStatic(nullptr),
    m_programFaceSprite(nullptr),
    m_textureTileset(nullptr),
    m_textureObjectSquare(nullptr)
{
    QString realName = RPM::generateMapName(id);
    QString pathMaps = Common::pathCombine(RPM::get()->project()
                                          ->pathCurrentProject(),
                                          RPM::pathMaps);
    m_pathMap = Common::pathCombine(pathMaps, realName);

    // Temp map files
    if (!RPM::mapsToSave.contains(id)) {
        QString pathTemp = Common::pathCombine(m_pathMap,
                                              RPM::TEMP_MAP_FOLDER_NAME);
        Common::deleteAllFiles(pathTemp);
        QFile(Common::pathCombine(m_pathMap, RPM::fileMapObjects)).copy(
                    Common::pathCombine(pathTemp, RPM::fileMapObjects));
    }
    if (!RPM::mapsUndoRedo.contains(id)) {
        Common::deleteAllFiles(
           Common::pathCombine(m_pathMap, RPM::TEMP_UNDOREDO_MAP_FOLDER_NAME));
    }

    m_mapProperties = new MapProperties(m_pathMap);
    readObjects();
    m_saved = !RPM::mapsToSave.contains(id);
    m_portionsRay = RPM::get()->getPortionsRay() + 1;
    m_squareSize = RPM::get()->getSquareSize();

    // Loading textures
    loadTextures();
}

Map::Map(MapProperties* properties) :
    m_mapProperties(properties),
    m_mapPortions(nullptr),
    m_cursor(nullptr),
    m_modelObjects(new QStandardItemModel),
    m_programStatic(nullptr),
    m_programFaceSprite(nullptr)
{

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

void Map::addOverflow(Position& p, Portion &portion) {
    m_mapProperties->addOverflow(p, portion);
}

void Map::removeOverflow(Position& p, Portion &portion) {
    m_mapProperties->removeOverflow(p, portion);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Map::initializeCursor(QVector3D *position) {
    m_cursor = new Cursor(position);
    m_cursor->loadTexture(":/textures/Ressources/editor_cursor.png");
    m_cursor->initializeSquareSize(m_squareSize);
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
                                  RPM::TEMP_MAP_FOLDER_NAME,
                                  getPortionPathMap(i, j, k)));
}

// -------------------------------------------------------

void Map::setModelObjects(QStandardItemModel* model){
    QStandardItem* item;
    SystemMapObject* super;

    item = new QStandardItem;
    Position3D position;
    super = new SystemMapObject(-1, "This object", position);
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
    item->setText(super->name());
    model->appendRow(item);
    item = new QStandardItem;
    super = new SystemMapObject(0, "Hero", position);
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
    item->setText(super->name());
    model->appendRow(item);
}

// -------------------------------------------------------

MapPortion* Map::loadPortionMap(int i, int j, int k, bool force){

    int lx = (m_mapProperties->length() - 1) / RPM::portionSize;
    int ly = (m_mapProperties->depth() + m_mapProperties->height() - 1) /
            RPM::portionSize;;
    int lz = (m_mapProperties->width() - 1) / RPM::portionSize;

    if (force || (i >= 0 && i <= lx && j >= 0 && j <= ly && k >= 0 && k <= lz)){
        Portion portion(i, j, k);
        QString path = getPortionPath(i, j, k);
        MapPortion* mapPortion = new MapPortion(portion);
        RPM::readJSON(path, *mapPortion);
        mapPortion->setIsLoaded(false);
        /*
        ThreadMapPortionLoader thread(this, portion);
        thread.start();
        */
        loadPortionThread(mapPortion);
        mapPortion->setIsLoaded(true);
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
    return Common::pathCombine(m_pathMap, RPM::fileMapInfos);
}

// -------------------------------------------------------

QString Map::getMapObjectsPath() const{
    return Common::pathCombine(m_pathMap,
                              Common::pathCombine(RPM::TEMP_MAP_FOLDER_NAME,
                                                 RPM::fileMapObjects));
}

// -------------------------------------------------------

void Map::loadPortion(int realX, int realY, int realZ, int x, int y, int z,
                      bool visible)
{
    MapPortion* newMapPortion = loadPortionMap(realX, realY, realZ);
    if (newMapPortion != nullptr)
        newMapPortion->setIsVisible(visible);

    setMapPortion(x, y, z, newMapPortion);
}

// -------------------------------------------------------

void Map::loadPortionThread(MapPortion* portion)
{
    portion->initializeVertices(m_squareSize, m_textureTileset,
                                m_texturesAutotiles, m_texturesCharacters,
                                m_texturesSpriteWalls);
    portion->initializeGL(m_programStatic, m_programFaceSprite);
    portion->updateGL();
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

void Map::updatePortion(MapPortion* mapPortion)
{
    mapPortion->updateSpriteWalls();
    mapPortion->initializeVertices(m_squareSize, m_textureTileset,
                                   m_texturesAutotiles, m_texturesCharacters,
                                   m_texturesSpriteWalls);
    mapPortion->initializeGL(m_programStatic, m_programFaceSprite);
    mapPortion->updateGL();
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
        }
    }
}

// -------------------------------------------------------

void Map::loadPortions(Portion portion){
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
    int l = m_mapProperties->length() / RPM::portionSize;
    int w = m_mapProperties->width() / RPM::portionSize;
    int d = m_mapProperties->depth() / RPM::portionSize;
    int h = m_mapProperties->height() / RPM::portionSize;

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
    portion.setX(position.x() / RPM::portionSize);
    portion.setY(position.y() / RPM::portionSize);
    portion.setZ(position.z() / RPM::portionSize);

    if (position.x() < 0)
        portion.addX(-1);
    if (position.y() < 0)
        portion.addY(-1);
    if (position.z() < 0)
        portion.addZ(-1);
}

// -------------------------------------------------------

void Map::getLocalPortion(Position3D& position, Portion& portion) const{
    portion.setX((position.x() / RPM::portionSize) -
                 (m_cursor->getSquareX() / RPM::portionSize));
    portion.setY((position.y() / RPM::portionSize) -
                 (m_cursor->getSquareY() / RPM::portionSize));
    portion.setZ((position.z() / RPM::portionSize) -
                 (m_cursor->getSquareZ() / RPM::portionSize));
}

// -------------------------------------------------------

Portion Map::getGlobalFromLocalPortion(Portion& portion) const{
    return Portion(
                portion.x() + (cursor()->getSquareX() / RPM::portionSize),
                portion.y() + (cursor()->getSquareY() / RPM::portionSize),
                portion.z() + (cursor()->getSquareZ() / RPM::portionSize));
}

// -------------------------------------------------------

Portion Map::getLocalFromGlobalPortion(Portion& portion) const {
    return Portion(
                portion.x() - (cursor()->getSquareX() / RPM::portionSize),
                portion.y() - (cursor()->getSquareY() / RPM::portionSize),
                portion.z() - (cursor()->getSquareZ() / RPM::portionSize));
}

// -------------------------------------------------------

bool Map::addObject(Position& p, MapPortion* mapPortion,
                    SystemCommonObject *object, QJsonObject &previous,
                    MapEditorSubSelectionKind &previousType)
{
    bool b = mapPortion->addObject(p, object, previous, previousType);

    int row = Map::removeObject(m_modelObjects, p);
    SystemMapObject* newObject = new SystemMapObject(object->id(),
                                                     object->name(), p);
    QStandardItem* item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(newObject)));
    item->setText(newObject->toString());
    m_modelObjects->insertRow(row, item);

    return b;
}

// -------------------------------------------------------

int Map::removeObject(QStandardItemModel *model, Position3D& p) {
    SystemMapObject* super;

    for (int i = 2; i < model->invisibleRootItem()->rowCount(); i++) {
        super = ((SystemMapObject*) model->item(i)->data()
                 .value<quintptr>());
        if (p == super->position()) {
            model->removeRow(i);
            delete super;
            return i;
        }
    }

    return model->invisibleRootItem()->rowCount();
}

// -------------------------------------------------------

bool Map::deleteObject(Position& p, MapPortion *mapPortion,
                       QJsonObject &previous,
                       MapEditorSubSelectionKind &previousType)
{
    Map::removeObject(m_modelObjects, p);

    return mapPortion->deleteObject(p, previous, previousType);
}

// -------------------------------------------------------

bool Map::isObjectIdExisting(int id) const{
    SystemMapObject* super;

    for (int i = 0; i < m_modelObjects->invisibleRootItem()->rowCount(); i++){
        super = ((SystemMapObject*) m_modelObjects->item(i)->data()
                 .value<quintptr>());
        if (id == super->id())
            return true;
    }

    return false;
}

// -------------------------------------------------------

int Map::generateObjectId() const{
    int id, l;

    l = m_modelObjects->invisibleRootItem()->rowCount();
    for (id = 1; id < l + 1; id++){
        if (!isObjectIdExisting(id))
            break;
    }

    return id;
}

// -------------------------------------------------------

QString Map::generateObjectName(int id){
    return "OBJ" + Common::getFormatNumber(id);
}
