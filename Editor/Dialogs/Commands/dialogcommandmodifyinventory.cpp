/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandmodifyinventory.h"
#include "ui_dialogcommandmodifyinventory.h"
#include "superlistitem.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandModifyInventory::DialogCommandModifyInventory(
        EventCommand *command,
        QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandModifyInventory)
{
    ui->setupUi(this);
    
    ui->widgetNumber->initializeNumberVariable();

    // Initilize comboBoxes
    SuperListItem::fillComboBox(ui->comboBoxItem, RPM::get()->project()
                                ->gameDatas()->itemsDatas()->model());
    SuperListItem::fillComboBox(ui->comboBoxWeapon, RPM::get()->project()
                                ->gameDatas()->weaponsDatas()->model());
    SuperListItem::fillComboBox(ui->comboBoxArmor, RPM::get()->project()
                                ->gameDatas()->armorsDatas()->model());

    if (command != nullptr) initialize(command);
}

DialogCommandModifyInventory::~DialogCommandModifyInventory()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandModifyInventory::initialize(EventCommand* command){
    int i = 0;

    // Selection
    int type = command->valueCommandAt(i++).toInt();
    int id = command->valueCommandAt(i++).toInt();
    QStandardItem* item;
    switch(type){
    case 0:
        ui->radioButtonItem->setChecked(true);
        item = RPM::get()->project()->gameDatas()->itemsDatas()->model()
               ->invisibleRootItem();
        ui->comboBoxItem->setCurrentIndex(SuperListItem::getIndexById(item,
                                                                      id));
        break;
    case 1:
        ui->radioButtonWeapon->setChecked(true);
        item = RPM::get()->project()->gameDatas()->weaponsDatas()->model()
               ->invisibleRootItem();
        ui->comboBoxWeapon->setCurrentIndex(SuperListItem::getIndexById(item,
                                                                        id));
        break;
    case 2:
        ui->radioButtonArmor->setChecked(true);
        item = RPM::get()->project()->gameDatas()->weaponsDatas()->model()
               ->invisibleRootItem();
        ui->comboBoxWeapon->setCurrentIndex(SuperListItem::getIndexById(item,
                                                                        id));
        break;
    }

    // Operation
    switch(command->valueCommandAt(i++).toInt()){
    case 0: ui->radioButtonEquals->setChecked(true); break;
    case 1: ui->radioButtonPlus->setChecked(true); break;
    case 2: ui->radioButtonMinus->setChecked(true); break;
    case 3: ui->radioButtonTimes->setChecked(true); break;
    case 4: ui->radioButtonDivided->setChecked(true); break;
    case 5: ui->radioButtonModulo->setChecked(true); break;
    }

    // Value
    ui->widgetNumber->initializeCommand(command, i);
}

// -------------------------------------------------------

EventCommand* DialogCommandModifyInventory::getCommand() const{
    QVector<QString> command;
    selection(command);
    operation(command);
    value(command);

    return new EventCommand(EventCommandKind::ModifyInventory, command);
}

// -------------------------------------------------------

void DialogCommandModifyInventory::selection(QVector<QString>& command) const{
    if (ui->radioButtonItem->isChecked()){
        command.append("0");
        int index = ui->comboBoxItem->currentIndex();
        QStandardItem* item = RPM::get()->project()->gameDatas()
                              ->itemsDatas()->model()->item(index);
        command.append(QString::number(((SuperListItem*)item->data()
                                        .value<quintptr>())->id()));
    }
    else if (ui->radioButtonWeapon->isChecked()){
        command.append("1");
        int index = ui->comboBoxWeapon->currentIndex();
        QStandardItem* item = RPM::get()->project()->gameDatas()
                              ->weaponsDatas()->model()->item(index);
        command.append(QString::number(((SuperListItem*)item->data()
                                        .value<quintptr>())->id()));
    }
    else if (ui->radioButtonArmor->isChecked()){
        command.append("2");
        int index = ui->comboBoxArmor->currentIndex();
        QStandardItem* item = RPM::get()->project()->gameDatas()
                              ->armorsDatas()->model()->item(index);
        command.append(QString::number(((SuperListItem*)item->data()
                                        .value<quintptr>())->id()));
    }
}

// -------------------------------------------------------

void DialogCommandModifyInventory::operation(QVector<QString>& command) const{
    if (ui->radioButtonEquals->isChecked()) command.append("0");
    else if (ui->radioButtonPlus->isChecked()) command.append("1");
    else if (ui->radioButtonMinus->isChecked()) command.append("2");
    else if (ui->radioButtonTimes->isChecked()) command.append("3");
    else if (ui->radioButtonDivided->isChecked()) command.append("4");
    else if (ui->radioButtonModulo->isChecked()) command.append("5");
}

// -------------------------------------------------------

void DialogCommandModifyInventory::value(QVector<QString> &command) const{
    ui->widgetNumber->getCommand(command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandModifyInventory::on_radioButtonItem_toggled(bool checked){
    ui->comboBoxItem->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandModifyInventory::on_radioButtonWeapon_toggled(bool checked){
    ui->comboBoxWeapon->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandModifyInventory::on_radioButtonArmor_toggled(bool checked){
    ui->comboBoxArmor->setEnabled(checked);
}
