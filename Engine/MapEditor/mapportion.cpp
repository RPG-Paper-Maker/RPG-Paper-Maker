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

bool MapPortion::addLand(Position& p, LandDatas *land){
    return m_lands->addLand(p, land);
}

// -------------------------------------------------------

bool MapPortion::deleteLand(Position& p){
    return m_lands->deleteLand(p);
}

// -------------------------------------------------------

bool MapPortion::addSprite(QSet<Portion>& portionsOverflow, Position& p,
                           SpriteDatas* sprite)
{
    return m_sprites->addSprite(portionsOverflow, p, sprite);
}

bool MapPortion::addSpriteOnWall(QSet<Portion>& portionsOverflow,
                                 GridPosition& p, SpriteDatas *sprite)
{
    return m_sprites->addSpriteOnWall(portionsOverflow, p, sprite);
}

// -------------------------------------------------------

bool MapPortion::deleteSprite(QSet<Portion> &portionsOverflow, Position& p){
    return m_sprites->deleteSprite(portionsOverflow, p);
}

// -------------------------------------------------------

bool MapPortion::addSpriteWall(GridPosition& gridPosition, int specialID) {
    return m_sprites->addSpriteWall(gridPosition, specialID);
}

// -------------------------------------------------------

bool MapPortion::deleteSpriteWall(GridPosition& gridPosition) {
    return m_sprites->deleteSpriteWall(gridPosition);
}

// -------------------------------------------------------

void MapPortion::updateSpriteWalls() {
    m_sprites->updateSpriteWalls(m_previewGrid, m_previewDeleteGrid);
}

// -------------------------------------------------------

SpriteWallDatas* MapPortion::getWallAt(GridPosition& gridPosition) {
    return m_sprites->getWallAt(m_previewGrid, m_previewDeleteGrid,
                                gridPosition);
}

// -------------------------------------------------------

bool MapPortion::addObject(Position& p, SystemCommonObject* o){
    return m_mapObjects->addObject(p, o);
}

// -------------------------------------------------------

bool MapPortion::deleteObject(Position& p){
    return m_mapObjects->deleteObject(p);
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

    QHash<GridPosition, MapElement*>::iterator j;
    for (j = m_previewGrid.begin(); j != m_previewGrid.end(); j++)
        delete j.value();

    m_previewSquares.clear();
    m_previewGrid.clear();
    m_previewDeleteGrid.clear();
}

// -------------------------------------------------------

void MapPortion::addPreview(Position& p, MapElement* element) {
    m_previewSquares.insert(p, element);
}

// -------------------------------------------------------

void MapPortion::addPreviewGrid(GridPosition& p, MapElement* element) {
    m_previewGrid.insert(p, element);
}

// -------------------------------------------------------

void MapPortion::addPreviewDeleteGrid(GridPosition& p) {
    m_previewDeleteGrid.append(p);
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
                                                GridPosition &finalGridPosition,
                                                QRay3D &ray,
                                                double cameraHAngle,
                                                bool layerOn)
{
    return m_sprites->updateRaycasting(squareSize, finalDistance, finalPosition,
                                       finalGridPosition, ray, cameraHAngle,
                                       layerOn);
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

void MapPortion::updateRemoveLayer(QSet<Portion> portionsOverflow,
                                   Position& position,
                                   MapEditorSelectionKind kind)
{
    switch (kind) {
    case MapEditorSelectionKind::Sprites:
        m_sprites->updateRemoveLayer(portionsOverflow, position);
        break;
    default:
        break;
    }
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------


void MapPortion::initializeVertices(int squareSize, QOpenGLTexture *tileset,
                                    QHash<int, QOpenGLTexture *> &characters,
                                    QHash<int, QOpenGLTexture *> &walls)
{
    m_lands->initializeVertices(m_previewSquares, squareSize,
                                 tileset->width(), tileset->height());
    m_sprites->initializeVertices(walls, m_previewSquares, m_previewGrid,
                                  m_previewDeleteGrid, squareSize,
                                  tileset->width(), tileset->height());
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
