/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    static const QString JSON_RECT;
    static const QString JSON_LEFT;
    static const QString JSON_RIGHT;
    static const QString JSON_TOP;
    static const QString JSON_BOT;
    static const QString JSON_TERRAIN;
    static const int DEFAULT_TERRAIN;

    CollisionSquare();
    CollisionSquare(QRectF *rect);
    virtual ~CollisionSquare();

    QRectF * rect() const;
    void setRect(QRectF *rect);
    bool left() const;
    bool right() const;
    bool top() const;
    bool bot() const;
    int terrain() const;
    void setTerrain(int terrain);

    bool hasAllDirections() const;
    void setDefaultPraticable();
    void revertAllDirections();
    void revertTop();
    void revertRight();
    void revertBot();
    void revertLeft();
    CollisionSquare * createCopy();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QRectF* m_rect;
    bool m_left;
    bool m_right;
    bool m_top;
    bool m_bot;
    int m_terrain;
};

inline uint qHash(const QPoint &key) {
    return static_cast<uint>(key.x() + key.y());
}

#endif // COLLISIONSQUARE_H
