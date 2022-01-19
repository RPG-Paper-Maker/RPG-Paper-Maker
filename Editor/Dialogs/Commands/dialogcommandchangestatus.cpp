/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangestatus.h"
#include "ui_dialogcommandchangestatus.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeStatus::DialogCommandChangeStatus(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandChangeStatus),
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

DialogCommandChangeStatus::~DialogCommandChangeStatus()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeStatus::initializePrimitives()
{
    ui->comboBoxTeam->addItems(RPM::ENUM_TO_STRING_TEAM);
    ui->panelPrimitiveHeroEnemyInstanceID->initializeNumber(m_parameters,
        m_properties);
    ui->panelPrimitiveHeroEnemyInstanceID->showVariable();
    ui->panelPrimitiveHeroEnemyInstanceID->setNumberValue(1);
    ui->panelPrimitiveStatusID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->statusDatas()->model(), m_parameters,
        m_properties);
}

// -------------------------------------------------------

void DialogCommandChangeStatus::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_STATUS) + RPM
        ::DOT_DOT_DOT);
    ui->groupBoxSelection->setTitle(RPM::translate(Translations::SELECTION));
    ui->radioButtonHeroEnemyInstanceID->setText(RPM::translate(Translations
        ::HERO_ENEMY_INSTANCE_ID) + RPM::COLON);
    ui->radioButtonEntire->setText(RPM::translate(Translations::THE_ENTIRE));
    ui->groupBoxOperation->setTitle(RPM::translate(Translations::OPERATION));
    ui->radioButtonAdd->setText(RPM::translate(Translations::ADD));
    ui->radioButtonRemove->setText(RPM::translate(Translations::REMOVE));
    ui->groupBoxStatus->setTitle(RPM::translate(Translations::STATUS));
    ui->labelStatusID->setText(RPM::translate(Translations::STATUS_ID) + RPM
        ::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandChangeStatus::getCommand() const
{
    QVector<QString> command;
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
    if (ui->radioButtonAdd->isChecked()) {
        command.append("0");
    } else if (ui->radioButtonRemove->isChecked()) {
        command.append("1");
    }
    ui->panelPrimitiveStatusID->getCommand(command);
    return new EventCommand(EventCommandKind::ChangeStatus, command);
}

// -------------------------------------------------------

void DialogCommandChangeStatus::initialize(EventCommand *command)
{
    int i = 0;
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
    switch (command->valueCommandAt(i++).toInt()) {
    case 0:
        ui->radioButtonAdd->setChecked(true); break;
    case 1:
        ui->radioButtonRemove->setChecked(true); break;
    }
    ui->panelPrimitiveStatusID->initializeCommand(command, i);
}
