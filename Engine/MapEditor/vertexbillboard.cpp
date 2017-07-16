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

#include "vertexbillboard.h"

const int VertexBillboard::positionTupleSize = 3;

const int VertexBillboard::texCoupleSize = 2;

const int VertexBillboard::sizeCoupleSize = 2;

const int VertexBillboard::modelCoupleSize = 1;

int VertexBillboard::positionOffset() {
    return offsetof(VertexBillboard, m_centerPosition);
}

int VertexBillboard::texOffset() {
    return offsetof(VertexBillboard, m_tex);
}

int VertexBillboard::sizeOffset() {
    return offsetof(VertexBillboard, m_size);
}

int VertexBillboard::modelOffset() {
    return offsetof(VertexBillboard, m_model);
}

int VertexBillboard::stride() {
    return sizeof(VertexBillboard);
}

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

VertexBillboard::VertexBillboard()
{

}

VertexBillboard::VertexBillboard(const QVector3D &position,
                                 const QVector2D &tex, const QVector2D &size,
                                 const QVector2D &model) :
    m_centerPosition(position),
    m_tex(tex),
    m_size(size),
    m_model(model)
{

}

QVector3D VertexBillboard::centerPosition() const { return m_centerPosition; }

void VertexBillboard::setCenterPosition(const QVector3D& position) {
    m_centerPosition = position;
}

QVector2D VertexBillboard::tex() const { return m_tex; }

void VertexBillboard::setTex(const QVector2D &tex) { m_tex = tex; }

QVector2D VertexBillboard::size() const { return m_size; }

void VertexBillboard::setSize(const QVector2D& size) { m_size = size; }

QVector2D VertexBillboard::model() const { return m_model; }

void VertexBillboard::setModel(QVector2D &model) { m_model = model; }

