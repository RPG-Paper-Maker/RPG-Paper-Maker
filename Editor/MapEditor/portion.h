/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PORTION_H
#define PORTION_H

#include <QtGlobal>
#include <QJsonArray>

// -------------------------------------------------------
//
//  CLASS Portion
//
//  A possible portion of a map.
//
// -------------------------------------------------------

class Portion
{
public:
    Portion();
    Portion(int x, int y, int z);

    bool operator==(const Portion& other) const;
    bool operator!=(const Portion& other) const;
    Portion& operator+=(const Portion& other);
    int x() const;
    int y() const;
    int z() const;
    void setCoords(int x, int y, int z);
    void setX(int x);
    void setY(int y);
    void setZ(int z);
    void addX(int x);
    void addY(int y);
    void addZ(int z);
    void addAll(int a);

    void read(const QJsonArray &json);
    void write(QJsonArray & json) const;

protected:
    int m_x;
    int m_y;
    int m_z;
};

inline uint qHash(const Portion& pos)
{
   return (pos.x() + pos.y() + pos.z());
}

#endif // PORTION_H
