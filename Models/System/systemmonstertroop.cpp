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

#include "systemmonstertroop.h"
#include "wanok.h"
#include "dialogsystemmonstertroop.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemMonsterTroop::SystemMonsterTroop() : SuperListItem()
{

}

SystemMonsterTroop::SystemMonsterTroop(int i, QString n, int level) :
    SuperListItem(i,n),
    m_level(level)
{

}

SystemMonsterTroop::~SystemMonsterTroop(){

}

int SystemMonsterTroop::level() const { return m_level; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool SystemMonsterTroop::openDialog(){
    SystemMonsterTroop monsterTroop;
    monsterTroop.setCopy(*this);
    DialogSystemMonsterTroop dialog(monsterTroop);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(monsterTroop);
        return true;
    }
    return false;
}

// -------------------------------------------------------

void SystemMonsterTroop::setCopy(const SystemMonsterTroop& monsterTroop){
    SuperListItem::setCopy(monsterTroop);
    m_level = monsterTroop.level();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemMonsterTroop::read(const QJsonObject &json){
    p_id = json["id"].toInt();
    p_name = SuperListItem::getById(
                Wanok::get()->project()->gameDatas()->monstersDatas()->model()
                ->invisibleRootItem(),
                p_id)->name();
    m_level = json["l"].toInt();
}

void SystemMonsterTroop::write(QJsonObject &json) const{
    json["id"] = id();
    json["l"] = level();
}
