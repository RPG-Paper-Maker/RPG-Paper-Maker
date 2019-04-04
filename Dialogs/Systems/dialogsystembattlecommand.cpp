/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "dialogsystembattlecommand.h"
#include "ui_dialogsystembattlecommand.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemBattleCommand::DialogSystemBattleCommand(
        SystemBattleCommand &battleCommand,
        QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemBattleCommand),
    m_battleCommand(battleCommand)
{
    ui->setupUi(this);
    

    initialize();
}

DialogSystemBattleCommand::~DialogSystemBattleCommand()
{
    delete ui;
}

SystemBattleCommand& DialogSystemBattleCommand::battleCommand() const {
    return m_battleCommand;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemBattleCommand::initialize(){
    int index = SuperListItem::getIndexById(
                RPM::get()->project()->gameDatas()->skillsDatas()->model()
                ->invisibleRootItem(), m_battleCommand.idSkill());
    SuperListItem::fillComboBox(ui->comboBoxSkill, RPM::get()->project()
                                ->gameDatas()->skillsDatas()->model());
    ui->comboBoxSkill->setCurrentIndex(index);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemBattleCommand::on_comboBoxSkill_currentIndexChanged(int index)
{
    m_battleCommand.setIdSkill(SuperListItem::getIdByIndex(
                                   RPM::get()->project()->gameDatas()
                                   ->skillsDatas()->model(), index));
    m_battleCommand.updateName();
}
