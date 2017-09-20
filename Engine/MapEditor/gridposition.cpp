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

#include "gridposition.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

GridPosition::GridPosition() : GridPosition(0, 0, 0, 0, 0, 0) {}

GridPosition::GridPosition(int x1, int z1, int x2, int z2, int y, int yPlus) :
    m_x1(x1), m_z1(z1), m_x2(x2), m_z2(z2), m_y(y)
{

}

GridPosition::GridPosition(Position3D& position, bool horizontal) :
    m_y(position.y()), m_yPlus(position.yPlus())
{
    m_x1 = position.x();
    m_z1 = position.z();

    if (horizontal) {
        m_x2 = m_x1 + 1;
        m_z2 = m_z1;
    }
    else {
        m_x2 = m_x1;
        m_z2 = m_z1 + 1;
    }
}

bool GridPosition::operator==(const GridPosition& other) const{
    return m_x1 == other.x1() && m_z1 == other.z1() && m_x2 == other.x2() &&
           m_z2 == other.z2() && m_y == other.y() && m_yPlus == other.yPlus();
}

bool GridPosition::operator!=(const GridPosition& other) const{
    return !operator==(other);
}

int GridPosition::x1() const {
    return m_x1;
}

int GridPosition::z1() const {
    return m_z1;
}

int GridPosition::x2() const {
    return m_x2;
}

int GridPosition::z2() const {
    return m_z2;
}

int GridPosition::y() const {
    return m_y;
}

int GridPosition::yPlus() const {
    return m_yPlus;
}

bool GridPosition::isHorizontal() const {
    return m_z1 == m_z2;
}

void GridPosition::setCoords(int x1, int z1, int x2, int z2, int y, int yPlus) {
    m_x1 = x1;
    m_x2 = x2;
    m_y = y;
    m_yPlus = yPlus;
    m_z1 = z1;
    m_z2 = z2;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void GridPosition::getSquares(Position3D& p1, Position3D& p2) const {
    if (isHorizontal()) {
        p1.setCoords(m_x1, m_y, m_yPlus, m_z1 - 1);
        p2.setCoords(m_x1, m_y, m_yPlus, m_z1);
    }
    else {
        p1.setCoords(m_x1 - 1, m_y, m_yPlus, m_z1);
        p2.setCoords(m_x1, m_y, m_yPlus, m_z1);
    }
}

// -------------------------------------------------------

void GridPosition::getLeft(GridPosition& gridPosition) const {
    if (isHorizontal())
        gridPosition.setCoords(m_x1 - 1, m_x2 - 1, m_y, m_yPlus, m_z1, m_z2);
    else
        gridPosition.setCoords(m_x1, m_x2, m_y, m_yPlus, m_z1 - 1, m_z2 - 1);
}

// -------------------------------------------------------

void GridPosition::getRight(GridPosition& gridPosition) const {
    if (isHorizontal())
        gridPosition.setCoords(m_x1 + 1, m_x2 + 1, m_y, m_yPlus, m_z1, m_z2);
    else
        gridPosition.setCoords(m_x1, m_x2, m_y, m_yPlus, m_z1 + 1, m_z2 + 1);
}

// -------------------------------------------------------

void GridPosition::getTopLeft(GridPosition& gridPosition) const {
    if (isHorizontal())
        gridPosition.setCoords(m_x1 - 1, m_x2 - 1, m_y, m_yPlus, m_z1 + 1,
                               m_z2 + 1);
    else
        gridPosition.setCoords(m_x1 - 1, m_x2 - 1, m_y, m_yPlus, m_z1 - 1,
                               m_z2 - 1);
}

// -------------------------------------------------------

void GridPosition::getTopRight(GridPosition& gridPosition) const {
    if (isHorizontal())
        gridPosition.setCoords(m_x1 + 1, m_x2 + 1, m_y, m_yPlus, m_z1 + 1,
                               m_z2 + 1);
    else
        gridPosition.setCoords(m_x1 - 1, m_x2 - 1, m_y, m_yPlus, m_z1 + 1,
                               m_z2 + 1);
}

// -------------------------------------------------------

void GridPosition::getBotLeft(GridPosition& gridPosition) const {
    if (isHorizontal())
        gridPosition.setCoords(m_x1 - 1, m_x2 - 1, m_y, m_yPlus, m_z1 - 1,
                               m_z2 - 1);
    else
        gridPosition.setCoords(m_x1 + 1, m_x2 + 1, m_y, m_yPlus, m_z1 - 1,
                               m_z2 - 1);
}

// -------------------------------------------------------

void GridPosition::getBotRight(GridPosition& gridPosition) const {
    if (isHorizontal())
        gridPosition.setCoords(m_x1 + 1, m_x2 + 1, m_y, m_yPlus, m_z1 - 1,
                               m_z2 - 1);
    else
        gridPosition.setCoords(m_x1 + 1, m_x2 + 1, m_y, m_yPlus, m_z1 + 1,
                               m_z2 + 1);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void GridPosition::read(const QJsonArray & json){
    m_x1 = json[0].toInt();
    m_z1 = json[1].toInt();
    m_x2 = json[2].toInt();
    m_z2 = json[3].toInt();
    m_y = json[4].toInt();
    m_yPlus = json[5].toInt();
}

// -------------------------------------------------------

void GridPosition::write(QJsonArray &json) const{
    json.append(m_x1);
    json.append(m_z1);
    json.append(m_x2);
    json.append(m_z2);
    json.append(m_y);
    json.append(m_yPlus);
}
