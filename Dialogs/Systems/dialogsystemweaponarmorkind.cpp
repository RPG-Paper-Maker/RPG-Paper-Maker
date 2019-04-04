/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
