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
    m_floors(new Floors),
    m_autotiles(new Autotiles)
{

}

Lands::~Lands()
{
    delete m_floors;
    delete m_autotiles;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool Lands::isEmpty() const {
    return m_floors->isEmpty() && m_autotiles->isEmpty();
}

// -------------------------------------------------------

LandDatas* Lands::getLand(Position& p) {
    LandDatas* land = m_floors->getFloor(p);

    if (land != nullptr)
        return land;

    land = m_autotiles->getAutotile(p);

    return land;
}

// -------------------------------------------------------

bool Lands::addLand(Position& p, LandDatas* land, QJsonObject &previous,
                    MapEditorSubSelectionKind &previousType)
{
    switch (land->getSubKind()) {
    case MapEditorSubSelectionKind::Floors:
        return m_floors->addFloor(p, (FloorDatas*) land, previous,
                                  previousType);
        break;
    case MapEditorSubSelectionKind::Autotiles:
        return m_autotiles->addAutotile(p, (AutotileDatas*) land, previous,
                                        previousType);
        break;
    default:
        return false;
    }
}

// -------------------------------------------------------

bool Lands::deleteLand(Position& p, QList<QJsonObject> &previous,
                       QList<MapEditorSubSelectionKind> &previousType,
                       QList<Position>& positions)
{
    QJsonObject prev;
    MapEditorSubSelectionKind kind = MapEditorSubSelectionKind::None;
    bool changed = m_floors->deleteFloor(p, prev, kind);
    if (kind == MapEditorSubSelectionKind::None) {
        changed = m_autotiles->deleteAutotile(p, prev, kind);
    }

    if (changed) {
        previous.append(prev);
        previousType.append(kind);
        positions.append(p);
        switch (kind) {
        case MapEditorSubSelectionKind::Floors:
            m_floors->updateRemoveLayer(p, previous, previousType, positions);
            break;
        case MapEditorSubSelectionKind::Autotiles:
            m_autotiles->updateRemoveLayer(p, previous, previousType,
                                           positions);
            break;
        default:
            break;
        }
    }

    return changed;
}

// -------------------------------------------------------

void Lands::removeLandOut(MapProperties& properties) {
    m_floors->removeFloorOut(properties);
    m_autotiles->removeAutotileOut(properties);
}

// -------------------------------------------------------

MapElement* Lands::updateRaycasting(int squareSize, float& finalDistance,
                                    Position &finalPosition, QRay3D &ray)
{
    MapElement* element = m_floors->updateRaycasting(squareSize, finalDistance,
                                                     finalPosition, ray);
    if (element == nullptr) {
        element = m_autotiles->updateRaycasting(squareSize, finalDistance,
                                                finalPosition, ray);
    }

    return element;
}

// -------------------------------------------------------

MapElement* Lands::getMapElementAt(Position& position,
                                   MapEditorSubSelectionKind subKind)
{
    switch (subKind) {
    case MapEditorSubSelectionKind::Floors:
        return m_floors->getFloor(position);
    case MapEditorSubSelectionKind::Autotiles:
        return m_autotiles->getAutotile(position);
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
    case MapEditorSubSelectionKind::Autotiles:
        return m_autotiles->getLastLayerAt(position);
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
    m_autotiles->read(json);
}

// -------------------------------------------------------

void Lands::write(QJsonObject & json) const{
    m_floors->write(json);
    m_autotiles->write(json);
}
