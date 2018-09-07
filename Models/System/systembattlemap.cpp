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

#include "systembattlemap.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemBattleMap::SystemBattleMap()
{

}

SystemBattleMap::SystemBattleMap(int i, QString name) :
    SuperListItem(i, name)
{

}

SystemBattleMap::~SystemBattleMap(){

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool SystemBattleMap::openDialog(){
    SystemBattleMap battleMap;
    battleMap.setCopy(*this);
    /*
    DialogSystemBattleCommand dialog(battleCommand);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(battleCommand);
        return true;
    }*/
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemBattleMap::createCopy() const{
    SystemBattleMap* super = new SystemBattleMap;
    super->setCopy(*this);
    return super;
}


// -------------------------------------------------------

void SystemBattleMap::setCopy(const SystemBattleMap& battleMap){
    SuperListItem::setCopy(battleMap);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemBattleMap::read(const QJsonObject &json){
    SuperListItem::read(json);
}

// -------------------------------------------------------

void SystemBattleMap::write(QJsonObject &json) const{
    SuperListItem::write(json);
}
