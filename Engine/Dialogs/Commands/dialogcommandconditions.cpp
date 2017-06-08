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

#include "dialogcommandconditions.h"
#include "ui_dialogcommandconditions.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandConditions::DialogCommandConditions(EventCommand* command,
                                                 bool hideElse,
                                                 QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandConditions)
{
    ui->setupUi(this);

    if (hideElse) ui->checkBox->hide();

    ui->widgetVariableVariable->initialize();
    ui->widgetVariableVariableConstant->initializeNumberVariable();

    ui->widgetSwitch->setVariable(false);
    ui->widgetSwitch->initialize();

    if (command != nullptr) initialize(command);
}

DialogCommandConditions::~DialogCommandConditions()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandConditions::initialize(EventCommand* command){
    int i = 0;
    ui->checkBox->setChecked(command->valueCommandAt(i++) == "1");
    ui->tabWidget->setCurrentIndex(command->valueCommandAt(i++).toInt());
    switch(command->valueCommandAt(i++).toInt()){
    case 0:
        ui->radioButtonSwitch->setChecked(true);
        ui->widgetSwitch->setCurrentId(command->valueCommandAt(i++).toInt());
        ui->comboBoxSwitch->setCurrentIndex(command->valueCommandAt(i++)
                                            .toInt());
        break;
    case 1:
        // TODO
        break;
    case 2:
        ui->radioButtonVariable->setChecked(true);
        ui->widgetVariableVariable->setCurrentId(command->valueCommandAt(i++)
                                                 .toInt());
        ui->widgetVariableOperation->setCurrentIndex(command
                                                     ->valueCommandAt(i++)
                                                     .toInt());
        ui->widgetVariableVariableConstant->initializeCommand(command, i);
    }
}

// -------------------------------------------------------

EventCommand* DialogCommandConditions::getCommand() const{
    QVector<QString> command;
    command.append(ui->checkBox->isChecked() ? "1" : "0");
    command.append("0"); // Page

    if(ui->radioButtonSwitch->isChecked()){
        command.append("0"); // Type switch
        command.append(QString::number(ui->widgetSwitch->currentId()));
        command.append(QString::number(ui->comboBoxSwitch->currentIndex()));
    }else{
        command.append("2"); // Type variable
        command.append(QString::number(ui->widgetVariableVariable
                                       ->currentId()));
        command.append(ui->widgetVariableOperation->operation());
        ui->widgetVariableVariableConstant->getCommand(command);
    }

    return new EventCommand(EventCommandKind::If, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonSwitch_toggled(bool checked){
    ui->widgetSwitch->setEnabled(checked);
    ui->labelSwitch->setEnabled(checked);
    ui->comboBoxSwitch->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonLocalSwitch_toggled(bool checked){
    ui->widgetLocalSwitches->setEnabled(checked);
    ui->labelLocalSwitch->setEnabled(checked);
    ui->comboBoxLocalSwitch->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonVariable_toggled(bool checked){
    ui->widgetVariableVariable->setEnabled(checked);
    ui->labelVariable->setEnabled(checked);
    ui->widgetVariableOperation->setEnabled(checked);
    ui->widgetVariableVariableConstant->setEnabled(checked);
}
