/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef AUTOTILE_H
#define AUTOTILE_H

#include <QOpenGLFunctions>
#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
#include "land.h"
#include "textureautotile.h"

class Autotiles;

// -------------------------------------------------------
//
//  CLASS AutotileDatas
//
//  Autotiles grouped that are having the same texture.
//
// -------------------------------------------------------

class AutotileDatas : public LandDatas
{
public:
    AutotileDatas();
    AutotileDatas(int autotileID, QRect *texture, bool up = true);
    AutotileDatas(const AutotileDatas &autotile);
    int autotileID() const;
    static const QString JSON_ID;
    static const QString JSON_TILE_ID;

    bool operator==(const AutotileDatas& other) const;
    bool operator!=(const AutotileDatas& other) const;

    virtual MapEditorSubSelectionKind getSubKind() const;
    virtual QString toString() const;

    virtual void initializeVertices(TextureAutotile* textureAutotile,
                                    int squareSize, int width, int height,
                                    QVector<Vertex>& vertices,
                                    QVector<GLuint>& indexes,
                                    Position& position, int& count);
    bool update(Position &position, Portion& portion,
                QHash<Position, AutotileDatas*> &preview);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject & json) const;

protected:
    int m_autotileID;
    int m_tileID;
};

// -------------------------------------------------------
//
//  CLASS Autotile
//
//  Autotiles grouped that are having the same texture.
//
// -------------------------------------------------------

class Autotile : protected QOpenGLFunctions
{
public:
    Autotile();
    virtual ~Autotile();
    void initializeVertices(TextureAutotile* textureAutotile,
                            Position& position, AutotileDatas* autotile,
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

#endif // AUTOTILE_H
