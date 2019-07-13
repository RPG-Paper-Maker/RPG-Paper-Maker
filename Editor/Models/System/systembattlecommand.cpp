/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
