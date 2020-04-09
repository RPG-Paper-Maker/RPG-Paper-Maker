/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemmapobject.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemMapObject::SystemMapObject()
{

}

SystemMapObject::SystemMapObject(int i, QString n, Position3D& position) :
    SuperListItem(i,n),
    m_position(position)
{

}

SystemMapObject::~SystemMapObject(){

}

Position3D SystemMapObject::position() const { return m_position; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemMapObject::read(const QJsonObject &json){
    SuperListItem::read(json);

    m_position.read(json["p"].toArray());
}

// -------------------------------------------------------

void SystemMapObject::write(QJsonObject &json) const{
    SuperListItem::write(json);

    QJsonArray tab;
    m_position.write(tab);
    json["p"] = tab;
}
