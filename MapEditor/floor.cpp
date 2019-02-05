/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#include "floor.h"
#include "lands.h"

// -------------------------------------------------------
//
//
//  ---------- FLOORDATAS
//
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

FloorDatas::FloorDatas() :
    FloorDatas(new QRect)
{

}

FloorDatas::FloorDatas(QRect* texture, bool up) :
    LandDatas(texture, up)
{

}

FloorDatas::~FloorDatas()
{

}

bool FloorDatas::operator==(const FloorDatas& other) const {
    return LandDatas::operator==(other);
}

bool FloorDatas::operator!=(const FloorDatas& other) const {
    return !operator==(other);
}

MapEditorSubSelectionKind FloorDatas::getSubKind() const{
    return MapEditorSubSelectionKind::Floors;
}

QString FloorDatas::toString() const {
    return "FLOOR";
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void FloorDatas::initializeVertices(int squareSize, int width, int height,
                                   QVector<Vertex>& vertices,
                                   QVector<GLuint>& indexes, Position& position,
                                   int& count)
{
    QVector3D pos, size;
    getPosSize(pos, size, squareSize, position);

    float x = (float)(textureRect()->x() * squareSize) / width;
    float y = (float)(textureRect()->y() * squareSize) / height;
    float w = (float)(textureRect()->width() * squareSize) / width;
    float h = (float)(textureRect()->height() * squareSize) / height;
    float coefX = 0.1 / width;
    float coefY = 0.1 / height;
    x += coefX;
    y += coefY;
    w -= (coefX * 2);
    h -= (coefY * 2);

    // Vertices
    vertices.append(Vertex(Lands::verticesQuad[0] * size + pos,
                    QVector2D(x, y)));
    vertices.append(Vertex(Lands::verticesQuad[1] * size + pos,
                    QVector2D(x + w, y)));
    vertices.append(Vertex(Lands::verticesQuad[2] * size + pos,
                    QVector2D(x + w, y + h)));
    vertices.append(Vertex(Lands::verticesQuad[3] * size + pos,
                    QVector2D(x, y + h)));

    // indexes
    int offset = count * Lands::nbVerticesQuad;
    for (int i = 0; i < Lands::nbIndexesQuad; i++)
        indexes.append(Lands::indexesQuad[i] + offset);

    count++;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void FloorDatas::read(const QJsonObject & json){
    LandDatas::read(json);
}

// -------------------------------------------------------

void FloorDatas::write(QJsonObject &json) const{
    LandDatas::write(json);
}
