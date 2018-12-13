/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#ifndef WALLINDICATOR_H
#define WALLINDICATOR_H

#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
#include <QOpenGLFunctions>
#include "position.h"

// -------------------------------------------------------
//
//  CLASS WallIndicator
//
//  The wall indicator of the map editor.
//
// -------------------------------------------------------

class WallIndicator : protected QOpenGLFunctions
{
public:
    WallIndicator();
    ~WallIndicator();
    void initializeSquareSize(int s);
    void getPosition(Position3D& position);
    void setPosition(Position3D& pos, int w, int h);
    void get3DPosition(QVector3D& vector);

    void initializeVertices();
    void initializeGL();
    void paintGL(QMatrix4x4 &modelviewProjection);

private:
    Position3D m_position;
    int m_squareSize;

    // OpenGL informations
    QOpenGLBuffer m_vertexBuffer;
    QOpenGLVertexArrayObject m_vao;
    QOpenGLShaderProgram *m_program;
    QVector<QVector3D> m_vertices;
    int u_modelviewProjection;
    int u_gridPosition;
};

#endif // WALLINDICATOR_H
