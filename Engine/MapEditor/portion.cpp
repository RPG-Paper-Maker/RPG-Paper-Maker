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

#include "portion.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Portion::Portion() : Portion(0,0,0) {}

Portion::Portion(int x, int y, int z) :
    m_x(x), m_y(y), m_z(z)
{

}

bool Portion::operator==(const Portion& other) const{
    return m_x == other.x() && m_y == other.y() && m_z == other.z();
}
bool Portion::operator!=(const Portion& other) const{
    return !operator==(other);
}

int Portion::x() const { return m_x; }

int Portion::y() const { return m_y; }

int Portion::z() const { return m_z; }

void Portion::setX(int x) { m_x = x; }

void Portion::setY(int y) { m_y = y; }

void Portion::setZ(int z) { m_z = z; }

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void Portion::read(const QJsonArray & json){
    m_x = json[0].toInt();
    m_y = json[1].toInt();
    m_z = json[2].toInt();
}

// -------------------------------------------------------

void Portion::write(QJsonArray &json) const{
    json.append(m_x);
    json.append(m_y);
    json.append(m_z);
}
