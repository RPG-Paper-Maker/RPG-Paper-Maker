/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangestate.h"
#include "ui_dialogcommandchangestate.h"
#include "rpm.h"

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

    this->translate();
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
        properties = m_object->modelProperties();
    }
    ui->widgetStateId->initializeDataBaseCommandId(dataBase, m_parameters,
                                                   properties);
}

//-------------------------------------------------

void DialogCommandChangeState::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_STATE) + RPM
        ::DOT_DOT_DOT);
    ui->labelStateID->setText(RPM::translate(Translations::STATE_ID) + RPM
        ::COLON);
    ui->radioButtonAdd->setText(RPM::translate(Translations::ADD));
    ui->radioButtonRemove->setText(RPM::translate(Translations::REMOVE));
    ui->radioButtonReplace->setText(RPM::translate(Translations::REPLACE));
    ui->groupBoxOperation->setTitle(RPM::translate(Translations::OPERATION));
    ui->groupBoxSelection->setTitle(RPM::translate(Translations::SELECTION));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
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



