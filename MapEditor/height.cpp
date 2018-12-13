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

#include "height.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Height::Height() : Height(0,0)
{}

Height::Height(int y, int y_plus) :
    m_y(y),
    m_y_plus(y_plus)
{

}

bool Height::operator==(const Height& other) const{
    return m_y == other.y() && m_y_plus == other.yPlus();
}
bool Height::operator!=(const Height& other) const{
    return !operator==(other);
}

int Height::y() const { return m_y; }

int Height::yPlus() const { return m_y_plus; }

int Height::getY(int squareSize) const{
    return (m_y * squareSize) + (int)(m_y_plus * squareSize / 100);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void Height::read(const QJsonArray & json){
    m_y = json[0].toInt();
    m_y_plus = json[1].toInt();
}

// -------------------------------------------------------

void Height::write(QJsonArray &json) const{
    json.append(m_y);
    json.append(m_y_plus);
}
