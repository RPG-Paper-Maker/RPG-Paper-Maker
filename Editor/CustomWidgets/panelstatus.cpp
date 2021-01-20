/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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
    ui(new Ui::PanelStatus)
{
    ui->setupUi(this);

    this->initializePrimitives();
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
    ui->panelPrimitiveValueAnimationID->addNone();
    ui->panelPrimitiveValueAnimationID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->animationsDatas()->model());
    ui->comboBoxRestrictions->addItems(RPM::ENUM_TO_STRING_STATUS_RESTRICTIONS_KIND);
    ui->panelPrimitiveValueChanceReleaseBeingAttacked->initializeNumber(nullptr,
        nullptr, false);
    ui->treeViewReleaseChanceTurn->initializeNewItemInstance(new SystemStatusReleaseTurn);
    ui->panelPrimitiveValueMessageAllyAffected->initializeMessage(false);
    ui->panelPrimitiveValueMessageEnemyAffected->initializeMessage(false);
    ui->panelPrimitiveValueMessageStatusHealed->initializeMessage(false);
    ui->panelPrimitiveValueMessageStatusStillAffected->initializeMessage(false);
    ui->treeViewEffects->initializeNewItemInstance(new SystemEffect);
    ui->treeViewCharacteristics->initializeNewItemInstance(new SystemCharacteristic);
}

// -------------------------------------------------------

void PanelStatus::initializeModel(SystemStatus *model)
{
    m_model = model;
    ui->panelPrimitiveValueAnimationID->initializeModel(m_model->animationID());
    ui->panelPrimitiveValueAnimationID->updateModel();
    ui->panelPrimitiveValueChanceReleaseBeingAttacked->initializeModel(m_model
        ->chanceReleaseAfterAttacked());
    ui->panelPrimitiveValueChanceReleaseBeingAttacked->updateModel();
    ui->treeViewReleaseChanceTurn->initializeModel(m_model->modelReleaseAfterTurn());
    ui->treeViewReleaseChanceTurn->header()->setSectionResizeMode(0, QHeaderView::Interactive);
    ui->treeViewReleaseChanceTurn->header()->setSectionResizeMode(1, QHeaderView::Stretch);
    ui->panelPrimitiveValueMessageAllyAffected->initializeModel(m_model
        ->messageAllyAffected());
    ui->panelPrimitiveValueMessageAllyAffected->updateModel();
    ui->panelPrimitiveValueMessageEnemyAffected->initializeModel(m_model
        ->messageEnemyAffected());
    ui->panelPrimitiveValueMessageEnemyAffected->updateModel();
    ui->panelPrimitiveValueMessageStatusHealed->initializeModel(m_model
        ->messageStatusHealed());
    ui->panelPrimitiveValueMessageStatusHealed->updateModel();
    ui->panelPrimitiveValueMessageStatusStillAffected->initializeModel(m_model
        ->messageStatusStillAffected());
    ui->panelPrimitiveValueMessageStatusStillAffected->updateModel();
    ui->treeViewEffects->initializeModel(m_model->modelEffects());
    ui->treeViewCharacteristics->initializeModel(m_model->modelCharacteristics());
}
