/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#ifndef VERTEX_H
#define VERTEX_H

#include <QVector3D>
#include <QVector2D>

// -------------------------------------------------------
//
//  CLASS Vertex
//
//  A vertex used for drawing primitives.
//
// -------------------------------------------------------

class Vertex
{
public:
    Vertex();
    Vertex(const QVector3D &position, const QVector2D &tex);
    QVector3D position() const;
    void setPosition(const QVector3D& position);
    QVector2D tex() const;
    void setTex(const QVector2D& tex);
    static const int positionTupleSize;
    static const int texCoupleSize;
    static int positionOffset();
    static int texOffset();
    static int stride();

protected:
    QVector3D m_position;
    QVector2D m_tex;
};

#endif // VERTEX_H
