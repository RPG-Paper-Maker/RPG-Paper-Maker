/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemloot.h"
#include "ui_dialogsystemloot.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemLoot::DialogSystemLoot(SystemLoot &loot, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemLoot),
    m_loot(loot)
{
    ui->setupUi(this);

    initialize();
}

DialogSystemLoot::~DialogSystemLoot() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemLoot::initialize() {
    // Connect
    connect(ui->radioButtonItem, SIGNAL(toggled(bool)), this, SLOT(
        on_radioButtonItemToggled(bool)));
    connect(ui->radioButtonWeapon, SIGNAL(toggled(bool)), this, SLOT(
        on_radioButtonWeaponToggled(bool)));
    connect(ui->radioButtonArmor, SIGNAL(toggled(bool)), this, SLOT(
        on_radioButtonArmorToggled(bool)));

    // Numbers
    ui->widgetVariableConstantNumber->initializeNumberVariable();
    ui->widgetVariableConstantNumber->initializeModel(m_loot.number());
    ui->widgetVariableConstantNumber->updateModel();
    ui->widgetVariableConstantProbability->initializeNumberVariable();
    ui->widgetVariableConstantProbability->initializeModel(m_loot.probability());
    ui->widgetVariableConstantProbability->updateModel();
    ui->panelPrimitiveValueInit->initializeNumberVariable();
    ui->panelPrimitiveValueInit->initializeModel(m_loot.initialLevel());
    ui->panelPrimitiveValueInit->updateModel();
    ui->panelPrimitiveValueFinal->initializeNumberVariable();
    ui->panelPrimitiveValueFinal->initializeModel(m_loot.finalLevel());
    ui->panelPrimitiveValueFinal->updateModel();

    // Loots
    ui->panelPrimitiveValueItem->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->itemsDatas()->model(), nullptr, nullptr);
    ui->panelPrimitiveValueWeapon->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->weaponsDatas()->model(), nullptr, nullptr);
    ui->panelPrimitiveValueArmor->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->armorsDatas()->model(), nullptr, nullptr);
    PanelPrimitiveValue *panel = nullptr;
    switch(m_loot.kind()) {
    case LootKind::Item:
        m_loot.lootID()->setModelDataBase(RPM::get()->project()->gameDatas()
            ->itemsDatas()->model());
        panel = ui->panelPrimitiveValueItem;
        ui->radioButtonItem->setChecked(true);
        break;
    case LootKind::Weapon:
        m_loot.lootID()->setModelDataBase(RPM::get()->project()->gameDatas()
            ->weaponsDatas()->model());
        panel = ui->panelPrimitiveValueWeapon;
        ui->radioButtonWeapon->setChecked(true);
        break;
    case LootKind::Armor:
        m_loot.lootID()->setModelDataBase(RPM::get()->project()->gameDatas()
            ->armorsDatas()->model());
        panel = ui->panelPrimitiveValueArmor;
        ui->radioButtonArmor->setChecked(true);
        break;
    }
    ui->panelPrimitiveValueItem->initializeModel(m_loot.lootID());
    ui->panelPrimitiveValueWeapon->initializeModel(m_loot.lootID());
    ui->panelPrimitiveValueArmor->initializeModel(m_loot.lootID());
    panel->updateModel();
}

// -------------------------------------------------------

void DialogSystemLoot::radioChanged(bool checked, LootKind kind) {

    // Getting all the informations according to loot kind
    QStandardItemModel *model = nullptr;
    PanelPrimitiveValue *panel = nullptr;
    switch (kind){
    case LootKind::Item:
        model = RPM::get()->project()->gameDatas()->itemsDatas()->model();
        panel = ui->panelPrimitiveValueItem;
        //ui->radioButtonItem->setChecked(checked);
        break;
    case LootKind::Weapon:
        model = RPM::get()->project()->gameDatas()->weaponsDatas()->model();
        panel = ui->panelPrimitiveValueWeapon;
        //ui->radioButtonWeapon->setChecked(true);
        break;
    case LootKind::Armor:
        model = RPM::get()->project()->gameDatas()->armorsDatas()->model();
        panel = ui->panelPrimitiveValueArmor;
        //ui->radioButtonArmor->setChecked(true);
        break;
    }

    panel->setEnabled(checked);
    if (checked) {
        m_loot.lootID()->setModelDataBase(model);
        m_loot.setKind(kind);
        panel->updateKind(true);
        panel->updateValue();
        m_loot.updateName();
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemLoot::on_radioButtonItemToggled(bool checked) {
    radioChanged(checked, LootKind::Item);
}

// -------------------------------------------------------

void DialogSystemLoot::on_radioButtonWeaponToggled(bool checked) {
    radioChanged(checked, LootKind::Weapon);
}

// -------------------------------------------------------

void DialogSystemLoot::on_radioButtonArmorToggled(bool checked) {
    radioChanged(checked, LootKind::Armor);
}
