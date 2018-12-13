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

#ifndef CURSOR_H
#define CURSOR_H

#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
#include <QOpenGLFunctions>
#include <QOpenGLTexture>
#include "position3d.h"
#include "vertex.h"

// -------------------------------------------------------
//
//  CLASS Cursor
//
//  The cursor of the map editor.
//
// -------------------------------------------------------

class Cursor : protected QOpenGLFunctions
{
public:
    Cursor(QVector3D *position);
    ~Cursor();
    int getSquareX() const;
    int getSquareY() const;
    int getSquareZ() const;
    void setX(int x, bool withReal = true);
    void setY(int y);
    void setYplus(int yPlus);
    void setZ(int z, bool withReal = true);
    void setPositions(Position3D& position);
    float getX() const;
    float getY() const;
    float getZ() const;
    void setFrameDuration(int i);
    void setFrameNumber(int i);
    QVector3D* position() const;
    Portion getPortion() const;
    void loadTexture(QString path);
    void updatePositionSquare();
    void centerInSquare(int offset);
    void initializeGL();
    void initializeVertices();
    void initializeSquareSize(int s);
    void initialize();
    void paintGL(QMatrix4x4& modelviewProjection);
    void onKeyPressed(int key, double angle, int w, int h, double speed);

protected:
    QVector3D* m_positionSquare;
    QVector3D m_positionReal;
    int m_squareSize;

    // OpenGL informations
    QOpenGLBuffer m_vertexBuffer;
    QOpenGLBuffer m_indexBuffer;
    QOpenGLVertexArrayObject m_vao;
    QOpenGLShaderProgram* m_program;
    QVector<Vertex> m_vertices;
    QVector<GLuint> m_indexes;
    QOpenGLTexture* m_texture;
    int u_modelviewProjection;
    int u_cursorPosition;
    int u_frameTex;

    int m_frameDuration;
    int m_frameNumber;
};

#endif // CURSOR_H
