/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "floor.h"
#include "lands.h"
#include "rpm.h"

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
    return RPM::translate(Translations::FLOOR).toUpper();
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
    QVector3D pos, size, center;
    getPosSizeCenterLand(pos, size, center, squareSize, position);

    float x = (float)(textureRect()->x() * squareSize) / width;
    float y = (float)(textureRect()->y() * squareSize) / height;
    float w = (float)(textureRect()->width() * squareSize) / width;
    float h = (float)(textureRect()->height() * squareSize) / height;
    if (w <= 0 || h <= 0)
    {
        return;
    }
    float coefX = 0.1 / width;
    float coefY = 0.1 / height;
    x += coefX;
    y += coefY;
    w -= (coefX * 2);
    h -= (coefY * 2);

    // Vertices
    QVector3D vecA = Lands::verticesQuad[0] * size + pos;
    QVector3D vecB = Lands::verticesQuad[1] * size + pos;
    QVector3D vecC = Lands::verticesQuad[2] * size + pos;
    QVector3D vecD = Lands::verticesQuad[3] * size + pos;
    if (position.angleY() != 0.0) {
        SpriteDatas::rotateSpriteX(vecA, vecB, vecC, vecD, center, position
            .angleY(), 0, 1, 0);
    }
    if (position.angleX() != 0.0) {
        SpriteDatas::rotateSpriteX(vecA, vecB, vecC, vecD, center, position
            .angleX(), 1, 0, 0);
    }
    if (position.angleZ() != 0.0) {
        SpriteDatas::rotateSpriteX(vecA, vecB, vecC, vecD, center, position
            .angleZ(), 0, 0, 1);
    }
    vertices.append(Vertex(vecA, QVector2D(x, y)));
    vertices.append(Vertex(vecB, QVector2D(x + w, y)));
    vertices.append(Vertex(vecC, QVector2D(x + w, y + h)));
    vertices.append(Vertex(vecD, QVector2D(x, y + h)));

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
