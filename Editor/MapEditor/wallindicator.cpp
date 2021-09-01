/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "wallindicator.h"
#include "map.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WallIndicator::WallIndicator()
{
    initializeOpenGLFunctions();
}

WallIndicator::~WallIndicator()
{
    delete m_program;
    m_program = nullptr;
}

void WallIndicator::initializeSquareSize(int s){
    m_squareSize = s;
}

void WallIndicator::getPosition(Position3D& position) {
    position.setX(m_position.x());
    position.setY(m_position.y());
    position.setYPlus(m_position.yPlus());
    position.setZ(m_position.z());
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WallIndicator::setPosition(Position3D& pos, int w, int h) {
    m_position.setInGrid(pos, w, h);
}

// -------------------------------------------------------

void WallIndicator::get3DPosition(QVector3D& vector) {
    vector.setX(m_position.x() * m_squareSize);
    vector.setY(m_position.getY());
    vector.setZ(m_position.z() * m_squareSize);
}

// -------------------------------------------------------

void WallIndicator::initializeVertices() {
    m_vertices.clear();

    m_vertices.push_back(QVector3D(0.0f, 0.0f, 0.0f));
    m_vertices.push_back(QVector3D(0.0f, (3 * (float) m_squareSize), 0.0f));
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void WallIndicator::initializeGL() {

    // Create Shader
    m_program = Map::createProgram("wallIndicator");

    // Uniform location of camera
    u_modelviewProjection = m_program->uniformLocation("modelviewProjection");
    u_gridPosition = m_program->uniformLocation("gridPosition");

    // Create Buffer (Do not release until VAO is created)
    m_vertexBuffer.create();
    m_vertexBuffer.bind();
    m_vertexBuffer.setUsagePattern(QOpenGLBuffer::StaticDraw);
    m_vertexBuffer.allocate(m_vertices.constData(),
                            m_vertices.size() * sizeof(QVector3D));

    // Create Vertex Array Object
    m_vao.create();
    m_vao.bind();
    m_program->enableAttributeArray(0);
    m_program->setAttributeBuffer(0, GL_FLOAT, 0, 3, 0);

    // Release
    m_vao.release();
    m_vertexBuffer.release();
    m_program->release();
}

// -------------------------------------------------------

void WallIndicator::paintGL(QMatrix4x4& modelviewProjection) {
    QVector3D gridPosition;
    get3DPosition(gridPosition);

    m_program->bind();
    m_program->setUniformValue(u_modelviewProjection, modelviewProjection);
    m_program->setUniformValue(u_gridPosition, gridPosition);
    {
      m_vao.bind();
      glDrawArrays(GL_LINES, 0, m_vertices.size());
      m_vao.release();
    }
    m_program->release();
}
