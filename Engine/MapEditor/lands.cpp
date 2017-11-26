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

#include "lands.h"
#include "floors.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Lands::Lands() :
    m_floors(new Floors)
{

}

Lands::~Lands()
{
    delete m_floors;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool Lands::isEmpty() const {
    return m_floors->isEmpty();
}

// -------------------------------------------------------

LandDatas* Lands::getLand(Position& p) {
    return m_floors->getFloor(p);
}

// -------------------------------------------------------

bool Lands::addLand(Position& p, LandDatas* land) {
    return m_floors->addFloor(p, (FloorDatas*) land);
}

// -------------------------------------------------------

bool Lands::deleteLand(Position& p) {
    return m_floors->deleteFloor(p);
}

// -------------------------------------------------------

void Lands::removeLandOut(MapProperties& properties) {
    m_floors->removeFloorOut(properties);
}

// -------------------------------------------------------

MapElement* Lands::updateRaycasting(int squareSize, float& finalDistance,
                                    Position &finalPosition, QRay3D &ray)
{
    return m_floors->updateRaycasting(squareSize, finalDistance, finalPosition,
                                      ray);
}

// -------------------------------------------------------

MapElement* Lands::getMapElementAt(Position& position,
                                   MapEditorSubSelectionKind subKind)
{
    switch (subKind) {
    case MapEditorSubSelectionKind::Floors:
        return m_floors->getFloor(position);
    default:
        return nullptr;
    }
}

// -------------------------------------------------------

int Lands::getLastLayerAt(Position& position, MapEditorSubSelectionKind subKind)
{
    switch (subKind) {
    case MapEditorSubSelectionKind::Floors:
        return m_floors->getLastLayerAt(position);
    default:
        return position.layer();
    }
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void Lands::initializeVertices(QHash<Position, MapElement *> &previewSquares,
                               int squareSize, int width, int height)
{
    m_floors->initializeVertices(previewSquares, squareSize, width, height);
}

// -------------------------------------------------------

void Lands::initializeGL(QOpenGLShaderProgram *programStatic){
    m_floors->initializeGL(programStatic);
}

// -------------------------------------------------------

void Lands::updateGL(){
    m_floors->updateGL();
}

// -------------------------------------------------------

void Lands::paintGL(){
    m_floors->paintGL();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void Lands::read(const QJsonObject & json){
    m_floors->read(json);
}

// -------------------------------------------------------

void Lands::write(QJsonObject & json) const{
    m_floors->write(json);
}
