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

#include "floors.h"
#include "wanok.h"

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

FloorDatas::FloorDatas(QRect* texture) :
    m_textureRect(texture)
{

}

FloorDatas::~FloorDatas()
{
    delete m_textureRect;
}

QRect *FloorDatas::textureRect() const { return m_textureRect; }

MapEditorSubSelectionKind FloorDatas::getSubKind() const{
    return MapEditorSubSelectionKind::Floors;
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
    QVector3D pos(position.x() * squareSize, 0.0f, position.z() * squareSize);
    QVector3D size(squareSize, 0.0, squareSize);

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
    vertices.append(Vertex(Floor::verticesQuad[0] * size + pos,
                    QVector2D(x, y)));
    vertices.append(Vertex(Floor::verticesQuad[1] * size + pos,
                    QVector2D(x + w, y)));
    vertices.append(Vertex(Floor::verticesQuad[2] * size + pos,
                    QVector2D(x + w, y + h)));
    vertices.append(Vertex(Floor::verticesQuad[3] * size + pos,
                    QVector2D(x, y + h)));

    // indexes
    int offset = count * Floor::nbVerticesQuad;
    for (int i = 0; i < Floor::nbIndexesQuad; i++)
        indexes.append(Floor::indexesQuad[i] + offset);

    count++;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void FloorDatas::read(const QJsonObject & json){
    QJsonArray tab = json["t"].toArray();

    m_textureRect->setLeft(tab[0].toInt());
    m_textureRect->setTop(tab[1].toInt());
    m_textureRect->setWidth(tab[2].toInt());
    m_textureRect->setHeight(tab[3].toInt());
}

// -------------------------------------------------------

void FloorDatas::write(QJsonObject &json) const{
    QJsonArray tab;

    tab.append(m_textureRect->left());
    tab.append(m_textureRect->top());
    tab.append(m_textureRect->width());
    tab.append(m_textureRect->height());
    json["t"] = tab;
}

// -------------------------------------------------------
//
//
//  ---------- FLOOR
//
//
// -------------------------------------------------------

QVector3D Floor::verticesQuad[4]{
                                  QVector3D(0.0f, 0.0f, 0.0f),
                                  QVector3D(1.0f, 0.0f, 0.0f),
                                  QVector3D(1.0f, 0.0f, 1.0f),
                                  QVector3D(0.0f, 0.0f, 1.0f)
                                };

GLuint Floor::indexesQuad[6]{0, 1, 2, 0, 2, 3};

int Floor::nbVerticesQuad(4);

int Floor::nbIndexesQuad(6);

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Floor::Floor()
{

}

Floor::~Floor()
{

}

// -------------------------------------------------------
//
//
//  ---------- FLOORS
//
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Floors::Floors() :
    m_vertexBuffer(QOpenGLBuffer::VertexBuffer),
    m_indexBuffer(QOpenGLBuffer::IndexBuffer),
    m_programStatic(nullptr)
{

}

Floors::~Floors()
{
    QHash<Position, FloorDatas*>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++)
        delete i.value();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool Floors::isEmpty() const{
    return m_all.size() == 0;
}

// -------------------------------------------------------

FloorDatas *Floors::getFloor(Position& p){
    return m_all.value(p);
}

// -------------------------------------------------------

void Floors::setFloor(Position& p, FloorDatas *floor){
    m_all.insert(p, floor);
}

// -------------------------------------------------------

FloorDatas *Floors::removeFloor(Position& p){
    FloorDatas* floor = m_all.value(p);

    if (floor != nullptr)
        m_all.remove(p);

    return floor;
}

// -------------------------------------------------------

bool Floors::addFloor(Position& p, FloorDatas *floor){
    FloorDatas* previousFloor = removeFloor(p);

    if (previousFloor != nullptr)
        delete previousFloor;

    setFloor(p, floor);

    return true;
}

// -------------------------------------------------------

bool Floors::deleteFloor(Position& p){
    FloorDatas* previousFloor = removeFloor(p);

    if (previousFloor != nullptr)
        delete previousFloor;

    return true;
}

// -------------------------------------------------------

void Floors::removeFloorOut(MapProperties& properties) {
    QList<Position> list;
    QHash<Position, FloorDatas*>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++) {
        Position position = i.key();

        if (position.x() >= properties.length() ||
            position.z() >= properties.width())
        {
            delete *i;
            list.push_back(position);
        }
    }

    for (int j = 0; j < list.size(); j++)
        m_all.remove(list.at(j));
}

