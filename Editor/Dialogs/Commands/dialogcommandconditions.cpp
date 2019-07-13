/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
