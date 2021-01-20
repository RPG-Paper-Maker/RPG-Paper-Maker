/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "paneldamageskind.h"
#include "ui_paneldamageskind.h"
#include "damageskind.h"
#include "common.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelDamagesKind::PanelDamagesKind(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelDamagesKind)
{
    ui->setupUi(this);
}

PanelDamagesKind::~PanelDamagesKind()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelDamagesKind::initialize(PrimitiveValue *statisticID, PrimitiveValue
    *currencyID, SuperListItem *variableID, SuperListItem *kind)
{
    m_statisticID = statisticID;
    m_currencyID = currencyID;
    m_variableID = variableID;
    m_kind = kind;
    int index = m_kind->id();
    ui->comboBoxChoice->clear();
    ui->comboBoxChoice->addItems(RPM::ENUM_TO_STRING_DAMAGES_KIND);
    ui->comboBoxChoice->setCurrentIndex(index);
    ui->panelPrimitiveValueStatistic->initializeDataBaseCommandId(m_statisticID
        ->modelDataBase());
    ui->panelPrimitiveValueStatistic->initializeModel(m_statisticID);
    ui->panelPrimitiveValueStatistic->updateModel();
    ui->panelPrimitiveValueCurrency->initializeDataBaseCommandId(m_currencyID
        ->modelDataBase());
    ui->panelPrimitiveValueCurrency->initializeModel(m_currencyID);
    ui->panelPrimitiveValueCurrency->updateModel();
    ui->widgetVariable->initializeSuper(m_variableID);

    showElement();
}

// -------------------------------------------------------

void PanelDamagesKind::hideAll() {
    ui->panelPrimitiveValueStatistic->hide();
    ui->panelPrimitiveValueCurrency->hide();
    ui->widgetVariable->hide();
}

// -------------------------------------------------------

void PanelDamagesKind::showElement() {
    hideAll();

    switch (static_cast<DamagesKind>(m_kind->id())) {
    case DamagesKind::Stat:
        ui->panelPrimitiveValueStatistic->show();
        break;
    case DamagesKind::Currency:
        ui->panelPrimitiveValueCurrency->show();
        break;
    case DamagesKind::Variable:
        ui->widgetVariable->show();
        break;
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelDamagesKind::on_comboBoxChoice_currentIndexChanged(int index) {
    m_kind->setId(index);

    showElement();
}
