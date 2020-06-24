/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "vertexbillboard.h"

const int VertexBillboard::positionTupleSize = 3;

const int VertexBillboard::texCoupleSize = 2;

const int VertexBillboard::sizeCoupleSize = 2;

const int VertexBillboard::modelTupleSize = 3;

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
                                 const QVector3D &model) :
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

QVector3D VertexBillboard::model() const { return m_model; }

void VertexBillboard::setModel(QVector3D &model) { m_model = model; }

