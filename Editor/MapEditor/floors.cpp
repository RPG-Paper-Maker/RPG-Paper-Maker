/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "floors.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Floors::Floors() :
    m_isEmpty(true),
    m_isHovered(false),
    m_vertexBuffer(QOpenGLBuffer::VertexBuffer),
    m_indexBuffer(QOpenGLBuffer::IndexBuffer),
    m_program(nullptr),
    m_vertexBufferHovered(QOpenGLBuffer::VertexBuffer),
    m_indexBufferHovered(QOpenGLBuffer::IndexBuffer)
{

}

Floors::~Floors()
{
    QHash<Position, FloorDatas*>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++)
        delete i.value();
}

bool Floors::isEmpty() const{
    return m_isEmpty;
}

void Floors::updateEmpty(bool previewSquare) {
    m_isEmpty = m_all.isEmpty() && previewSquare;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

FloorDatas *Floors::getFloor(Position& p) const{
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

void Floors::removeFloorOut(MapProperties& properties) {
    QList<Position> list;
    QHash<Position, FloorDatas*>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++) {
        Position position = i.key();

        if (position.isOutMapPorperties(properties)) {
            delete *i;
            list.push_back(position);
        }
    }

    for (int j = 0; j < list.size(); j++)
        m_all.remove(list.at(j));
}

// -------------------------------------------------------

MapElement* Floors::updateRaycasting(int squareSize, float& finalDistance,
    Position &finalPosition, QRay3D &ray, Position &previousCoords)
{
    MapElement* element = nullptr;

    for (QHash<Position, FloorDatas*>::iterator i = m_all.begin();
         i != m_all.end(); i++)
    {
        Position position = i.key();
        FloorDatas* floor = i.value();
        if (updateRaycastingAt(position, floor, squareSize, finalDistance,
            finalPosition, ray, previousCoords))
        {
            element = floor;
        }
    }

    return element;
}

// -------------------------------------------------------

bool Floors::updateRaycastingAt(Position &position, FloorDatas* floor, int
    squareSize, float &finalDistance, Position &finalPosition, QRay3D& ray,
    Position &previousCoords)
{
    // Check if floor is in current drawing height
    if (previousCoords.x() == -500 || (previousCoords.y() == position.y() &&
        qFuzzyCompare(previousCoords.yPlus(), position.yPlus())))
    {
        float newDistance = floor->intersection(squareSize, ray, position);
        if (Common::getMinDistance(finalDistance, newDistance)) {
            finalPosition = position;
            return true;
        }
    }

    return false;
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void Floors::initializeVertices(QHash<Position, MapElement *> &previewSquares,
    int squareSize, int width, int height, MapElement *excludeElement)
{
    QList<Position> layers;
    Position p;
    int j, ll, layer;

    m_vertices.clear();
    m_indexes.clear();
    m_verticesHovered.clear();
    m_indexesHovered.clear();
    int count = 0;

    // Create temp hash for preview
    QHash<Position, FloorDatas*> floorsWithPreview(m_all);
    QHash<Position, MapElement*>::iterator it;
    for (it = previewSquares.begin(); it != previewSquares.end(); it++) {
        MapElement* element = it.value();
        if (element->getSubKind() == MapEditorSubSelectionKind::Floors)
            floorsWithPreview[it.key()] = (FloorDatas*) element;
        else if (element->getSubKind() == MapEditorSubSelectionKind::Autotiles)
            floorsWithPreview.remove(it.key());
    }

    // Initialize vertices
    QHash<Position, FloorDatas*>::iterator i;
    FloorDatas *floor;
    for (i = floorsWithPreview.begin(); i != floorsWithPreview.end(); i++) {
        floor = i.value();
        p = i.key();
        layer = p.layer();
        if (layer > 0) {
            for (j = 0, ll = layers.size(); j < ll; j++) {
                if (layer <= layers.at(j).layer()) {
                    layers.insert(j, p);
                    break;
                }
            }
            if (j == ll) {
                layers.append(p);
            }
        } else {
            if (excludeElement == floor) {
                int c = 0;
                m_isHovered = true;
                floor->initializeVertices(squareSize, width, height,
                    m_verticesHovered, m_indexesHovered, p, c);
            } else {
                floor->initializeVertices(squareSize, width, height, m_vertices,
                    m_indexes, p, count);
            }
        }
    }

    // Vertices for layers
    for (j = 0, ll = layers.size(); j < ll; j++) {
        p = layers.at(j);
        floor = floorsWithPreview.value(p);
        if (excludeElement == floor) {
            int c = 0;
            floor->initializeVertices(squareSize, width, height,
                m_verticesHovered, m_indexesHovered, p, c);
        } else
        {
            floor->initializeVertices(squareSize, width, height, m_vertices,
                m_indexes, p, count);
        }
    }
}

// -------------------------------------------------------

void Floors::initializeGL(QOpenGLShaderProgram *programStatic){
    if (m_program == nullptr){
        initializeOpenGLFunctions();

        m_program = programStatic;
    }
}

// -------------------------------------------------------

void Floors::updateGL()
{
    Map::updateGLStatic(m_vertexBuffer, m_indexBuffer, m_vertices, m_indexes,
        m_vao, m_program);
    Map::updateGLStatic(m_vertexBufferHovered, m_indexBufferHovered,
        m_verticesHovered, m_indexesHovered, m_vaoHovered, m_program);
}

// -------------------------------------------------------

void Floors::paintGL(int uniformHovered)
{
    m_vao.bind();
    glDrawElements(GL_TRIANGLES, m_indexes.size(), GL_UNSIGNED_INT, 0);
    m_vao.release();

    if (m_isHovered) {
        m_program->setUniformValue(uniformHovered, true);
        m_vaoHovered.bind();
        glDrawElements(GL_TRIANGLES, m_indexesHovered.size(), GL_UNSIGNED_INT,
            nullptr);
        m_vaoHovered.release();
        m_program->setUniformValue(uniformHovered, false);
    }
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
        Position position = i.key();
        position.write(tabKey);
        FloorDatas* floor = i.value();
        QJsonObject objFloor;
        floor->write(objFloor);
        objHash["k"] = tabKey;
        objHash["v"] = objFloor;
        tabFloors.append(objHash);
    }
    json["floors"] = tabFloors;
}
