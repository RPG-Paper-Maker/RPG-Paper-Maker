/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
