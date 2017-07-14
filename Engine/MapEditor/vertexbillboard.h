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

#ifndef VERTEXBILLBOARD_H
#define VERTEXBILLBOARD_H

#include "vertex.h"

// -------------------------------------------------------
//
//  CLASS VertexBillboard
//
//  A vertex used for drawing billboard sprites.
//
// -------------------------------------------------------

class VertexBillboard
{
public:
    VertexBillboard();
    VertexBillboard(const QVector3D &position, const QVector2D &tex,
                    const QVector2D &size, const int index);
    QVector3D centerPosition() const;
    void setCenterPosition(const QVector3D& position);
    QVector2D tex() const;
    void setTex(const QVector2D& tex);
    QVector2D size() const;
    void setSize(const QVector2D& size);
    int index() const;
    void setIndex(int index);
    static const int positionTupleSize;
    static const int texCoupleSize;
    static const int sizeCoupleSize;
    static const int indexUnitSize;
    static int positionOffset();
    static int texOffset();
    static int sizeOffset();
    static int indexOffset();
    static int stride();

protected:
    QVector3D m_centerPosition;
    QVector2D m_tex;
    QVector2D m_size;
    int m_index;
};

#endif // VERTEXBILLBOARD_H
