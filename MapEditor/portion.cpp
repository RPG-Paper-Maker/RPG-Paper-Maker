/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

Portion& Portion::operator+=(const Portion& other) {
    addX(other.x());
    addY(other.y());
    addZ(other.z());

    return *this;
}

int Portion::x() const { return m_x; }

int Portion::y() const { return m_y; }

int Portion::z() const { return m_z; }

void Portion::setCoords(int x, int y, int z) {
    setX(x);
    setY(y);
    setZ(z);
}

void Portion::setX(int x) { m_x = x; }

void Portion::setY(int y) { m_y = y; }

void Portion::setZ(int z) { m_z = z; }

void Portion::addX(int x) { m_x += x; }

void Portion::addY(int y) { m_y += y; }

void Portion::addZ(int z) { m_z += z; }

void Portion::addAll(int a) {
    addX(a);
    addY(a);
    addZ(a);
}

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
