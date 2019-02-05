/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#include "systemarmor.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemArmor::SystemArmor() : SystemLang()
{

}

SystemArmor::SystemArmor(int i, LangsTranslation* names, int k) :
    SystemLang(i,names),
    m_idKind(k)
{

}

SystemArmor::~SystemArmor(){

}

int SystemArmor::idKind() const { return m_idKind; }

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemArmor::read(const QJsonObject &json){
    SystemLang::read(json);
    m_idKind = json["k"].toInt();
}

void SystemArmor::write(QJsonObject &json) const{
    SystemLang::write(json);
    json["k"] = m_idKind;
}
