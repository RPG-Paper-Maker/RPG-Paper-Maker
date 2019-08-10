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

DialogCommandConditions::DialogCommandConditions(EventCommand *command,
    SystemCommonObject *object, QStandardItemModel *parameters, bool hideElse,
    QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandConditions)
{
    ui->setupUi(this);

    if (hideElse) {
        ui->checkBox->hide();
    }

    this->initializePrimitives(object, parameters);

    if (command != nullptr) {
        initialize(command);
    }
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

void DialogCommandConditions::initializePrimitives(SystemCommonObject *object,
    QStandardItemModel *parameters)
{
    QStandardItemModel *properties;

    properties = object == nullptr ? nullptr : object->modelProperties();
    ui->panelPrimitiveVariableParamPropValue->initializeVariableParamProp(
        parameters, properties);
    ui->panelPrimitiveVariableParamPropValue->showVariable();
    ui->comboBoxVariableOperation->addItems(RPM::ENUM_TO_STRING_OPERATION);
    ui->panelPrimitiveVariableParamPropTestValue->initializeProperty(parameters,
        properties);
    ui->panelPrimitiveVariableParamPropTestValue->showNumberDouble();
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandConditions::initialize(EventCommand *command) {
    int i, radioIndex, tabIndex;

    i = 0;
    ui->checkBox->setChecked(command->valueCommandAt(i++) == "1");
    radioIndex = command->valueCommandAt(i++).toInt();
    tabIndex = 0;
    switch (radioIndex) {
    case 0:
        ui->radioButtonVariableParamProp->setChecked(true);
        ui->panelPrimitiveVariableParamPropValue->initializeCommand(command, i);
        ui->comboBoxVariableOperation->setCurrentIndex(command->valueCommandAt(
            i++).toInt());
        ui->panelPrimitiveVariableParamPropTestValue->initializeCommand(command,
            i);
        break;
    default:
        break;
    }
    ui->tabWidget->setCurrentIndex(tabIndex);
}

// -------------------------------------------------------

EventCommand* DialogCommandConditions::getCommand() const {
    QVector<QString> command;

    command.append(ui->checkBox->isChecked() ? RPM::TRUE_BOOL_STRING : RPM
        ::FALSE_BOOL_STRING);
    if (ui->radioButtonVariableParamProp->isChecked()) {
        command.append("0");
    }
    ui->panelPrimitiveVariableParamPropValue->getCommand(command);
    command.append(QString::number(ui->comboBoxVariableOperation->currentIndex()));
    ui->panelPrimitiveVariableParamPropTestValue->getCommand(command);

    return new EventCommand(EventCommandKind::If, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonVariableParamProp_clicked(bool
    checked)
{
    // Impossible to uncheck manually
    if (!checked) {
        ui->radioButtonVariableParamProp->setChecked(true);
    }
}
