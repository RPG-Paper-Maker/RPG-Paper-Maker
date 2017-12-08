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

#include "vertex.h"

const int Vertex::positionTupleSize = 3;

const int Vertex::texCoupleSize = 2;

int Vertex::positionOffset() { return offsetof(Vertex, m_position); }

int Vertex::texOffset() { return offsetof(Vertex, m_tex); }

int Vertex::stride() { return sizeof(Vertex); }

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Vertex::Vertex()
{

}

Vertex::Vertex(const QVector3D &position, const QVector2D &tex) :
    m_position(position),
    m_tex(tex)
{

}

QVector3D Vertex::position() const { return m_position; }

void Vertex::setPosition(const QVector3D& position) { m_position = position; }

QVector2D Vertex::tex() const { return m_tex; }

void Vertex::setTex(const QVector2D &tex) { m_tex = tex; }
