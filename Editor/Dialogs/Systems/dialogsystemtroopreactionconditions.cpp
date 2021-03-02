/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemtroopreactionconditions.h"
#include "ui_dialogsystemtroopreactionconditions.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemTroopReactionConditions::DialogSystemTroopReactionConditions(
    SystemTroopReactionConditions &conditions, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemTroopReactionConditions),
    m_conditions(conditions)
{
    ui->setupUi(this);
    this->initializePrimitives();
    this->initialize();
    this->translate();
}

DialogSystemTroopReactionConditions::~DialogSystemTroopReactionConditions()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemTroopReactionConditions::initializePrimitives()
{
    ui->panelPrimitiveTurnPlus->initializeNumber();
    ui->panelPrimitiveTurnTimes->initializeNumber();
    ui->panelPrimitiveInstanceID->initializeNumber();
    ui->panelPrimitiveStatusID->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->statusDatas()->model());
    ui->panelPrimitiveStatisticID->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->battleSystemDatas()->modelCommonStatistics());
    ui->panelPrimitiveStatisticCompare->initializeNumber();
    ui->labelWithInstanceID->hide();
    ui->panelPrimitiveInstanceID->hide();
}

// -------------------------------------------------------

void DialogSystemTroopReactionConditions::initialize()
{
    int index = m_conditions.isHeroes() ? 0 : 1;
    ui->comboBoxHeroesMonsters->addItem(RPM::translate(Translations::HEROES));
    ui->comboBoxHeroesMonsters->addItem(RPM::translate(Translations::MONSTERS));
    ui->comboBoxHeroesMonsters->setCurrentIndex(index);
    index = static_cast<int>(m_conditions.conditionHeroesKind());
    ui->comboBoxHeroMonsterNumber->addItems(RPM::ENUM_TO_STRING_CONDITION_PLAYERS);
    ui->comboBoxHeroMonsterNumber->setCurrentIndex(index);
    index = static_cast<int>(m_conditions.statisticOperationKind());
    ui->comboBoxStatisticCompare->addItems(RPM::ENUM_TO_STRING_OPERATION);
    ui->comboBoxStatisticCompare->setCurrentIndex(index);
    index = m_conditions.statisticCompareUnit() ? 0 : 1;
    ui->comboBoxStatisticCompareUnit->addItem("%");
    ui->comboBoxStatisticCompareUnit->addItem(RPM::translate(Translations::FIX));
    ui->comboBoxStatisticCompareUnit->setCurrentIndex(index);
    if (m_conditions.isNumberOfTurn())
    {
        ui->checkBoxNumberOfTurns->setChecked(true);
        ui->panelPrimitiveTurnPlus->initializeModel(m_conditions.numberOfTurnPlus());
        ui->panelPrimitiveTurnPlus->updateModel();
        ui->panelPrimitiveTurnTimes->initializeModel(m_conditions.numberOfTurnTimes());
        ui->panelPrimitiveTurnTimes->updateModel();
    }
    if (m_conditions.isHeroesMonsters())
    {
        ui->checkBoxMonstersHeroes->setChecked(true);
        ui->panelPrimitiveInstanceID->initializeModel(m_conditions.heroInstanceID());
        ui->panelPrimitiveInstanceID->updateModel();
        if (m_conditions.isStatusID())
        {
            ui->checkBoxStatusID->setChecked(true);
            ui->panelPrimitiveStatusID->initializeModel(m_conditions.statusID());
            ui->panelPrimitiveStatusID->updateModel();
        }
        if (m_conditions.isStatisticID())
        {
            ui->checkBoxStatisticID->setChecked(true);
            ui->panelPrimitiveStatisticID->initializeModel(m_conditions.statisticID());
            ui->panelPrimitiveStatisticID->updateModel();
            ui->panelPrimitiveStatisticCompare->initializeModel(m_conditions
                .statisticCompare());
            ui->panelPrimitiveStatisticCompare->updateModel();
        }
    }
}

// -------------------------------------------------------

void DialogSystemTroopReactionConditions::translate()
{

}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemTroopReactionConditions::on_checkBoxNumberOfTurns_toggled(bool checked)
{
    m_conditions.setIsNumberOfTurn(checked);
    ui->panelPrimitiveTurnPlus->setEnabled(checked);
    ui->labelPlus->setEnabled(checked);
    ui->panelPrimitiveTurnTimes->setEnabled(checked);
    ui->labelTimes->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemTroopReactionConditions::on_checkBoxMonstersHeroes_toggled(bool checked)
{
    m_conditions.setIsHeroesMonsters(checked);
    ui->comboBoxHeroesMonsters->setEnabled(checked);
    ui->comboBoxHeroMonsterNumber->setEnabled(checked);
    ui->labelWithInstanceID->setEnabled(checked);
    ui->panelPrimitiveInstanceID->setEnabled(checked);
    ui->checkBoxStatusID->setEnabled(checked);
    ui->checkBoxStatisticID->setEnabled(checked);
    if (!checked)
    {
        ui->checkBoxStatusID->setChecked(false);
        ui->checkBoxStatisticID->setChecked(false);
    }
    this->on_checkBoxStatusID_toggled(m_conditions.isStatusID());
    this->on_checkBoxStatisticID_toggled(m_conditions.isStatisticID());
}

// -------------------------------------------------------

void DialogSystemTroopReactionConditions::on_comboBoxHeroesMonsters_currentIndexChanged(int index)
{
    m_conditions.setIsHeroes(index == 0);
}

// -------------------------------------------------------

void DialogSystemTroopReactionConditions::on_comboBoxHeroMonsterNumber_currentIndexChanged(int index)
{
    m_conditions.setConditionHeroesKind(static_cast<ConditionHeroesKind>(index));
    bool show = m_conditions.conditionHeroesKind() == ConditionHeroesKind::TheHeroeWithInstanceID;
    ui->labelWithInstanceID->setVisible(show);
    ui->panelPrimitiveInstanceID->setVisible(show);
}

// -------------------------------------------------------

void DialogSystemTroopReactionConditions::on_checkBoxStatusID_toggled(bool checked)
{
    m_conditions.setIsStatusID(checked);
    ui->panelPrimitiveStatusID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemTroopReactionConditions::on_checkBoxStatisticID_toggled(bool checked)
{
    m_conditions.setIsStatisticID(checked);
    ui->panelPrimitiveStatisticID->setEnabled(checked);
    ui->comboBoxStatisticCompare->setEnabled(checked);
    ui->panelPrimitiveStatisticCompare->setEnabled(checked);
    ui->comboBoxStatisticCompareUnit->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemTroopReactionConditions::on_comboBoxStatisticCompare_currentIndexChanged(int index)
{
    m_conditions.setStatisticOperationKind(static_cast<OperationKind>(index));
}

// -------------------------------------------------------

void DialogSystemTroopReactionConditions::on_comboBoxStatisticCompareUnit_currentIndexChanged(int index)
{
    m_conditions.setStatisticCompareUnit(index == 0);
}
