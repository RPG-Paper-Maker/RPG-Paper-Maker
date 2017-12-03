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

#include "sprite.h"
#include "map.h"
#include "wanok.h"
#include "qbox3d.h"

// -------------------------------------------------------
//
//
//  ---------- SPRITE
//
//
// -------------------------------------------------------

QVector3D Sprite::verticesQuad[4]{
                                  QVector3D(0.0f, 1.0f, 0.0f),
                                  QVector3D(1.0f, 1.0f, 0.0f),
                                  QVector3D(1.0f, 0.0f, 0.0f),
                                  QVector3D(0.0f, 0.0f, 0.0f)
                                };

QVector3D Sprite::modelQuad[4]{
    QVector3D(-0.5f, 0.5f, 0.0f),
    QVector3D(0.5f, 0.5f, 0.0f),
    QVector3D(0.5f, -0.5f, 0.0f),
    QVector3D(-0.5f, -0.5f, 0.0f)
};

GLuint Sprite::indexesQuad[6]{0, 1, 2, 0, 2, 3};

int Sprite::nbVerticesQuad(4);

int Sprite::nbIndexesQuad(6);

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Sprite::Sprite()
{

}

Sprite::~Sprite()
{

}

// -------------------------------------------------------
//
//
//  ---------- SPRITEDATAS
//
//
// -------------------------------------------------------

QString SpriteDatas::jsonFront = "f";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SpriteDatas::SpriteDatas() :
    SpriteDatas(MapEditorSubSelectionKind::SpritesFace, new QRect(0, 0, 2, 2))
{

}

SpriteDatas::SpriteDatas(MapEditorSubSelectionKind kind, QRect *textureRect,
                         bool front) :
    m_kind(kind),
    m_textureRect(textureRect),
    m_front(front)
{

}

SpriteDatas::~SpriteDatas()
{
    delete m_textureRect;
}

MapEditorSelectionKind SpriteDatas::getKind() const {
    return MapEditorSelectionKind::Sprites;
}

MapEditorSubSelectionKind SpriteDatas::getSubKind() const { return m_kind; }

QString SpriteDatas::toString() const {
    switch (m_kind) {
    case MapEditorSubSelectionKind::SpritesFace:
        return "SPRITE FACE";
    case MapEditorSubSelectionKind::SpritesFix:
        return "SPRITE FIX";
    case MapEditorSubSelectionKind::SpritesDouble:
        return "SPRITE DOUBLE";
    case MapEditorSubSelectionKind::SpritesQuadra:
        return "SPRITE QUADRA";
    default:
        return "";
    }
}

