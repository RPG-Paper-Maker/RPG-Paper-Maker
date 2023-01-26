/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QOpenGLFunctions>
#include <QOpenGLTexture>
#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
#include "vertexbillboard.h"

#ifndef BATTLER_H
#define BATTLER_H

class Battler : protected QOpenGLFunctions
{
public:
    Battler(QVector3D &position, int battlerID, bool reverse = false);
    virtual ~Battler();

    void initializeVertices();
    void initializeGL(QOpenGLShaderProgram* programStatic);
    void updateGL();
    void paintGL();

protected:
    QOpenGLTexture *m_texture;
    QVector3D m_position;
    bool m_reverse;

    // OpenGL
    QOpenGLBuffer m_vertexBuffer;
    QOpenGLBuffer m_indexBuffer;
    QVector<VertexBillboard> m_vertices;
    QVector<GLuint> m_indexes;
    QOpenGLVertexArrayObject m_vao;
    QOpenGLShaderProgram *m_program;
};

#endif // BATTLER_H
