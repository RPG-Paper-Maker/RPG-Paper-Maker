/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemcharacteristic.h"
#include "ui_dialogsystemcharacteristic.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemCharacteristic::DialogSystemCharacteristic(SystemCharacteristic
    &characteristic, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemCharacteristic),
    m_characteristic(characteristic)
{
    ui->setupUi(this);

    ui->comboBoxIncreaseDecrease->addItem(RPM::translate(Translations::INCREASE));
    ui->comboBoxIncreaseDecrease->addItem(RPM::translate(Translations::DECREASE));
    ui->comboBoxIncreaseDecreaseKind->addItems(RPM
        ::ENUM_TO_STRING_INCREASE_DECREASE_KIND);
    ui->comboBoxSkillCostAll->addItem(RPM::translate(Translations::ALL));
    ui->comboBoxSkillCostAll->addItem(RPM::translate(Translations::SPECIFIC));
    ui->comboBoxUnit->addItem(RPM::translate(Translations::FIX));

    initialize();

    this->translate();
}

DialogSystemCharacteristic::~DialogSystemCharacteristic() {
    delete ui;
}

SystemCharacteristic & DialogSystemCharacteristic::characteristic() const {
    return m_characteristic;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemCharacteristic::initialize() {
    int index = m_characteristic.increaseDecreaseKind()->id();

    // Temporary disable combobox
    QModelIndex modelIndex;
    QVariant v(0);
    int i, l;
    for (i = 2, l = ui->comboBoxIncreaseDecreaseKind->count(); i < l; i++) {
        modelIndex = ui->comboBoxIncreaseDecreaseKind->model()->index(i, 0);
        ui->comboBoxIncreaseDecreaseKind->model()->setData(modelIndex, v, Qt
            ::UserRole - 1);
    }

    switch(m_characteristic.kind()) {
    case CharacteristicKind::IncreaseDecrease:
        ui->radioButtonBuff->setChecked(true);
        break;
    case CharacteristicKind::AllowForbidEquip:
        ui->radioButtonEquip->setChecked(true);
        break;
    case CharacteristicKind::AllowForbidChange:
        ui->radioButtonEquipmentChange->setChecked(true);
        break;
    case CharacteristicKind::BeginEquipment:
        ui->radioButtonBeginEquipment->setChecked(true);
        break;
    case CharacteristicKind::Script:
        ui->radioButtonScript->setChecked(true);
        break;
    }

    // Buff
    ui->comboBoxIncreaseDecrease->setCurrentIndex(m_characteristic
        .isIncreaseDecrease() ? 0 : 1);
    ui->comboBoxIncreaseDecreaseKind->setCurrentIndex(index);
    ui->panelPrimitiveValueStatValue->initializeDataBaseAndUpdate(
        m_characteristic.statValueID());
    ui->panelPrimitiveValueElementRes->initializeDataBaseAndUpdate(
        m_characteristic.elementResID());
    ui->panelPrimitiveValueStatusRes->initializeDataBaseAndUpdate(
        m_characteristic.statusResID());
    ui->panelPrimitiveValueCurrencyGain->initializeDataBaseAndUpdate(
        m_characteristic.currencyGainID());
    ui->panelPrimitiveValueSkillCost->initializeDataBaseAndUpdate(
        m_characteristic.skillCostID());
    ui->widgetVariable->initializeSuper(m_characteristic.variableID());
    ui->comboBoxOperation->setCurrentIndex(m_characteristic.operation() ? 0 :
        1);
    ui->panelPrimitiveValue->initializeNumberVariableAndUpdate(m_characteristic
        .value());
    ui->comboBoxUnit->setCurrentIndex(m_characteristic.unit() ? 0 : 1);

    // Character
    ui->comboBoxEquipAllowForbid->setCurrentIndex(m_characteristic
        .isAllowEquip() ? 0 : 1);
    ui->panelPrimitiveValueArmorKindID->hide();
    ui->comboBoxEquipWeaponArmor->setCurrentIndex(m_characteristic
        .isAllowEquipWeapon() ? 0 : 1);
    ui->panelPrimitiveValueWeaponKindID->initializeDataBaseAndUpdate(
        m_characteristic.equipWeaponTypeID());
    ui->panelPrimitiveValueArmorKindID->initializeDataBaseAndUpdate(
        m_characteristic.equipArmorTypeID());
    ui->comboBoxEquipmentChange->setCurrentIndex(m_characteristic
        .isAllowChangeEquipment() ? 0 : 1);
    ui->panelPrimitiveValueEquipmentChangeID->initializeDataBaseAndUpdate(
        m_characteristic.changeEquipmentID());
    ui->panelPrimitiveValueBeginEquipmentID->initializeDataBaseAndUpdate(
        m_characteristic.beginEquipmentID());
    ui->comboBoxBeginWeaponArmor->setCurrentIndex(m_characteristic
        .isBeginWeapon() ? 0 : 1);
    m_characteristic.updateModelBeginWeaponArmor();
    ui->panelPrimitiveValueBeginWeaponArmorID->initializeDataBaseAndUpdate(
        m_characteristic.beginWeaponArmorID());
    connect(ui->panelPrimitiveValueBeginEquipmentID, SIGNAL(numberUpdated(int)),
        this, SLOT(on_beginWeaponArmorNumberChanged(int)));

    // Script
    ui->panelPrimitiveValueScript->initializeMessageAndUpdate(m_characteristic
        .script(), true);
}

// -------------------------------------------------------

void DialogSystemCharacteristic::setRadioCharacters() {
    ui->radioButtonBuff->setChecked(false);
    ui->radioButtonScript->setChecked(false);
}

// -------------------------------------------------------

void DialogSystemCharacteristic::uncheckAllRadiosCharacters() {
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

//-------------------------------------------------

void DialogSystemCharacteristic::translate()
{
    this->setWindowTitle(RPM::translate(Translations::NEW_PROJECT));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemCharacteristic::on_radioButtonBuff_toggled(bool checked) {
    if (checked) {
        m_characteristic.setKind(CharacteristicKind::IncreaseDecrease);
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

void DialogSystemCharacteristic::on_radioButtonEquip_toggled(bool checked) {
    m_characteristic.setKind(CharacteristicKind::AllowForbidEquip);

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

void DialogSystemCharacteristic::on_radioButtonEquipmentChange_toggled(bool
    checked)
{
    if (checked) {
        m_characteristic.setKind(CharacteristicKind::AllowForbidChange);
        setRadioCharacters();
    }

    // Enable
    ui->comboBoxEquipmentChange->setEnabled(checked);
    ui->panelPrimitiveValueEquipmentChangeID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemCharacteristic::on_radioButtonBeginEquipment_toggled(bool
    checked)
{
    if (checked) {
        m_characteristic.setKind(CharacteristicKind::BeginEquipment);
        setRadioCharacters();
    }

    // Enable
    ui->panelPrimitiveValueBeginEquipmentID->setEnabled(checked);
    ui->labelWith->setEnabled(checked);
    ui->comboBoxBeginWeaponArmor->setEnabled(checked);
    ui->panelPrimitiveValueBeginWeaponArmorID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemCharacteristic::on_radioButtonScript_toggled(bool checked) {
    if (checked) {
        m_characteristic.setKind(CharacteristicKind::Script);
        ui->radioButtonBuff->setChecked(false);
        uncheckAllRadiosCharacters();
    }

    // Enable
    ui->panelPrimitiveValueScript->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemCharacteristic::on_comboBoxIncreaseDecrease_currentIndexChanged(
    int index)
{
    m_characteristic.setIsIncreaseDecrease(index == 0);
}

// -------------------------------------------------------

void DialogSystemCharacteristic::
    on_comboBoxIncreaseDecreaseKind_currentIndexChanged(int index)
{
    m_characteristic.increaseDecreaseKind()->setId(index);

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
        if (!m_characteristic.isAllSkillCost()) {
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

void DialogSystemCharacteristic::on_comboBoxSkillCostAll_currentIndexChanged(int
    index)
{
    m_characteristic.setIsAllSkillCost(index == 0);

    if (index == 0) {
        ui->panelPrimitiveValueSkillCost->hide();
    } else {
        ui->panelPrimitiveValueSkillCost->show();
    }
}

// -------------------------------------------------------

void DialogSystemCharacteristic::on_comboBoxOperation_currentIndexChanged(int
    index)
{
    m_characteristic.setOperation(index == 0);
}

// -------------------------------------------------------

void DialogSystemCharacteristic::on_comboBoxUnit_currentIndexChanged(int index) {
    m_characteristic.setUnit(index == 0);
}

// -------------------------------------------------------

void DialogSystemCharacteristic::on_comboBoxEquipAllowForbid_currentIndexChanged(
    int index)
{
    m_characteristic.setIsAllowEquip(index == 0);
}

// -------------------------------------------------------

void DialogSystemCharacteristic::on_comboBoxEquipWeaponArmor_currentIndexChanged(
    int index)
{
    m_characteristic.setIsAllowEquipWeapon(index == 0);

    ui->panelPrimitiveValueWeaponKindID->hide();
    ui->panelPrimitiveValueArmorKindID->hide();
    if (index == 0) {
        ui->panelPrimitiveValueWeaponKindID->show();
    } else {
        ui->panelPrimitiveValueArmorKindID->show();
    }
}

// -------------------------------------------------------

void DialogSystemCharacteristic::on_comboBoxEquipmentChange_currentIndexChanged(
    int index)
{
    m_characteristic.setIsAllowChangeEquipment(index == 0);
}

// -------------------------------------------------------

void DialogSystemCharacteristic::on_comboBoxBeginWeaponArmor_currentIndexChanged(
    int index)
{
    m_characteristic.setIsBeginWeapon(index == 0);
    m_characteristic.updateModelBeginWeaponArmor();
    ui->panelPrimitiveValueBeginWeaponArmorID->clearDataBase();
}

// -------------------------------------------------------

void DialogSystemCharacteristic::on_beginWeaponArmorNumberChanged(int) {
    m_characteristic.updateModelBeginWeaponArmor();
    ui->panelPrimitiveValueBeginWeaponArmorID->clearDataBase();
}
