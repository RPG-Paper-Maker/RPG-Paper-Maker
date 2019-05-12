/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
