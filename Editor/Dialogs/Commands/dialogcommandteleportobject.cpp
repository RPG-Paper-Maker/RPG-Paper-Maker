/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandteleportobject.h"
#include "ui_dialogcommandteleportobject.h"
#include "dialogselectposition.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandTeleportObject::DialogCommandTeleportObject(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandTeleportObject),
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

DialogCommandTeleportObject::~DialogCommandTeleportObject()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandTeleportObject::initializePrimitives()
{
    ui->panelPosition->initializePrimitives(m_properties, m_parameters);
    ui->widgetObjectID->initializeDataBaseCommandId(ui->panelPosition->modelObjects(),
        m_parameters, m_properties);
    ui->widgetObjectID->setNumberValue(0);
}

// -------------------------------------------------------

void DialogCommandTeleportObject::translate()
{
    this->setWindowTitle(RPM::translate(Translations::TELEPORT_OBJECT) + RPM
        ::DOT_DOT_DOT);
    ui->labelObjectID->setText(RPM::translate(Translations::OBJECT_ID) + RPM
        ::COLON);
    ui->groupBoxOptions->setTitle(RPM::translate(Translations::POSITION));
    ui->groupBoxPosition->setTitle(RPM::translate(Translations::POSITION));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------

EventCommand * DialogCommandTeleportObject::getCommand() const
{
    QVector<QString> command;

    // Object ID
    ui->widgetObjectID->getCommand(command);

    // Position
    ui->panelPosition->getCommand(command);

    // Options
    command.append(QString::number(ui->comboBoxDirection->currentIndex()));
    command.append(QString::number(ui->comboBoxShadinBefore->currentIndex()));
    command.append(QString::number(ui->comboBoxShadingAfter->currentIndex()));

    return new EventCommand(EventCommandKind::TeleportObject, command);
}

// -------------------------------------------------------

void DialogCommandTeleportObject::initialize(EventCommand *command)
{
    int i = 0;

    // Object ID
    ui->widgetObjectID->initializeCommand(command, i);

    // Position
    ui->panelPosition->initializeCommand(command, i);

    // Options
    ui->comboBoxDirection->setCurrentIndex(command->valueCommandAt(i++).toInt());
    ui->comboBoxShadinBefore->setCurrentIndex(command->valueCommandAt(i++).toInt());
    ui->comboBoxShadingAfter->setCurrentIndex(command->valueCommandAt(i++).toInt());
}
