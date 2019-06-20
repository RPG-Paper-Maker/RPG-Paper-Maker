/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include <QOpenGLWidget>
#include <QOpenGLFunctions>
#include "objects3d.h"
#include "camera.h"

#ifndef WIDGETPREVIEWOBJECT3D_H
#define WIDGETPREVIEWOBJECT3D_H

// -------------------------------------------------------
//
//  CLASS WidgetPreviewObject3D
//
//  A widget drawing an Object3D with corresponding texture.
//
// -------------------------------------------------------

class WidgetPreviewObject3D : public QOpenGLWidget, protected QOpenGLFunctions
{
    Q_OBJECT
public:
    explicit WidgetPreviewObject3D(QWidget *parent = nullptr);
    ~WidgetPreviewObject3D();

    void clearObject();
    void loadObject(SystemObject3D *object);
    void updateObject();

protected:
    Object3DDatas *m_object;
    Objects3DGL *m_objectsGL;
    Camera *m_camera;
    bool m_isInitialized;

    // OpenGL
    QOpenGLShaderProgram *m_program;
    int u_modelviewProjection;
    QOpenGLTexture *m_texture;

    virtual void resizeGL(int width, int height);
    virtual void initializeGL();
    virtual void paintGL();

public slots:
    void update();
};

#endif // WIDGETPREVIEWOBJECT3D_H
