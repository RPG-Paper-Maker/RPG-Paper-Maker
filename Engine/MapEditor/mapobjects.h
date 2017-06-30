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

#ifndef MAPOBJECTS_H
#define MAPOBJECTS_H

#include <QHash>
#include <QPair>
#include <QOpenGLFunctions>
#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
#include <QOpenGLTexture>
#include "serializable.h"
#include "position.h"
#include "systemcommonobject.h"
#include "vertex.h"

// -------------------------------------------------------
//
//  CLASS MapObjects
//
//  A set of objects in a portion of the map.
//
// -------------------------------------------------------

class MapObjects : public Serializable, protected QOpenGLFunctions
{
public:
    MapObjects();
    virtual ~MapObjects();
    bool isEmpty() const;
    SystemCommonObject* getObjectAt(Position& p) const;
    void setObject(Position& p, SystemCommonObject* object);
    SystemCommonObject* removeObject(Position& p);
    bool addObject(Position& p, SystemCommonObject* object);
    bool deleteObject(Position& p);
    void initializeVertices(int squareSize,
                            QHash<int, QOpenGLTexture *> &characters);
    void initializeGL(QOpenGLShaderProgram* programStatic);
    void updateGL();
    void paintGL();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QHash<int, QHash<Position, SystemCommonObject*>*> m_sprites;

    // OpenGL informations
    QOpenGLBuffer m_vertexBufferStatic;
    QOpenGLBuffer m_indexBufferStatic;
    QVector<Vertex> m_verticesStatic;
    QVector<GLuint> m_indexesStatic;
    QOpenGLVertexArrayObject m_vaoStatic;
    QOpenGLShaderProgram* m_programStatic;
};

#endif // MAPOBJECTS_H
