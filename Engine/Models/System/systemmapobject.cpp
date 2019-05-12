/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
