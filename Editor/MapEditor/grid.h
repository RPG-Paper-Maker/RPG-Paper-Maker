/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    void paintGL(QMatrix4x4 &modelviewProjection, int y);

private:
    // OpenGL informations
    QOpenGLBuffer m_vertexBuffer;
    QOpenGLVertexArrayObject m_vao;
    QOpenGLShaderProgram *m_program;
    QVector<QVector3D> m_vertices;

    int u_modelviewProjection;
    int u_yPosition;
};

#endif // GRID_H
