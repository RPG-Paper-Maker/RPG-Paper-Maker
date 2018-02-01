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

#include "mapportion.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MapPortion::MapPortion(Portion &globalPortion) :
    m_globalPortion(globalPortion),
    m_lands(new Lands),
    m_sprites(new Sprites),
    m_mapObjects(new MapObjects)
{

}

MapPortion::~MapPortion()
{
    delete m_lands;
    delete m_sprites;
    delete m_mapObjects;

    clearPreview();
}

void MapPortion::getGlobalPortion(Portion& portion) {
    portion = m_globalPortion;
}

MapObjects* MapPortion::mapObjects() const { return m_mapObjects; }

bool MapPortion::isVisibleLoaded() const {
    return isVisible();
}

bool MapPortion::isVisible() const {
   return m_isVisible;
}

bool MapPortion::isLoaded() const {
    return m_isLoaded;
}

void MapPortion::setIsVisible(bool b) {
    m_isVisible = b;
}

void MapPortion::setIsLoaded(bool b) {
    m_isLoaded = b;
}

bool MapPortion::isEmpty() const {
    return m_lands->isEmpty() && m_sprites->isEmpty() &&
           m_mapObjects->isEmpty();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

LandDatas* MapPortion::getLand(Position& p){
    return m_lands->getLand(p);
}

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

void MapPortion::updateSpriteWalls() {
    m_sprites->updateSpriteWalls(m_previewSquares, m_previewDelete);
}

// -------------------------------------------------------

SpriteWallDatas* MapPortion::getWallAt(Position &position) {
    return m_sprites->getWallAt(m_previewSquares, m_previewDelete, position);
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

void MapPortion::addOverflow(Position& p) {
    m_sprites->addOverflow(p);
}

// -------------------------------------------------------

void MapPortion::removeOverflow(Position& p) {
    m_sprites->removeOverflow(p);
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

MapElement* MapPortion::updateRaycastingLand(int squareSize,
                                             float& finalDistance,
                                             Position &finalPosition,
                                             QRay3D& ray)
{
    return m_lands->updateRaycasting(squareSize, finalDistance, finalPosition,
                                     ray);
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

MapElement* MapPortion::getMapElementAt(Position& position,
                                        MapEditorSelectionKind kind,
                                        MapEditorSubSelectionKind subKind)
{
    switch (kind) {
    case MapEditorSelectionKind::Land:
        return m_lands->getMapElementAt(position, subKind);
    case MapEditorSelectionKind::Sprites:
        return m_sprites->getMapElementAt(position, subKind);
    default:
        return nullptr;
    }
}

int MapPortion::getLastLayerAt(Position& position, MapEditorSelectionKind kind,
                               MapEditorSubSelectionKind subKind) const
{
    switch (kind) {
    case MapEditorSelectionKind::Land:
        return m_lands->getLastLayerAt(position, subKind);
    case MapEditorSelectionKind::Sprites:
        return m_sprites->getLastLayerAt(position);
    default:
        return position.layer();
    }
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------


void MapPortion::initializeVertices(int squareSize, QOpenGLTexture *tileset,
                                    QList<TextureAutotile*>& autotiles,
                                    QHash<int, QOpenGLTexture *> &characters,
                                    QHash<int, QOpenGLTexture *> &walls)
{
    m_lands->initializeVertices(autotiles, m_previewSquares, squareSize,
                                tileset->width(), tileset->height());
    m_sprites->initializeVertices(walls, m_previewSquares, m_previewDelete,
                                  squareSize, tileset->width(),
                                  tileset->height());
    m_mapObjects->initializeVertices(squareSize, characters);
}

// -------------------------------------------------------

void MapPortion::initializeVerticesObjects(int squareSize,
                                           QHash<int, QOpenGLTexture*>&
                                           characters)
{
    m_mapObjects->initializeVertices(squareSize, characters);
}

// -------------------------------------------------------

void MapPortion::initializeGL(QOpenGLShaderProgram *programStatic,
                              QOpenGLShaderProgram *programFace)
{
    m_lands->initializeGL(programStatic);
    m_sprites->initializeGL(programStatic, programFace);
    initializeGLObjects(programStatic, programFace);
}

// -------------------------------------------------------

void MapPortion::initializeGLObjects(QOpenGLShaderProgram *programStatic,
                                     QOpenGLShaderProgram *programFace)
{
    m_mapObjects->initializeGL(programStatic, programFace);
}

// -------------------------------------------------------

void MapPortion::updateGL(){
    m_lands->updateGL();
    m_sprites->updateGL();
    updateGLObjects();
}


// -------------------------------------------------------

void MapPortion::updateGLObjects() {
    m_mapObjects->updateGL();
}

// -------------------------------------------------------

void MapPortion::paintFloors(){
    m_lands->paintGL();
}

// -------------------------------------------------------

void MapPortion::paintAutotiles(int textureID) {
    m_lands->paintAutotilesGL(textureID);
}

// -------------------------------------------------------

void MapPortion::paintSprites(){
    m_sprites->paintGL();
}

// -------------------------------------------------------

void MapPortion::paintSpritesWalls(int textureID) {
    m_sprites->paintSpritesWalls(textureID);
}

// -------------------------------------------------------

void MapPortion::paintFaceSprites(){
    m_sprites->paintFaceGL();
}

// -------------------------------------------------------

void MapPortion::paintObjectsStaticSprites(int textureID,
                                           QOpenGLTexture* texture)
{
    m_mapObjects->paintStaticSprites(textureID, texture);
}

// -------------------------------------------------------

void MapPortion::paintObjectsFaceSprites(int textureID,
                                         QOpenGLTexture* texture)
{
    m_mapObjects->paintFaceSprites(textureID, texture);
}

// -------------------------------------------------------

void MapPortion::paintObjectsSquares(){
    m_mapObjects->paintSquares();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void MapPortion::read(const QJsonObject & json){
    if (json.contains("lands")){
        m_lands->read(json["lands"].toObject());
        m_sprites->read(json["sprites"].toObject());
        m_mapObjects->read(json["objs"].toObject());
    }
}

// -------------------------------------------------------

void MapPortion::write(QJsonObject & json) const{
    QJsonObject obj;

    // Floors
    m_lands->write(obj);
    json["lands"] = obj;

    // Sprites
    obj = QJsonObject();
    m_sprites->write(obj);
    json["sprites"] = obj;

    // Map objects
    obj = QJsonObject();
    m_mapObjects->write(obj);
    json["objs"] = obj;
}
