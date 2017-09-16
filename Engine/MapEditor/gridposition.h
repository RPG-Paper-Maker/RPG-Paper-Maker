/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#ifndef GRIDPOSITION_H
#define GRIDPOSITION_H

#include "position3d.h"

// -------------------------------------------------------
//
//  CLASS GridPosition
//
//  A position on the grid borders (used for sprite walls).
//
// -------------------------------------------------------

class GridPosition
{
public:
    GridPosition();
    GridPosition(int x1, int z1, int x2, int z2, int y, int yPlus);
    GridPosition(Position3D& position, bool horizontal);

    bool operator==(const GridPosition& other) const;
    bool operator!=(const GridPosition& other) const;
    int x1() const;
    int z1() const;
    int x2() const;
    int z2() const;
    int y() const;
    int yPlus() const;
    bool isHorizontal() const;
    void getSquares(Position3D& p1, Position3D& p2) const;

    void read(const QJsonArray &json);
    void write(QJsonArray & json) const;

protected:
    int m_x1;
    int m_z1;
    int m_x2;
    int m_z2;
    int m_y;
    int m_yPlus;
};

inline uint qHash(const GridPosition& pos)
{
   return (pos.x1() + pos.z1() + pos.x2() + pos.z2() + pos.y() + pos.yPlus());
}

#endif // GRIDPOSITION_H
