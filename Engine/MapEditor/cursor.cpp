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

#include "cursor.h"
#include <QtMath>
#include "wanok.h"
#include "floors.h"
#include "keyboardenginekind.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Cursor::Cursor(QVector3D* position) :
    m_position(position),
    m_vertexBuffer(QOpenGLBuffer::VertexBuffer),
    m_indexBuffer(QOpenGLBuffer::IndexBuffer)
{

}

Cursor::~Cursor()
{
    delete m_program;
    m_program = nullptr;
}

void Cursor::initializeSquareSize(int s){
    m_squareSize = s;
}

int Cursor::getSquareX() const{
    return (int)((m_position->x() + 1) / m_squareSize);
}

int Cursor::getSquareY() const{
    return (int)((m_position->y() + 1) / m_squareSize);
}

int Cursor::getSquareZ() const{
    return (int)((m_position->z() + 1) / m_squareSize);
}

void Cursor::setX(int x){
    m_position->setX(x * m_squareSize);
}

void Cursor::setY(int){

}

void Cursor::setYplus(int){

}

void Cursor::setZ(int z){
    m_position->setZ(z * m_squareSize);
}

float Cursor::getX() const { return m_position->x(); }

float Cursor::getY() const { return m_position->y(); }

float Cursor::getZ() const { return m_position->z(); }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

Portion Cursor::getPortion() const{
    return Portion(getSquareX() / Wanok::portionSize,
                   getSquareY()/ Wanok::portionSize,
                   getSquareZ() / Wanok::portionSize);
}

// -------------------------------------------------------

void Cursor::onKeyPressed(int key, double angle, int w, int h){
    int x = getSquareX(), z = getSquareZ(), xPlus, zPlus;
    KeyBoardDatas* keyBoardDatas = Wanok::get()->engineSettings()
            ->keyBoardDatas();

    if (keyBoardDatas->isEqual(key, KeyBoardEngineKind::MoveCursorUp)){
        xPlus = (int)(m_squareSize * (qRound(qCos(angle * M_PI / 180.0))));
        zPlus = (int)(m_squareSize * (qRound(qSin(angle * M_PI / 180.0))));
        if ((z > 0 && zPlus < 0) || (z < h && zPlus > 0))
            m_position->setZ(m_position->z() + zPlus);
        if (zPlus == 0 && ((x > 0 && xPlus < 0) || (x < w - 1 && xPlus > 0)))
            m_position->setX(m_position->x() + xPlus);
    }
    else if (keyBoardDatas->isEqual(key, KeyBoardEngineKind::MoveCursorDown)){
        xPlus = (int)(m_squareSize * (qRound(qCos(angle * M_PI / 180.0))));
        zPlus = (int)(m_squareSize * (qRound(qSin(angle * M_PI / 180.0))));
        if ((z < h - 1 && zPlus < 0) || (z > 0 && zPlus > 0))
            m_position->setZ(m_position->z() - zPlus);
        if (zPlus == 0 && ((x < w - 1 && xPlus < 0) || (x > 0 && xPlus > 0)))
            m_position->setX(m_position->x() - xPlus);
    }
    else if (keyBoardDatas->isEqual(key, KeyBoardEngineKind::MoveCursorLeft)){
        xPlus = (int)(m_squareSize *
                      (qRound(qCos((angle - 90) * M_PI / 180.0))));
        zPlus = (int)(m_squareSize *
                      (qRound(qSin((angle - 90) * M_PI / 180.0))));
        if ((x > 0 && xPlus < 0) || (x < w - 1 && xPlus > 0))
            m_position->setX(m_position->x() + xPlus);
        if (xPlus == 0 && ((z > 0 && zPlus < 0) || (z < h - 1 && zPlus > 0)))
            m_position->setZ(m_position->z() + zPlus);
    }
    else if (keyBoardDatas->isEqual(key, KeyBoardEngineKind::MoveCursorRight)){
        xPlus = (int)(m_squareSize *
                      (qRound(qCos((angle - 90) * M_PI / 180.0))));
        zPlus = (int)(m_squareSize *
                      (qRound(qSin((angle - 90) * M_PI / 180.0))));
        if ((x < w - 1 && xPlus < 0) || (x > 0 && xPlus > 0))
            m_position->setX(m_position->x() - xPlus);
        if (xPlus == 0 && ((z < h - 1 && zPlus < 0) || (z > 0 && zPlus > 0)))
            m_position->setZ(m_position->z() - zPlus);
    }
}

// -------------------------------------------------------

void Cursor::initialize(){
    initializeVertices();
    initializeGL();
}

// -------------------------------------------------------

void Cursor::initializeVertices(){

    QVector3D pos(0.0f, 0.15f, 0.0f);

    // Vertices
    m_vertices.clear();
    m_vertices.append(Floor::verticesQuad[0] + pos);
    m_vertices.append(Floor::verticesQuad[1] * m_squareSize + pos);
    m_vertices.append(Floor::verticesQuad[2] * m_squareSize + pos);
    m_vertices.append(Floor::verticesQuad[3] * m_squareSize + pos);

    // indexes
    m_indexes.clear();
    for (int i = 0; i < Floor::nbIndexesQuad; i++)
        m_indexes.append(Floor::indexesQuad[i]);
}

// -------------------------------------------------------

void Cursor::initializeGL(){
    initializeOpenGLFunctions();

    // Create Shader
    m_program = new QOpenGLShaderProgram();
    m_program->addShaderFromSourceFile(QOpenGLShader::Vertex,
                                       ":/Shaders/cursor.vert");
    m_program->addShaderFromSourceFile(QOpenGLShader::Fragment,
                                       ":/Shaders/cursor.frag");
    m_program->link();
    m_program->bind();

    // Uniform location of camera
    u_modelviewProjection = m_program->uniformLocation("modelviewProjection");
    u_cursorPosition = m_program->uniformLocation("cursorPosition");

    // Create Buffer (Do not release until VAO is created)
    m_vertexBuffer.create();
    m_vertexBuffer.bind();
    m_vertexBuffer.setUsagePattern(QOpenGLBuffer::StaticDraw);
    m_vertexBuffer.allocate(m_vertices.constData(), Floor::nbVerticesQuad *
                            sizeof(QVector3D));

    m_indexBuffer.create();
    m_indexBuffer.bind();
    m_indexBuffer.setUsagePattern(QOpenGLBuffer::StaticDraw);
    m_indexBuffer.allocate(m_indexes.constData(), Floor::nbIndexesQuad *
                           sizeof(GLuint));

    // Create Vertex Array Object
    m_vao.create();
    m_vao.bind();
    m_program->enableAttributeArray(0);
    m_program->setAttributeBuffer(0, GL_FLOAT, 0,3,0);

    // Release
    m_vao.release();
    m_indexBuffer.release();
    m_vertexBuffer.release();
    m_program->release();
}

// -------------------------------------------------------

void Cursor::paintGL(QMatrix4x4 &modelviewProjection){
    m_program->bind();
    m_program->setUniformValue(u_modelviewProjection, modelviewProjection);
    m_program->setUniformValue(u_cursorPosition, *m_position);
    {
      m_vao.bind();
      m_indexBuffer.bind();
      glDrawElements(GL_TRIANGLES, Floor::nbIndexesQuad, GL_UNSIGNED_INT, NULL);
      m_indexBuffer.release();
      m_vao.release();
    }
    m_program->release();
}
