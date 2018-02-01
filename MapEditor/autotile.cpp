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

#include "autotile.h"
#include "map.h"

// -------------------------------------------------------
//
//
//  ---------- AUTOTILEDATAS
//
//
// -------------------------------------------------------

const QString AutotileDatas::JSON_ID = "id";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

AutotileDatas::AutotileDatas() :
    AutotileDatas(1, new QRect)
{

}

AutotileDatas::AutotileDatas(int autotileID, QRect *texture, bool up) :
    LandDatas(texture, up),
    m_autotileID(autotileID),
    m_tileID(0)
{

}

int AutotileDatas::autotileID() const {
    return m_autotileID;
}

bool AutotileDatas::operator==(const AutotileDatas& other) const {
    return LandDatas::operator==(other) && m_autotileID == other.m_autotileID;
}

bool AutotileDatas::operator!=(const AutotileDatas& other) const {
    return !operator==(other);
}

MapEditorSubSelectionKind AutotileDatas::getSubKind() const{
    return MapEditorSubSelectionKind::Autotiles;
}

QString AutotileDatas::toString() const {
    return "AUTOTILE";
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void AutotileDatas::initializeVertices(TextureAutotile* textureAutotile,
                                       int squareSize, int width, int height,
                                       QVector<Vertex>& vertices,
                                       QVector<GLuint>& indexes,
                                       Position& position, int& count)
{
    QVector3D pos, size;
    getPosSize(pos, size, squareSize, position);

    int xTile = m_tileID % 64;
    int yTile = (m_tileID / 64) +
            (10 * textureAutotile->getOffset(m_autotileID, m_textureRect));

    float x = ((float) xTile * squareSize) / width;
    float y = ((float) yTile * squareSize) / height;
    float w = ((float) squareSize) / width;
    float h = ((float) squareSize) / height;
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

void AutotileDatas::update(Position &position, Portion &portion,
                           QHash<Position, AutotileDatas *> &preview)
{
    int a, b, c, d;

    // Top left
    if (!Autotiles::tileOnLeft(position, portion, preview) &&
        !Autotiles::tileOnTop(position, portion, preview))
        a = 1;
    else if (!Autotiles::tileOnTop(position, portion, preview) &&
             Autotiles::tileOnLeft(position, portion, preview))
        a = 3;
    else if (!Autotiles::tileOnLeft(position, portion, preview) &&
             Autotiles::tileOnTop(position, portion, preview))
        a = 4;
    else if (Autotiles::tileOnLeft(position, portion, preview) &&
             Autotiles::tileOnTop(position, portion, preview) &&
             Autotiles::tileOnTopLeft(position, portion, preview))
        a = 2;
    else
        a = 0;

    // Top right
    if (!Autotiles::tileOnRight(position, portion, preview) &&
        !Autotiles::tileOnTop(position, portion, preview))
        b = 1;
    else if (!Autotiles::tileOnTop(position, portion, preview) &&
             Autotiles::tileOnRight(position, portion, preview))
        b = 3;
    else if (!Autotiles::tileOnRight(position, portion, preview) &&
             Autotiles::tileOnTop(position, portion, preview))
        b = 4;
    else if (Autotiles::tileOnRight(position, portion, preview) &&
             Autotiles::tileOnTop(position, portion, preview) &&
             Autotiles::tileOnTopRight(position, portion, preview))
        b = 2;
    else
        b = 0;

    // Bottom left
    if (!Autotiles::tileOnLeft(position, portion, preview) &&
            !Autotiles::tileOnBottom(position, portion, preview))
        c = 1;
    else if (!Autotiles::tileOnBottom(position, portion, preview) &&
             Autotiles::tileOnLeft(position, portion, preview))
        c = 3;
    else if (!Autotiles::tileOnLeft(position, portion, preview) &&
             Autotiles::tileOnBottom(position, portion, preview))
        c = 4;
    else if (Autotiles::tileOnLeft(position, portion, preview) &&
             Autotiles::tileOnBottom(position, portion, preview) &&
             Autotiles::tileOnBottomLeft(position, portion, preview))
        c = 2;
    else
        c = 0;

    // Bottom right
    if (!Autotiles::tileOnRight(position, portion, preview) &&
        !Autotiles::tileOnBottom(position, portion, preview))
        d = 1;
    else if (!Autotiles::tileOnBottom(position, portion, preview) &&
             Autotiles::tileOnRight(position, portion, preview))
        d = 3;
    else if (!Autotiles::tileOnRight(position, portion, preview) &&
             Autotiles::tileOnBottom(position, portion, preview))
        d = 4;
    else if (Autotiles::tileOnRight(position, portion, preview) &&
             Autotiles::tileOnBottom(position, portion, preview) &&
             Autotiles::tileOnBottomRight(position, portion, preview))
        d = 2;
    else
        d = 0;

    // Update tileId
    m_tileID = (a * 64 * 2) + (b * 25) + (c * 5) + d;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void AutotileDatas::read(const QJsonObject & json){
    LandDatas::read(json);

    m_autotileID = json[JSON_ID].toInt();
}

// -------------------------------------------------------

void AutotileDatas::write(QJsonObject &json) const{
    LandDatas::write(json);

    json[JSON_ID] = m_autotileID;
}

// -------------------------------------------------------
//
//
//  ---------- AUTOTILE
//
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Autotile::Autotile() :
    m_count(0),
    m_vertexBuffer(QOpenGLBuffer::VertexBuffer),
    m_indexBuffer(QOpenGLBuffer::IndexBuffer),
    m_program(nullptr)
{

}

Autotile::~Autotile()
{

}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void Autotile::initializeVertices(TextureAutotile* textureAutotile,
                                  Position &position, AutotileDatas* autotile,
                                  int squareSize, int width, int height)
{
    autotile->initializeVertices(textureAutotile, squareSize, width, height,
                                 m_vertices, m_indexes, position, m_count);
}

// -------------------------------------------------------

void Autotile::initializeGL(QOpenGLShaderProgram* program) {
    if (m_program == nullptr){
        initializeOpenGLFunctions();

        // Programs
        m_program = program;
    }
}

// -------------------------------------------------------

void Autotile::updateGL(){
    Map::updateGLStatic(m_vertexBuffer, m_indexBuffer, m_vertices, m_indexes,
                        m_vao, m_program);
}

// -------------------------------------------------------

void Autotile::paintGL(){
    m_vao.bind();
    glDrawElements(GL_TRIANGLES, m_indexes.size(), GL_UNSIGNED_INT, 0);
    m_vao.release();
}
