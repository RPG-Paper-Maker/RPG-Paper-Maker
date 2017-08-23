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
#include "lands.h"
#include "position.h"
#include "height.h"
#include "vertex.h"
#include "mapproperties.h"

// -------------------------------------------------------
//
//  CLASS FloorDatas
//
//  A square floor datas.
//
// -------------------------------------------------------

class FloorDatas : public LandDatas
{
public:
    FloorDatas();
    FloorDatas(QRect *texture);
    virtual ~FloorDatas();
    QRect* textureRect() const;
    virtual MapEditorSubSelectionKind getKind() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject & json) const;

protected:
    QRect* m_textureRect;
};

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

    void clearGL();
    void initializeVertices(int squareSize, int width, int height,
                            Position3D& p, FloorDatas* floor);
    void initializeGL(QOpenGLShaderProgram* programStatic);
    void updateGL();
    void paintGL();

protected:
    int m_count;

    // OpenGL informations
    QOpenGLBuffer m_vertexBuffer;
    QOpenGLBuffer m_indexBuffer;
    QVector<Vertex> m_vertices;
    QVector<GLuint> m_indexes;
    QOpenGLVertexArrayObject m_vao;
    QOpenGLShaderProgram* m_programStatic;
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
    LandDatas* getLand(Position& p);
    void setLand(Position& p, LandDatas* floor);
    LandDatas* removeLand(Position& p);
    bool addLand(Position& p, LandDatas* land);
    bool deleteLand(Position& p);

    void removeLandOut(MapProperties& properties);

    void initializeVertices(int squareSize, int width, int height);
    void initializeGL(QOpenGLShaderProgram* programStatic);
    void updateGL();
    void paintGL();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QHash<Position, LandDatas*> m_lands;
    Floor* m_floorsGL[2];

    QOpenGLShaderProgram* m_programStatic;
};

#endif // FLOORS_H
