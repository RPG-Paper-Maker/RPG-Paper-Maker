/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#ifndef POSITION3D_H
#define POSITION3D_H

#include "portion.h"

// -------------------------------------------------------
//
//  CLASS Position3D
//
//  A possible position of an element in the map.
//
// -------------------------------------------------------

class Position3D : public Portion
{
public:
    Position3D();
    Position3D(int x, int y, int yPlus, int z);
    virtual ~Position3D();

    bool operator==(const Position3D& other) const;
    bool operator!=(const Position3D& other) const;
    int yPlus() const;
    void setYPlus(int yPlus);
    int getY(int squareSize) const;
    int getYpx(int squareSize) const;
    void setCoords(int x, int y, int yPlus, int z);
    void setInGrid(Position3D &p, int w, int h);

    virtual QString toString() const;

    void read(const QJsonArray &json);
    void write(QJsonArray & json) const;

protected:
    int m_y_plus;
};

inline uint qHash(const Position3D& pos)
{
   return (pos.x() + pos.y() + pos.yPlus() + pos.z());
}

#endif // POSITION3D_H
