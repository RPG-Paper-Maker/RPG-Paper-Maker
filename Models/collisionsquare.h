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

#ifndef COLLISIONSQUARE_H
#define COLLISIONSQUARE_H

#include <QRect>
#include "serializable.h"

// -------------------------------------------------------
//
//  CLASS CollisionSquare
//
//  Collisions applied to a particular square of a picture.
//
// -------------------------------------------------------

class CollisionSquare : public Serializable
{
public:
    CollisionSquare();
    CollisionSquare(QRectF* rect);
    virtual ~CollisionSquare();
    QRectF* rect() const;
    void setRect(QRectF* rect);
    bool left() const;
    bool right() const;
    bool top() const;
    bool bot() const;
    static const QString JSON_RECT;
    static const QString JSON_LEFT;
    static const QString JSON_RIGHT;
    static const QString JSON_TOP;
    static const QString JSON_BOT;
    bool hasAllDirections() const;
    void setDefaultPraticable();
    void revertAllDirections();
    void revertTop();
    void revertRight();
    void revertBot();
    void revertLeft();
    CollisionSquare *createCopy();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QRectF* m_rect;
    bool m_left;
    bool m_right;
    bool m_top;
    bool m_bot;
};

inline uint qHash(const QPoint & key) {
    return key.x() + key.y();
}

#endif // COLLISIONSQUARE_H
