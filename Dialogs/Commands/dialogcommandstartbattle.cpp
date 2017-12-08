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

#include "dialogcommandstartbattle.h"
#include "ui_dialogcommandstartbattle.h"
#include "eventcommandkind.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandStartBattle::DialogCommandStartBattle(EventCommand* command,
                                                   QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandStartBattle)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());

    // Initialize widgets
    SuperListItem::fillComboBox(ui->comboBoxDB, Wanok::get()->project()
                                ->gameDatas()->troopsDatas()->model());
    ui->widgetVariableConstant->initializeNumberVariable();

    if (command != nullptr) initialize(command);
}

DialogCommandStartBattle::~DialogCommandStartBattle()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandStartBattle::initialize(EventCommand* command){
    int i = 0;

    // Options
    ui->checkBoxEscape->setChecked(command->valueCommandAt(i++) == "1");
    ui->checkBoxGameOver->setChecked(command->valueCommandAt(i++) == "1");

    // Troop's ID
    int type = command->valueCommandAt(i++).toInt();
    switch(type){
    case 0:
        ui->radioButtonDB->setChecked(true);
        ui->comboBoxDB->setCurrentIndex(
                    SuperListItem::getIndexById(
                        Wanok::get()->project()->gameDatas()->troopsDatas()
                        ->model()->invisibleRootItem(),
                        command->valueCommandAt(i++).toInt()));
        break;
    case 1:
        ui->radioButtonVariableConstant->setChecked(true);
        ui->widgetVariableConstant->initializeCommand(command, i);
        break;
    case 2:
        ui->radioButtonRandom->setChecked(true);
        break;
    }
}

// -------------------------------------------------------

EventCommand* DialogCommandStartBattle::getCommand() const{
    QVector<QString> command;

    // Options
    command.append(ui->checkBoxEscape->isChecked() ? "1" : "0");
    command.append(ui->checkBoxGameOver->isChecked() ? "1" : "0");

    // Troop's ID
    if (ui->radioButtonDB->isChecked()){
        command.append("0");
        QStandardItem* model = Wanok::get()->project()->gameDatas()
                ->troopsDatas()->model()->item(ui->comboBoxDB->currentIndex());
        command.append(QString::number(((SuperListItem*)model->data()
                                        .value<qintptr>())->id()));
    }
    else if (ui->radioButtonVariableConstant->isChecked()){
        command.append("1");
        ui->widgetVariableConstant->getCommand(command);
    }
    else if (ui->radioButtonRandom->isChecked()){
        command.append("2");
    }

    return new EventCommand(EventCommandKind::StartBattle, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandStartBattle::on_radioButtonDB_toggled(bool checked){
    ui->comboBoxDB->setEnabled(checked);
}

void DialogCommandStartBattle::on_radioButtonVariableConstant_toggled(bool checked){
    ui->widgetVariableConstant->setEnabled(checked);
}
