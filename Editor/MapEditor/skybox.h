/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SKYBOX_H
#define SKYBOX_H

#include <QOpenGLTexture>
#include <QOpenGLFunctions>
#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
#include "mapproperties.h"

// -------------------------------------------------------
//
//  CLASS Skybox
//
//  A class used to display map skybox.
//
// -------------------------------------------------------

class Skybox : protected QOpenGLFunctions
{
public:
    static QString SHADER_NAME;
    static QString ATTR_MODEL_VIEW_PROJECTION;
    static QString ATTR_POS;

    Skybox();
    virtual ~Skybox();

    void loadSkyBoxTexture(MapProperties *properties);
    QImage createSkyBoxImage(int id);
    void initializeGL();
    void paintGL(QMatrix4x4 &modelviewProjection, float x, float y, float z);

protected:
    QOpenGLShaderProgram *m_programSkyBox;
    QOpenGLTexture *m_textureSkyBox;
    QOpenGLBuffer m_vertexBufSkyBox;
    QOpenGLBuffer m_indexBufferSkyBox;
    QOpenGLVertexArrayObject m_vaoSkyBox;
    int u_modelViewProjection;
    int u_pos;
};

#endif // SKYBOX_H
