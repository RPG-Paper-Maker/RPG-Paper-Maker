/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "grid.h"
#include "map.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Grid::Grid() :
    m_vertexBuffer(QOpenGLBuffer::VertexBuffer)
{
    initializeOpenGLFunctions();
}

Grid::~Grid()
{
    delete m_program;
    m_program = nullptr;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Grid::initializeVertices(int w, int h, int squareSize) {
    m_vertices.clear();

    float w_f = (float)w, h_f = (float)h, squareSize_f = (float)squareSize;

    for (int i = 0; i <= w; i++){
        m_vertices.push_back(QVector3D((i * squareSize_f), 0.0f, 0.0f));
        m_vertices.push_back(QVector3D((i * squareSize_f), 0.0f,
                                       squareSize_f * h_f));
    }
    for (int i = 0; i <= h; i++){
        m_vertices.push_back(QVector3D(0.0f, 0.0f,(i*squareSize_f)));
        m_vertices.push_back(QVector3D(squareSize_f * w_f, 0.0f,
                                       (i * squareSize_f)));
    }
}

// -------------------------------------------------------

void Grid::initializeGL(){

    // Create Shader
    m_program = Map::createProgram("grid");

    // Uniform location of camera
    u_modelviewProjection = m_program->uniformLocation("modelviewProjection");
    u_yPosition = m_program->uniformLocation("yPosition");

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
    m_program->setAttributeBuffer(0, GL_FLOAT, 0,3,0);

    // Release
    m_vao.release();
    m_vertexBuffer.release();
    m_program->release();
}

// -------------------------------------------------------

void Grid::paintGL(QMatrix4x4& modelviewProjection, int y) {
    m_program->bind();
    m_program->setUniformValue(u_modelviewProjection, modelviewProjection);
    m_program->setUniformValue(u_yPosition, y + 0.5f);
    {
      m_vao.bind();
      glDrawArrays(GL_LINES, 0, m_vertices.size());
      m_vao.release();
    }
    m_program->release();
}
