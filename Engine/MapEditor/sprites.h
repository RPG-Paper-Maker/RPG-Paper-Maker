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

#ifndef SPRITES_H
#define SPRITES_H

#include <QOpenGLFunctions>
#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
#include <QOpenGLTexture>
#include <QHash>
#include <QVector>
#include "serializable.h"
#include "position.h"
#include "vertex.h"
#include "vertexbillboard.h"
#include "mapeditorsubselectionkind.h"

// -------------------------------------------------------
//
//  CLASS Sprite
//
//  A sprite in a portion of the map.
//
// -------------------------------------------------------

class Sprite
{
public:
    Sprite();
    virtual ~Sprite();
    static QVector3D verticesQuad[];
    static QVector2D modelQuad[];
    static GLuint indexesQuad[];
    static int nbVerticesQuad;
    static int nbIndexesQuad;
};

// -------------------------------------------------------
//
//  CLASS SpriteDatas
//
//  A sprite datas.
//
// -------------------------------------------------------

class SpriteDatas
{
public:
    SpriteDatas();
    SpriteDatas(MapEditorSubSelectionKind kind, int layer, int widthPosition,
                int angle, QRect* textureRect);
    virtual ~SpriteDatas();
    MapEditorSubSelectionKind kind() const;
    int layer() const;
    int widthPosition() const;
    int angle() const;
    QRect* textureRect() const;
    void initializeVertices(int squareSize, int width, int height,
                            QVector<Vertex>& verticesStatic,
                            QVector<GLuint>& indexesStatic,
                            QVector<VertexBillboard>& verticesFace,
                            QVector<GLuint>& indexesFace,
                            Position3D& position, int& countStatic,
                            int& countFace);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    MapEditorSubSelectionKind m_kind;
    int m_layer;
    int m_widthPosition;
    int m_angle;
    QRect* m_textureRect;
};

// -------------------------------------------------------
//
//  CLASS SpriteObject
//
//  A sprite object in a portion of the map.
//
// -------------------------------------------------------

class SpriteObject : protected QOpenGLFunctions
{
public:
    SpriteObject(SpriteDatas& datas, QOpenGLTexture* texture);
    virtual ~SpriteObject();
    void initializeVertices(int squareSize, Position3D& position);
    void initializeStaticGL(QOpenGLShaderProgram* programStatic);
    void initializeFaceGL(QOpenGLShaderProgram *programFace);
    void updateStaticGL();
    void updateFaceGL();
    void paintGL();

protected:
    SpriteDatas& m_datas;
    QOpenGLTexture* m_texture;

    // OpenGL static
    QOpenGLBuffer m_vertexBuffer;
    QOpenGLBuffer m_indexBuffer;
    QVector<Vertex> m_verticesStatic;
    QVector<GLuint> m_indexes;
    QOpenGLVertexArrayObject m_vao;
    QOpenGLShaderProgram* m_programStatic;
    QVector<VertexBillboard> m_verticesFace;
    QOpenGLShaderProgram* m_programFace;
};

// -------------------------------------------------------
//
//  CLASS Sprites
//
//  A set of sprites in a portion of the map.
//
// -------------------------------------------------------

class Sprites : public Serializable, protected QOpenGLFunctions
{
public:
    Sprites();
    virtual ~Sprites();
    bool isEmpty() const;
    void setSprite(Position& p, SpriteDatas* sprite);
    SpriteDatas* removeSprite(Position& p);
    bool addSprite(Position& p, SpriteDatas* sprite);
    bool deleteSprite(Position& p);

    void initializeVertices(int squareSize, int width, int height);
    void initializeGL(QOpenGLShaderProgram* programStatic,
                      QOpenGLShaderProgram* programFace);
    void updateGL();
    void paintGL();
    void paintFaceGL();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QHash<Position3D, QVector<SpriteDatas*>*> m_allStatic;

    // OpenGL static
    QOpenGLBuffer m_vertexBufferStatic;
    QOpenGLBuffer m_indexBufferStatic;
    QVector<Vertex> m_verticesStatic;
    QVector<GLuint> m_indexesStatic;
    QOpenGLVertexArrayObject m_vaoStatic;
    QOpenGLShaderProgram* m_programStatic;

    // OpenGL face
    QOpenGLBuffer m_vertexBufferFace;
    QOpenGLBuffer m_indexBufferFace;
    QVector<VertexBillboard> m_verticesFace;
    QVector<GLuint> m_indexesFace;
    QOpenGLVertexArrayObject m_vaoFace;
    QOpenGLShaderProgram* m_programFace;
};

#endif // SPRITES_H
