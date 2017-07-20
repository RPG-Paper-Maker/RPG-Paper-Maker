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

#include <QDebug>
#include <QJsonArray>
#include <QJsonDocument>
#include <cmath>
#include <QDir>
#include "map.h"
#include "wanok.h"
#include "widgettreelocalmaps.h"
#include "systemmapobject.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Map::Map() :
    m_mapProperties(new MapProperties),
    m_mapPortions(nullptr),
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
    m_modelObjects(new QStandardItemModel),
    m_programStatic(nullptr),
    m_programFaceSprite(nullptr),
    m_textureTileset(nullptr),
    m_textureObjectSquare(nullptr)
{
    QString realName = WidgetTreeLocalMaps::generateMapName(id);
    QString pathMaps = Wanok::pathCombine(Wanok::get()->project()
                                          ->pathCurrentProject(),
                                          Wanok::pathMaps);
    m_pathMap = Wanok::pathCombine(pathMaps, realName);
    QString pathTemp = Wanok::pathCombine(m_pathMap,
                                          Wanok::TEMP_MAP_FOLDER_NAME);

    // Reading map infos
    if (!Wanok::mapsToSave.contains(id)){
        Wanok::deleteAllFiles(pathTemp);
        Wanok::copyAllFiles(m_pathMap, pathTemp);
    }
    m_mapProperties = new MapProperties(pathTemp);
    readObjects();
    m_saved = !Wanok::mapsToSave.contains(id);
    m_portionsRay = Wanok::get()->getPortionsRay();
    m_squareSize = Wanok::get()->getSquareSize();

    // Initialize portions


    // Loading textures
    loadTextures();
}

Map::Map(MapProperties* properties) :
    m_mapProperties(properties),
    m_mapPortions(nullptr),
    m_modelObjects(new QStandardItemModel),
    m_programStatic(nullptr),
    m_programFaceSprite(nullptr)
{

}

