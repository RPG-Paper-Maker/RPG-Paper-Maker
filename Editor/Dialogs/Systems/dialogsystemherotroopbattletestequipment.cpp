/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemherotroopbattletestequipment.h"
#include "ui_dialogsystemherotroopbattletestequipment.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemHeroTroopBattleTestEquipment::DialogSystemHeroTroopBattleTestEquipment(
    SystemHeroTroopBattleTestEquipment &equipment, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemHeroTroopBattleTestEquipment),
    m_equipment(equipment)
{
    ui->setupUi(this);
    this->initialize();
    this->translate();
}

DialogSystemHeroTroopBattleTestEquipment::~DialogSystemHeroTroopBattleTestEquipment()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemHeroTroopBattleTestEquipment::initialize()
{
    int kind = m_equipment.kind();
    int id = m_equipment.weaponArmorID();
    m_equipment.updateModels();
    if (m_equipment.modelWeapons()->invisibleRootItem()->rowCount() == 0)
    {
        ui->radioButtonWeapon->setEnabled(false);
        ui->comboBoxWeapon->setEnabled(false);
    }
    if (m_equipment.modelArmors()->invisibleRootItem()->rowCount() == 0)
    {
        ui->radioButtonArmor->setEnabled(false);
        ui->comboBoxArmor->setEnabled(false);
    }
    SuperListItem::fillComboBox(ui->comboBoxWeapon, m_equipment.modelWeapons());
    SuperListItem::fillComboBox(ui->comboBoxArmor, m_equipment.modelArmors());

    switch (kind) {
    case 0:
        ui->radioButtonNone->setChecked(true);
        break;
    case 1:
        ui->radioButtonWeapon->setChecked(true);
        ui->comboBoxWeapon->setCurrentIndex(SuperListItem::getIndexById(
            m_equipment.modelWeapons()->invisibleRootItem(), id, true));
        break;
    case 2:
        ui->radioButtonArmor->setChecked(true);
        ui->comboBoxArmor->setCurrentIndex(SuperListItem::getIndexById(
            m_equipment.modelArmors()->invisibleRootItem(), id, true));
        break;
    }
}

// -------------------------------------------------------

void DialogSystemHeroTroopBattleTestEquipment::translate()
{
    this->setWindowTitle(RPM::translate(Translations::COMMON_EQUIPMENT) + RPM
        ::DOT_DOT_DOT);
    ui->radioButtonNone->setText(RPM::translate(Translations::NONE));
    ui->radioButtonWeapon->setText(RPM::translate(Translations::WEAPON) + RPM::COLON);
    ui->radioButtonArmor->setText(RPM::translate(Translations::ARMOR) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemHeroTroopBattleTestEquipment::on_radioButtonNone_toggled(bool checked)
{
    if (checked)
    {
        m_equipment.setKind(0);
    }
}

// -------------------------------------------------------

void DialogSystemHeroTroopBattleTestEquipment::on_radioButtonWeapon_toggled(bool checked)
{
    if (checked)
    {
        m_equipment.setKind(1);
        m_equipment.setWeapondArmorID(SuperListItem::getIdByIndex(m_equipment
            .modelWeapons(), ui->comboBoxWeapon->currentIndex()));
    }
    ui->comboBoxWeapon->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemHeroTroopBattleTestEquipment::on_radioButtonArmor_toggled(bool checked)
{
    if (checked)
    {
        m_equipment.setKind(2);
        m_equipment.setWeapondArmorID(SuperListItem::getIdByIndex(m_equipment
            .modelArmors(), ui->comboBoxArmor->currentIndex()));
    }
    ui->comboBoxArmor->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemHeroTroopBattleTestEquipment::on_comboBoxWeapon_currentIndexChanged(int index)
{
    m_equipment.setWeapondArmorID(SuperListItem::getIdByIndex(m_equipment.modelWeapons(), index));
}

// -------------------------------------------------------

void DialogSystemHeroTroopBattleTestEquipment::on_comboBoxArmor_currentIndexChanged(int index)
{
    m_equipment.setWeapondArmorID(SuperListItem::getIdByIndex(m_equipment.modelArmors(), index));
}
