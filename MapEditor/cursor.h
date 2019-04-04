/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
