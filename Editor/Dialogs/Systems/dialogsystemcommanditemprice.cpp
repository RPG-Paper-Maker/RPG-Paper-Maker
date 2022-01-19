/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemcommanditemprice.h"
#include "ui_dialogsystemcommanditemprice.h"
#include "systemcost.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemCommandItemPrice::DialogSystemCommandItemPrice(SystemCommandItemPrice
    &itemPrice, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemCommandItemPrice),
    m_itemPrice(itemPrice)
{
    ui->setupUi(this);
    this->initialize();
    this->translate();
}

DialogSystemCommandItemPrice::~DialogSystemCommandItemPrice()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemCommandItemPrice::initialize() {
    switch (m_itemPrice.selectionItem()) {
    case 0:
        ui->radioButtonItemID->setChecked(true);
        break;
    case 1:
        ui->radioButtonWeaponID->setChecked(true);
        break;
    case 2:
        ui->radioButtonArmorID->setChecked(true);
        break;
    }
    ui->panelPrimitiveValueItemID->initializeDataBaseAndUpdate(m_itemPrice.itemID());
    ui->panelPrimitiveValueWeaponID->initializeDataBaseAndUpdate(m_itemPrice.weaponID());
    ui->panelPrimitiveValueArmorID->initializeDataBaseAndUpdate(m_itemPrice.armorID());
    switch (m_itemPrice.selectionPrice()) {
    case 0:
        ui->radioButtonPriceDefault->setChecked(true);
        break;
    case 1:
        ui->radioButtonPriceSpecific->setChecked(true);
        break;
    }
    ui->treeViewPriceSpecific->initializeNewItemInstance(new SystemCost(
        DamagesKind::Currency, new PrimitiveValue(PrimitiveValueKind::DataBase,
        1), new PrimitiveValue(PrimitiveValueKind::DataBase, 1), 1, new
        PrimitiveValue(QString("1"))));
    ui->treeViewPriceSpecific->initializeModel(m_itemPrice.specificPrice());
    switch (m_itemPrice.selectionStock()) {
    case 0:
        ui->radioButtonStockUnlimited->setChecked(true);
        break;
    case 1:
        ui->radioButtonStockSpecific->setChecked(true);
        break;
    }
    ui->panelPrimitiveValueStockSpecific->initializeNumberAndUpdate(m_itemPrice
        .specificStock());
}

// -------------------------------------------------------

void DialogSystemCommandItemPrice::translate() {
    this->setWindowTitle(RPM::translate(Translations::ITEM) + RPM::SPACE + RPM
        ::SLASH + RPM::SPACE + RPM::translate(Translations::PRICE) + RPM::SPACE +
        RPM::SLASH + RPM::SPACE + RPM::translate(Translations::STOCK));
    ui->groupBoxItem->setTitle(RPM::translate(Translations::ITEM));
    ui->radioButtonItemID->setText(RPM::translate(Translations::ITEM_ID) + RPM::COLON);
    ui->radioButtonWeaponID->setText(RPM::translate(Translations::WEAPON_ID) + RPM::COLON);
    ui->radioButtonArmorID->setText(RPM::translate(Translations::ARMOR_ID) + RPM::COLON);
    ui->groupBoxPrice->setTitle(RPM::translate(Translations::PRICE));
    ui->radioButtonPriceDefault->setText(RPM::translate(Translations::DEFAULT));
    ui->radioButtonPriceSpecific->setText(RPM::translate(Translations::SPECIFIC) + RPM::COLON);
    ui->groupBoxStock->setTitle(RPM::translate(Translations::STOCK));
    ui->radioButtonStockUnlimited->setText(RPM::translate(Translations::UNLIMITED));
    ui->radioButtonStockSpecific->setText(RPM::translate(Translations::SPECIFIC) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemCommandItemPrice::on_radioButtonItemID_toggled(bool checked)
{
    ui->panelPrimitiveValueItemID->setEnabled(checked);
    if (checked)
    {
        m_itemPrice.setSelectionItem(0);
    }
}

// -------------------------------------------------------

void DialogSystemCommandItemPrice::on_radioButtonWeaponID_toggled(bool checked)
{
    ui->panelPrimitiveValueWeaponID->setEnabled(checked);
    if (checked)
    {
        m_itemPrice.setSelectionItem(1);
    }
}

void DialogSystemCommandItemPrice::on_radioButtonArmorID_toggled(bool checked)
{
    ui->panelPrimitiveValueArmorID->setEnabled(checked);
    if (checked)
    {
        m_itemPrice.setSelectionItem(2);
    }
}

// -------------------------------------------------------

void DialogSystemCommandItemPrice::on_radioButtonPriceSpecific_toggled(bool checked)
{
    ui->treeViewPriceSpecific->setEnabled(checked);
    m_itemPrice.setSelectionPrice(checked ? 1 : 0);
}

// -------------------------------------------------------

void DialogSystemCommandItemPrice::on_radioButtonStockSpecific_toggled(bool checked)
{
    ui->panelPrimitiveValueStockSpecific->setEnabled(checked);
    m_itemPrice.setSelectionStock(checked ? 1 : 0);
}
