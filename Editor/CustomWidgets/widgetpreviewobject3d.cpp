/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgetpreviewobject3d.h"
#include "map.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetPreviewObject3D::WidgetPreviewObject3D(QWidget *parent) :
    QOpenGLWidget(parent),
    m_object(nullptr),
    m_objectsGL(nullptr),
    m_object3D(nullptr),
    m_camera(new Camera),
    m_isInitialized(false),
    m_program(nullptr),
    m_texture(nullptr)
{

}

WidgetPreviewObject3D::~WidgetPreviewObject3D() {
    this->clearObject();
    if (m_object != nullptr) {
        delete m_object;
    }
    delete m_camera;
    if (m_program != nullptr) {
        delete m_program;
    }
}

SystemObject3D * WidgetPreviewObject3D::object3D() const
{
    return m_object3D;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetPreviewObject3D::clearObject() {
    this->makeCurrent();
    if (m_objectsGL != nullptr) {
        delete m_objectsGL;
        m_objectsGL = nullptr;
    }
    if (m_texture != nullptr) {
        delete m_texture;
        m_texture = nullptr;
    }
}

// -------------------------------------------------------

void WidgetPreviewObject3D::loadObject(SystemObject3D *object)
{
    if (m_object != nullptr) {
        delete m_object;
        m_object = nullptr;
    }
    m_object3D = object;
    m_object = Object3DDatas::instanciate(object);
}

// -------------------------------------------------------

void WidgetPreviewObject3D::loadShape(SystemCustomShape *shape) {
    if (m_object3D != nullptr) {
        delete m_object3D;
    }

    m_object3D = new SystemObject3D(-1, "", ShapeKind::Custom, shape->id());
    this->loadObject(m_object3D);
}

// -------------------------------------------------------

void WidgetPreviewObject3D::updateObject() {
    if (m_isInitialized) {
        Position position;
        QImage image;

        this->clearObject();

        // Load object
        m_objectsGL = new Objects3DGL;
        m_objectsGL->initializeVertices(position, m_object, nullptr);
        m_objectsGL->initializeGL(m_program);
        m_objectsGL->updateGL();

        // Texture
        Map::loadPicture(m_object->datas()->picture(), PictureKind::Object3D,
            image);
        m_texture = Map::createTexture(image);

        // Update camera position
        m_camera->setDistance(m_object->minDistanceFromCenter());
        m_camera->setHorizontalAngle(-145.0);
        m_camera->setVerticalAngle(70);
        QVector3D center;
        m_object->getCenter(center);
        m_camera->updateTarget(center);
    }
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void WidgetPreviewObject3D::initializeGL() {

    // Initialize OpenGL Backend
    initializeOpenGLFunctions();
    connect(this, SIGNAL(frameSwapped()), this, SLOT(update()));

    // Create STATIC Shader
    m_program = Map::createProgram("static");

    // Uniform location of camera
    u_modelviewProjection = m_program->uniformLocation("modelviewProjection");

    // Release
    m_program->release();

    // Load now the first object
    m_isInitialized = true;
    this->makeCurrent();
    if (m_object != nullptr) {
        this->updateObject();
    }
}

// -------------------------------------------------------

void WidgetPreviewObject3D::resizeGL(int width, int height) {
    m_camera->setProjection(width, height);
}

// -------------------------------------------------------

void WidgetPreviewObject3D::paintGL() {

    // Clear buffer
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glClearColor(RPM::COLOR_ALMOST_BLACK.red() / 255.0f, RPM::COLOR_ALMOST_BLACK
        .green() / 255.0f, RPM::COLOR_ALMOST_BLACK.blue() / 255.0f, 1.0f);

    // Config
    glEnable(GL_DEPTH_TEST);
    glEnable(GL_BLEND);
    glBlendEquation(GL_FUNC_ADD);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    // Model view / projection
    QMatrix4x4 viewMatrix = m_camera->view();
    QMatrix4x4 projectionMatrix = m_camera->projection();
    QMatrix4x4 modelviewProjection = projectionMatrix * viewMatrix;

    // Paint
    if (m_objectsGL != nullptr) {
        m_program->bind();
        m_program->setUniformValue(u_modelviewProjection, modelviewProjection);
        if (m_texture != nullptr) {
            m_texture->bind();
        }
        m_objectsGL->paintGL(0);
        if (m_texture != nullptr) {
            m_texture->release();
        }
        m_program->release();
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetPreviewObject3D::update() {
    QOpenGLWidget::update();
}
