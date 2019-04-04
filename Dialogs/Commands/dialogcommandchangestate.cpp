/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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



