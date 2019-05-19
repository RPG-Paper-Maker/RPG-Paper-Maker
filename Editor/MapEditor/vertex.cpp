/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
