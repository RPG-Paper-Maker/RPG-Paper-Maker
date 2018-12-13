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

#include "systemitem.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemItem::SystemItem() : SuperListItem()
{

}

SystemItem::SystemItem(int i, QString n, int idType, bool consumable) :
    SuperListItem(i,n),
    m_idType(idType),
    m_consumable(consumable)
{

}

SystemItem::~SystemItem(){

}

bool SystemItem::consumable() const { return m_consumable; }

void SystemItem::setConsumable(bool consumable){ m_consumable = consumable; }

int SystemItem::idType() const { return m_idType; }

void SystemItem::setIdType(int t){ m_idType = t; }

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemItem::read(const QJsonObject &json){
    SuperListItem::read(json);
    m_idType = json["t"].toInt();
    m_consumable= json["cons"].toBool();
}

void SystemItem::write(QJsonObject &json) const{
    SuperListItem::write(json);
    json["t"] = m_idType;
    json["cons"] = m_consumable;
}
