/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#include "dialogcommandmodifyinventory.h"
#include "ui_dialogcommandmodifyinventory.h"
#include "superlistitem.h"
#include "wanok.h"

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
    SuperListItem::fillComboBox(ui->comboBoxItem, Wanok::get()->project()
                                ->gameDatas()->itemsDatas()->model());
    SuperListItem::fillComboBox(ui->comboBoxWeapon, Wanok::get()->project()
                                ->gameDatas()->weaponsDatas()->model());
    SuperListItem::fillComboBox(ui->comboBoxArmor, Wanok::get()->project()
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
        item = Wanok::get()->project()->gameDatas()->itemsDatas()->model()
               ->invisibleRootItem();
        ui->comboBoxItem->setCurrentIndex(SuperListItem::getIndexById(item,
                                                                      id));
        break;
    case 1:
        ui->radioButtonWeapon->setChecked(true);
        item = Wanok::get()->project()->gameDatas()->weaponsDatas()->model()
               ->invisibleRootItem();
        ui->comboBoxWeapon->setCurrentIndex(SuperListItem::getIndexById(item,
                                                                        id));
        break;
    case 2:
        ui->radioButtonArmor->setChecked(true);
        item = Wanok::get()->project()->gameDatas()->weaponsDatas()->model()
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
        QStandardItem* item = Wanok::get()->project()->gameDatas()
                              ->itemsDatas()->model()->item(index);
        command.append(QString::number(((SuperListItem*)item->data()
                                        .value<quintptr>())->id()));
    }
    else if (ui->radioButtonWeapon->isChecked()){
        command.append("1");
        int index = ui->comboBoxWeapon->currentIndex();
        QStandardItem* item = Wanok::get()->project()->gameDatas()
                              ->weaponsDatas()->model()->item(index);
        command.append(QString::number(((SuperListItem*)item->data()
                                        .value<quintptr>())->id()));
    }
    else if (ui->radioButtonArmor->isChecked()){
        command.append("2");
        int index = ui->comboBoxArmor->currentIndex();
        QStandardItem* item = Wanok::get()->project()->gameDatas()
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