Map::~Map() {
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

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Map::writeNewMap(QString path, MapProperties& properties){
    QJsonArray jsonObject;
    writeMap(path, properties, jsonObject);
}

// -------------------------------------------------------

void Map::writeDefaultMap(QString path){
    MapProperties properties;
    QJsonArray jsonObject;
    QJsonObject json;

    SystemMapObject super(1, "Hero", Portion(0, 0, 0));
    super.write(json);
    jsonObject.append(json);
    QString pathMap = writeMap(path, properties, jsonObject);

    // Portion
    MapPortion mapPortion;
    Position position(7, 0, 0, 7, 0);
    SystemCommonObject* o = new SystemCommonObject(1, "Hero", 1,
                                                   new QStandardItemModel,
                                                   new QStandardItemModel);
    mapPortion.addObject(position, o);
    Wanok::writeJSON(Wanok::pathCombine(pathMap, getPortionPathMap(0, 0, 0)),
                     mapPortion);
}

// -------------------------------------------------------

QString Map::writeMap(QString path, MapProperties& properties,
                      QJsonArray& jsonObject)
{
    QString dirMaps = Wanok::pathCombine(path, Wanok::pathMaps);
    QString mapName = properties.realName();
    QDir(dirMaps).mkdir(mapName);
    QString dirMap = Wanok::pathCombine(dirMaps, mapName);

    // Properties
    Wanok::writeJSON(Wanok::pathCombine(dirMap, Wanok::fileMapInfos),
                     properties);

    // Portions
    int lx = (properties.length() - 1) / Wanok::portionSize;
    int ly = (properties.depth() + properties.height() - 1) /
            Wanok::portionSize;;
    int lz = (properties.width() - 1) / Wanok::portionSize;
    for (int i = 0; i <= lx; i++){
        for (int j = 0; j <= ly; j++){
            for (int k = 0; k <= lz; k++){
                QJsonObject obj;
                Wanok::writeOtherJSON(
                            Wanok::pathCombine(dirMap,
                                               getPortionPathMap(i, j, k)),
                            obj);
            }
        }
    }

    // Objects
    QJsonObject json;
    json["objs"] = jsonObject;
    Wanok::writeOtherJSON(Wanok::pathCombine(dirMap, Wanok::fileMapObjects),
                          json);

    QDir(dirMap).mkdir(Wanok::TEMP_MAP_FOLDER_NAME);
    QDir(dirMap).mkdir(Wanok::TEMP_UNDOREDO_MAP_FOLDER_NAME);

    return dirMap;
}

// -------------------------------------------------------

void Map::correctMap(QString path, MapProperties& properties){
    int lx = (properties.length() - 1) / Wanok::portionSize;
    int ly = (properties.depth() + properties.height() - 1) /
            Wanok::portionSize;;
    int lz = (properties.width() - 1) / Wanok::portionSize;
    for (int i = 0; i <= lx; i++){
        for (int j = 0; j <= ly; j++){
            for (int k = 0; k <= lz; k++){
                QString pathPortion = Wanok::pathCombine(
                            path, getPortionPathMap(i, j, k));
                if (!QFile(pathPortion).exists()){
                    QJsonObject obj;
                    Wanok::writeOtherJSON(pathPortion, obj);
                }
            }
        }
    }
}

// -------------------------------------------------------

QString Map::getPortionPathMap(int i, int j, int k){
    return QString::number(i) + "_" + QString::number(j) + "_" +
            QString::number(k) + ".json";
}

// -------------------------------------------------------

QString Map::getPortionPath(int i, int j, int k){
    return Wanok::pathCombine(m_pathMap, Wanok::pathCombine(
                                  Wanok::TEMP_MAP_FOLDER_NAME,
                                  getPortionPathMap(i, j, k)));
}

// -------------------------------------------------------

void Map::setModelObjects(QStandardItemModel* model){
    QStandardItem* item;
    SystemMapObject* super;

    item = new QStandardItem;
    super = new SystemMapObject(-1, "This object", Portion());
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
    item->setText(super->name());
    model->appendRow(item);
    item = new QStandardItem;
    super = new SystemMapObject(0, "Hero", Portion());
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
    item->setText(super->name());
    model->appendRow(item);
}

// -------------------------------------------------------

void Map::loadTextures(){
    SystemPicture* picture;
    QOpenGLTexture* texture;
    QStandardItemModel* model;

    deleteTextures();

    // Tileset
    m_textureTileset = new QOpenGLTexture(
                QImage(m_mapProperties->tileset()->picture()
                       ->getPath(PictureKind::Tilesets)));
    m_textureTileset->setMinificationFilter(QOpenGLTexture::Filter::Nearest);
    m_textureTileset->setMagnificationFilter(QOpenGLTexture::Filter::Nearest);

    // Characters
    model = Wanok::get()->project()->picturesDatas()
            ->model(PictureKind::Characters);
    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++){
        picture = (SystemPicture*) model->item(i)->data().value<qintptr>();
        QImage image(1, 1, QImage::Format_ARGB32);
        QString path = picture->getPath(PictureKind::Characters);

        if (path.isEmpty())
            image.fill(QColor(0, 0, 0, 0));
        else
            image.load(path);

        texture = new QOpenGLTexture(image);
        texture->setMinificationFilter(QOpenGLTexture::Filter::Nearest);
        texture->setMagnificationFilter(QOpenGLTexture::Filter::Nearest);
        m_texturesCharacters[picture->id()] = texture;
    }

    // Object square
    m_textureObjectSquare = new QOpenGLTexture(
                QImage(":/textures/Ressources/object_square.png"));
    m_textureObjectSquare->setMinificationFilter(
                QOpenGLTexture::Filter::Nearest);
    m_textureObjectSquare->setMagnificationFilter(
                QOpenGLTexture::Filter::Nearest);
}

// -------------------------------------------------------

void Map::deleteTextures(){
    if (m_textureTileset != nullptr)
        delete m_textureTileset;
    QHash<int, QOpenGLTexture*>::iterator j;
    for (j = m_texturesCharacters.begin(); j != m_texturesCharacters.end(); j++)
        delete j.value();
    if (m_textureObjectSquare != nullptr)
        delete m_textureObjectSquare;
}

// -------------------------------------------------------

