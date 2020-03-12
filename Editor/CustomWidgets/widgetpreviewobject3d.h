/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    void loadShape(SystemCustomShape *shape);
    void updateObject();

protected:
    Object3DDatas *m_object;
    Objects3DGL *m_objectsGL;
    SystemObject3D *m_object3DShape;
    Camera *m_camera;
    bool m_isInitialized;
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
