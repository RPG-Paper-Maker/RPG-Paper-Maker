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

#ifndef LAND_H
#define LAND_H

#include "mapelement.h"
#include "qray3d.h"
#include "position.h"
#include "vertex.h"
#include <QGLContext>

class LandDatas : public MapElement
{
public:
    LandDatas(QRect* texture, bool up);
    virtual ~LandDatas();
    bool operator==(const LandDatas& other) const;
    bool operator!=(const LandDatas& other) const;
    QRect* textureRect() const;
    virtual MapEditorSubSelectionKind getSubKind() const;

    virtual void initializeVertices(int, int, int, QVector<Vertex>&,
                                    QVector<GLuint>&, Position&, int&);
    void getPosSize(QVector3D& pos, QVector3D& size, int squareSize,
                    Position &position);
    float intersection(int squareSize, QRay3D& ray, Position& position);

    static const QString JSON_UP;
    static const QString JSON_TEXTURE;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QRect* m_textureRect;
    bool m_up;
};

#endif // LAND_H
