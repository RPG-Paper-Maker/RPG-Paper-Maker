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

#include "land.h"
#include "qbox3d.h"
#include "floor.h"

QString LandDatas::jsonUp = "up";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

LandDatas::LandDatas(bool up) :
    MapElement(),
    m_up(up)
{

}

LandDatas::~LandDatas()
{

}

bool LandDatas::operator==(const LandDatas& other) const {
    return MapElement::operator==(other) && m_up == other.m_up;
}

bool LandDatas::operator!=(const LandDatas& other) const {
    return !operator==(other);
}

MapEditorSubSelectionKind LandDatas::getSubKind() const{
    return MapEditorSubSelectionKind::None;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void LandDatas::initializeVertices(int, int, int, QVector<Vertex>&,
                                   QVector<GLuint>&, Position&, int&)
{

}

// -------------------------------------------------------

float LandDatas::intersection(int squareSize, QRay3D& ray, Position& position) {
    QVector3D pos, size;
    getPosSize(pos, size, squareSize, position);

    QVector3D vecA = Floor::verticesQuad[0] * size + pos,
              vecC = Floor::verticesQuad[2] * size + pos;
    QBox3D box(vecA, vecC);

    return box.intersection(ray);
}

// -------------------------------------------------------

void LandDatas::getPosSize(QVector3D& pos, QVector3D& size, int squareSize,
                           Position &position)
{
    // Position
    float yLayerOffset = position.layer() * 0.05f;
    if (!m_up)
        yLayerOffset *= -1;
    float yPosition = position.getY(squareSize) + yLayerOffset;
    pos.setX(position.x() * squareSize);
    pos.setY(yPosition);
    pos.setZ(position.z() * squareSize);

    // Size
    size.setX(squareSize);
    size.setY(0.0f);
    size.setZ(squareSize);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void LandDatas::read(const QJsonObject &json){
    MapElement::read(json);

    if (json.contains(jsonUp))
        m_up = json[jsonUp].toBool();
}

// -------------------------------------------------------

void LandDatas::write(QJsonObject &json) const{
    MapElement::write(json);

    if (!m_up)
        json[jsonUp] = m_up;
}
