/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
