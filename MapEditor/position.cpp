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

#include "position.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Position::Position() : Position(0, 0, 0, 0, 0) {}

Position::Position(int x, int y, int y_plus, int z, int layer) :
    Position(x, y, y_plus, z, layer, 50, 50, 0)
{

}

Position::Position(int x, int y, int y_plus, int z, int layer, int centerX,
                   int centerZ, int angle) :
    Position3D(x, y, y_plus, z),
    m_layer(layer),
    m_centerX(centerX),
    m_centerZ(centerZ),
    m_angle(angle)
{

}

Position::~Position() {

}

bool Position::operator==(const Position& other) const{
    return m_x == other.x() && m_y == other.y() && m_y_plus == other.yPlus()
           && m_z == other.z() && m_layer == other.layer() && m_centerX ==
           other.centerX() && m_centerZ == other.centerZ() && m_angle ==
           other.angle();
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

int Position::centerX() const{ return m_centerX; }

void Position::setCenterX(int x){ m_centerX = x; }

int Position::centerZ() const{ return m_centerZ; }

void Position::setCenterZ(int z){ m_centerZ = z; }

int Position::angle() const{ return m_angle; }

void Position::setAngle(int a){ m_angle = a; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool Position::isHorizontal() const {
    return m_angle == 0;
}

// -------------------------------------------------------

void Position::setHorizontal() {
    setCenterX(50);
    setCenterZ(0);
    setAngle(0);
}

// -------------------------------------------------------

void Position::setVertical() {
    setCenterX(0);
    setCenterZ(50);
    setAngle(90);
}

// -------------------------------------------------------

void Position::setCurrent(Position& position) const {
    position.setCenterX(m_centerX);
    position.setCenterZ(m_centerZ);
    position.setAngle(m_angle);
}

// -------------------------------------------------------

void Position::getLeft(Position& position) const {
    if (isHorizontal())
        position.setCoords(m_x - 1, m_y, m_y_plus, m_z);
    else
        position.setCoords(m_x, m_y, m_y_plus, m_z + 1);
    setCurrent(position);
}

// -------------------------------------------------------

void Position::getRight(Position& position) const {
    if (isHorizontal())
        position.setCoords(m_x + 1, m_y, m_y_plus, m_z);
    else
        position.setCoords(m_x, m_y, m_y_plus, m_z - 1);
    setCurrent(position);
}

// -------------------------------------------------------

void Position::getTopLeft(Position& position) const {
    if (isHorizontal()) {
        position.setCoords(m_x, m_y, m_y_plus, m_z - 1);
        position.setVertical();
    }
    else {
        position.setCoords(m_x - 1, m_y, m_y_plus, m_z + 1);
        position.setHorizontal();
    }
}

// -------------------------------------------------------

void Position::getTopRight(Position& position) const {
    if (isHorizontal()) {
        position.setCoords(m_x + 1, m_y, m_y_plus, m_z - 1);
        position.setVertical();
    }
    else {
        position.setCoords(m_x - 1, m_y, m_y_plus, m_z);
        position.setHorizontal();
    }
}

// -------------------------------------------------------

void Position::getBotLeft(Position& position) const {
    if (isHorizontal()) {
        position.setCoords(m_x, m_y, m_y_plus, m_z);
        position.setVertical();
    }
    else {
        position.setCoords(m_x, m_y, m_y_plus, m_z + 1);
        position.setHorizontal();
    }
}

// -------------------------------------------------------

void Position::getBotRight(Position& position) const {
    if (isHorizontal()) {
        position.setCoords(m_x + 1, m_y, m_y_plus, m_z);
        position.setVertical();
    }
    else {
        position.setCoords(m_x, m_y, m_y_plus, m_z);
        position.setHorizontal();
    }
}

// -------------------------------------------------------

void Position::getStringLayerYPlus(QString& infos, int squareSize) const {
    int yPlus = getYpx(squareSize);
    if (yPlus > 0)
        infos += "y+ = " + QString::number(yPlus) + "px\n";
    infos += "Layer = " + QString::number(m_layer) + "\nAngle = " +
            QString::number(m_angle) + "\nCenter x = " +
            QString::number(m_centerX) + "%\nCenter z = " +
            QString::number(m_centerZ) + "%";
}

// -------------------------------------------------------

QString Position::toString(int squareSize) const {
    QString infos = "[x = " + QString::number(m_x) + ", y = " +
            QString::number(m_y) + ", z = " + QString::number(m_z) + "]\n";
    getStringLayerYPlus(infos, squareSize);

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

    if (json.size() > 5) {
        m_centerX = json[5].toInt();
        m_centerZ = json[6].toInt();
        m_angle = json[7].toInt();
    }
}

// -------------------------------------------------------

void Position::write(QJsonArray &json) const{
    Position3D::write(json);

    json.append(m_layer);
    if (m_centerX != 50 || m_centerZ != 50 || m_angle != 0) {
        json.append(m_centerX);
        json.append(m_centerZ);
        json.append(m_angle);
    }
}

