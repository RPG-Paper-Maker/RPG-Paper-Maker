/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "panelposition.h"
#include "ui_panelposition.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelPosition::PanelPosition(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelPosition)
{
    ui->setupUi(this);
    this->translate();
}

PanelPosition::~PanelPosition()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelPosition::getCommand(QVector<QString> &command) const
{
    if (ui->radioButtonSelect->isChecked())
    {
        command.append("0");
        ui->panelSelectPosition->getCommand(command);
    } else if (ui->radioButtonNumber->isChecked())
    {
        command.append("1");
        ui->widgetIdMap->getCommand(command);
        ui->widgetX->getCommand(command);
        ui->widgetY->getCommand(command);
        ui->widgetYplus->getCommand(command);
        ui->widgetZ->getCommand(command);
    } else if (ui->radioButtonObject->isChecked())
    {
        command.append("2");
        ui->widgetObjectIDPosition->getCommand(command);
    }
}

// -------------------------------------------------------

void PanelPosition::initializePrimitives(QStandardItemModel *modelObjects,
    QStandardItemModel *properties, QStandardItemModel *parameters)
{
    ui->widgetIdMap->initializeNumber(parameters, properties);
    ui->widgetX->initializeNumber(parameters, properties);
    ui->widgetY->initializeNumber(parameters, properties);
    ui->widgetYplus->initializeNumber(parameters, properties);
    ui->widgetZ->initializeNumber(parameters, properties);
    ui->widgetObjectIDPosition->initializeDataBaseCommandId(modelObjects,
        parameters, properties);
}

// -------------------------------------------------------

void PanelPosition::initialize(EventCommand *command, int &i)
{
    switch (command->valueCommandAt(i++).toInt())
    {
    case 0:
        ui->radioButtonSelect->setChecked(true);
        ui->panelSelectPosition->initialize(command, i);
        break;
    case 1:
        ui->radioButtonNumber->setChecked(true);
        ui->widgetIdMap->initializeCommand(command, i);
        ui->widgetX->initializeCommand(command, i);
        ui->widgetY->initializeCommand(command, i);
        ui->widgetYplus->initializeCommand(command, i);
        ui->widgetZ->initializeCommand(command, i);
        break;
    case 2:
        ui->radioButtonObject->setChecked(true);
        ui->widgetObjectIDPosition->initializeCommand(command, i);
        break;
    }
}

// -------------------------------------------------------

void PanelPosition::translate()
{
    ui->labelX->setText(RPM::translate(Translations::X) + RPM::COLON);
    ui->labelY->setText(RPM::translate(Translations::Y) + RPM::COLON);
    ui->labelZ->setText(RPM::translate(Translations::Z) + RPM::COLON);
    ui->labelIDMap->setText(RPM::translate(Translations::MAP_ID) + RPM::COLON);
    ui->labelYPlus->setText(RPM::translate(Translations::Y_PLUS) + RPM::COLON);
    ui->radioButtonObject->setText(RPM::translate(Translations::OBJECT_ID) + RPM::COLON);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelPosition::on_radioButtonSelect_toggled(bool checked)
{
    ui->panelSelectPosition->setEnabled(checked);
}

// -------------------------------------------------------

void PanelPosition::on_radioButtonNumber_toggled(bool checked)
{
    ui->labelIDMap->setEnabled(checked);
    ui->labelX->setEnabled(checked);
    ui->labelY->setEnabled(checked);
    ui->labelYPlus->setEnabled(checked);
    ui->labelZ->setEnabled(checked);
    ui->widgetIdMap->setEnabled(checked);
    ui->widgetX->setEnabled(checked);
    ui->widgetY->setEnabled(checked);
    ui->widgetYplus->setEnabled(checked);
    ui->widgetZ->setEnabled(checked);
}

// -------------------------------------------------------

void PanelPosition::on_radioButtonObject_toggled(bool checked)
{
    ui->widgetObjectIDPosition->setEnabled(checked);
}
