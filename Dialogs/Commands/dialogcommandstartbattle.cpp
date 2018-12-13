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
    SystemCommonObject* object, QStandardItemModel* parameters, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandStartBattle),
    m_object(object),
    m_parameters(parameters)
{
    ui->setupUi(this);

    // Initialize widgets
    ui->widgetVariableConstant->initializeDataBaseCommandId(Wanok::get()
        ->project()->gameDatas()->troopsDatas()->model(), m_parameters, nullptr);
    ui->panelPrimitiveValueIDBattleMap->initializeDataBaseCommandId(Wanok::get()
        ->project()->gameDatas()->battleSystemDatas()->modelBattleMaps(),
        m_parameters, nullptr);
    ui->widgetIdMap->initializeNumber(parameters, nullptr);
    ui->widgetX->initializeNumber(parameters, nullptr);
    ui->widgetY->initializeNumber(parameters, nullptr);
    ui->widgetYplus->initializeNumber(parameters, nullptr);
    ui->widgetZ->initializeNumber(parameters, nullptr);

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
        ui->radioButtonVariableConstant->setChecked(true);
        ui->widgetVariableConstant->initializeCommand(command, i);
        break;
    case 1:
        ui->radioButtonRandom->setChecked(true);
        break;
    }

    // Battle map
    type = command->valueCommandAt(i++).toInt();
    switch(type){
    case 0:
        ui->radioButtonID->setChecked(true);
        ui->panelPrimitiveValueIDBattleMap->initializeCommand(command, i);
        break;
    case 1:
        ui->radioButtonSelect->setChecked(true);
        ui->panelSelectPosition->initialize(command, i);
        break;
    case 2:
        ui->radioButtonNumber->setChecked(true);
        ui->widgetIdMap->initializeCommand(command, i);
        ui->widgetX->initializeCommand(command, i);
        ui->widgetY->initializeCommand(command, i);
        ui->widgetYplus->initializeCommand(command, i);
        ui->widgetZ->initializeCommand(command, i);
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
    if (ui->radioButtonVariableConstant->isChecked()){
        command.append("0");
        ui->widgetVariableConstant->getCommand(command);
    }
    else if (ui->radioButtonRandom->isChecked()){
        command.append("1");
    }

    // Battle map
    if (ui->radioButtonID->isChecked()){
        command.append("0");
        ui->panelPrimitiveValueIDBattleMap->getCommand(command);
    }
    else if (ui->radioButtonSelect->isChecked()) {
        command.append("1");
        ui->panelSelectPosition->getCommand(command);
    }
    else if (ui->radioButtonNumber->isChecked()){
        command.append("2");
        ui->widgetIdMap->getCommand(command);
        ui->widgetX->getCommand(command);
        ui->widgetY->getCommand(command);
        ui->widgetYplus->getCommand(command);
        ui->widgetZ->getCommand(command);
    }

    return new EventCommand(EventCommandKind::StartBattle, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandStartBattle::on_radioButtonVariableConstant_toggled(bool checked)
{
    ui->widgetVariableConstant->setEnabled(checked);
}

//--------------------------------------------

void DialogCommandStartBattle::on_radioButtonID_toggled(bool checked){
    ui->panelPrimitiveValueIDBattleMap->setEnabled(checked);
}

//--------------------------------------------

void DialogCommandStartBattle::on_radioButtonSelect_toggled(bool checked){
    ui->panelSelectPosition->setEnabled(checked);
}

//--------------------------------------------

void DialogCommandStartBattle::on_radioButtonNumber_toggled(bool checked){
    ui->label_7->setEnabled(checked);
    ui->label_8->setEnabled(checked);
    ui->label_9->setEnabled(checked);
    ui->label_10->setEnabled(checked);
    ui->label_11->setEnabled(checked);
    ui->widgetIdMap->setEnabled(checked);
    ui->widgetX->setEnabled(checked);
    ui->widgetY->setEnabled(checked);
    ui->widgetYplus->setEnabled(checked);
    ui->widgetZ->setEnabled(checked);
}
