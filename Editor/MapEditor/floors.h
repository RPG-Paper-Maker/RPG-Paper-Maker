/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef FLOORS_H
#define FLOORS_H

#include <QHash>
#include "mapproperties.h"
#include "floor.h"

// -------------------------------------------------------
//
//  CLASS Floors
//
//  A set of static floors in a portion of the map.
//
// -------------------------------------------------------

class Floors : public Serializable, protected QOpenGLFunctions
{
public:
    Floors();
    virtual ~Floors();
    bool isEmpty() const;
    void updateEmpty(bool previewSquare);
    FloorDatas* getFloor(Position& p) const;
    void setFloor(Position& p, FloorDatas* floor);
    FloorDatas* removeFloor(Position& p);
    bool addFloor(Position& p, FloorDatas* floor, QJsonObject &previousObj,
                  MapEditorSubSelectionKind& previousType);
    bool deleteFloor(Position& p, QJsonObject &previous,
                     MapEditorSubSelectionKind &previousType);

    void removeFloorOut(MapProperties& properties);
    MapElement *updateRaycasting(int squareSize, float& finalDistance, Position
        &finalPosition, QRay3D &ray, Position &previousCoords);
    bool updateRaycastingAt(Position &position, FloorDatas *floor, int
        squareSize, float &finalDistance, Position &finalPosition, QRay3D& ray,
        Position &previousCoords);

    void initializeVertices(QHash<Position, MapElement*>& previewSquares,
        int squareSize, int width, int height, MapElement *excludeElement);
    void initializeGL(QOpenGLShaderProgram* programStatic);
    void updateGL();
    void paintGL(int uniformHovered);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QHash<Position, FloorDatas*> m_all;
    bool m_isEmpty;
    bool m_isHovered;

    // OpenGL informations
    QOpenGLBuffer m_vertexBuffer;
    QOpenGLBuffer m_indexBuffer;
    QVector<Vertex> m_vertices;
    QVector<GLuint> m_indexes;
    QOpenGLVertexArrayObject m_vao;
    QOpenGLShaderProgram* m_program;
    QOpenGLBuffer m_vertexBufferHovered;
    QOpenGLBuffer m_indexBufferHovered;
    QVector<Vertex> m_verticesHovered;
    QVector<GLuint> m_indexesHovered;
    QOpenGLVertexArrayObject m_vaoHovered;
};

#endif // FLOORS_H
