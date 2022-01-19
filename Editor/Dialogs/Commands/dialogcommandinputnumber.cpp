/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

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
    QStandardItemModel *properties, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandInputNumber),
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

DialogCommandInputNumber::~DialogCommandInputNumber()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandInputNumber::initializePrimitives()
{
    ui->panelPrimitiveStockVariableID->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveStockVariableID->setKind(PrimitiveValueKind::Variable);
    ui->panelPrimitiveStockVariableID->setNumberValue(1);
    ui->panelPrimitiveDigits->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveDigits->setNumberValue(3);
}

// -------------------------------------------------------

void DialogCommandInputNumber::translate()
{
    this->setWindowTitle(RPM::translate(Translations::INPUT_NUMBER) + RPM
        ::DOT_DOT_DOT);
    ui->labelStockInVariableID->setText(RPM::translate(Translations
        ::STOCK_VALUE_IN_VARIABLE_ID) + RPM::COLON);
    ui->labelDigits->setText(RPM::translate(Translations::DIGITS) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand* DialogCommandInputNumber::getCommand() const
{
    QVector<QString> command;
    ui->panelPrimitiveStockVariableID->getCommand(command);
    ui->panelPrimitiveDigits->getCommand(command);
    return new EventCommand(EventCommandKind::InputNumber, command);
}

// -------------------------------------------------------

void DialogCommandInputNumber::initialize(EventCommand *command)
{
    int i = 0;
    ui->panelPrimitiveStockVariableID->initializeCommand(command, i);
    ui->panelPrimitiveDigits->initializeCommand(command, i);
}
