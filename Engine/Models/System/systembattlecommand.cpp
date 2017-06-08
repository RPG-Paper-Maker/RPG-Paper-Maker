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

#include "systembattlecommand.h"
#include "dialogsystembattlecommand.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemBattleCommand::SystemBattleCommand() : SystemLang()
{

}

SystemBattleCommand::SystemBattleCommand(int i, LangsTranslation* names,
                                         int idSkill) :
    SystemLang(i,names),
    m_idSkill(idSkill)
{

}

SystemBattleCommand::~SystemBattleCommand(){

}

int SystemBattleCommand::idSkill() const { return m_idSkill; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool SystemBattleCommand::openDialog(){
    SystemBattleCommand battleCommand;
    battleCommand.setCopy(*this);
    DialogSystemBattleCommand dialog(battleCommand);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(battleCommand);
        return true;
    }
    return false;
}

// -------------------------------------------------------

void SystemBattleCommand::setCopy(const SystemBattleCommand& battleCommand){
    SystemLang::setCopy(battleCommand);
    m_idSkill = battleCommand.idSkill();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemBattleCommand::read(const QJsonObject &json){
    p_id = json["id"].toInt();
    m_idSkill = json["s"].toInt();
    p_name = SuperListItem::getById(
                Wanok::get()->project()->gameDatas()->skillsDatas()->model()
                ->invisibleRootItem(),
                m_idSkill)->name();
}

// -------------------------------------------------------

void SystemBattleCommand::write(QJsonObject &json) const{
    json["id"] = p_id;
    json["s"] = m_idSkill;
}
