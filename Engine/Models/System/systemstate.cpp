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

#include "systemstate.h"
#include "main.h"
#include "systemobjectevent.h"
#include "systemcommonreaction.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemState::SystemState() :
    SystemState(1,"")
{

}

SystemState::SystemState(int i, QString n) :
    SuperListItem(i,n),
    m_object(nullptr)
{

}

SystemState::~SystemState(){

}

void SystemState::setObject(SystemCommonObject* object) { m_object = object; }

void SystemState::setId(int i){
    SuperListItem::setId(i);
}

void SystemState::setName(QString n){
    SuperListItem::setName(n);
}

SystemCommonObject* SystemState::object() const { return m_object; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemState::setDefault(){

}

// -------------------------------------------------------

void SystemState::setDefaultJson(){

}

// -------------------------------------------------------

void SystemState::updateName(){

}

// -------------------------------------------------------

void SystemState::updateModel(){

}

// -------------------------------------------------------

QString SystemState::getJsonName(){
    return "";
}

// -------------------------------------------------------

SuperListItem* SystemState::createCopy() const{
    SystemState* super = new SystemState;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemState::setCopy(const SystemState& state){
    SuperListItem::setCopy(state);
    m_object = state.m_object;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemState::read(const QJsonObject &json){
    SuperListItem::read(json);
}

// -------------------------------------------------------

void SystemState::write(QJsonObject &json) const{
    SuperListItem::write(json);
}
