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

#include "dialogsystemcaracteristic.h"
#include "ui_dialogsystemcaracteristic.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemCaracteristic::DialogSystemCaracteristic(SystemCaracteristic
    &caracteristic, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemCaracteristic),
    m_caracteristic(caracteristic)
{
    ui->setupUi(this);

    initialize();
}

DialogSystemCaracteristic::~DialogSystemCaracteristic() {
    delete ui;
}

SystemCaracteristic & DialogSystemCaracteristic::caracteristic() const {
    return m_caracteristic;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemCaracteristic::initialize() {
    int index = m_caracteristic.increaseDecreaseKind()->id();
    ui->comboBoxIncreaseDecreaseKind->addItems(Common
        ::enumToStringIncreaseDecreaseKind);

    switch(m_caracteristic.kind()) {
    case CaracteristicKind::IncreaseDecrease:
        ui->radioButtonBuff->setChecked(true);
        ui->comboBoxIncreaseDecrease->setCurrentIndex(m_caracteristic
            .isIncreaseDecrease() ? 0 : 1);
        ui->comboBoxIncreaseDecreaseKind->setCurrentIndex(index);
        break;
    case CaracteristicKind::AllowForbidEquip:

        break;
    case CaracteristicKind::AllowForbidChange:
        break;
    case CaracteristicKind::BeginEquipment:
        break;
    case CaracteristicKind::Script:
        break;
    }

    ui->panelPrimitiveValueStatValue->initializeDataBaseCommandId(
        m_caracteristic.statValueID()->modelDataBase());
    ui->panelPrimitiveValueStatValue->initializeModel(m_caracteristic
        .statValueID());
    ui->panelPrimitiveValueStatValue->updateModel();

    ui->panelPrimitiveValueElementRes->initializeDataBaseCommandId(
        m_caracteristic.elementResID()->modelDataBase());
    ui->panelPrimitiveValueElementRes->initializeModel(m_caracteristic
        .elementResID());
    ui->panelPrimitiveValueElementRes->updateModel();

    ui->panelPrimitiveValueStatusRes->initializeDataBaseCommandId(
        m_caracteristic.statusResID()->modelDataBase());
    ui->panelPrimitiveValueStatusRes->initializeModel(m_caracteristic
        .statusResID());
    ui->panelPrimitiveValueStatusRes->updateModel();

    ui->panelPrimitiveValueCurrencyGain->initializeDataBaseCommandId(
        m_caracteristic.currencyGainID()->modelDataBase());
    ui->panelPrimitiveValueCurrencyGain->initializeModel(m_caracteristic
        .currencyGainID());
    ui->panelPrimitiveValueCurrencyGain->updateModel();

    ui->panelPrimitiveValueSkillCost->initializeDataBaseCommandId(
        m_caracteristic.skillCostID()->modelDataBase());
    ui->panelPrimitiveValueSkillCost->initializeModel(m_caracteristic
        .skillCostID());
    ui->panelPrimitiveValueSkillCost->updateModel();

    ui->widgetVariable->initializeSuper(m_caracteristic.variableID());

    ui->panelPrimitiveValue->initializeNumberVariable();
    ui->panelPrimitiveValue->initializeModel(m_caracteristic
        .value());
    ui->panelPrimitiveValue->updateModel();
}

// -------------------------------------------------------

void DialogSystemCaracteristic::setRadioCharacters() {
    ui->radioButtonBuff->setChecked(false);
    ui->radioButtonScript->setChecked(false);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemCaracteristic::on_radioButtonBuff_toggled(bool checked) {
    if (checked) {
        ui->radioButtonEquip->setChecked(false);
        ui->radioButtonEquipmentChange->setChecked(false);
        ui->radioButtonBeginEquipment->setChecked(false);
        ui->radioButtonScript->setChecked(false);
    }
}

// -------------------------------------------------------

void DialogSystemCaracteristic::on_radioButtonEquip_toggled(bool checked) {
    if (checked) {
        setRadioCharacters();
    }
}

// -------------------------------------------------------

void DialogSystemCaracteristic::on_radioButtonEquipmentChange_toggled(bool
    checked)
{
    if (checked) {
        setRadioCharacters();
    }
}

// -------------------------------------------------------

void DialogSystemCaracteristic::on_radioButtonBeginEquipment_toggled(bool
    checked)
{
    if (checked) {
        setRadioCharacters();
    }
}

// -------------------------------------------------------

void DialogSystemCaracteristic::on_radioButtonScript_toggled(bool checked) {
    if (checked) {
        ui->radioButtonBuff->setChecked(false);
        ui->radioButtonEquip->setChecked(false);
        ui->radioButtonEquipmentChange->setChecked(false);
        ui->radioButtonBeginEquipment->setChecked(false);
    }
}

// -------------------------------------------------------

void DialogSystemCaracteristic::on_comboBoxIncreaseDecrease_currentIndexChanged(
    int index)
{
    m_caracteristic.setIsIncreaseDecrease(index == 0);
}

// -------------------------------------------------------

void DialogSystemCaracteristic::
    on_comboBoxIncreaseDecreaseKind_currentIndexChanged(int index)
{
    m_caracteristic.increaseDecreaseKind()->setId(index);

    ui->panelPrimitiveValueStatValue->hide();
    ui->panelPrimitiveValueElementRes->hide();
    ui->panelPrimitiveValueStatusRes->hide();
    ui->panelPrimitiveValueCurrencyGain->hide();
    ui->panelPrimitiveValueSkillCost->hide();
    ui->comboBoxSkillCostAll->hide();
    ui->widgetVariable->hide();

    switch(static_cast<IncreaseDecreaseKind>(index)) {
    case IncreaseDecreaseKind::StatValue:
        ui->panelPrimitiveValueStatValue->show();
        break;
    case IncreaseDecreaseKind::ElementRes:
        ui->panelPrimitiveValueElementRes->show();
        break;
    case IncreaseDecreaseKind::StatusRes:
        ui->panelPrimitiveValueStatusRes->show();
        break;
    case IncreaseDecreaseKind::CurrencyGain:
        ui->panelPrimitiveValueCurrencyGain->show();
        break;
    case IncreaseDecreaseKind::SkillCost:
        ui->comboBoxSkillCostAll->show();
        if (!m_caracteristic.isAllSkillCost()) {
            ui->panelPrimitiveValueSkillCost->show();
        }
        break;
    case IncreaseDecreaseKind::Variable:
        ui->widgetVariable->show();
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

void DialogSystemCaracteristic::on_comboBoxSkillCostAll_currentIndexChanged(int
    index)
{
    m_caracteristic.setIsAllSkillCost(index == 0);

    if (index == 0) {
        ui->panelPrimitiveValueSkillCost->hide();
    } else {
        ui->panelPrimitiveValueSkillCost->show();
    }
}

// -------------------------------------------------------

void DialogSystemCaracteristic::on_comboBoxOperation_currentIndexChanged(int
    index)
{
    m_caracteristic.setOperation(index == 0);
}

// -------------------------------------------------------

void DialogSystemCaracteristic::on_comboBoxUnit_currentIndexChanged(int index) {
    m_caracteristic.setUnit(index == 0);
}
