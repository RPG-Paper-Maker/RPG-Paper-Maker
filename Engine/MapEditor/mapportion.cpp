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

MapPortion::MapPortion() :
    m_floors(new Floors),
    m_sprites(new Sprites),
    m_mapObjects(new MapObjects)
{

}

MapPortion::~MapPortion()
{
    delete m_floors;
    delete m_sprites;
    delete m_mapObjects;

    clearPreview();
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
    return m_floors->isEmpty() && m_sprites->isEmpty() &&
            m_mapObjects->isEmpty();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

LandDatas* MapPortion::getLand(Position& p){
    return m_floors->getLand(p);
}

bool MapPortion::addLand(Position& p, LandDatas *land){
    return m_floors->addLand(p, land);
}

// -------------------------------------------------------

bool MapPortion::deleteLand(Position& p){
    return m_floors->deleteLand(p);
}

// -------------------------------------------------------

bool MapPortion::addSprite(Position& p, MapEditorSubSelectionKind kind,
                           int layer, int widthPosition, int angle,
                           QRect *textureRect)
{
    return m_sprites->addSprite(p, kind, layer, widthPosition, angle,
                                textureRect);
}

// -------------------------------------------------------

bool MapPortion::deleteSprite(Position& p){
    return m_sprites->deleteSprite(p);
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

void MapPortion::removeLandOut(MapProperties& properties) {
    m_floors->removeLandOut(properties);
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
}

// -------------------------------------------------------

void MapPortion::addPreview(Position& p, MapElement* element) {
    m_previewSquares.insert(p, element);
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------


void MapPortion::initializeVertices(int squareSize, QOpenGLTexture *tileset,
                                    QHash<int, QOpenGLTexture *> &characters)
{
    int spritesOffset = -0.005;
    m_floors->initializeVertices(m_previewSquares,
                                 squareSize,
                                 tileset->width(),
                                 tileset->height());
    m_sprites->initializeVertices(squareSize,
                                  tileset->width(),
                                  tileset->height(),
                                  spritesOffset);
    m_mapObjects->initializeVertices(squareSize, characters, spritesOffset);
}

// -------------------------------------------------------

void MapPortion::initializeGL(QOpenGLShaderProgram *programStatic,
                              QOpenGLShaderProgram *programFace){
    m_floors->initializeGL(programStatic);
    m_sprites->initializeGL(programStatic, programFace);
    m_mapObjects->initializeGL(programStatic, programFace);
}

// -------------------------------------------------------

void MapPortion::updateGL(){
    m_floors->updateGL();
    m_sprites->updateGL();
    m_mapObjects->updateGL();
}

// -------------------------------------------------------

void MapPortion::paintFloors(){
    m_floors->paintGL();
}

// -------------------------------------------------------

void MapPortion::paintSprites(){
    m_sprites->paintGL();
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
    if (json.contains("floors")){
        m_floors->read(json["floors"].toObject());
        m_sprites->read(json["sprites"].toObject());
        m_mapObjects->read(json["objs"].toObject());
    }
}

// -------------------------------------------------------

void MapPortion::write(QJsonObject & json) const{
    QJsonObject obj;

    // Floors
    m_floors->write(obj);
    json["floors"] = obj;

    // Sprites
    obj = QJsonObject();
    m_sprites->write(obj);
    json["sprites"] = obj;

    // Map objects
    obj = QJsonObject();
    m_mapObjects->write(obj);
    json["objs"] = obj;
}
