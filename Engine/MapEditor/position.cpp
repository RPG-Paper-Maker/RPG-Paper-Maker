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

#include "position.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Position::Position() : Position(0,0,0,0,0) {}

Position::Position(int x, int y, int y_plus, int z, int layer) :
    Position3D(x, y, y_plus, z),
    m_layer(layer)
{

}

Position::~Position() {

}

bool Position::operator==(const Position& other) const{
    return m_x == other.x() && m_y == other.y() && m_y_plus == other.yPlus()
            && m_z == other.z() && m_layer == other.layer();
}
bool Position::operator!=(const Position& other) const{
    return !operator==(other);
}

void Position::setX(int x){
    m_x = x;
}

void Position::setZ(int z){
    m_z = z;
}

void Position::setCoords(int x, int y, int y_plus, int z){
    m_x = x;
    m_y = y;
    m_y_plus = y_plus;
    m_z = z;
}

int Position::layer() const { return m_layer; }

void Position::setLayer(int l) { m_layer = l; }

QString Position::toString(int squareSize) const {
    int yPlus = getYpx(squareSize);
    QString infos = "[x = " + QString::number(m_x) + ", y = " +
            QString::number(m_y) + ", z = " + QString::number(m_z) + "]\n";
    if (yPlus > 0)
        infos += "y+ = " + QString::number(yPlus) + "px\n";
    infos += "Layer = " + QString::number(m_layer);

    return infos;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void Position::read(const QJsonArray & json){
    Position3D::read(json);
    m_layer = json[4].toInt();
}

// -------------------------------------------------------

void Position::write(QJsonArray &json) const{
    Position3D::write(json);
    json.append(m_layer);
}