QRect* SpriteDatas::textureRect() const { return m_textureRect; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SpriteDatas::getPosSizeCenter(QVector3D& pos, QVector3D& size,
                                   QVector3D& center, QVector3D& offset,
                                   int squareSize, Position& position)
{
    MapElement::getPosSizeCenter(pos, size, center, offset, squareSize,
                                 position, textureRect()->width(),
                                 textureRect()->height(), m_front);
}

// -------------------------------------------------------

void SpriteDatas::initializeVertices(int squareSize,
                                     int width, int height,
                                     QVector<Vertex>& verticesStatic,
                                     QVector<GLuint>& indexesStatic,
                                     QVector<VertexBillboard>& verticesFace,
                                     QVector<GLuint>& indexesFace,
                                     Position& position, int& countStatic,
                                     int& countFace)
{
    QVector3D pos, size, center, off;

    float x, y, w, h;
    int offset;
    x = (float)(m_textureRect->x() * squareSize) / width;
    y = (float)(m_textureRect->y() * squareSize) / height;
    w = (float)(m_textureRect->width() * squareSize) / width;
    h = (float)(m_textureRect->height() * squareSize) / height;
    float coefX = 0.1 / width;
    float coefY = 0.1 / height;
    x += coefX;
    y += coefY;
    w -= (coefX * 2);
    h -= (coefY * 2);

    getPosSizeCenter(pos, size, center, off, squareSize, position);
    QVector2D texA(x, y), texB(x + w, y), texC(x + w, y + h), texD(x, y + h);

    // Adding to buffers according to the kind of sprite
    m_vertices.clear();
    switch (m_kind) {
    case MapEditorSubSelectionKind::SpritesFix:
    case MapEditorSubSelectionKind::SpritesDouble:
    case MapEditorSubSelectionKind::SpritesQuadra:
    {
        QVector3D vecA = Sprite::modelQuad[0] * size + pos,
                  vecB = Sprite::modelQuad[1] * size + pos,
                  vecC = Sprite::modelQuad[2] * size + pos,
                  vecD = Sprite::modelQuad[3] * size + pos;

        rotateSprite(vecA, vecB, vecC, vecD, center, position.angle());
        addStaticSpriteToBuffer(verticesStatic, indexesStatic, countStatic,
                                vecA, vecB, vecC, vecD, texA, texB, texC, texD);
        m_vertices.append(vecA);
        m_vertices.append(vecC);

        // If double sprite, add one sprite more
        if (m_kind == MapEditorSubSelectionKind::SpritesDouble ||
            m_kind == MapEditorSubSelectionKind::SpritesQuadra) {
            QVector3D vecDoubleA(vecA), vecDoubleB(vecB),
                      vecDoubleC(vecC), vecDoubleD(vecD);

            rotateSprite(vecDoubleA, vecDoubleB, vecDoubleC, vecDoubleD, center,
                         90);
            addStaticSpriteToBuffer(verticesStatic, indexesStatic, countStatic,
                                    vecDoubleA, vecDoubleB, vecDoubleC,
                                    vecDoubleD, texA, texB, texC, texD);
            m_vertices.append(vecDoubleA);
            m_vertices.append(vecDoubleC);

            if (m_kind == MapEditorSubSelectionKind::SpritesQuadra) {
                QVector3D vecQuadra1A(vecA), vecQuadra1B(vecB),
                          vecQuadra1C(vecC), vecQuadra1D(vecD),
                          vecQuadra2A(vecA), vecQuadra2B(vecB),
                          vecQuadra2C(vecC), vecQuadra2D(vecD);

                rotateSprite(vecQuadra1A, vecQuadra1B, vecQuadra1C, vecQuadra1D,
                             center, 45);
                rotateSprite(vecQuadra2A, vecQuadra2B, vecQuadra2C, vecQuadra2D,
                             center, -45);
                addStaticSpriteToBuffer(verticesStatic, indexesStatic,
                                        countStatic, vecQuadra1A, vecQuadra1B,
                                        vecQuadra1C, vecQuadra1D, texA, texB,
                                        texC, texD);
                addStaticSpriteToBuffer(verticesStatic, indexesStatic,
                                        countStatic, vecQuadra2A, vecQuadra2B,
                                        vecQuadra2C, vecQuadra2D, texA, texB,
                                        texC, texD);
                m_vertices.append(vecQuadra1A);
                m_vertices.append(vecQuadra1C);
                m_vertices.append(vecQuadra2A);
                m_vertices.append(vecQuadra2C);
            }
        }

        break;
    }
    case MapEditorSubSelectionKind::SpritesFace:
    {
        QVector2D s(size.x(), size.y());

        // Vertices
        verticesFace.append(
              VertexBillboard(center, texA, s, Sprite::modelQuad[0] + off));
        verticesFace.append(
              VertexBillboard(center, texB, s, Sprite::modelQuad[1] + off));
        verticesFace.append(
              VertexBillboard(center, texC, s, Sprite::modelQuad[2] + off));
        verticesFace.append(
              VertexBillboard(center, texD, s, Sprite::modelQuad[3] + off));

        // indexes
        offset = countFace * Sprite::nbVerticesQuad;
        for (int i = 0; i < Sprite::nbIndexesQuad; i++)
            indexesFace.append(Sprite::indexesQuad[i] + offset);
        countFace++;
        break;
    }
    default:
        break;
    }
}

// -------------------------------------------------------

void SpriteDatas::rotateVertex(QVector3D& vec, QVector3D& center, int angle) {
    QMatrix4x4 m;
    QVector3D v(vec);

    v -= center;
    m.rotate(-angle, 0.0, 1.0, 0.0);
    v = v * m + center;

    vec.setX(v.x());
    vec.setY(v.y());
    vec.setZ(v.z());
}

// -------------------------------------------------------

void SpriteDatas::rotateSprite(QVector3D& vecA, QVector3D& vecB,
                               QVector3D& vecC, QVector3D& vecD,
                               QVector3D& center, int angle)
{
    rotateVertex(vecA, center, angle);
    rotateVertex(vecB, center, angle);
    rotateVertex(vecC, center, angle);
    rotateVertex(vecD, center, angle);
}

// -------------------------------------------------------

void SpriteDatas::addStaticSpriteToBuffer(QVector<Vertex>& verticesStatic,
                                          QVector<GLuint>& indexesStatic,
                                          int& count,
                                          QVector3D& vecA, QVector3D& vecB,
                                          QVector3D& vecC, QVector3D& vecD,
                                          QVector2D& texA, QVector2D& texB,
                                          QVector2D& texC, QVector2D& texD)
{
    // Vertices
    verticesStatic.append(Vertex(vecA, texA));
    verticesStatic.append(Vertex(vecB, texB));
    verticesStatic.append(Vertex(vecC, texC));
    verticesStatic.append(Vertex(vecD, texD));

    // indexes
    int offset = count * Sprite::nbVerticesQuad;
    for (int i = 0; i < Sprite::nbIndexesQuad; i++)
        indexesStatic.append(Sprite::indexesQuad[i] + offset);
    count++;
}

// -------------------------------------------------------

float SpriteDatas::intersection(int squareSize, QRay3D& ray, Position& position,
                                int cameraHAngle)
{
    float minDistance = 0, distance = 0;
    QBox3D box;

    if (m_kind == MapEditorSubSelectionKind::SpritesFace) {
        QVector3D pos, size, center, off;
        getPosSizeCenter(pos, size, center, off, squareSize, position);

        QVector3D vecA = Sprite::modelQuad[0] * size + pos,
                  vecB = Sprite::modelQuad[1] * size + pos,
                  vecC = Sprite::modelQuad[2] * size + pos,
                  vecD = Sprite::modelQuad[3] * size + pos;
        rotateSprite(vecA, vecB, vecC, vecD, center, -cameraHAngle - 90);
        box = QBox3D(vecA, vecC);
        minDistance = box.intersection(ray);
    }
    else {
        int i = 0;
        while (i < m_vertices.size()) {
            QVector3D vecA = m_vertices.at(i++),
                      vecC = m_vertices.at(i++);
            box = QBox3D(vecA, vecC);
            distance = box.intersection(ray);
            Wanok::getMinDistance(minDistance, distance);
        }
    }

    return minDistance;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SpriteDatas::read(const QJsonObject & json){
    MapElement::read(json);

    m_kind = static_cast<MapEditorSubSelectionKind>(json["k"].toInt());
    if (json.contains(jsonFront))
        m_front = json[jsonFront].toBool();

    // Texture
    QJsonArray tab = json["t"].toArray();
    m_textureRect->setLeft(tab[0].toInt());
    m_textureRect->setTop(tab[1].toInt());
    m_textureRect->setWidth(tab[2].toInt());
    m_textureRect->setHeight(tab[3].toInt());
}

// -------------------------------------------------------

void SpriteDatas::write(QJsonObject & json) const{
    MapElement::write(json);
    QJsonArray tab;

    json["k"] = (int) m_kind;

    // Texture
    tab.append(m_textureRect->left());
    tab.append(m_textureRect->top());
    tab.append(m_textureRect->width());
    tab.append(m_textureRect->height());
    json["t"] = tab;
}

// -------------------------------------------------------

void SpriteDatas::writeFull(QJsonObject &json, bool front) const {
    write(json);

    // Only if layer > 0
    if (front)
        json[jsonFront] = m_front;
}

// -------------------------------------------------------
//
//
//  ---------- SPRITEOBJECT
//
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SpriteObject::SpriteObject(SpriteDatas &datas, QOpenGLTexture* texture) :
    m_datas(datas),
    m_texture(texture),
    m_vertexBuffer(QOpenGLBuffer::VertexBuffer),
    m_indexBuffer(QOpenGLBuffer::IndexBuffer),
    m_programStatic(nullptr),
    m_programFace(nullptr)
{

}

SpriteObject::~SpriteObject()
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SpriteObject::initializeVertices(int squareSize, Position& position)
{
    m_verticesStatic.clear();
    m_verticesFace.clear();
    m_indexes.clear();
    int count = 0;
    m_datas.initializeVertices(squareSize,
                               m_texture->width(),
                               m_texture->height(),
                               m_verticesStatic, m_indexes, m_verticesFace,
                               m_indexes, position, count, count);
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void SpriteObject::initializeStaticGL(QOpenGLShaderProgram* programStatic){
    if (m_programStatic == nullptr){
        initializeOpenGLFunctions();
        m_programStatic = programStatic;
    }
}

// -------------------------------------------------------

void SpriteObject::initializeFaceGL(QOpenGLShaderProgram *programFace){
    if (m_programFace == nullptr){
        initializeOpenGLFunctions();
        m_programFace = programFace;
    }
}

// -------------------------------------------------------

void SpriteObject::updateStaticGL(){
    Map::updateGLStatic(m_vertexBuffer, m_indexBuffer, m_verticesStatic,
                        m_indexes, m_vao, m_programStatic);
}

// -------------------------------------------------------

void SpriteObject::updateFaceGL(){
    Map::updateGLFace(m_vertexBuffer, m_indexBuffer, m_verticesFace,
                      m_indexes, m_vao, m_programFace);
}

// -------------------------------------------------------

void SpriteObject::paintGL(){
    m_vao.bind();
    glDrawElements(GL_TRIANGLES, m_indexes.size(), GL_UNSIGNED_INT, 0);
    m_vao.release();
}

// -------------------------------------------------------
//
//
//  ---------- SPRITEWALLDATAS
//
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SpriteWallDatas::SpriteWallDatas() :
    SpriteWallDatas(1)
{

}

SpriteWallDatas::SpriteWallDatas(int wallID) :
    m_wallID(wallID),
    m_wallKind(SpriteWallKind::Middle)
{

}

int SpriteWallDatas::wallID() const {
    return m_wallID;
}

MapEditorSelectionKind SpriteWallDatas::getKind() const {
    return MapEditorSelectionKind::Sprites;
}

MapEditorSubSelectionKind SpriteWallDatas::getSubKind() const {
    return MapEditorSubSelectionKind::SpritesWall;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SpriteWallDatas::update(Position &position) {
    SpriteWallDatas *leftSprite, *rightSprite, *topLeftSprite, *botLeftSprite,
            *topRightSprite, *botRightSprite;
    SpriteWallKind kA, kB;

    // Getting all sprites
    leftSprite = getLeft(position);
    rightSprite = getRight(position);
    topLeftSprite = getTopLeft(position);
    topRightSprite = getTopRight(position);
    botLeftSprite = getBotLeft(position);
    botRightSprite = getBotRight(position);

    // Borders
    if (!isWallHere(leftSprite) && !isWallHere(rightSprite))
        kA = SpriteWallKind::LeftRight;
    else if (!isWallHere(leftSprite))
        kA = SpriteWallKind::Left;
    else if (!isWallHere(rightSprite))
        kA = SpriteWallKind::Right;
    else
        kA = SpriteWallKind::Middle;

    // Diagonals
    bool diagLeft = isWallHere(topLeftSprite) ||
            isWallHere(botLeftSprite);
    bool diagRight = isWallHere(topRightSprite) ||
            isWallHere(botRightSprite);
    if (diagLeft && diagRight)
        kB = SpriteWallKind::LeftRight;
    else if (diagLeft)
        kB = SpriteWallKind::Left;
    else if (diagRight)
        kB = SpriteWallKind::Right;
    else
        kB = SpriteWallKind::Middle;

    m_wallKind = addKind(kA, kB);
}

// -------------------------------------------------------

bool SpriteWallDatas::isWallHere(SpriteWallDatas* sprite) {
    return (sprite != nullptr);
}

// -------------------------------------------------------

SpriteWallKind SpriteWallDatas::addKind(SpriteWallKind kA, SpriteWallKind kB) {
    if (kA == SpriteWallKind::Middle)
        return kB;
    if (kB == SpriteWallKind::Middle)
        return kA;

    return kA == kB ? kA : SpriteWallKind::LeftRight;
}

// -------------------------------------------------------

SpriteWallDatas* SpriteWallDatas::getWall(Position& position) {
    Map* map = Wanok::get()->project()->currentMap();
    Portion portion = map->getLocalPortion(position);
    MapPortion* mapPortion = map->mapPortion(portion);

    return mapPortion != nullptr ? mapPortion->getWallAt(position) : nullptr;
}

// -------------------------------------------------------

SpriteWallDatas* SpriteWallDatas::getLeft(Position &position) {
    Position newPosition;
    position.getLeft(newPosition);

    return getWall(newPosition);
}

// -------------------------------------------------------

SpriteWallDatas* SpriteWallDatas::getRight(Position& position) {
    Position newPosition;
    position.getRight(newPosition);

    return getWall(newPosition);
}

// -------------------------------------------------------

SpriteWallDatas* SpriteWallDatas::getTopLeft(Position &position) {
    Position newPosition;
    position.getTopLeft(newPosition);

    return getWall(newPosition);
}

// -------------------------------------------------------

SpriteWallDatas* SpriteWallDatas::getTopRight(Position &position) {
    Position newPosition;
    position.getTopRight(newPosition);

    return getWall(newPosition);
}

// -------------------------------------------------------

SpriteWallDatas* SpriteWallDatas::getBotLeft(Position &position) {
    Position newPosition;
    position.getBotLeft(newPosition);

    return getWall(newPosition);
}

// -------------------------------------------------------

SpriteWallDatas* SpriteWallDatas::getBotRight(Position &position)
{
    Position newPosition;
    position.getBotRight(newPosition);

    return getWall(newPosition);
}

// -------------------------------------------------------

void SpriteWallDatas::initializeVertices(int squareSize, int width, int height,
                                         QVector<Vertex>& vertices,
                                         QVector<GLuint>& indexes,
                                         Position &position, int& count)
{
    QVector3D pos, size, center, off;
    MapElement::getPosSizeCenter(pos, size, center, off, squareSize, position,
                                 1, height / squareSize, false);

    float x, y, w, h;
    x = (float)((int) m_wallKind * squareSize) / width;
    y = (float)(0 * squareSize) / height;
    w = (float)(1 * squareSize) / width;
    h = 1.0;
    float coefX = 0.1 / width;
    float coefY = 0.1 / height;
    x += coefX;
    y += coefY;
    w -= (coefX * 2);
    h -= (coefY * 2);
    QVector2D texA(x, y), texB(x + w, y), texC(x + w, y + h), texD(x, y + h);

    m_vecA = Sprite::modelQuad[0] * size + center;
    m_vecC = Sprite::modelQuad[2] * size + center;
    QVector3D vecB = Sprite::modelQuad[1] * size + center,
              vecD = Sprite::modelQuad[3] * size + center;

    SpriteDatas::rotateSprite(m_vecA, vecB, m_vecC, vecD, center,
                              position.angle());
    SpriteDatas::addStaticSpriteToBuffer(vertices, indexes, count, m_vecA, vecB,
                                         m_vecC, vecD, texA, texB, texC, texD);
}

// -------------------------------------------------------

float SpriteWallDatas::intersection(QRay3D& ray)
{
    QBox3D box(m_vecA, m_vecC);
    return box.intersection(ray);
}

// -------------------------------------------------------

QString SpriteWallDatas::toString() const {
    return "SPRITE WALL";
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SpriteWallDatas::read(const QJsonObject & json){
    m_wallID = json["w"].toInt();
    m_wallKind = static_cast<SpriteWallKind>(json["k"].toInt());
}

// -------------------------------------------------------

void SpriteWallDatas::write(QJsonObject & json) const{
    json["w"] = m_wallID;
    json["k"] = (int) m_wallKind;
}
