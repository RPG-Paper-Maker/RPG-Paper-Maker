/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemweaponarmorkind.h"
#include "ui_dialogsystemweaponarmorkind.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemWeaponArmorKind::DialogSystemWeaponArmorKind(
        SystemWeaponArmorKind &weaponArmorKind,
        QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemWeaponArmorKind),
    m_weaponArmorKind(weaponArmorKind)
{
    ui->setupUi(this);
    

    initialize();
}

DialogSystemWeaponArmorKind::~DialogSystemWeaponArmorKind()
{
    delete ui->treeViewEquipment->model();
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemWeaponArmorKind::initialize(){
    ui->widgetName->initializeNamesLang(&m_weaponArmorKind);
    ui->treeViewEquipment->setModel(m_weaponArmorKind.getEquipmentModel());
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemWeaponArmorKind::accept() {
    m_weaponArmorKind.updateByModel(static_cast<QStandardItemModel*>(
        ui->treeViewEquipment->model()));
    QDialog::accept();
}
