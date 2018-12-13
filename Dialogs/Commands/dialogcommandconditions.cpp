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
    ui->widgetVariableVariable->setCurrentId(command->valueCommandAt(i++)
                                             .toInt());
    ui->widgetVariableOperation->setCurrentIndex(command
                                                 ->valueCommandAt(i++)
                                                 .toInt());
    ui->widgetVariableVariableConstant->initializeCommand(command, i);
}

// -------------------------------------------------------

EventCommand* DialogCommandConditions::getCommand() const{
    QVector<QString> command;
    command.append(ui->checkBox->isChecked() ? "1" : "0");
    command.append("0"); // Page
    command.append(QString::number(ui->widgetVariableVariable
                                   ->currentId()));
    command.append(ui->widgetVariableOperation->operation());
    ui->widgetVariableVariableConstant->getCommand(command);

    return new EventCommand(EventCommandKind::If, command);
}
