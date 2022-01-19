/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangeclass.h"
#include "ui_dialogcommandchangeclass.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeClass::DialogCommandChangeClass(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters,
    QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandChangeClass),
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

DialogCommandChangeClass::~DialogCommandChangeClass()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeClass::initializePrimitives()
{
    ui->panelPrimitiveClassID->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->classesDatas()->model(), m_parameters, m_properties);
    ui->panelPrimitiveHeroEnemyInstanceID->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveHeroEnemyInstanceID->setKind(PrimitiveValueKind::Variable);
    ui->panelPrimitiveHeroEnemyInstanceID->setNumberValue(1);
    ui->comboBoxTeam->addItems(RPM::ENUM_TO_STRING_TEAM);
}

// -------------------------------------------------------

void DialogCommandChangeClass::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_CLASS) + RPM::DOT_DOT_DOT);
    ui->labelClassID->setText(RPM::translate(Translations::CLASS_ID) + RPM::COLON);
    ui->groupBoxSelection->setTitle(RPM::translate(Translations::SELECTION));
    ui->radioButtonHeroEnemyInstanceID->setText(RPM::translate(Translations
        ::HERO_ENEMY_INSTANCE_ID) + RPM::COLON);
    ui->radioButtonEntire->setText(RPM::translate(Translations::THE_ENTIRE));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandChangeClass::getCommand() const
{
    QVector<QString> command;
    ui->panelPrimitiveClassID->getCommand(command);
    if (ui->radioButtonHeroEnemyInstanceID->isChecked())
    {
        command.append("0");
        ui->panelPrimitiveHeroEnemyInstanceID->getCommand(command);
    }
    if (ui->radioButtonEntire->isChecked())
    {
        command.append("1");
        command.append(QString::number(ui->comboBoxTeam->currentIndex()));
    }
    return new EventCommand(EventCommandKind::ChangeClass, command);
}

// -------------------------------------------------------

void DialogCommandChangeClass::initialize(EventCommand *command)
{
    int i = 0;
    ui->panelPrimitiveClassID->initializeCommand(command, i);
    switch (command->valueCommandAt(i++).toInt())
    {
    case 0:
        ui->radioButtonHeroEnemyInstanceID->setChecked(true);
        ui->panelPrimitiveHeroEnemyInstanceID->initializeCommand(command, i);
        break;
    case 1:
        ui->radioButtonEntire->setChecked(true);
        ui->comboBoxTeam->setCurrentIndex(command->valueCommandAt(i++).toInt());
        break;
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandChangeClass::on_radioButtonHeroEnemyInstanceID_toggled(bool checked)
{
    ui->panelPrimitiveHeroEnemyInstanceID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeClass::on_radioButtonEntire_toggled(bool checked)
{
    ui->comboBoxTeam->setEnabled(checked);
}
