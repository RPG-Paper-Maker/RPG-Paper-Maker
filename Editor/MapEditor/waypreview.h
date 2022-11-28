/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WAYPREVIEW_H
#define WAYPREVIEW_H

#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
#include <QOpenGLFunctions>
#include <QOpenGLTexture>
#include "position.h"
#include "vertex.h"

class WayPreview : protected QOpenGLFunctions
{
public:
    WayPreview();
    ~WayPreview();
    void loadTexture();
    void initializeGL(QOpenGLShaderProgram *programStatic);
    void updateGL();
    void initializeVertices();
    void paintGL(QMatrix4x4& modelviewProjection);

protected:
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
};

#endif // WAYPREVIEW_H
