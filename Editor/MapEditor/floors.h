/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
                            int squareSize, int width, int height);
    void initializeGL(QOpenGLShaderProgram* programStatic);
    void updateGL();
    void paintGL();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QHash<Position, FloorDatas*> m_all;

    // OpenGL informations
    QOpenGLBuffer m_vertexBuffer;
    QOpenGLBuffer m_indexBuffer;
    QVector<Vertex> m_vertices;
    QVector<GLuint> m_indexes;
    QOpenGLVertexArrayObject m_vao;
    QOpenGLShaderProgram* m_programStatic;
};

#endif // FLOORS_H
