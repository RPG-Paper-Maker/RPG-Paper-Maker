/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    int getYPlus() const;
    double getPercentYPlus() const;
    int getSquareZ() const;
    void setX(int x, bool withReal = true);
    void setY(Position3D pos, bool withReal = true);
    void setZ(int z, bool withReal = true);
    void setPositions(Position3D& position);
    float getX() const;
    float getY() const;
    float getZ() const;
    void setFrameDuration(int i);
    void setFrameNumber(int i);
    QVector3D* position() const;
    void getPosition3D(Position3D& position) const;
    Portion getPortion() const;
    void loadTexture(QString path);
    void updatePositionSquare();
    void centerInSquare(int offset);
    void initializeGL();
    void initializeVertices();
    void initializeSquareSize(int s);
    void initialize();
    void addHeight(int h, int hp);
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
