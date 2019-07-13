/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
