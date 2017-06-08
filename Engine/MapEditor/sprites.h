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
#include <QHash>
#include <QVector>
#include "serializable.h"
#include "position.h"
#include "vertex.h"

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
    SpriteDatas(int layer, int widthPosition, int angle, QRect* textureRect);
    virtual ~SpriteDatas();
    int layer() const;
    int widthPosition() const;
    int angle() const;
    QRect* textureRect() const;
    void initializeVertices(int squareSize, QVector<Vertex>& vertices,
                            QVector<GLuint>& indexes, Position3D& position,
                            int& count, bool isTileset);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_layer;
    int m_widthPosition;
    int m_angle;
    QRect* m_textureRect;
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
    bool addSprite(Position& p);
    bool deleteSprite(Position& p);

    void initializeVertices(int squareSize);
    void initializeGL(QOpenGLShaderProgram* programStatic);
    void updateGL();
    void paintGL();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QHash<Position3D, QVector<SpriteDatas*>*> m_allStatic;

    // OpenGL informations
    QOpenGLBuffer m_vertexBufferStatic;
    QOpenGLBuffer m_indexBufferStatic;
    QVector<Vertex> m_verticesStatic;
    QVector<GLuint> m_indexesStatic;
    QOpenGLVertexArrayObject m_vaoStatic;
    QOpenGLShaderProgram* m_programStatic;
};

#endif // SPRITES_H
