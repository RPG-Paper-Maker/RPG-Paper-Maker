/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandinputnumber.h"
#include "ui_dialogcommandinputnumber.h"
#include "rpm.h"

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

    this->translate();
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

//-------------------------------------------------

void DialogCommandInputNumber::translate()
{
    this->setWindowTitle(RPM::translate(Translations::NEW_PROJECT));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

void DialogCommandInputNumber::initialize(EventCommand* command){
    ui->widgetVariable->setCurrentId(command->valueCommandAt(0).toInt());
}

// -------------------------------------------------------

EventCommand* DialogCommandInputNumber::getCommand() const{
    QVector<QString> command;
    command.append(QString::number(ui->widgetVariable->currentId()));

    return new EventCommand(EventCommandKind::InputNumber, command);
}
