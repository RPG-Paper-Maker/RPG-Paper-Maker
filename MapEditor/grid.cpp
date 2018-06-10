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

void Grid::initializeVertices(int w, int h, int squareSize){
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

void Grid::paintGL(QMatrix4x4& modelviewProjection){
    glDisable(GL_DEPTH_TEST);
    m_program->bind();
    m_program->setUniformValue(u_modelviewProjection, modelviewProjection);
    {
      m_vao.bind();
      glDrawArrays(GL_LINES, 0, m_vertices.size());
      m_vao.release();
    }
    m_program->release();
    glEnable(GL_DEPTH_TEST);
}
