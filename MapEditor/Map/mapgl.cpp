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

#include "map.h"
#include "wanok.h"

// -------------------------------------------------------

void Map::initializeGL(){
    initializeOpenGLFunctions();

    // Create STATIC Shader
    m_programStatic = Map::createProgram("static");

    // Uniform location of camera
    u_modelviewProjectionStatic = m_programStatic
            ->uniformLocation("modelviewProjection");

    // Release
    m_programStatic->release();


    // Create SPRITE FACE Shader
    m_programFaceSprite = Map::createProgram("spriteFace");
    m_programFaceSprite->link();
    m_programFaceSprite->bind();

    // Uniform location of camera
    u_cameraRightWorldspace = m_programFaceSprite
            ->uniformLocation("cameraRightWorldspace");
    u_cameraUpWorldspace = m_programFaceSprite
            ->uniformLocation("cameraUpWorldspace");
    u_cameraDeepWorldspace = m_programFaceSprite
            ->uniformLocation("cameraDeepWorldspace");
    u_modelViewProjection = m_programFaceSprite
            ->uniformLocation("modelViewProjection");

    // Release
    m_programFaceSprite->release();
}

// -------------------------------------------------------

void Map::updateGLStatic(QOpenGLBuffer &vertexBuffer,
                         QOpenGLBuffer &indexBuffer,
                         QVector<Vertex> &vertices,
                         QVector<GLuint> &indexes,
                         QOpenGLVertexArrayObject &vao,
                         QOpenGLShaderProgram* program)
{
    program->bind();

    // If existing VAO or VBO, destroy it
    if (vao.isCreated())
        vao.destroy();
    if (vertexBuffer.isCreated())
        vertexBuffer.destroy();
    if (indexBuffer.isCreated())
        indexBuffer.destroy();

    // Create new VBO for vertex
    vertexBuffer.create();
    vertexBuffer.bind();
    vertexBuffer.setUsagePattern(QOpenGLBuffer::StaticDraw);
    vertexBuffer.allocate(vertices.constData(),
                          vertices.size() * sizeof(Vertex));

    // Create new VBO for indexes
    indexBuffer.create();
    indexBuffer.bind();
    indexBuffer.setUsagePattern(QOpenGLBuffer::StaticDraw);
    indexBuffer.allocate(indexes.constData(),
                         indexes.size() * sizeof(GLuint));

    // Create new VAO
    vao.create();
    vao.bind();
    program->enableAttributeArray(0);
    program->enableAttributeArray(1);
    program->setAttributeBuffer(0, GL_FLOAT, Vertex::positionOffset(),
                                Vertex::positionTupleSize,
                                Vertex::stride());
    program->setAttributeBuffer(1, GL_FLOAT, Vertex::texOffset(),
                                Vertex::texCoupleSize,
                                Vertex::stride());
    indexBuffer.bind();

    // Releases
    vao.release();
    indexBuffer.release();
    vertexBuffer.release();
    program->release();
}

// -------------------------------------------------------

void Map::updateGLFace(QOpenGLBuffer &vertexBuffer,
                       QOpenGLBuffer &indexBuffer,
                       QVector<VertexBillboard> &vertices,
                       QVector<GLuint> &indexes,
                       QOpenGLVertexArrayObject &vao,
                       QOpenGLShaderProgram* program)
{
    program->bind();

    // If existing VAO or VBO, destroy it
    if (vao.isCreated())
        vao.destroy();
    if (vertexBuffer.isCreated())
        vertexBuffer.destroy();
    if (indexBuffer.isCreated())
        indexBuffer.destroy();

    // Create new VBO for vertex
    vertexBuffer.create();
    vertexBuffer.bind();
    vertexBuffer.setUsagePattern(QOpenGLBuffer::StaticDraw);
    vertexBuffer.allocate(vertices.constData(),
                          vertices.size() * sizeof(VertexBillboard));

    // Create new VBO for indexes
    indexBuffer.create();
    indexBuffer.bind();
    indexBuffer.setUsagePattern(QOpenGLBuffer::StaticDraw);
    indexBuffer.allocate(indexes.constData(),
                         indexes.size() * sizeof(GLuint));

    // Create new VAO
    vao.create();
    vao.bind();
    program->enableAttributeArray(0);
    program->enableAttributeArray(1);
    program->enableAttributeArray(2);
    program->enableAttributeArray(3);
    program->setAttributeBuffer(0, GL_FLOAT, VertexBillboard::positionOffset(),
                                VertexBillboard::positionTupleSize,
                                VertexBillboard::stride());
    program->setAttributeBuffer(1, GL_FLOAT, VertexBillboard::texOffset(),
                                VertexBillboard::texCoupleSize,
                                VertexBillboard::stride());
    program->setAttributeBuffer(2, GL_FLOAT, VertexBillboard::sizeOffset(),
                                VertexBillboard::sizeCoupleSize,
                                VertexBillboard::stride());
    program->setAttributeBuffer(3, GL_FLOAT, VertexBillboard::modelOffset(),
                                VertexBillboard::modelTupleSize,
                                VertexBillboard::stride());
    indexBuffer.bind();

    // Releases
    vao.release();
    indexBuffer.release();
    vertexBuffer.release();
    program->release();
}

