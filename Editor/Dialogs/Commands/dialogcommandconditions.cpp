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
#include "rpm.h"

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
    ui->comboBoxVariableOperation->addItems(RPM::ENUM_TO_STRING_OPERATION);

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
    int i;

    i = 0;
    ui->checkBox->setChecked(command->valueCommandAt(i++) == "1");
    ui->tabWidget->setCurrentIndex(command->valueCommandAt(i++).toInt());
    ui->widgetVariableVariable->setCurrentId(command->valueCommandAt(i++)
                                             .toInt());
    ui->comboBoxVariableOperation->setCurrentIndex(command
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
    command.append(QString::number(ui->comboBoxVariableOperation->currentIndex()));
    ui->widgetVariableVariableConstant->getCommand(command);

    return new EventCommand(EventCommandKind::If, command);
}
