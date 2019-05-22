/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
