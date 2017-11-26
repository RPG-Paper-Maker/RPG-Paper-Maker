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
    bool addFloor(Position& p, FloorDatas* floor);
    bool deleteFloor(Position& p);

    void removeFloorOut(MapProperties& properties);
    MapElement *updateRaycasting(int squareSize, float& finalDistance,
                                 Position &finalPosition, QRay3D &ray);
    bool updateRaycastingAt(Position &position, FloorDatas *floor,
                            int squareSize, float &finalDistance,
                            Position &finalPosition, QRay3D& ray);
    int getLastLayerAt(Position& position) const;
    void updateRemoveLayer(Position& position);

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
