/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemrandombattle.h"
#include "ui_dialogsystemrandombattle.h"
#include "systemnumber.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemRandomBattle::DialogSystemRandomBattle(SystemRandomBattle
    &randomBattle, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemRandomBattle),
    m_randomBattle(randomBattle)
{
    ui->setupUi(this);
    this->initialize();
    this->translate();
}

DialogSystemRandomBattle::~DialogSystemRandomBattle()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemRandomBattle::initialize()
{
    connect(ui->panelPrimitivePriority, SIGNAL(numberUpdated(int)), this, SLOT(
        on_priorityUpdated(int)));
    ui->panelPrimitiveTroopID->initializeDataBaseAndUpdate(m_randomBattle.troopID());
    ui->panelPrimitivePriority->initializeNumberAndUpdate(m_randomBattle.priority());
    if (m_randomBattle.priority()->isDefaultNumberValue())
    {
        this->on_priorityUpdated(m_randomBattle.priority()->numberValue());
    }
    if (!m_randomBattle.isEntireMap())
    {
        ui->radioButtonTerrain->setChecked(true);
    }
    ui->treeViewTerrain->initializeModel(m_randomBattle.terrains());
    ui->treeViewTerrain->initializeNewItemInstance(new SystemNumber);
}

// -------------------------------------------------------

void DialogSystemRandomBattle::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_RANDOM_BATTLE) + RPM
        ::DOT_DOT_DOT);
    ui->labelTroopID->setText(RPM::translate(Translations::TROOP_ID) + RPM::COLON);
    ui->labelPriority->setText(RPM::translate(Translations::PRIORITY) + RPM::COLON);
    ui->labelProbability->setText(RPM::translate(Translations::PROBABILITY) + RPM::COLON);
    ui->groupBox->setTitle(RPM::translate(Translations::TERRAIN));
    ui->radioButtonEntireMap->setText(RPM::translate(Translations::ENTIRE_MAP));
    ui->radioButtonTerrain->setText(RPM::translate(Translations::TERRAIN));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemRandomBattle::on_priorityUpdated(int p)
{
    ui->labelProbabilityValue->setText(m_randomBattle.probabilityToString(p) + "%");
}

// -------------------------------------------------------

void DialogSystemRandomBattle::on_radioButtonTerrain_toggled(bool checked)
{
    ui->treeViewTerrain->setEnabled(checked);
    m_randomBattle.setIsEntireMap(!checked);
}
