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

#include "sprite.h"

// -------------------------------------------------------
//
//  CLASS SpritesWalls
//
//  A set of sprites walls in a portion of the map.
//
// -------------------------------------------------------

class SpritesWalls : protected QOpenGLFunctions
{
public:
    SpritesWalls();
    virtual ~SpritesWalls();
    void initializeVertices(GridPosition& position, SpriteWallDatas* sprite,
                            int squareSize, int width, int height);
    void initializeGL(QOpenGLShaderProgram* program);
    void updateGL();
    void paintGL();

protected:
    int m_count;

    // OpenGL
    QOpenGLBuffer m_vertexBuffer;
    QOpenGLBuffer m_indexBuffer;
    QVector<Vertex> m_vertices;
    QVector<GLuint> m_indexes;
    QOpenGLVertexArrayObject m_vao;
    QOpenGLShaderProgram* m_program;
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
    bool addSprite(Position& p, MapEditorSubSelectionKind kind,
                   int widthPosition, int angle, QRect *textureRect);
    bool deleteSprite(Position& p);
    void setSpriteWall(GridPosition& p, SpriteWallDatas* sprite);
    SpriteWallDatas* removeSpriteWall(GridPosition& p);
    bool addSpriteWall(GridPosition& p, int specialID);
    bool deleteSpriteWall(GridPosition& p);
    void updateSpriteWalls(QHash<GridPosition, MapElement*>& previewGrid,
                           QList<GridPosition> &previewDeleteGrid);
    SpriteWallDatas* getWallAt(QHash<GridPosition, MapElement*>& previewGrid,
                               QList<GridPosition> &previewDeleteGrid,
                               GridPosition& gridPosition);
    void getWallsWithPreview(QHash<GridPosition, SpriteWallDatas*>&
                             spritesWallWithPreview,
                             QHash<GridPosition, MapElement *>&
                             previewGrid,
                             QList<GridPosition>& previewDeleteGrid);
    void removeSpritesOut(MapProperties& properties);
    void updateRaycasting(int squareSize, float& finalDistance,
                          Position &finalPosition, QRay3D &ray,
                          double cameraHAngle, int& spritesOffset);

    void initializeVertices(QHash<int, QOpenGLTexture*>& texturesWalls,
                            QHash<Position, MapElement*>& previewSquares,
                            QHash<GridPosition, MapElement*>& previewGrid,
                            QList<GridPosition>& previewDeleteGrid,
                            int squareSize, int width, int height,
                            int& spritesOffset);
    void initializeGL(QOpenGLShaderProgram* programStatic,
                      QOpenGLShaderProgram* programFace);
    void updateGL();
    void paintGL();
    void paintFaceGL();
    void paintSpritesWalls(int textureID);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QHash<Position, SpriteDatas*> m_all;
    QHash<GridPosition, SpriteWallDatas*> m_walls;
    QHash<int, SpritesWalls*> m_wallsGL;

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
