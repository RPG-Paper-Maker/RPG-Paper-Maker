/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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

    ui->comboBoxChoice->addItems(Common::enumToStringDamagesKind);
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
