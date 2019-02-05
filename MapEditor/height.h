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

#ifndef HEIGHT_H
#define HEIGHT_H

#include <QJsonArray>

// -------------------------------------------------------
//
//  CLASS Height
//
//  A possible height of an element in the map.
//
// -------------------------------------------------------

class Height
{
public:
    Height();
    Height(int y, int y_plus);

    bool operator==(const Height& other) const;
    bool operator!=(const Height& other) const;
    int y() const;
    int yPlus() const;
    int getY(int squareSize) const;

    void read(const QJsonArray &json);
    void write(QJsonArray & json) const;

protected:
    int m_y;
    int m_y_plus;
};

inline uint qHash(const Height& pos)
{
   return (pos.y() + pos.yPlus());
}

#endif // HEIGHT_H
