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

#ifndef SPRITE_H
#define SPRITE_H

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
#include "mapproperties.h"
#include "mapelement.h"
#include "gridposition.h"
#include "spritewallkind.h"

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
    static const int SPRITES_OFFSET_COEF = 0.0005;
};

// -------------------------------------------------------
//
//  CLASS SpriteDatas
//
//  A sprite datas.
//
// -------------------------------------------------------

class SpriteDatas : public MapElement
{
public:
    SpriteDatas();
    SpriteDatas(MapEditorSubSelectionKind kind, int widthPosition,
                int angle, QRect* textureRect);
    virtual ~SpriteDatas();
    virtual MapEditorSelectionKind getKind() const;
    virtual MapEditorSubSelectionKind getSubKind() const;
    int widthPosition() const;
    int angle() const;
    QRect* textureRect() const;
    virtual void initializeVertices(int squareSize, int width, int height,
                                    QVector<Vertex>& verticesStatic,
                                    QVector<GLuint>& indexesStatic,
                                    QVector<VertexBillboard>& verticesFace,
                                    QVector<GLuint>& indexesFace,
                                    Position3D& position, int& countStatic,
                                    int& countFace, int& spritesOffset);
    static void rotateVertex(QVector3D& vec, QVector3D& center, int angle);
    static void rotateSprite(QVector3D& vecA, QVector3D& vecB, QVector3D& vecC,
                             QVector3D& vecD, QVector3D& center, int angle);
    static void addStaticSpriteToBuffer(QVector<Vertex>& verticesStatic,
                                        QVector<GLuint>& indexesStatic,
                                        int& count,
                                        QVector3D& vecA, QVector3D& vecB,
                                        QVector3D& vecC, QVector3D& vecD,
                                        QVector2D& texA, QVector2D& texB,
                                        QVector2D& texC, QVector2D& texD);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    MapEditorSubSelectionKind m_kind;
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
    void initializeVertices(int squareSize, Position3D& position,
                            int &spritesOffset);
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
//  CLASS SpriteWallDatas
//
//  A sprite datas for walls.
//
// -------------------------------------------------------

class SpriteWallDatas : public MapElement
{
public:
    SpriteWallDatas();
    SpriteWallDatas(int wallID);
    virtual MapEditorSelectionKind getKind() const;
    virtual MapEditorSubSelectionKind getSubKind() const;
    void update(GridPosition& gridPosition);
    static SpriteWallDatas* getWall(GridPosition& gridPosition);
    static SpriteWallDatas* getLeft(GridPosition& gridPosition);
    static SpriteWallDatas* getRight(GridPosition& gridPosition);
    static SpriteWallDatas* getTopLeft(GridPosition& gridPosition);
    static SpriteWallDatas* getTopRight(GridPosition& gridPosition);
    static SpriteWallDatas* getBotLeft(GridPosition& gridPosition);
    static SpriteWallDatas* getBotRight(GridPosition& gridPosition);
    virtual void initializeVertices(int squareSize, int width, int height,
                                    QVector<Vertex>& vertices,
                                    QVector<GLuint>& indexes,
                                    GridPosition& position, int& count);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_wallID;
    SpriteWallKind m_wallKind;
};

#endif // SPRITE_H
