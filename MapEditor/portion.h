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
