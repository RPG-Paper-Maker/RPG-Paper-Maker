/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "systembattlecommand.h"
#include "dialogsystembattlecommand.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemBattleCommand::SystemBattleCommand() :
    SystemBattleCommand(1, new LangsTranslation, 1)
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

void SystemBattleCommand::setIdSkill(int i) { m_idSkill = i; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemBattleCommand::updateName(){
    p_name = SuperListItem::getById(
                RPM::get()->project()->gameDatas()->skillsDatas()->model()
                ->invisibleRootItem(),
                m_idSkill)->name();
}

// -------------------------------------------------------

void SystemBattleCommand::setDefault(){
    updateName();
}

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

SuperListItem* SystemBattleCommand::createCopy() const{
    SystemBattleCommand* super = new SystemBattleCommand;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemBattleCommand::setCopy(const SystemBattleCommand& battleCommand){
    SystemLang::setCopy(battleCommand);

    m_idSkill = battleCommand.m_idSkill;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemBattleCommand::read(const QJsonObject &json){
    p_id = json["id"].toInt();
    m_idSkill = json["s"].toInt();
    updateName();
}

// -------------------------------------------------------

void SystemBattleCommand::write(QJsonObject &json) const{
    json["id"] = p_id;
    json["s"] = m_idSkill;
}
