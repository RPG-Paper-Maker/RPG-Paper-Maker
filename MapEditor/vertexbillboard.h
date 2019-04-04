/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef VERTEXBILLBOARD_H
#define VERTEXBILLBOARD_H

#include <QVector3D>
#include <QVector2D>

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
                    const QVector2D &size, const QVector3D &model);
    QVector3D centerPosition() const;
    void setCenterPosition(const QVector3D& position);
    QVector2D tex() const;
    void setTex(const QVector2D& tex);
    QVector2D size() const;
    void setSize(const QVector2D& size);
    QVector3D model() const;
    void setModel(QVector3D& model);
    static const int positionTupleSize;
    static const int texCoupleSize;
    static const int sizeCoupleSize;
    static const int modelTupleSize;
    static int positionOffset();
    static int texOffset();
    static int sizeOffset();
    static int modelOffset();
    static int stride();

protected:
    QVector3D m_centerPosition;
    QVector2D m_tex;
    QVector2D m_size;
    QVector3D m_model;
};

#endif // VERTEXBILLBOARD_H
