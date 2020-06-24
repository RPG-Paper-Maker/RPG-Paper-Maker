/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

    this->translate();
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

//-------------------------------------------------

void DialogSystemBattleCommand::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_BATTLE_COMMAND) + RPM
        ::DOT_DOT_DOT);
    ui->labelSkillID->setText(RPM::translate(Translations::SKILL_ID) + RPM
        ::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
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
