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

#include "position3d.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Position3D::Position3D() : Position3D(0,0,0,0) {}

Position3D::Position3D(int x, int y, int y_plus, int z) :
    Portion(x, y, z),
    m_y_plus(y_plus)
{

}

Position3D::~Position3D() {

}

bool Position3D::operator==(const Position3D& other) const{
    return m_x == other.x() && m_y == other.y() && m_y_plus == other.yPlus() &&
            m_z == other.z();
}
bool Position3D::operator!=(const Position3D& other) const{
    return !operator==(other);
}

int Position3D::yPlus() const { return m_y_plus; }

void Position3D::setYPlus(int yPlus) { m_y_plus = yPlus; }

int Position3D::getY(int squareSize) const {
    return (m_y * squareSize) + getYpx(squareSize);
}

int Position3D::getYpx(int squareSize) const {
    return m_y_plus * squareSize / 100;
}

void Position3D::setCoords(int x, int y, int yPlus, int z) {
    m_x = x;
    m_y = y;
    m_y_plus = yPlus;
    m_z = z;
}

void Position3D::setInGrid(Position3D& p, int w, int h) {
    int x = p.x(), z = p.z();
    if (x < 0)
        x = 0;
    else if (x > w)
        x = w;
    if (z < 0)
        z = 0;
    else if (z > h)
        z = h;

    setCoords(x, p.y(), p.yPlus(), z);
}

// -------------------------------------------------------

QString Position3D::toString() const {
    QString infos = "[" + QString::number(m_x) + "," + QString::number(m_y) +
        "," + QString::number(m_y_plus) + "," + QString::number(m_z) + "]";

    return infos;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void Position3D::read(const QJsonArray & json){
    m_x = json[0].toInt();
    m_y = json[1].toInt();
    m_y_plus = json[2].toInt();
    m_z = json[3].toInt();
}

// -------------------------------------------------------

void Position3D::write(QJsonArray &json) const{
    json.append(m_x);
    json.append(m_y);
    json.append(m_y_plus);
    json.append(m_z);
}
