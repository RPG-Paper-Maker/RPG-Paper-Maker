/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

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

DialogCommandModifyInventory::DialogCommandModifyInventory(EventCommand *command
    , QStandardItemModel *properties, QStandardItemModel *parameters, QWidget
    *parent) :
    DialogCommand(parent),
    m_properties(properties),
    m_parameters(parameters),
    ui(new Ui::DialogCommandModifyInventory)
{
    ui->setupUi(this);
    ui->panelPrimitiveItemID->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->itemsDatas()->model(), m_parameters, m_properties);
    ui->panelPrimitiveWeaponID->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->weaponsDatas()->model(), m_parameters, m_properties);
    ui->panelPrimitiveArmorID->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->armorsDatas()->model(), m_parameters, m_properties);
    ui->panelPrimitiveNumber->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveNumber->setNumberValue(1);
    if (command != nullptr)
    {
        initialize(command);
    }

    this->translate();
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

void DialogCommandModifyInventory::translate()
{
    this->setWindowTitle(RPM::translate(Translations::MODIFY_INVENTORY) + RPM
        ::DOT_DOT_DOT);
    ui->radioButtonItem->setText(RPM::translate(Translations::ITEM_ID) + RPM
        ::COLON);
    ui->radioButtonArmor->setText(RPM::translate(Translations::ARMOR_ID) + RPM
        ::COLON);
    ui->radioButtonWeapon->setText(RPM::translate(Translations::WEAPON_ID) + RPM
        ::COLON);
    ui->groupBoxNumber->setTitle(RPM::translate(Translations::NUMBER));
    ui->groupBoxOperation->setTitle(RPM::translate(Translations::OPERATION));
    ui->groupBoxSelection->setTitle(RPM::translate(Translations::SELECTION));
    ui->radioButtonPlus->setText(RPM::PARENTHESIS_LEFT + RPM::PLUS + RPM
        ::PARENTHESIS_RIGHT + RPM::translate(Translations::PLUS));
    ui->radioButtonMinus->setText(RPM::PARENTHESIS_LEFT + RPM::MINUS + RPM
        ::PARENTHESIS_RIGHT + RPM::translate(Translations::MINUS));
    ui->radioButtonTimes->setText(RPM::PARENTHESIS_LEFT + RPM::TIMES + RPM
        ::PARENTHESIS_RIGHT + RPM::translate(Translations::TIMES));
    ui->radioButtonEquals->setText(RPM::PARENTHESIS_LEFT + RPM::EQUAL + RPM
        ::PARENTHESIS_RIGHT + RPM::translate(Translations::EQUALS));
    ui->radioButtonModulo->setText(RPM::PARENTHESIS_LEFT + RPM::MODULO + RPM
        ::PARENTHESIS_RIGHT + RPM::translate(Translations::MODULO));
    ui->radioButtonDivided->setText(RPM::PARENTHESIS_LEFT + RPM::DIVIDED_BY +
        RPM::PARENTHESIS_RIGHT + RPM::translate(Translations::DIVIDED_BY));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

void DialogCommandModifyInventory::initialize(EventCommand* command){
    int i = 0;

    // Selection
    int type = command->valueCommandAt(i++).toInt();
    switch(type)
    {
    case 0:
        ui->panelPrimitiveItemID->initializeCommand(command, i);
        ui->radioButtonItem->setChecked(true);
        break;
    case 1:
        ui->panelPrimitiveWeaponID->initializeCommand(command, i);
        ui->radioButtonWeapon->setChecked(true);
        break;
    case 2:
        ui->panelPrimitiveArmorID->initializeCommand(command, i);
        ui->radioButtonArmor->setChecked(true);
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
    ui->panelPrimitiveNumber->initializeCommand(command, i);
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
        ui->panelPrimitiveItemID->getCommand(command);
    }
    else if (ui->radioButtonWeapon->isChecked()){
        command.append("1");
        ui->panelPrimitiveWeaponID->getCommand(command);
    }
    else if (ui->radioButtonArmor->isChecked()){
        command.append("2");
        ui->panelPrimitiveArmorID->getCommand(command);
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
    ui->panelPrimitiveNumber->getCommand(command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandModifyInventory::on_radioButtonItem_toggled(bool checked){
    ui->panelPrimitiveItemID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandModifyInventory::on_radioButtonWeapon_toggled(bool checked){
    ui->panelPrimitiveWeaponID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandModifyInventory::on_radioButtonArmor_toggled(bool checked){
    ui->panelPrimitiveArmorID->setEnabled(checked);
}
