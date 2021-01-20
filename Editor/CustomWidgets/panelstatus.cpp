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
    ui->panelPrimitiveValueChanceReleaseDamage->initializeNumber(nullptr,
        nullptr, false);
    ui->panelPrimitiveValueMessageAllyAffected->initializeMessage(false);
    ui->panelPrimitiveValueMessageEnemyAffected->initializeMessage(false);
    ui->panelPrimitiveValueMessageStatusHealed->initializeMessage(false);
    ui->panelPrimitiveValueMessageStatusStillAffected->initializeMessage(false);
}

// -------------------------------------------------------

void PanelStatus::initializeModel(SystemStatus *model)
{
    m_model = model;
}
