/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "waypreview.h"
#include "lands.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WayPreview::WayPreview() :
    m_vertexBuffer(QOpenGLBuffer::VertexBuffer),
    m_indexBuffer(QOpenGLBuffer::IndexBuffer),
    m_program(nullptr)
{
    this->loadTexture();

}

WayPreview::~WayPreview()
{
    delete m_texture;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WayPreview::loadTexture() {
    m_texture = new QOpenGLTexture(QImage(":/textures/Ressources/arrow-preview.png"));
    m_texture->setMinificationFilter(QOpenGLTexture::Filter::Nearest);
    m_texture->setMagnificationFilter(QOpenGLTexture::Filter::Nearest);
}

// -------------------------------------------------------

void WayPreview::initializeVertices(Position3D &p){
    QVector3D pos(p.x() * RPM::getSquareSize(), (p.y() * RPM::getSquareSize()) +
        (RPM::getSquareSize() / 2), p.z() * RPM::getSquareSize());
    this->clear();

    // Vertices
    m_vertices.append(Vertex(Lands::verticesQuad[0] * RPM::getSquareSize() + pos,
                      QVector2D(0.0f, 0.0f)));
    m_vertices.append(Vertex(Lands::verticesQuad[1] * RPM::getSquareSize() + pos,
                      QVector2D(1.0f, 0.0f)));
    m_vertices.append(Vertex(Lands::verticesQuad[2] * RPM::getSquareSize() + pos,
                      QVector2D(1.0f, 1.0f)));
    m_vertices.append(Vertex(Lands::verticesQuad[3] * RPM::getSquareSize() + pos,
                      QVector2D(0.0f, 1.0f)));

    // indexes
    for (int i = 0; i < Lands::nbIndexesQuad; i++)
        m_indexes.append(Lands::indexesQuad[i]);
}

// -------------------------------------------------------

void WayPreview::clear() {
    m_vertices.clear();
    m_indexes.clear();
}

// -------------------------------------------------------

void WayPreview::initializeGL(QOpenGLShaderProgram *programStatic){
    if (m_program == nullptr){
        initializeOpenGLFunctions();

        m_program = programStatic;
    }
}

// -------------------------------------------------------

void WayPreview::updateGL() {
    Map::updateGLStatic(m_vertexBuffer, m_indexBuffer, m_vertices, m_indexes,
        m_vao, m_program);
}

// -------------------------------------------------------

void WayPreview::paintGL(QMatrix4x4& modelviewProjection) {
    m_program->bind();
    m_texture->bind();
    m_program->setUniformValue(u_modelviewProjection, modelviewProjection);
    {
      m_vao.bind();
      glDrawElements(GL_TRIANGLES, m_indexes.size(), GL_UNSIGNED_INT, 0);
      m_vao.release();
    }
    m_texture->release();
    m_program->release();
}
