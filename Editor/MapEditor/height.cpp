/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