MapPortion* Map::loadPortionMap(int i, int j, int k){

    int lx = (m_mapProperties->length() - 1) / Wanok::portionSize;
    int ly = (m_mapProperties->depth() + m_mapProperties->height() - 1) /
            Wanok::portionSize;;
    int lz = (m_mapProperties->width() - 1) / Wanok::portionSize;

    if (i >= 0 && i <= lx && j >= 0 && j <= ly && k >= 0 && k <= lz){
        QString path = getPortionPath(i, j, k);
        MapPortion* portion = new MapPortion;
        Wanok::readJSON(path, *portion);
        if (!portion->isEmpty()){

            // Static update
            portion->initializeVertices(m_squareSize,
                                        m_textureTileset,
                                        m_texturesCharacters);
            portion->initializeGL(m_programStatic, m_programFaceSprite);
            portion->updateGL();

            return portion;
        }

        delete portion;
    }

    return nullptr;
}


// -------------------------------------------------------

void Map::savePortionMap(MapPortion* mapPortion, Portion& portion){
    QString path = getPortionPath(portion.x(), portion.y(), portion.z());
    if (mapPortion == nullptr){
        QJsonObject obj;
        Wanok::writeOtherJSON(path, obj);
    }
    else
        Wanok::writeJSON(path, *mapPortion);
}

// -------------------------------------------------------

QString Map::getMapInfosPath() const{
    return Wanok::pathCombine(m_pathMap,
                              Wanok::pathCombine(Wanok::TEMP_MAP_FOLDER_NAME,
                                                 Wanok::fileMapInfos));
}

// -------------------------------------------------------

QString Map::getMapObjectsPath() const{
    return Wanok::pathCombine(m_pathMap,
                              Wanok::pathCombine(Wanok::TEMP_MAP_FOLDER_NAME,
                                                 Wanok::fileMapObjects));
}

// -------------------------------------------------------

void Map::loadPortion(int realX, int realY, int realZ, int x, int y, int z){
    MapPortion* newMapPortion = loadPortionMap(realX, realY, realZ);

    setMapPortion(x, y, z, newMapPortion);
}

// -------------------------------------------------------

void Map::replacePortion(Portion& previousPortion, Portion& newPortion){
    setMapPortion(previousPortion, mapPortion(newPortion));
}

// -------------------------------------------------------

void Map::updatePortion(Portion& p){
    MapPortion* mapPortion = this->mapPortion(p);
    if (mapPortion->isEmpty()) {
        delete mapPortion;
        setMapPortion(p, nullptr);
    }
    else {
        mapPortion->initializeVertices(m_squareSize,
                                       m_textureTileset,
                                       m_texturesCharacters);
        mapPortion->initializeGL(m_programStatic, m_programFaceSprite);
        mapPortion->updateGL();
    }
}

// -------------------------------------------------------

void Map::loadPortions(Portion portion){
    deletePortions();

    m_mapPortions = new MapPortion*[getMapPortionTotalSize()];
    for (int i = -m_portionsRay; i <= m_portionsRay; i++){
        for (int j = -m_portionsRay; j <= m_portionsRay; j++){
            for (int k = -m_portionsRay; k <= m_portionsRay; k++){
                loadPortion(i + portion.x(), j + portion.y(), k + portion.z(),
                            i, j, k);
            }
        }
    }
}

// -------------------------------------------------------

void Map::deletePortions(){
    if (m_mapPortions != nullptr) {
        int totalSize = getMapPortionTotalSize();
        for (int i = 0; i < totalSize; i++){
            MapPortion* mapPortion = this->mapPortionBrut(i);
            if (mapPortion != nullptr)
                delete mapPortion;
        }
        delete[] m_mapPortions;
    }
}

// -------------------------------------------------------

