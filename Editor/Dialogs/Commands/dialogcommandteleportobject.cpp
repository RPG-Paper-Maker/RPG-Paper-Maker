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
    ui->comboBoxDirection->addItem(RPM::translate(Translations::UNCHANGED));
    ui->comboBoxDirection->addItem(RPM::translate(Translations::SOUTH));
    ui->comboBoxDirection->addItem(RPM::translate(Translations::WEST));
    ui->comboBoxDirection->addItem(RPM::translate(Translations::NORTH));
    ui->comboBoxDirection->addItem(RPM::translate(Translations::EAST));
    ui->comboBoxTransitionStart->addItem(RPM::translate(Translations::NONE));
    ui->comboBoxTransitionStart->addItem(RPM::translate(Translations::FADE_IN) +
        RPM::DOT_DOT_DOT);
    ui->comboBoxTransitionStart->addItem(RPM::translate(Translations::ZOOM_IN));
    ui->comboBoxTransitionEnd->addItem(RPM::translate(Translations::NONE));
    ui->comboBoxTransitionEnd->addItem(RPM::translate(Translations::FADE_OUT) +
        RPM::DOT_DOT_DOT);
    ui->comboBoxTransitionEnd->addItem(RPM::translate(Translations::ZOOM_OUT));
    ui->panelPrimitiveValueTransitionColorStart->initializeDataBaseCommandId(
        RPM::get()->project()->gameDatas()->systemDatas()->modelColors(),
        m_parameters, m_properties);
    ui->panelPrimitiveValueTransitionColorStart->showDataBase();
    ui->panelPrimitiveValueTransitionColorEnd->initializeDataBaseCommandId(
        RPM::get()->project()->gameDatas()->systemDatas()->modelColors(),
        m_parameters, m_properties);
    ui->panelPrimitiveValueTransitionColorEnd->showDataBase();
}

// -------------------------------------------------------

void DialogCommandTeleportObject::translate()
{
    this->setWindowTitle(RPM::translate(Translations::TELEPORT_OBJECT) + RPM
        ::DOT_DOT_DOT);
    ui->labelObjectID->setText(RPM::translate(Translations::OBJECT_ID) + RPM
        ::COLON);
    ui->groupBoxPosition->setTitle(RPM::translate(Translations::POSITION));
    ui->groupBoxTransition->setTitle(RPM::translate(Translations::TRANSITION));
    ui->labelDirection->setText(RPM::translate(Translations::DIRECTION) + RPM::COLON);
    ui->labelStart->setText(RPM::translate(Translations::START) + RPM::COLON);
    ui->labelEnd->setText(RPM::translate(Translations::END) + RPM::COLON);
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

    // Transition
    command.append(QString::number(ui->comboBoxDirection->currentIndex()));
    int index = ui->comboBoxTransitionStart->currentIndex();
    command.append(QString::number(index));
    if (index == 1)
        ui->panelPrimitiveValueTransitionColorStart->getCommand(command);
    index = ui->comboBoxTransitionEnd->currentIndex();
    command.append(QString::number(index));
    if (index == 1)
        ui->panelPrimitiveValueTransitionColorEnd->getCommand(command);

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

    // Transition
    ui->comboBoxDirection->setCurrentIndex(command->valueCommandAt(i++).toInt());
    int type = command->valueCommandAt(i++).toInt();
    ui->comboBoxTransitionStart->setCurrentIndex(type);
    if (type == 1)
        ui->panelPrimitiveValueTransitionColorStart->initializeCommand(command, i);
    type = command->valueCommandAt(i++).toInt();
    ui->comboBoxTransitionEnd->setCurrentIndex(type);
    if (type == 1)
        ui->panelPrimitiveValueTransitionColorEnd->initializeCommand(command, i);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandTeleportObject::on_comboBoxTransitionStart_currentIndexChanged(
    int index)
{
    ui->panelPrimitiveValueTransitionColorStart->setEnabled(index == 1);
}

//--------------------------------------------

void DialogCommandTeleportObject::on_comboBoxTransitionEnd_currentIndexChanged(
    int index)
{
    ui->panelPrimitiveValueTransitionColorEnd->setEnabled(index == 1);
}
