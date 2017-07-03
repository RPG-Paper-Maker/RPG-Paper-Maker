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

#include "dialogsystembattlecommand.h"
#include "ui_dialogsystembattlecommand.h"
#include "wanok.h"

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
    setFixedSize(geometry().width(), geometry().height());

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
                Wanok::get()->project()->gameDatas()->skillsDatas()->model()
                ->invisibleRootItem(), m_battleCommand.idSkill());
    SuperListItem::fillComboBox(ui->comboBoxSkill, Wanok::get()->project()
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
                                   Wanok::get()->project()->gameDatas()
                                   ->skillsDatas()->model(), index));
    m_battleCommand.updateName();
}
