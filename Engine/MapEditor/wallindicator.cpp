/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "wallindicator.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WallIndicator::WallIndicator()
{

}

WallIndicator::~WallIndicator()
{
    delete m_program;
    m_program = nullptr;
}

void WallIndicator::initializeSquareSize(int s){
    m_squareSize = s;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WallIndicator::setGridPosition(Position& pos, int w, int h) {
    int x = pos.x(), z = pos.z();
    if (x < 0)
        x = 0;
    else if (x > w)
        x = w;
    if (z < 0)
        z = 0;
    else if (z > h)
        z = h;

    m_gridPosition.setX(x);
    m_gridPosition.setY(pos.y());
    m_gridPosition.setZ(z);
}

// -------------------------------------------------------

void WallIndicator::get3DPosition(QVector3D& vector) {
    vector.setX(m_gridPosition.x() * m_squareSize);
    vector.setY(m_gridPosition.y());
    vector.setZ(m_gridPosition.z() * m_squareSize);
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
    m_program = new QOpenGLShaderProgram();
    m_program->addShaderFromSourceFile(QOpenGLShader::Vertex,
                                       ":/Shaders/wallIndicator.vert");
    m_program->addShaderFromSourceFile(QOpenGLShader::Fragment,
                                       ":/Shaders/wallIndicator.frag");
    m_program->link();
    m_program->bind();

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