bool Map::isInGrid(Position& position) const{
    return (position.x() >= 0 && position.x() < m_mapProperties->length() &&
            position.z() >= 0 && position.z() < m_mapProperties->width());
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

MapPortion* Map::createMapPortion(Portion &p){
    MapPortion* portion = new MapPortion;
    setMapPortion(p, portion);

    return portion;
}

// -------------------------------------------------------

bool Map::addObject(Position& p, MapPortion* mapPortion, Portion &globalPortion,
                    SystemCommonObject *object)
{
    bool b = mapPortion->addObject(p, object);

    int row = removeObject(object);
    SystemMapObject* newObject = new SystemMapObject(object->id(),
                                                     object->name(),
                                                     globalPortion);
    QStandardItem* item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(newObject)));
    item->setText(newObject->toString());
    m_modelObjects->insertRow(row, item);

    return b;
}

// -------------------------------------------------------

int Map::removeObject(SystemCommonObject *object){
    SystemMapObject* super;

    for (int i = 0; i < m_modelObjects->invisibleRootItem()->rowCount(); i++){
        super = ((SystemMapObject*) m_modelObjects->item(i)->data()
                 .value<quintptr>());
        if (object->id() == super->id()){
            m_modelObjects->removeRow(i);
            delete super;
            return i;
        }
    }

    return m_modelObjects->invisibleRootItem()->rowCount();
}

// -------------------------------------------------------

bool Map::deleteObject(Position& p, MapPortion *mapPortion,
                       SystemCommonObject *object)
{
    removeObject(object);

    bool b = mapPortion->deleteObject(p);

    return b;
}

// -------------------------------------------------------