// -------------------------------------------------------

QOpenGLShaderProgram* Map::createProgram(QString shaderName) {
    QOpenGLShaderProgram* program = new QOpenGLShaderProgram;
    QString path = ":/Shaders/" + shaderName + Wanok::shadersExtension;
    program->addShaderFromSourceFile(QOpenGLShader::Vertex, path + ".vert");
    program->addShaderFromSourceFile(QOpenGLShader::Fragment, path + ".frag");
    program->link();
    program->bind();

    return program;
}

// -------------------------------------------------------

void Map::paintFloors(QMatrix4x4& modelviewProjection) {

    m_programStatic->bind();
    m_programStatic->setUniformValue(u_modelviewProjectionStatic,
                                     modelviewProjection);
    m_textureTileset->bind();

    int totalSize = getMapPortionTotalSize();
    for (int i = 0; i < totalSize; i++) {
        MapPortion* mapPortion = this->mapPortionBrut(i);
        if (mapPortion != nullptr && mapPortion->isVisibleLoaded())
            mapPortion->paintFloors();
    }

    m_programStatic->release();
}

// -------------------------------------------------------

void Map::paintOthers(QMatrix4x4 &modelviewProjection,
                      QVector3D &cameraRightWorldSpace,
                      QVector3D &cameraUpWorldSpace,
                      QVector3D &cameraDeepWorldSpace)
{
    int totalSize = getMapPortionTotalSize();
    MapPortion* mapPortion;

    m_programStatic->bind();
    m_programStatic->setUniformValue(u_modelviewProjectionStatic,
                                     modelviewProjection);

    // Sprites
    m_textureTileset->bind();
    for (int i = 0; i < totalSize; i++) {
        mapPortion = this->mapPortionBrut(i);
        if (mapPortion != nullptr && mapPortion->isVisibleLoaded())
            mapPortion->paintSprites();
    }
    m_textureTileset->release();

    // Objects
    QHash<int, QOpenGLTexture*>::iterator it;
    for (it = m_texturesCharacters.begin();
         it != m_texturesCharacters.end(); it++)
    {
        int textureID = it.key();
        QOpenGLTexture* texture = it.value();
        for (int i = 0; i < totalSize; i++) {
            mapPortion = this->mapPortionBrut(i);
            if (mapPortion != nullptr && mapPortion->isVisibleLoaded())
                mapPortion->paintObjectsStaticSprites(textureID, texture);
        }
    }

    // Walls
    QHash<int, QOpenGLTexture*>::iterator itWalls;
    for (itWalls = m_texturesSpriteWalls.begin();
         itWalls != m_texturesSpriteWalls.end(); itWalls++)
    {
        int textureID = itWalls.key();
        QOpenGLTexture* texture = itWalls.value();
        texture->bind();
        for (int i = 0; i < totalSize; i++) {
            mapPortion = this->mapPortionBrut(i);
            if (mapPortion != nullptr && mapPortion->isVisibleLoaded())
                mapPortion->paintSpritesWalls(textureID);
        }
        texture->release();
    }

    // Face sprites
    m_programStatic->release();
    m_programFaceSprite->bind();
    m_programFaceSprite->setUniformValue(u_cameraRightWorldspace,
                                         cameraRightWorldSpace);
    m_programFaceSprite->setUniformValue(u_cameraUpWorldspace,
                                         cameraUpWorldSpace);
    m_programFaceSprite->setUniformValue(u_cameraDeepWorldspace,
                                         cameraDeepWorldSpace);
    m_programFaceSprite->setUniformValue(u_modelViewProjection,
                                         modelviewProjection);
    m_textureTileset->bind();
    for (int i = 0; i < totalSize; i++) {
        mapPortion = this->mapPortionBrut(i);
        if (mapPortion != nullptr && mapPortion->isVisible())
            mapPortion->paintFaceSprites();
    }
    m_textureTileset->release();

    // Objects face sprites
    for (it = m_texturesCharacters.begin();
         it != m_texturesCharacters.end(); it++)
    {
        int textureID = it.key();
        QOpenGLTexture* texture = it.value();
        for (int i = 0; i < totalSize; i++) {
            mapPortion = this->mapPortionBrut(i);
            if (mapPortion != nullptr && mapPortion->isVisibleLoaded())
                mapPortion->paintObjectsFaceSprites(textureID, texture);
        }
    }
    m_programFaceSprite->release();

    // Objects squares
    m_programStatic->bind();
    m_textureObjectSquare->bind();
    for (int i = 0; i < totalSize; i++) {
        mapPortion = this->mapPortionBrut(i);
        if (mapPortion != nullptr && mapPortion->isVisibleLoaded())
            mapPortion->paintObjectsSquares();
    }
    m_textureObjectSquare->release();
    m_programStatic->release();
}
