/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "panelstatus.h"
#include "ui_panelstatus.h"
#include "rpm.h"
#include "systemstatusreleaseturn.h"
#include "systemeffect.h"
#include "systemcharacteristic.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelStatus::PanelStatus(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelStatus),
    m_model(nullptr)
{
    ui->setupUi(this);
    this->initializePrimitives();
    this->translate();
}

PanelStatus::~PanelStatus()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelStatus::initializePrimitives()
{
    ui->panelPrimitiveAnimationID->addNone();
    ui->panelPrimitiveAnimationID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->animationsDatas()->model());
    ui->comboBoxRestrictions->addItems(RPM::ENUM_TO_STRING_STATUS_RESTRICTIONS_KIND);
    ui->panelPrimitivePriority->initializeNumber(nullptr, nullptr);
    ui->panelPrimitiveBattlerPosition->initializeNumber(nullptr, nullptr);
    ui->panelPrimitiveChanceReleaseBeingAttacked->initializeNumber(nullptr,
        nullptr, false);
    ui->treeViewReleaseChanceTurn->initializeNewItemInstance(new SystemStatusReleaseTurn);
    ui->panelPrimitiveMessageAllyAffected->initializeMessage(false);
    ui->panelPrimitiveMessageEnemyAffected->initializeMessage(false);
    ui->panelPrimitiveMessageStatusHealed->initializeMessage(false);
    ui->panelPrimitiveMessageStatusStillAffected->initializeMessage(false);
    ui->treeViewEffects->initializeNewItemInstance(new SystemEffect);
    ui->treeViewCharacteristics->initializeNewItemInstance(new SystemCharacteristic);
}

// -------------------------------------------------------

void PanelStatus::initializeModel(SystemStatus *model)
{
    m_model = model;
    ui->panelPrimitiveAnimationID->initializeModel(m_model->animationID());
    ui->panelPrimitiveAnimationID->updateModel();
    ui->comboBoxRestrictions->setCurrentIndex(static_cast<int>(m_model
        ->restrictionsKind()));
    ui->widgetIcon->initializeIcon(m_model);
    ui->panelPrimitivePriority->initializeModel(m_model->priority());
    ui->panelPrimitivePriority->updateModel();
    ui->panelPrimitiveBattlerPosition->initializeModel(m_model->battlerPosition());
    ui->panelPrimitiveBattlerPosition->updateModel();
    ui->checkBoxReleaseAtEndBattle->setChecked(m_model->isReleaseAtEndBattle());
    ui->checkBoxReleaseWith->setChecked(m_model->isReleaseAfterAttacked());
    ui->panelPrimitiveChanceReleaseBeingAttacked->initializeModel(m_model
        ->chanceReleaseAfterAttacked());
    ui->panelPrimitiveChanceReleaseBeingAttacked->updateModel();
    ui->checkBoxReleaseStartTurn->setChecked(m_model->isReleaseStartTurn());
    ui->treeViewReleaseChanceTurn->initializeModel(m_model->modelReleaseStartTurn());
    ui->treeViewReleaseChanceTurn->header()->setSectionResizeMode(0, QHeaderView::Interactive);
    ui->treeViewReleaseChanceTurn->header()->setSectionResizeMode(1, QHeaderView::Stretch);
    ui->treeViewReleaseChanceTurn->updateAbsoluteAllNodesString();
    ui->panelPrimitiveMessageAllyAffected->initializeModel(m_model
        ->messageAllyAffected());
    ui->panelPrimitiveMessageAllyAffected->updateModel();
    ui->panelPrimitiveMessageEnemyAffected->initializeModel(m_model
        ->messageEnemyAffected());
    ui->panelPrimitiveMessageEnemyAffected->updateModel();
    ui->panelPrimitiveMessageStatusHealed->initializeModel(m_model
        ->messageStatusHealed());
    ui->panelPrimitiveMessageStatusHealed->updateModel();
    ui->panelPrimitiveMessageStatusStillAffected->initializeModel(m_model
        ->messageStatusStillAffected());
    ui->panelPrimitiveMessageStatusStillAffected->updateModel();
    ui->treeViewEffects->initializeModel(m_model->modelEffects());
    ui->treeViewEffects->updateAbsoluteAllNodesString();
    ui->treeViewCharacteristics->initializeModel(m_model->modelCharacteristics());
    ui->treeViewCharacteristics->updateAbsoluteAllNodesString();
}

void PanelStatus::translate()
{
    ui->labelAnimation->setText(RPM::translate(Translations::ANIMATION_ID)+ RPM::COLON);
    ui->labelRestrictions->setText(RPM::translate(Translations::RESTRICTIONS)+ RPM::COLON);
    ui->labelPriority->setText(RPM::translate(Translations::PRIORITY)+ RPM::COLON);
    ui->labelBattlerPosition->setText(RPM::translate(Translations::BATTLER_POSITION)+ RPM::COLON);
    ui->groupBoxReleaseConditions->setTitle(RPM::translate(Translations::RELEASE_CONDITIONS));
    ui->checkBoxReleaseAtEndBattle->setText(RPM::translate(Translations::RELEASE_AT_END_BATTLE));
    ui->checkBoxReleaseWith->setText(RPM::translate(Translations::RELEASE_WITH));
    ui->labelChanceAfterBeingAttacked->setText(RPM::translate(Translations
        ::CHANCE_AFTER_BEING_ATTACKED).toLower());
    ui->checkBoxReleaseStartTurn->setText(RPM::translate(Translations
        ::RELEASE_AT_START_TURN) + RPM::COLON);
    ui->groupBoxMessages->setTitle(RPM::translate(Translations::MESSAGES));
    ui->labelAllyAffected->setText(RPM::translate(Translations::ALLY_AFFECTED) + RPM::COLON);
    ui->labelEnemyAffected->setText(RPM::translate(Translations::ENEMY_AFFECTED) + RPM::COLON);
    ui->labelStatusHealed->setText(RPM::translate(Translations::STATUS_HEALED) + RPM::COLON);
    ui->labelStatusStillAffected->setText(RPM::translate(Translations::STATUS_STILL_AFFECTED) + RPM::COLON);
    ui->groupBoxEffects->setTitle(RPM::translate(Translations::EFFECTS));
    ui->groupBoxCharacteristics->setTitle(RPM::translate(Translations::CHARACTERISTICS));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelStatus::on_comboBoxRestrictions_currentIndexChanged(int index)
{
    if (m_model != nullptr)
    {
        m_model->setRestrictionsKind(static_cast<StatusRestrictionsKind>(index));
    }
}

// -------------------------------------------------------

void PanelStatus::on_checkBoxReleaseAtEndBattle_toggled(bool checked)
{
    if (m_model != nullptr)
    {
        m_model->setIsReleaseAtEndBattle(checked);
    }
}

// -------------------------------------------------------

void PanelStatus::on_checkBoxReleaseWith_toggled(bool checked)
{
    ui->panelPrimitiveChanceReleaseBeingAttacked->setEnabled(checked);
    ui->labelPercent->setEnabled(checked);
    ui->labelChanceAfterBeingAttacked->setEnabled(checked);
    if (m_model != nullptr)
    {
        m_model->setIsReleaseAfterAttacked(checked);
    }
}

// -------------------------------------------------------

void PanelStatus::on_checkBoxReleaseStartTurn_toggled(bool checked)
{
    ui->treeViewReleaseChanceTurn->setEnabled(checked);
    if (m_model != nullptr)
    {
        m_model->setIsReleaseStartTurn(checked);
    }
}