void Map::save(Map* currentMap){
    QString pathTemp = Wanok::pathCombine(m_pathMap,
                                          Wanok::TEMP_MAP_FOLDER_NAME);

    Wanok::deleteAllFiles(m_pathMap);
    Wanok::copyAllFiles(pathTemp, m_pathMap);

    if (currentMap != nullptr &&
            currentMap->mapProperties()->id() != m_mapProperties->id())
    {
        Wanok::deleteAllFiles(pathTemp);
    }
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
    return "OBJ" + Wanok::getFormatNumber(id);
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void Map::initializeGL(){
    initializeOpenGLFunctions();

    // Create STATIC Shader
    m_programStatic = new QOpenGLShaderProgram();
    m_programStatic->addShaderFromSourceFile(QOpenGLShader::Vertex,
                                             ":/Shaders/static.vert");
    m_programStatic->addShaderFromSourceFile(QOpenGLShader::Fragment,
                                             ":/Shaders/static.frag");
    m_programStatic->link();
    m_programStatic->bind();

    // Uniform location of camera
    u_modelviewProjectionStatic = m_programStatic
            ->uniformLocation("modelviewProjection");

    // Release
    m_programStatic->release();


    // Create SPRITE FACE Shader
    m_programFaceSprite = new QOpenGLShaderProgram();
    m_programFaceSprite->addShaderFromSourceFile(QOpenGLShader::Vertex,
                                                 ":/Shaders/spriteFace.vert");
    m_programFaceSprite->addShaderFromSourceFile(QOpenGLShader::Fragment,
                                                 ":/Shaders/spriteFace.frag");
    m_programFaceSprite->link();
    m_programFaceSprite->bind();

    // Uniform location of camera
    u_cameraRightWorldspace = m_programFaceSprite
            ->uniformLocation("cameraRightWorldspace");
    u_cameraUpWorldspace = m_programFaceSprite
            ->uniformLocation("cameraUpWorldspace");
    u_modelViewProjection = m_programFaceSprite
            ->uniformLocation("modelViewProjection");

    // Release
    m_programFaceSprite->release();
}

// -------------------------------------------------------

void Map::updateGLStatic(QOpenGLBuffer &vertexBuffer,
                         QOpenGLBuffer &indexBuffer,
                         QVector<Vertex> &vertices,
                         QVector<GLuint> &indexes,
                         QOpenGLVertexArrayObject &vao,
                         QOpenGLShaderProgram* program)
{
    program->bind();

    // If existing VAO or VBO, destroy it
    if (vao.isCreated())
        vao.destroy();
    if (vertexBuffer.isCreated())
        vertexBuffer.destroy();
    if (indexBuffer.isCreated())
        indexBuffer.destroy();

    // Create new VBO for vertex
    vertexBuffer.create();
    vertexBuffer.bind();
    vertexBuffer.setUsagePattern(QOpenGLBuffer::StaticDraw);
    vertexBuffer.allocate(vertices.constData(),
                          vertices.size() * sizeof(Vertex));

    // Create new VBO for indexes
    indexBuffer.create();
    indexBuffer.bind();
    indexBuffer.setUsagePattern(QOpenGLBuffer::StaticDraw);
    indexBuffer.allocate(indexes.constData(),
                         indexes.size() * sizeof(GLuint));

    // Create new VAO
    vao.create();
    vao.bind();
    program->enableAttributeArray(0);
    program->enableAttributeArray(1);
    program->setAttributeBuffer(0, GL_FLOAT, Vertex::positionOffset(),
                                Vertex::positionTupleSize,
                                Vertex::stride());
    program->setAttributeBuffer(1, GL_FLOAT, Vertex::texOffset(),
                                Vertex::texCoupleSize,
                                Vertex::stride());
    indexBuffer.bind();

    // Releases
    vao.release();
    indexBuffer.release();
    vertexBuffer.release();
    program->release();
}

// -------------------------------------------------------

void Map::updateGLFace(QOpenGLBuffer &vertexBuffer,
                       QOpenGLBuffer &indexBuffer,
                       QVector<VertexBillboard> &vertices,
                       QVector<GLuint> &indexes,
                       QOpenGLVertexArrayObject &vao,
                       QOpenGLShaderProgram* program)
{
    program->bind();

    // If existing VAO or VBO, destroy it
    if (vao.isCreated())
        vao.destroy();
    if (vertexBuffer.isCreated())
        vertexBuffer.destroy();
    if (indexBuffer.isCreated())
        indexBuffer.destroy();

    // Create new VBO for vertex
    vertexBuffer.create();
    vertexBuffer.bind();
    vertexBuffer.setUsagePattern(QOpenGLBuffer::StaticDraw);
    vertexBuffer.allocate(vertices.constData(),
                          vertices.size() * sizeof(VertexBillboard));

    // Create new VBO for indexes
    indexBuffer.create();
    indexBuffer.bind();
    indexBuffer.setUsagePattern(QOpenGLBuffer::StaticDraw);
    indexBuffer.allocate(indexes.constData(),
                         indexes.size() * sizeof(GLuint));

    // Create new VAO
    vao.create();
    vao.bind();
    program->enableAttributeArray(0);
    program->enableAttributeArray(1);
    program->enableAttributeArray(2);
    program->enableAttributeArray(3);
    program->setAttributeBuffer(0, GL_FLOAT, VertexBillboard::positionOffset(),
                                VertexBillboard::positionTupleSize,
                                VertexBillboard::stride());
    program->setAttributeBuffer(1, GL_FLOAT, VertexBillboard::texOffset(),
                                VertexBillboard::texCoupleSize,
                                VertexBillboard::stride());
    program->setAttributeBuffer(2, GL_FLOAT, VertexBillboard::sizeOffset(),
                                VertexBillboard::sizeCoupleSize,
                                VertexBillboard::stride());
    program->setAttributeBuffer(3, GL_FLOAT, VertexBillboard::modelOffset(),
                                VertexBillboard::modelCoupleSize,
                                VertexBillboard::stride());
    indexBuffer.bind();

    // Releases
    vao.release();
    indexBuffer.release();
    vertexBuffer.release();
    program->release();
}

// -------------------------------------------------------

void Map::paintFloors(QMatrix4x4& modelviewProjection)
{

    m_programStatic->bind();
    m_programStatic->setUniformValue(u_modelviewProjectionStatic,
                                     modelviewProjection);
    m_textureTileset->bind();

    int totalSize = getMapPortionTotalSize();
    for (int i = 0; i < totalSize; i++) {
        MapPortion* mapPortion = this->mapPortionBrut(i);
        if (mapPortion != nullptr)
            mapPortion->paintFloors();
    }

    m_programStatic->release();
}

// -------------------------------------------------------

void Map::paintOthers(QMatrix4x4 &modelviewProjection,
                      QVector3D &cameraRightWorldSpace,
                      QVector3D &cameraUpWorldSpace)
{
    int totalSize = getMapPortionTotalSize();
    MapPortion* mapPortion;

    m_programStatic->bind();
    m_programStatic->setUniformValue(u_modelviewProjectionStatic,
                                     modelviewProjection);
    m_textureTileset->bind();

    // Sprites
    for (int i = 0; i < totalSize; i++) {
        mapPortion = this->mapPortionBrut(i);
        if (mapPortion != nullptr)
            mapPortion->paintSprites();
    }

    // Objects
    QHash<int, QOpenGLTexture*>::iterator it;
    for (it = m_texturesCharacters.begin();
         it != m_texturesCharacters.end(); it++)
    {
        int textureID = it.key();
        QOpenGLTexture* texture = it.value();
        for (int i = 0; i < totalSize; i++) {
            mapPortion = this->mapPortionBrut(i);
            if (mapPortion != nullptr)
                mapPortion->paintObjectsStaticSprites(textureID, texture);
        }
    }

    // Face sprites
    m_programStatic->release();
    m_programFaceSprite->bind();
    m_programFaceSprite->setUniformValue(u_cameraRightWorldspace,
                                         cameraRightWorldSpace);
    m_programFaceSprite->setUniformValue(u_cameraUpWorldspace,
                                         cameraUpWorldSpace);
    m_programFaceSprite->setUniformValue(u_modelViewProjection,
                                         modelviewProjection);
    m_textureTileset->bind();
    for (int i = 0; i < totalSize; i++) {
        mapPortion = this->mapPortionBrut(i);
        if (mapPortion != nullptr)
            mapPortion->paintFaceSprites();
    }

    // Objects face sprites
    for (it = m_texturesCharacters.begin();
         it != m_texturesCharacters.end(); it++)
    {
        int textureID = it.key();
        QOpenGLTexture* texture = it.value();
        for (int i = 0; i < totalSize; i++) {
            mapPortion = this->mapPortionBrut(i);
            if (mapPortion != nullptr)
                mapPortion->paintObjectsFaceSprites(textureID, texture);
        }
    }
    m_programFaceSprite->release();

    // Objects squares
    m_programStatic->bind();
    m_textureObjectSquare->bind();
    for (int i = 0; i < totalSize; i++) {
        mapPortion = this->mapPortionBrut(i);
        if (mapPortion != nullptr)
            mapPortion->paintObjectsSquares();
    }

    m_programStatic->release();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void Map::readObjects(){
    QString pathTemp = Wanok::pathCombine(m_pathMap,
                                          Wanok::TEMP_MAP_FOLDER_NAME);
    QString path = Wanok::pathCombine(pathTemp, Wanok::fileMapObjects);
    QJsonDocument loadDoc;
    Wanok::readOtherJSON(path, loadDoc);
    QJsonObject json = loadDoc.object();
    readJSONArray(json["objs"].toArray());
}

// -------------------------------------------------------

void Map::writeObjects(bool temp) const{
    QString pathTemp = temp ?
                Wanok::pathCombine(m_pathMap, Wanok::TEMP_MAP_FOLDER_NAME)
              : m_pathMap;
    QString path = Wanok::pathCombine(pathTemp, Wanok::fileMapObjects);
    QJsonObject json;
    QJsonArray portions;
    writeJSONArray(portions);
    json["objs"] = portions;
    Wanok::writeOtherJSON(path, json);
}

// -------------------------------------------------------

void Map::readJSONArray(const QJsonArray & tab){
    QStandardItem* item;
    SystemMapObject* super;

    setModelObjects(m_modelObjects);
    for (int i = 0; i < tab.size(); i++){
        item = new QStandardItem;
        super = new SystemMapObject;
        super->read(tab.at(i).toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
        item->setText(super->toString());
        m_modelObjects->appendRow(item);
    }
}

// -------------------------------------------------------

void Map::writeJSONArray(QJsonArray & tab) const{
    SystemMapObject* super;

    for (int i = 2; i < m_modelObjects->invisibleRootItem()->rowCount(); i++){
        QJsonObject obj;
        super = ((SystemMapObject*) m_modelObjects->item(i)->data()
                 .value<quintptr>());
        super->write(obj);
        tab.append(obj);
    }
}
