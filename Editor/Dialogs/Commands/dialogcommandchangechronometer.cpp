/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangechronometer.h"
#include "ui_dialogcommandchangechronometer.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeChronometer::DialogCommandChangeChronometer(EventCommand
    *command, QStandardItemModel *properties, QStandardItemModel *parameters,
    QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandChangeChronometer),
    m_properties(properties),
    m_parameters(parameters)
{
    ui->setupUi(this);
    this->initializePrimitives();
    if (command != nullptr)
    {
        this->initialize(command);
    }
    this->translate();
}

DialogCommandChangeChronometer::~DialogCommandChangeChronometer()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeChronometer::initializePrimitives()
{
    ui->panelPrimitiveChronometerID->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveChronometerID->setKind(PrimitiveValueKind::Variable);
    ui->panelPrimitiveChronometerID->setNumberValue(1);
    ui->panelPrimitiveTime->initializeNumber(m_parameters, m_properties, false);
    ui->panelPrimitiveTime->setNumberDoubleValue(1.0);
    ui->panelPrimitiveStockValue->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveStockValue->setKind(PrimitiveValueKind::Variable);
    ui->panelPrimitiveStockValue->setNumberValue(1);
    ui->checkBoxStockValue->setVisible(false);
    ui->panelPrimitiveStockValue->setVisible(false);

    // Keep space when hiding widgets
    QSizePolicy sp_retain;
    QList<QWidget *> widgetList = QList<QWidget*>({ui->labelTime, ui
        ->panelPrimitiveTime, ui->labelSeconds, ui->checkBoxDisplayOnScreen, ui
        ->checkBoxStockValue, ui->panelPrimitiveStockValue});
    for (int i = 0; i < widgetList.size(); i++)
    {
        sp_retain = widgetList[i]->sizePolicy();
        sp_retain.setRetainSizeWhenHidden(true);
        widgetList[i]->setSizePolicy(sp_retain);
    }
}

// -------------------------------------------------------

void DialogCommandChangeChronometer::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_CHRONOMETER) +
        RPM::DOT_DOT_DOT);
    ui->labelChronometerID->setText(RPM::translate(Translations::STOCK_CHRONOMETER_ID_IN_VARIABLE_ID) +
        RPM::COLON);
    ui->groupBoxOperation->setTitle(RPM::translate(Translations::OPERATION));
    ui->radioButtonStart->setText(RPM::translate(Translations::START));
    ui->radioButtonPause->setText(RPM::translate(Translations::PAUSE));
    ui->radioButtonContinue->setText(RPM::translate(Translations::CONTINUE));
    ui->radioButtonStop->setText(RPM::translate(Translations::STOP));
    ui->labelTime->setText(RPM::translate(Translations::TIME) + RPM::COLON);
    ui->labelSeconds->setText(RPM::translate(Translations::SECONDS));
    ui->checkBoxDisplayOnScreen->setText(RPM::translate(Translations::DISPLAY_ON_SCREEN));
    ui->checkBoxStockValue->setText(RPM::translate(Translations::STOCK_CURRENT_CHRONOMETER_VALUE_IN_VARIABLE_ID) +
        RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandChangeChronometer::getCommand() const
{
    QVector<QString> command;
    ui->panelPrimitiveChronometerID->getCommand(command);
    if (ui->radioButtonStart->isChecked())
    {
        command.append("0");
        ui->panelPrimitiveTime->getCommand(command);
        command.append(RPM::boolToString(ui->checkBoxDisplayOnScreen->isChecked()));
    } else if (ui->radioButtonPause->isChecked())
    {
        command.append("1");
    } else if (ui->radioButtonContinue->isChecked())
    {
        command.append("2");
    } else if (ui->radioButtonStop->isChecked())
    {
        command.append("3");
    }
    if (!ui->radioButtonStart->isChecked())
    {
        command.append(RPM::boolToString(ui->checkBoxStockValue->isChecked()));
        if (ui->checkBoxStockValue->isChecked())
        {
            ui->panelPrimitiveStockValue->getCommand(command);
        }
    }
    return new EventCommand(EventCommandKind::ChangeChronometer, command);
}

// -------------------------------------------------------

void DialogCommandChangeChronometer::initialize(EventCommand *command)
{
    int i = 0;
    ui->panelPrimitiveChronometerID->initializeCommand(command, i);
    switch (command->valueCommandAt(i++).toInt())
    {
    case 0:
        ui->radioButtonStart->setChecked(true);
        ui->panelPrimitiveTime->initializeCommand(command, i);
        ui->checkBoxDisplayOnScreen->setChecked(RPM::stringToBool(command->valueCommandAt(i++)));
        break;
    case 1:
        ui->radioButtonPause->setChecked(true);
        break;
    case 2:
        ui->radioButtonContinue->setChecked(true);
        break;
    case 3:
        ui->radioButtonStop->setChecked(true);
        break;
    }
    if (!ui->radioButtonStart->isChecked())
    {
        ui->checkBoxStockValue->setChecked(RPM::stringToBool(command->valueCommandAt(i++)));
        if (ui->checkBoxStockValue->isChecked())
        {
            ui->panelPrimitiveStockValue->initializeCommand(command, i);
        }
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandChangeChronometer::on_radioButtonStart_toggled(bool checked)
{
    ui->labelChronometerID->setText(RPM::translate(checked ? Translations
        ::STOCK_CHRONOMETER_ID_IN_VARIABLE_ID : Translations::CHRONOMETER_ID) +
        RPM::COLON);
    ui->labelTime->setVisible(checked);
    ui->panelPrimitiveTime->setVisible(checked);
    ui->labelSeconds->setVisible(checked);
    ui->checkBoxDisplayOnScreen->setVisible(checked);
    ui->checkBoxStockValue->setVisible(!checked);
    ui->panelPrimitiveStockValue->setVisible(!checked);
}
