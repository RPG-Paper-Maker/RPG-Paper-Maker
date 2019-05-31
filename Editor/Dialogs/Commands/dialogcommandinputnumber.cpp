/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
