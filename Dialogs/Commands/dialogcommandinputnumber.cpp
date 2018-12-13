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

#include "dialogcommandinputnumber.h"
#include "ui_dialogcommandinputnumber.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandInputNumber::DialogCommandInputNumber(EventCommand *command,
                                                   QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandInputNumber)
{
    ui->setupUi(this);
    
    ui->widgetVariable->initialize();

    if (command != nullptr) initialize(command);
}

DialogCommandInputNumber::~DialogCommandInputNumber()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandInputNumber::initialize(EventCommand* command){
    ui->widgetVariable->setCurrentId(command->valueCommandAt(0).toInt());
}

// -------------------------------------------------------

EventCommand* DialogCommandInputNumber::getCommand() const{
    QVector<QString> command;
    command.append(QString::number(ui->widgetVariable->currentId()));

    return new EventCommand(EventCommandKind::InputNumber, command);
}
