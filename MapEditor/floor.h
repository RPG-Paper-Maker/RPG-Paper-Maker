/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#ifndef FLOOR_H
#define FLOOR_H

#include <QHash>
#include <QRect>
#include <QVector>
#include <QOpenGLFunctions>
#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
#include "land.h"
#include "position.h"
#include "vertex.h"

// -------------------------------------------------------
//
//  CLASS FloorDatas
//
//  A square floor datas.
//
// -------------------------------------------------------

class FloorDatas : public LandDatas
{
public:
    FloorDatas();
    FloorDatas(QRect *texture, bool up = true);
    virtual ~FloorDatas();
    bool operator==(const FloorDatas& other) const;
    bool operator!=(const FloorDatas& other) const;

    virtual MapEditorSubSelectionKind getSubKind() const;
    virtual QString toString() const;

    virtual void initializeVertices(int squareSize, int width, int height,
                                    QVector<Vertex>& vertices,
                                    QVector<GLuint>& indexes,
                                    Position& position, int& count);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject & json) const;
};

#endif // FLOOR_H
