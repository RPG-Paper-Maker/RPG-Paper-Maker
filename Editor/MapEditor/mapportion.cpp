/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "mapportion.h"
#include "rpm.h"

const QString MapPortion::JSON_LANDS = "lands";
const QString MapPortion::JSON_SPRITES = "sprites";
const QString MapPortion::JSON_OBJECT_3D = "objs3d";
const QString MapPortion::JSON_MOUNTAINS = "moun";
const QString MapPortion::JSON_OBJECT = "objs";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MapPortion::MapPortion(Portion &globalPortion) :
    m_globalPortion(globalPortion),
    m_lands(new Lands),
    m_sprites(new Sprites),
    m_objects3D(new Objects3D),
    m_mountains(new Mountains),
    m_mapObjects(new MapObjects),
    m_detection(nullptr),
    m_isEmpty(true)
{

}

MapPortion::~MapPortion()
{
    delete m_lands;
    delete m_sprites;
    delete m_objects3D;
    delete m_mountains;
    delete m_mapObjects;

    clearPreview();
}

void MapPortion::setDetection(SystemDetection *detection) {
    m_detection = detection;
}

void MapPortion::getGlobalPortion(Portion& portion) {
    portion = m_globalPortion;
}

MapObjects* MapPortion::mapObjects() const { return m_mapObjects; }

bool MapPortion::isVisibleLoaded() const {
    return isVisible() && !isEmpty();
}

bool MapPortion::isVisible() const {
   return m_isVisible;
}

void MapPortion::setIsVisible(bool b) {
    m_isVisible = b;
}

bool MapPortion::isEmpty() const {
    return m_isEmpty;
}

