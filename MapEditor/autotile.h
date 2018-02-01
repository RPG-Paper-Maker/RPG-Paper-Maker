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
