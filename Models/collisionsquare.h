/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
