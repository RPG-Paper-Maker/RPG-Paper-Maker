/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandcreateobjectinmap.h"
#include "ui_dialogcommandcreateobjectinmap.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandCreateObjectInMap::DialogCommandCreateObjectInMap(EventCommand
    *command, QStandardItemModel *properties, QStandardItemModel *parameters,
    QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandCreateObjectInMap),
    m_properties(properties),
    m_parameters(parameters)
{
    ui->setupUi(this);
    this->initializePrimitives();
    if (command != nullptr)
    {
        initialize(command);
    }
    this->translate();
}

DialogCommandCreateObjectInMap::~DialogCommandCreateObjectInMap()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandCreateObjectInMap::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CREATE_OBJECT_IN_MAP) +
        RPM::DOT_DOT_DOT);
    ui->labelModelID->setText(RPM::translate(Translations::NEW_OBJECT_MODEL_ID)
        + RPM::COLON);
    ui->checkBoxStock->setText(RPM::translate(Translations::STOCK_ID_IN_VARIABLE_ID)
        + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------

void DialogCommandCreateObjectInMap::initializePrimitives()
{
    ui->panelPosition->initializePrimitives(m_properties, m_parameters);
    ui->panelPrimitiveModelID->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->commonEventsDatas()->modelCommonObjects(), m_parameters,
        m_properties);
    ui->panelPrimitiveStock->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveStock->setKind(PrimitiveValueKind::Variable);
    ui->panelPrimitiveStock->setNumberValue(1);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandCreateObjectInMap::initialize(EventCommand* command)
{
    int i = 0;
    ui->panelPrimitiveModelID->initializeCommand(command, i);
    ui->panelPosition->initializeCommand(command, i);
    if (RPM::stringToBool(command->valueCommandAt(i++)))
    {
        ui->checkBoxStock->setChecked(true);
        ui->panelPrimitiveStock->initializeCommand(command, i);
    }
}

// -------------------------------------------------------

EventCommand * DialogCommandCreateObjectInMap::getCommand() const
{
    QVector<QString> command;
    ui->panelPrimitiveModelID->getCommand(command);
    ui->panelPosition->getCommand(command);
    command.append(RPM::boolToString(ui->checkBoxStock->isChecked()));
    if (ui->checkBoxStock->isChecked())
    {
        ui->panelPrimitiveStock->getCommand(command);
    }
    return new EventCommand(EventCommandKind::CreateObjectInMap, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandCreateObjectInMap::on_checkBoxStock_toggled(bool checked)
{
    ui->panelPrimitiveStock->setEnabled(checked);
}
