/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

    // Temporary disable combobox
    QModelIndex modelIndex;
    QVariant v(0);
    int i, l;
    for (i = 1, l = ui->comboBoxIncreaseDecreaseKind->count(); i < l; i++) {
        modelIndex = ui->comboBoxIncreaseDecreaseKind->model()->index(i, 0);
        ui->comboBoxIncreaseDecreaseKind->model()->setData(modelIndex, v, Qt
            ::UserRole - 1);
    }

    switch(m_caracteristic.kind()) {
    case CaracteristicKind::IncreaseDecrease:
        ui->radioButtonBuff->setChecked(true);
        break;
    case CaracteristicKind::AllowForbidEquip:
        ui->radioButtonEquip->setChecked(true);
        break;
    case CaracteristicKind::AllowForbidChange:
        ui->radioButtonEquipmentChange->setChecked(true);
        break;
    case CaracteristicKind::BeginEquipment:
        ui->radioButtonBeginEquipment->setChecked(true);
        break;
    case CaracteristicKind::Script:
        ui->radioButtonScript->setChecked(true);
        break;
    }

    // Buff
    ui->comboBoxIncreaseDecrease->setCurrentIndex(m_caracteristic
        .isIncreaseDecrease() ? 0 : 1);
    ui->comboBoxIncreaseDecreaseKind->setCurrentIndex(index);
    ui->panelPrimitiveValueStatValue->initializeDataBaseAndUpdate(
        m_caracteristic.statValueID());
    ui->panelPrimitiveValueElementRes->initializeDataBaseAndUpdate(
        m_caracteristic.elementResID());
    ui->panelPrimitiveValueStatusRes->initializeDataBaseAndUpdate(
        m_caracteristic.statusResID());
    ui->panelPrimitiveValueCurrencyGain->initializeDataBaseAndUpdate(
        m_caracteristic.currencyGainID());
    ui->panelPrimitiveValueSkillCost->initializeDataBaseAndUpdate(
        m_caracteristic.skillCostID());
    ui->widgetVariable->initializeSuper(m_caracteristic.variableID());
    ui->comboBoxOperation->setCurrentIndex(m_caracteristic.operation() ? 0 :
        1);
    ui->panelPrimitiveValue->initializeNumberVariableAndUpdate(m_caracteristic
        .value());
    ui->comboBoxUnit->setCurrentIndex(m_caracteristic.unit() ? 0 : 1);

    // Character
    ui->comboBoxEquipAllowForbid->setCurrentIndex(m_caracteristic
        .isAllowEquip() ? 0 : 1);
    ui->panelPrimitiveValueArmorKindID->hide();
    ui->comboBoxEquipWeaponArmor->setCurrentIndex(m_caracteristic
        .isAllowEquipWeapon() ? 0 : 1);
    ui->panelPrimitiveValueWeaponKindID->initializeDataBaseAndUpdate(
        m_caracteristic.equipWeaponTypeID());
    ui->panelPrimitiveValueArmorKindID->initializeDataBaseAndUpdate(
        m_caracteristic.equipArmorTypeID());
    ui->comboBoxEquipmentChange->setCurrentIndex(m_caracteristic
        .isAllowChangeEquipment() ? 0 : 1);
    ui->panelPrimitiveValueEquipmentChangeID->initializeDataBaseAndUpdate(
        m_caracteristic.changeEquipmentID());
    ui->panelPrimitiveValueBeginEquipmentID->initializeDataBaseAndUpdate(
        m_caracteristic.beginEquipmentID());
    ui->comboBoxBeginWeaponArmor->setCurrentIndex(m_caracteristic
        .isBeginWeapon() ? 0 : 1);
    m_caracteristic.updateModelBeginWeaponArmor();
    ui->panelPrimitiveValueBeginWeaponArmorID->initializeDataBaseAndUpdate(
        m_caracteristic.beginWeaponArmorID());
    connect(ui->panelPrimitiveValueBeginEquipmentID, SIGNAL(numberUpdated(int)),
        this, SLOT(on_beginWeaponArmorNumberChanged(int)));

    // Script
    ui->panelPrimitiveValueScript->initializeMessageAndUpdate(m_caracteristic
        .script());
}

// -------------------------------------------------------

void DialogSystemCaracteristic::setRadioCharacters() {
    ui->radioButtonBuff->setChecked(false);
    ui->radioButtonScript->setChecked(false);
}

// -------------------------------------------------------

