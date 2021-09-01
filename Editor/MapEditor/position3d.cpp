/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "position3d.h"
#include "mapproperties.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Position3D::Position3D() : Position3D(0,0,0,0) {}

Position3D::Position3D(int x, int y, double y_plus, int z) :
    Portion(x, y, z),
    m_y_plus(y_plus)
{

}

Position3D::~Position3D() {

}

bool Position3D::operator==(const Position3D& other) const{
    return m_x == other.x() && m_y == other.y() && qFuzzyCompare(m_y_plus, other
        .yPlus()) && m_z == other.z();
}
bool Position3D::operator!=(const Position3D& other) const{
    return !operator==(other);
}

double Position3D::yPlus() const { return m_y_plus; }

void Position3D::setYPlus(double yPlus) { m_y_plus = yPlus; }

int Position3D::getY() const {
    return (m_y * RPM::getSquareSize()) + this->getYpx();
}

int Position3D::getYpx() const {
    return static_cast<int>(m_y_plus * RPM::getSquareSize() / 100);
}

void Position3D::setCoords(int x, int y, double yPlus, int z) {
    Portion::setCoords(x, y, z);
    setYPlus(yPlus);
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

bool Position3D::isOutMapPorperties(MapProperties& properties) {
    return this->x() >= properties.length() || this->y() < -properties.depth()
        || this->y() > properties.height() || this->z() >= properties.width();
}

// -------------------------------------------------------

void Position3D::setCopy(const Position3D &position) {
    this->setCoords(position.x(), position.y(), position.yPlus(), position.z());
}

// -------------------------------------------------------

QString Position3D::toString() const {
    QString infos = RPM::BRACKET_LEFT + QString::number(m_x) + "," + QString
        ::number(m_y) + "," + QString::number(m_y_plus) + "," + QString::number(
        m_z) + RPM::BRACKET_RIGHT;

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
    m_y_plus = json[2].toDouble();
    m_z = json[3].toInt();
}

// -------------------------------------------------------

void Position3D::write(QJsonArray &json) const{
    json.append(m_x);
    json.append(m_y);
    json.append(m_y_plus);
    json.append(m_z);
}