void MapPortion::updateEmpty() {
    bool previewSquare = m_previewSquares.isEmpty();

    m_lands->updateEmpty(previewSquare);
    m_sprites->updateEmpty(previewSquare);
    m_objects3D->updateEmpty(previewSquare);
    m_mountains->updateEmpty(previewSquare);
    m_mapObjects->updateEmpty();
    m_isEmpty = m_lands->isEmpty() && m_sprites->isEmpty() && m_objects3D
        ->isEmpty() && m_mountains->isEmpty() && m_mapObjects->isEmpty() &&
        previewSquare;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void MapPortion::initializeDetection() {
    m_detection->initializeObjects(m_objects3D, m_globalPortion);
}

// -------------------------------------------------------

LandDatas* MapPortion::getLand(Position& p) {
    return m_lands->getLand(p);
}

// -------------------------------------------------------

bool MapPortion::addLand(Position& p, LandDatas *land, QJsonObject& previous,
                         MapEditorSubSelectionKind& previousType,
                         QSet<MapPortion*>& update, QSet<MapPortion*>& save)
{
    return m_lands->addLand(p, land, previous, previousType, update, save);
}

// -------------------------------------------------------

bool MapPortion::deleteLand(Position& p, QList<QJsonObject> &previous,
                            QList<MapEditorSubSelectionKind> &previousType,
                            QList<Position> &positions,
                            QSet<MapPortion*>& update, QSet<MapPortion*>& save)
{
    return m_lands->deleteLand(p, previous, previousType, positions, update,
                               save);
}

// -------------------------------------------------------

bool MapPortion::addSprite(QSet<Portion>& portionsOverflow, Position& p,
                           SpriteDatas* sprite, QJsonObject &previous,
                           MapEditorSubSelectionKind &previousType)
{
    return m_sprites->addSprite(portionsOverflow, p, sprite, previous,
                                previousType);
}

// -------------------------------------------------------

bool MapPortion::deleteSprite(QSet<Portion> &portionsOverflow, Position& p,
                              QList<QJsonObject> &previous,
                              QList<MapEditorSubSelectionKind> &previousType,
                              QList<Position> &positions)
{
    QJsonObject prev;
    MapEditorSubSelectionKind kind = MapEditorSubSelectionKind::None;
    bool changed = m_sprites->deleteSprite(portionsOverflow, p, prev, kind);

    if (changed) {
        previous.append(prev);
        previousType.append(kind);
        positions.append(p);
        m_sprites->updateRemoveLayer(portionsOverflow, p, previous,
                                     previousType, positions);
    }

    return changed;
}

// -------------------------------------------------------

bool MapPortion::addSpriteWall(Position &position, SpriteWallDatas* sprite,
                               QJsonObject &previous,
                               MapEditorSubSelectionKind &previousType)
{
    return m_sprites->addSpriteWall(position, sprite, previous,
                                    previousType);
}

// -------------------------------------------------------

bool MapPortion::deleteSpriteWall(Position &position,
                                  QJsonObject &previous,
                                  MapEditorSubSelectionKind &previousType)
{
    return m_sprites->deleteSpriteWall(position, previous, previousType);
}

// -------------------------------------------------------

bool MapPortion::addObject3D(QSet<Portion> &portionsOverflow, Position &p,
    Object3DDatas *object3D, QJsonObject &previous, MapEditorSubSelectionKind
    &previousType)
{
    return m_objects3D->addObject3D(portionsOverflow, p, object3D, previous,
        previousType);
}

// -------------------------------------------------------

bool MapPortion::deleteObject3D(QSet<Portion> &portionsOverflow, Position &p,
    QList<QJsonObject> &previous, QList<MapEditorSubSelectionKind> &previousType
    , QList<Position> &positions)
{
    QJsonObject prev;
    MapEditorSubSelectionKind kind = MapEditorSubSelectionKind::None;
    bool changed = m_objects3D->deleteObject3D(portionsOverflow, p, prev, kind);

    if (changed) {
        previous.append(prev);
        previousType.append(kind);
        positions.append(p);
    }

    return changed;
}

// -------------------------------------------------------

bool MapPortion::addMountain(QSet<Portion> &portionsOverflow, Position &p,
    MountainDatas *mountain, QJsonObject &previous, MapEditorSubSelectionKind
    &previousType, QSet<MapPortion *> &update, QSet<MapPortion *> &save,
    Position &positionPreviousFloor)
{
    return m_mountains->addMountain(portionsOverflow, p, mountain, previous,
        previousType, update, save, positionPreviousFloor);
}

// -------------------------------------------------------

bool MapPortion::deleteMountain(QSet<Portion> &portionsOverflow, Position &p,
    QList<QJsonObject> &previous, QList<MapEditorSubSelectionKind> &previousType
    , QList<Position> &positions, QSet<MapPortion *> &update, QSet<MapPortion *>
    &save)
{
    QJsonObject prev;
    MapEditorSubSelectionKind kind = MapEditorSubSelectionKind::None;
    bool changed = m_mountains->deleteMountain(portionsOverflow, p, prev, kind,
        update, save);

    if (changed) {
        previous.append(prev);
        previousType.append(kind);
        positions.append(p);
    }

    return changed;
}

// -------------------------------------------------------

void MapPortion::updateAutotiles(Position &position, QSet<MapPortion *> &update,
    QSet<MapPortion *> &save, QSet<MapPortion *> &previousPreview)
{
    m_lands->updateAutotiles(position, m_previewSquares, update, save,
        previousPreview);
}

// -------------------------------------------------------

void MapPortion::updateMountains(Position &position, QSet<MapPortion *> &update,
    QSet<MapPortion *> &save, QSet<MapPortion *> &previousPreview)
{
    m_mountains->updateMountains(position, m_previewSquares, update, save,
        previousPreview);
}

// -------------------------------------------------------

void MapPortion::updateSpriteWalls() {
    m_sprites->updateSpriteWalls(m_previewSquares, m_previewDelete);
}

// -------------------------------------------------------

SpriteWallDatas* MapPortion::getWallAt(Position &position) {
    return m_sprites->getWallAt(m_previewSquares, m_previewDelete, position);
}

// -------------------------------------------------------

void MapPortion::fillWithFloor(MapProperties *properties) {
    QRect rect(0, 0, 1, 1);
    Position p;

    for (int i = 0; i < RPM::PORTION_SIZE; i++) {
        for (int j = 0; j < RPM::PORTION_SIZE; j++) {
            p.setCoords(m_globalPortion.x() * RPM::PORTION_SIZE + i,
                m_globalPortion.y() * RPM::PORTION_SIZE, 0, m_globalPortion.z()
                * RPM::PORTION_SIZE + j);
            if (p.x() < properties->length() && p.y() >= -properties->depth() &&
                p.y() < properties->height() && p.z() < properties->width())
            {
                m_lands->setLand(p, new FloorDatas(new QRect(rect)));
            }
        }
    }
}

// -------------------------------------------------------

bool MapPortion::addObject(Position& p, SystemCommonObject* o,
                           QJsonObject &previous,
                           MapEditorSubSelectionKind &previousType)
{
    return m_mapObjects->addObject(p, o, previous, previousType);
}

// -------------------------------------------------------

bool MapPortion::deleteObject(Position& p, QJsonObject &previous,
                              MapEditorSubSelectionKind &previousType){
    return m_mapObjects->deleteObject(p, previous, previousType);
}

// -------------------------------------------------------

void MapPortion::addOverflowSprites(Position& p) {
    m_sprites->addOverflow(p);
}

// -------------------------------------------------------

void MapPortion::removeOverflowSprites(Position& p) {
    m_sprites->removeOverflow(p);
}

// -------------------------------------------------------

void MapPortion::addOverflowObjects3D(Position &p) {
    m_objects3D->addOverflow(p);
}

// -------------------------------------------------------

void MapPortion::removeOverflowObjects3D(Position& p) {
    m_objects3D->removeOverflow(p);
}

// -------------------------------------------------------

void MapPortion::addOverflowMountains(Position &p) {
    m_mountains->addOverflow(p);
}

// -------------------------------------------------------

void MapPortion::removeOverflowMountains(Position& p) {
    m_mountains->removeOverflow(p);
}

// -------------------------------------------------------

void MapPortion::removeLandOut(MapProperties& properties) {
    m_lands->removeLandOut(properties);
}

// -------------------------------------------------------

void MapPortion::removeSpritesOut(MapProperties& properties) {
    m_sprites->removeSpritesOut(properties);
}

// -------------------------------------------------------

void MapPortion::removeObjects3DOut(MapProperties& properties) {
    m_objects3D->removeObjects3DOut(properties);
}

// -------------------------------------------------------

void MapPortion::removeMountainsOut(MapProperties& properties) {
    m_mountains->removeMountainsOut(properties);
}


// -------------------------------------------------------

void MapPortion::removeObjectsOut(QList<int> &listDeletedObjectsIDs,
                                  MapProperties& properties)
{
    m_mapObjects->removeObjectsOut(listDeletedObjectsIDs, properties);
}

// -------------------------------------------------------

void MapPortion::clearPreview() {
    QHash<Position, MapElement*>::iterator i;
    for (i = m_previewSquares.begin(); i != m_previewSquares.end(); i++)
        delete i.value();

    m_previewSquares.clear();
    m_previewDelete.clear();
}

// -------------------------------------------------------

void MapPortion::addPreview(Position& p, MapElement* element) {
    m_previewSquares.insert(p, element);
}

// -------------------------------------------------------

void MapPortion::addPreviewDelete(Position &p) {
    m_previewDelete.append(p);
}

// -------------------------------------------------------

MapElement* MapPortion::updateRaycastingLand(int squareSize, float&
    finalDistance, Position &finalPosition, QRay3D& ray, Position &previousCoords)
{
    return m_lands->updateRaycasting(squareSize, finalDistance, finalPosition,
        ray, previousCoords);
}

// -------------------------------------------------------

MapElement* MapPortion::updateRaycastingSprites(int squareSize,
                                                float& finalDistance,
                                                Position& finalPosition,
                                                QRay3D &ray,
                                                double cameraHAngle,
                                                bool layerOn)
{
    return m_sprites->updateRaycasting(squareSize, finalDistance, finalPosition,
                                       ray, cameraHAngle, layerOn);
}

// -------------------------------------------------------

MapElement* MapPortion::updateRaycastingObjects3D(float &finalDistance,
    Position &finalPosition, QRay3D &ray)
{
    return m_objects3D->updateRaycasting(finalDistance, finalPosition, ray);
}

MapElement* MapPortion::updateRaycastingMountains(float &finalDistance, Position
    &finalPosition, QRay3D &ray)
{
    return m_mountains->updateRaycasting(finalDistance, finalPosition, ray);
}

// -------------------------------------------------------

MapElement* MapPortion::updateRaycastingObjects(int squareSize, float&
    finalDistance, Position &finalPosition, QRay3D& ray)
{
    return m_mapObjects->updateRaycasting(squareSize, finalDistance,
        finalPosition, ray);
}

// -------------------------------------------------------

MapElement* MapPortion::updateRaycastingOverflowSprite(int squareSize,
                                                        Position& position,
                                                        float &finalDistance,
                                                        Position &finalPosition,
                                                        QRay3D& ray,
                                                        double cameraHAngle)
{
    SpriteDatas* sprite = m_sprites->spriteAt(position);

    if (m_sprites->updateRaycastingAt(position, sprite, squareSize,
                                      finalDistance, finalPosition, ray,
                                      cameraHAngle))
    {
        return sprite;
    }

    return nullptr;
}

// -------------------------------------------------------

MapElement* MapPortion::updateRaycastingOverflowObject3D(Position& position,
    float &finalDistance, Position &finalPosition, QRay3D& ray)
{
    Object3DDatas *object3D;

    object3D = m_objects3D->object3DAt(position);
    if (m_objects3D->updateRaycastingAt(position, object3D, finalDistance,
        finalPosition, ray))
    {
        return object3D;
    }

    return nullptr;
}

// -------------------------------------------------------

MapElement * MapPortion::updateRaycastingOverflowMountain(Position &position,
    float &finalDistance, Position &finalPosition, QRay3D &ray)
{
    MountainDatas *mountain;

    mountain = m_mountains->mountainAt(position);
    if (m_mountains->updateRaycastingAt(position, mountain, finalDistance,
        finalPosition, ray))
    {
        return mountain;
    }

    return nullptr;
}

// -------------------------------------------------------

MapElement* MapPortion::getMapElementAt(Position& position,
                                        MapEditorSelectionKind kind,
                                        MapEditorSubSelectionKind subKind)
{
    switch (kind) {
    case MapEditorSelectionKind::Land:
        return m_lands->getMapElementAt(position, subKind);
    case MapEditorSelectionKind::Sprites:
        return m_sprites->getMapElementAt(position, subKind);
    case MapEditorSelectionKind::Objects3D:
        return m_objects3D->getMapElementAt(position);
    case MapEditorSelectionKind::Mountains:
        return m_mountains->getMapElementAt(position);
    default:
        return nullptr;
    }
}

// -------------------------------------------------------

int MapPortion::getLastLayerAt(Position& position, MapEditorSelectionKind kind)
const
{
    switch (kind) {
    case MapEditorSelectionKind::Land:
        return m_lands->getLastLayerAt(position);
    case MapEditorSelectionKind::Sprites:
        return m_sprites->getLastLayerAt(position);
    case MapEditorSelectionKind::Objects3D:
        return m_objects3D->getLastLayerAt(position);
    case MapEditorSelectionKind::Mountains:
        return m_mountains->getLastLayerAt(position);
    default:
        return position.layer();
    }
}

// -------------------------------------------------------

MapElement * MapPortion::updateElementPosition(Position &previousPosition,
    MapEditorSelectionKind kind)
{
    switch (kind) {
    case MapEditorSelectionKind::Sprites:
        return m_sprites->spriteAt(previousPosition);
    case MapEditorSelectionKind::Objects3D:
        return m_objects3D->object3DAt(previousPosition);
    default:
        return nullptr;
    }
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------


void MapPortion::initializeVertices(int squareSize, QOpenGLTexture *tileset,
                                    QList<TextureSeveral *> &autotiles,
                                    QList<TextureSeveral *> &mountains,
                                    QHash<int, QOpenGLTexture *> &characters,
                                    QHash<int, QOpenGLTexture *> &walls,
                                    MapElement *elementExcludeSprite,
                                    MapElement *elementExcludeObject3D)
{
    m_lands->initializeVertices(autotiles, m_previewSquares, squareSize,
                                tileset->width(), tileset->height());
    m_sprites->initializeVertices(walls, m_previewSquares, m_previewDelete,
                                  squareSize, tileset->width(),
                                  tileset->height(), elementExcludeSprite);
    m_objects3D->initializeVertices(m_previewSquares, m_previewDelete,
        elementExcludeObject3D);
    m_mountains->initializeVertices(mountains, m_previewSquares, m_previewDelete);
    m_mapObjects->initializeVertices(squareSize, characters, tileset);
}

// -------------------------------------------------------

void MapPortion::initializeVerticesObjects(int squareSize,
                                           QHash<int, QOpenGLTexture*>&
                                           characters, QOpenGLTexture *tileset)
{
    m_mapObjects->initializeVertices(squareSize, characters, tileset);
}

// -------------------------------------------------------

void MapPortion::initializeGL(QOpenGLShaderProgram *programStatic,
                              QOpenGLShaderProgram *programFace)
{
    m_lands->initializeGL(programStatic);
    m_sprites->initializeGL(programStatic, programFace);
    m_objects3D->initializeGL(programStatic);
    m_mountains->initializeGL(programStatic);
    initializeGLObjects(programStatic, programFace);
}

// -------------------------------------------------------

void MapPortion::initializeGLObjects(QOpenGLShaderProgram *programStatic,
                                     QOpenGLShaderProgram *programFace)
{
    m_mapObjects->initializeGL(programStatic, programFace);
}

// -------------------------------------------------------

void MapPortion::updateGL() {
    m_lands->updateGL();
    m_sprites->updateGL();
    m_objects3D->updateGL();
    m_mountains->updateGL();
    updateGLObjects();
}

// -------------------------------------------------------

void MapPortion::updateGLObjects() {
    m_mapObjects->updateGL();
}

// -------------------------------------------------------

void MapPortion::paintFloors(){
    if (!m_lands->isEmpty()) {
        m_lands->paintGL();
    }
}

// -------------------------------------------------------

void MapPortion::paintAutotiles(int textureID) {
    if (!m_lands->isEmpty()) {
        m_lands->paintAutotilesGL(textureID);
    }
}

// -------------------------------------------------------

void MapPortion::paintSprites(int uniformHovered) {
    if (!m_sprites->isEmpty()) {
        m_sprites->paintGL(uniformHovered);
    }
}

// -------------------------------------------------------

void MapPortion::paintSpritesWalls(int textureID) {
    if (!m_sprites->isEmpty()) {
        m_sprites->paintSpritesWalls(textureID);
    }
}

// -------------------------------------------------------

void MapPortion::paintFaceSprites(int uniformHovered) {
    if (!m_sprites->isEmpty()) {
        m_sprites->paintFaceGL(uniformHovered);
    }
}

// -------------------------------------------------------

void MapPortion::paintObjects3D(int textureID, int uniformHovered) {
    if (!m_objects3D->isEmpty()) {
        m_objects3D->paintGL(textureID, uniformHovered);
    }
}

// -------------------------------------------------------

void MapPortion::paintMountains(int textureID) {
    if (!m_mountains->isEmpty()) {
        m_mountains->paintGL(textureID);
    }
}

// -------------------------------------------------------

void MapPortion::paintObjectsStaticSprites(int textureID,
                                           QOpenGLTexture* texture)
{
    if (!m_mapObjects->isEmpty()) {
        m_mapObjects->paintStaticSprites(textureID, texture);
    }
}

// -------------------------------------------------------

void MapPortion::paintObjectsFaceSprites(int textureID,
                                         QOpenGLTexture* texture)
{
    if (!m_mapObjects->isEmpty()) {
        m_mapObjects->paintFaceSprites(textureID, texture);
    }
}

// -------------------------------------------------------

void MapPortion::paintObjectsSquares(){
    if (!m_mapObjects->isEmpty()) {
        m_mapObjects->paintSquares();
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void MapPortion::read(const QJsonObject &json) {
    if (json.contains(JSON_LANDS)) {
        m_lands->read(json[JSON_LANDS].toObject());
        m_sprites->read(json[JSON_SPRITES].toObject());
        m_objects3D->read(json[JSON_OBJECT_3D].toObject());
        m_mountains->read(json[JSON_MOUNTAINS].toObject());
        m_mapObjects->read(json[JSON_OBJECT].toObject());
    }
}

// -------------------------------------------------------

void MapPortion::write(QJsonObject &json) const {
    QJsonObject obj;

    // Floors
    m_lands->write(obj);
    json[JSON_LANDS] = obj;

    // Sprites
    obj = QJsonObject();
    m_sprites->write(obj);
    json[JSON_SPRITES] = obj;

    // Objects 3D
    obj = QJsonObject();
    m_objects3D->write(obj);
    json[JSON_OBJECT_3D] = obj;

    // Mountains
    obj = QJsonObject();
    m_mountains->write(obj);
    json[JSON_MOUNTAINS] = obj;

    // Map objects
    obj = QJsonObject();
    m_mapObjects->write(obj);
    json[JSON_OBJECT] = obj;
}
