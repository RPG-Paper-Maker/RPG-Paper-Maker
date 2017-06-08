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
#include <QRect>
#include <QVector>
#include <QOpenGLFunctions>
#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
#include "serializable.h"
#include "position.h"
#include "height.h"
#include "vertex.h"

// -------------------------------------------------------
//
//  CLASS Floor
//
//  A square floor.
//
// -------------------------------------------------------

class Floor : protected QOpenGLFunctions
{
public:
    Floor();
    virtual ~Floor();
    static QVector3D verticesQuad[];
    static GLuint indexesQuad[];
    static int nbVerticesQuad;
    static int nbIndexesQuad;
};

// -------------------------------------------------------
//
//  CLASS FloorDatas
//
//  A square floor datas.
//
// -------------------------------------------------------

class FloorDatas : public Serializable
{
public:
    FloorDatas();
    FloorDatas(int layer);
    virtual ~FloorDatas();
    int layer() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject & json) const;

protected:
    int m_layer;
};

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
    void setFloor(Position& p, FloorDatas* floor);
    FloorDatas* removeFloor(Position& p);
    bool addFloor(Position& p);
    void updateFloorSquareAdding(Position& p);
    bool deleteFloor(Position& p);
    void updateFloorSquareDeleting(Position& p);
    bool updateFloorSquareDeletingCheck(bool isVertical, int i, int& v,
                                        QRect* rect, Height& height, int size);

    void initializeVertices(int squareSize);
    void initializeGL(QOpenGLShaderProgram* programStatic);
    void updateGL();
    void paintGL();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QHash<Position3D, QVector<FloorDatas*>*> m_all;
    QHash<Height, QRect*> m_squares;

    // OpenGL informations
    QOpenGLBuffer m_vertexBufferStatic;
    QOpenGLBuffer m_indexBufferStatic;
    QVector<Vertex> m_verticesStatic;
    QVector<GLuint> m_indexesStatic;
    QOpenGLVertexArrayObject m_vaoStatic;
    QOpenGLShaderProgram* m_programStatic;
};

#endif // FLOORS_H