// -------------------------------------------------------

void Floors::updateRaycasting(int squareSize, float& finalDistance,
                              Position &finalPosition, QRay3D &ray)
{
    for (QHash<Position, FloorDatas*>::iterator i = m_all.begin();
         i != m_all.end(); i++)
    {
        Position position = i.key();
        updateRaycastingAt(position, i.value(), squareSize, finalDistance,
                           finalPosition, ray);
    }
}

// -------------------------------------------------------

void Floors::updateRaycastingAt(Position &position, FloorDatas* floor,
                                int squareSize, float &finalDistance,
                                Position &finalPosition, QRay3D& ray)
{
    /*
    float newDistance = floor->intersection(squareSize, ray, position);
    if (Wanok::getMinDistance(finalDistance, newDistance))
        finalPosition = position;
        */
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void Floors::initializeVertices(QHash<Position, MapElement *> &previewSquares,
                                int squareSize, int width, int height)
{
    m_vertices.clear();
    m_indexes.clear();
    int count = 0;

    // Create temp hash for preview
    QHash<Position, FloorDatas*> floorsWithPreview(m_all);
    QHash<Position, MapElement*>::iterator it;
    for (it = previewSquares.begin(); it != previewSquares.end(); it++) {
        MapElement* element = it.value();
        if (element->getSubKind() == MapEditorSubSelectionKind::Floors)
            floorsWithPreview[it.key()] = (FloorDatas*) element;
    }

    // Initialize vertices
    QHash<Position, FloorDatas*>::iterator i;
    for (i = floorsWithPreview.begin(); i != floorsWithPreview.end(); i++) {
        FloorDatas* floor = i.value();
        Position p = i.key();
        floor->initializeVertices(squareSize, width, height, m_vertices,
                                  m_indexes, p, count);
    }
}

// -------------------------------------------------------

void Floors::initializeGL(QOpenGLShaderProgram *programStatic){
    if (m_programStatic == nullptr){
        initializeOpenGLFunctions();

        m_programStatic = programStatic;
    }
}

// -------------------------------------------------------

void Floors::updateGL(){
    Map::updateGLStatic(m_vertexBuffer, m_indexBuffer, m_vertices, m_indexes,
                        m_vao, m_programStatic);
}

// -------------------------------------------------------

void Floors::paintGL(){
    m_vao.bind();
    glDrawElements(GL_TRIANGLES, m_indexes.size(), GL_UNSIGNED_INT, 0);
    m_vao.bind();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void Floors::read(const QJsonObject & json){
    QJsonArray tabFloors = json["floors"].toArray();

    for (int i = 0; i < tabFloors.size(); i++){
        QJsonObject obj = tabFloors.at(i).toObject();
        Position p;
        p.read(obj["k"].toArray());
        QJsonObject objLand = obj["v"].toObject();
        FloorDatas* floor = new FloorDatas;
        floor->read(objLand);
        m_all[p] = floor;
    }
}

// -------------------------------------------------------

void Floors::write(QJsonObject & json) const{
    QJsonArray tabFloors;

    QHash<Position, FloorDatas*>::const_iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++){
        QJsonObject objHash;
        QJsonArray tabKey;
        i.key().write(tabKey);
        FloorDatas* floor = i.value();
        QJsonObject objFloor;
        floor->write(objFloor);
        objHash["k"] = tabKey;
        objHash["v"] = objFloor;
        tabFloors.append(objHash);
    }
    json["floors"] = tabFloors;
}
