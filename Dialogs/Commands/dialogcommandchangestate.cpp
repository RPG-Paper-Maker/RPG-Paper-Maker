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

#include "dialogcommandchangestate.h"
#include "ui_dialogcommandchangestate.h"
#include "main.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeState::DialogCommandChangeState(
        EventCommand *command,
        SystemCommonObject* object,
        QStandardItemModel* parameters,
        QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandChangeState),
    m_object(object),
    m_parameters(parameters)
{
    ui->setupUi(this);

    initializeStateId();
    if(command != nullptr) initialize(command);
}

DialogCommandChangeState::~DialogCommandChangeState()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeState::initializeStateId(){
    QStandardItemModel* dataBase = nullptr;
    QStandardItemModel* properties = nullptr;
    if (m_object != nullptr){
        dataBase = m_object->modelStates();
        // TODO : properties
    }
    ui->widgetStateId->initializeDataBaseCommandId(dataBase, m_parameters,
                                                   properties);
}

// -------------------------------------------------------

void DialogCommandChangeState::initialize(EventCommand* command){
    int i = 0;

    ui->widgetStateId->initializeCommand(command,i);
    int action = command->valueCommandAt(i++).toInt();
    switch(action){
    case 0:
        ui->radioButtonReplace->setChecked(true); break;
    case 1:
        ui->radioButtonAdd->setChecked(true); break;
    case 2:
        ui->radioButtonRemove->setChecked(true); break;
    }
}

// -------------------------------------------------------

EventCommand* DialogCommandChangeState::getCommand() const{
    QVector<QString> command;
    selectionState(command);
    operation(command);

    return new EventCommand(EventCommandKind::ChangeState, command);
}

// -------------------------------------------------------

void DialogCommandChangeState::selectionState(QVector<QString>& command) const{
    ui->widgetStateId->getCommand(command);
}

// -------------------------------------------------------

void DialogCommandChangeState::operation(QVector<QString>& command) const{
    if (ui->radioButtonReplace->isChecked()) command.append("0");
    else if (ui->radioButtonAdd->isChecked()) command.append("1");
    else if (ui->radioButtonRemove->isChecked()) command.append("2");
}



