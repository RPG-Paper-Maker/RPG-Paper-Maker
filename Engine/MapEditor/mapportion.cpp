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
}

MapObjects* MapPortion::mapObjects() const { return m_mapObjects; }

bool MapPortion::isEmpty() const{
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

bool MapPortion::addSprite(Position& p, SpriteDatas *sprite){
    return m_sprites->addSprite(p, sprite);
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
//
//  GL
//
// -------------------------------------------------------


void MapPortion::initializeVertices(int squareSize, QOpenGLTexture *tileset,
                                    QHash<int, QOpenGLTexture *> &characters)
{
    m_floors->initializeVertices(squareSize,
                                 tileset->width(),
                                 tileset->height());
    m_sprites->initializeVertices(squareSize,
                                  tileset->width(),
                                  tileset->height());
    m_mapObjects->initializeVertices(squareSize,
                                     characters);
}

// -------------------------------------------------------

void MapPortion::initializeGL(QOpenGLShaderProgram *programStatic,
                              QOpenGLShaderProgram *programFace){
    m_floors->initializeGL(programStatic);
    m_sprites->initializeGL(programStatic, programFace);
    m_mapObjects->initializeGL(programStatic);
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

void MapPortion::paintObjectsSprites(int textureID, QOpenGLTexture* texture){
    m_mapObjects->paintStaticSprites(textureID, texture);
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
