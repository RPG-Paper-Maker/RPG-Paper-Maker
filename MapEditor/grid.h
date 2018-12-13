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

#ifndef GRID_H
#define GRID_H

#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
#include <QOpenGLFunctions>
#include <QVector>
#include <QVector4D>
#include <QVector3D>
#include <QVector>
#include <QPair>

// -------------------------------------------------------
//
//  CLASS Grid
//
//  The grid of the map editor.
//
// -------------------------------------------------------

class Grid : protected QOpenGLFunctions
{
public:
    Grid();
    ~Grid();
    void initializeVertices(int w, int h, int squareSize);
    void initializeGL();
    void paintGL(QMatrix4x4 &modelviewProjection);

private:
    // OpenGL informations
    QOpenGLBuffer m_vertexBuffer;
    QOpenGLVertexArrayObject m_vao;
    QOpenGLShaderProgram *m_program;
    QVector<QVector3D> m_vertices;
    int u_modelviewProjection;
};

#endif // GRID_H