void DialogSystemCaracteristic::uncheckAllRadiosCharacters() {
    ui->radioButtonEquip->setAutoExclusive(false);
    ui->radioButtonEquipmentChange->setAutoExclusive(false);
    ui->radioButtonBeginEquipment->setAutoExclusive(false);
    ui->radioButtonEquip->setChecked(false);
    ui->radioButtonEquipmentChange->setChecked(false);
    ui->radioButtonBeginEquipment->setChecked(false);
    ui->radioButtonEquip->setAutoExclusive(true);
    ui->radioButtonEquipmentChange->setAutoExclusive(true);
    ui->radioButtonBeginEquipment->setAutoExclusive(true);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemCaracteristic::on_radioButtonBuff_toggled(bool checked) {
    if (checked) {
        m_caracteristic.setKind(CaracteristicKind::IncreaseDecrease);
        uncheckAllRadiosCharacters();
        ui->radioButtonScript->setChecked(false);
    }

    // Enable
    ui->comboBoxIncreaseDecrease->setEnabled(checked);
    ui->comboBoxIncreaseDecreaseKind->setEnabled(checked);
    ui->panelPrimitiveValueStatValue->setEnabled(checked);
    ui->panelPrimitiveValueElementRes->setEnabled(checked);
    ui->panelPrimitiveValueStatusRes->setEnabled(checked);
    ui->panelPrimitiveValueCurrencyGain->setEnabled(checked);
    ui->panelPrimitiveValueSkillCost->setEnabled(checked);
    ui->comboBoxSkillCostAll->setEnabled(checked);
    ui->widgetVariable->setEnabled(checked);
    ui->comboBoxOperation->setEnabled(checked);
    ui->panelPrimitiveValue->setEnabled(checked);
    ui->comboBoxUnit->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemCaracteristic::on_radioButtonEquip_toggled(bool checked) {
    m_caracteristic.setKind(CaracteristicKind::AllowForbidEquip);

    if (checked) {
        setRadioCharacters();
    }

    // Enable
    ui->comboBoxEquipAllowForbid->setEnabled(checked);
    ui->comboBoxEquipWeaponArmor->setEnabled(checked);
    ui->panelPrimitiveValueWeaponKindID->setEnabled(checked);
    ui->panelPrimitiveValueArmorKindID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemCaracteristic::on_radioButtonEquipmentChange_toggled(bool
    checked)
{
    if (checked) {
        m_caracteristic.setKind(CaracteristicKind::AllowForbidChange);
        setRadioCharacters();
    }

    // Enable
    ui->comboBoxEquipmentChange->setEnabled(checked);
    ui->panelPrimitiveValueEquipmentChangeID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemCaracteristic::on_radioButtonBeginEquipment_toggled(bool
    checked)
{
    if (checked) {
        m_caracteristic.setKind(CaracteristicKind::BeginEquipment);
        setRadioCharacters();
    }

    // Enable
    ui->panelPrimitiveValueBeginEquipmentID->setEnabled(checked);
    ui->labelWith->setEnabled(checked);
    ui->comboBoxBeginWeaponArmor->setEnabled(checked);
    ui->panelPrimitiveValueBeginWeaponArmorID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemCaracteristic::on_radioButtonScript_toggled(bool checked) {
    if (checked) {
        m_caracteristic.setKind(CaracteristicKind::Script);
        ui->radioButtonBuff->setChecked(false);
        uncheckAllRadiosCharacters();
    }

    // Enable
    ui->panelPrimitiveValueScript->setEnabled(checked);
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

// -------------------------------------------------------

void DialogSystemCaracteristic::on_comboBoxEquipAllowForbid_currentIndexChanged(
    int index)
{
    m_caracteristic.setIsAllowEquip(index == 0);
}

// -------------------------------------------------------

void DialogSystemCaracteristic::on_comboBoxEquipWeaponArmor_currentIndexChanged(
    int index)
{
    m_caracteristic.setIsAllowEquipWeapon(index == 0);

    ui->panelPrimitiveValueWeaponKindID->hide();
    ui->panelPrimitiveValueArmorKindID->hide();
    if (index == 0) {
        ui->panelPrimitiveValueWeaponKindID->show();
    } else {
        ui->panelPrimitiveValueArmorKindID->show();
    }
}

// -------------------------------------------------------

void DialogSystemCaracteristic::on_comboBoxEquipmentChange_currentIndexChanged(
    int index)
{
    m_caracteristic.setIsAllowChangeEquipment(index == 0);
}

// -------------------------------------------------------

void DialogSystemCaracteristic::on_comboBoxBeginWeaponArmor_currentIndexChanged(
    int index)
{
    m_caracteristic.setIsBeginWeapon(index == 0);
    m_caracteristic.updateModelBeginWeaponArmor();
    ui->panelPrimitiveValueBeginWeaponArmorID->clearDataBase();
}

// -------------------------------------------------------

void DialogSystemCaracteristic::on_beginWeaponArmorNumberChanged(int) {
    m_caracteristic.updateModelBeginWeaponArmor();
    ui->panelPrimitiveValueBeginWeaponArmorID->clearDataBase();
}
