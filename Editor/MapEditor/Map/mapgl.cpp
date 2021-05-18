/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "map.h"
#include "rpm.h"

// -------------------------------------------------------

void Map::initializeGL(){
    initializeOpenGLFunctions();

    // Create STATIC Shader
    m_programStatic = Map::createProgram("static");

    // Uniform location of camera
    u_modelviewProjectionStatic = m_programStatic
            ->uniformLocation("modelviewProjection");
    u_hoveredStatic = m_programStatic->uniformLocation("hovered");

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
    u_hoveredFace = m_programFaceSprite->uniformLocation("hovered");
    u_yOffset = m_programStatic->uniformLocation("yOffset");

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
    QString path = ":/Shaders/" + shaderName + RPM::shadersExtension;
    program->addShaderFromSourceFile(QOpenGLShader::Vertex, path + ".vert");
    program->addShaderFromSourceFile(QOpenGLShader::Fragment, path + ".frag");
    program->link();
    program->bind();

    return program;
}

// -------------------------------------------------------

void Map::paintFloors(QMatrix4x4& modelviewProjection, int autotileFrame) {
    MapPortion* mapPortion;
    int totalSize = getMapPortionTotalSize();

    // Floors
    m_programStatic->bind();
    m_programStatic->setUniformValue(u_modelviewProjectionStatic,
                                     modelviewProjection);
    m_programStatic->setUniformValue(u_hoveredStatic, false);
    m_programStatic->setUniformValue(u_yOffset, 0.0f);
    m_textureTileset->bind();
    for (int i = 0; i < totalSize; i++) {
        mapPortion = this->mapPortionBrut(i);
        if (mapPortion != nullptr && mapPortion->isVisibleLoaded())
            mapPortion->paintFloors(u_hoveredStatic);
    }
    m_textureTileset->release();

    // Autotiles
    for (int j = 0; j < m_texturesAutotiles.size(); j++) {
        TextureSeveral *texture = m_texturesAutotiles[j];
        texture->texture()->bind();
        for (int i = 0; i < totalSize; i++)
        {
            mapPortion = this->mapPortionBrut(i);
            if (mapPortion != nullptr && mapPortion->isVisibleLoaded())
            {
                mapPortion->paintAutotiles(m_programStatic, j, texture
                    ->isAnimated(), autotileFrame, u_yOffset);
            }
        }
        texture->texture()->release();
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
    QHash<int, QOpenGLTexture*>::iterator it;

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
    m_programFaceSprite->setUniformValue(u_hoveredFace, false);
    m_textureTileset->bind();
    for (int i = 0; i < totalSize; i++) {
        mapPortion = this->mapPortionBrut(i);
        if (mapPortion != nullptr && mapPortion->isVisibleLoaded())
            mapPortion->paintFaceSprites(u_hoveredFace);
    }
    m_textureTileset->release();

    // Objects face sprites
    for (it = m_texturesCharacters.begin();
         it != m_texturesCharacters.end(); it++)
    {
        int textureID = it.key();
        QOpenGLTexture *texture = it.value();
        if (texture == nullptr) {
            texture = m_textureMissing;
        }
        for (int i = 0; i < totalSize; i++) {
            mapPortion = this->mapPortionBrut(i);
            if (mapPortion != nullptr && mapPortion->isVisibleLoaded())
                mapPortion->paintObjectsFaceSprites(textureID, texture);
        }
    }
    m_programFaceSprite->release();


    // Walls
    m_programStatic->bind();
    m_programStatic->setUniformValue(u_modelviewProjectionStatic,
                                     modelviewProjection);
    m_programStatic->setUniformValue(u_hoveredStatic, false);
    QHash<int, QOpenGLTexture*>::iterator itWalls;
    for (itWalls = m_texturesSpriteWalls.begin();
         itWalls != m_texturesSpriteWalls.end(); itWalls++)
    {
        int textureID = itWalls.key();
        QOpenGLTexture* texture = itWalls.value();
        if (texture != nullptr) {
            texture->bind();
            for (int i = 0; i < totalSize; i++) {
                mapPortion = this->mapPortionBrut(i);
                if (mapPortion != nullptr && mapPortion->isVisibleLoaded())
                    mapPortion->paintSpritesWalls(textureID);
            }
            texture->release();
        }
    }

    // Sprites
    m_textureTileset->bind();
    for (int i = 0; i < totalSize; i++) {
        mapPortion = this->mapPortionBrut(i);
        if (mapPortion != nullptr && mapPortion->isVisibleLoaded())
            mapPortion->paintSprites(u_hoveredStatic);
    }
    m_textureTileset->release();

    // Objects
    for (it = m_texturesCharacters.begin();
         it != m_texturesCharacters.end(); it++)
    {
        int textureID = it.key();
        QOpenGLTexture* texture = it.value();
        if (texture == nullptr) {
            texture = m_textureMissing;
        }
        for (int i = 0; i < totalSize; i++) {
            mapPortion = this->mapPortionBrut(i);
            if (mapPortion != nullptr && mapPortion->isVisibleLoaded())
            {
                mapPortion->paintObjectsStaticSprites(textureID, texture);
            }
        }
    }

    // 3D objects
    if (m_detection == nullptr) {
        QHash<int, QOpenGLTexture*>::iterator itObj3D;
        for (itObj3D = m_texturesObjects3D.begin(); itObj3D !=
             m_texturesObjects3D.end(); itObj3D++)
        {
            int textureID = itObj3D.key();
            QOpenGLTexture *texture = itObj3D.value();
            if (texture != nullptr) {
                texture->bind();
                for (int i = 0; i < totalSize; i++) {
                    mapPortion = this->mapPortionBrut(i);
                    if (mapPortion != nullptr && mapPortion->isVisibleLoaded())
                    {
                        mapPortion->paintObjects3D(textureID, u_hoveredStatic);
                        mapPortion->paintObjectsObjects3D(textureID);
                    }
                }
                texture->release();
            }
        }
    } else {
        // 3D boxes for detections
        m_textureDetection->bind();
        for (int i = 0; i < totalSize; i++) {
            mapPortion = this->mapPortionBrut(i);
            if (mapPortion != nullptr && mapPortion->isVisibleLoaded()) {
                mapPortion->paintObjects3D(1, u_hoveredStatic);
            }
        }
        m_textureDetection->release();
    }

    // Mountains
    for (int j = 0; j < m_texturesMountains.size(); j++) {
        QOpenGLTexture* texture = m_texturesMountains[j]->texture();
        texture->bind();
        for (int i = 0; i < totalSize; i++) {
            mapPortion = this->mapPortionBrut(i);
            if (mapPortion != nullptr && mapPortion->isVisibleLoaded()) {
                mapPortion->paintMountains(j);
            }
        }
        texture->release();
    }

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
