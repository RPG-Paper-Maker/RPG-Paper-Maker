/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangeequipment.h"
#include "ui_dialogcommandchangeequipment.h"
#include "systemweapon.h"
#include "systemarmor.h"
#include "systemweaponarmorkind.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeEquipment::DialogCommandChangeEquipment(EventCommand *command
    , SystemCommonObject *object, QStandardItemModel *parameters, QWidget
    *parent) :
    DialogCommand(parent),
    m_object(object),
    m_parameters(parameters),
    m_properties(nullptr),
    m_weaponsArmors(new QStandardItemModel),
    ui(new Ui::DialogCommandChangeEquipment)
{
    ui->setupUi(this);

    connect(ui->panelPrimitiveEquipmentID, SIGNAL(numberUpdated(int)), this,
        SLOT(onPanelPrimitiveEquipmentID_numberUpdated(int)));

    this->initializePrimitives();

    if (command != nullptr) {
        initialize(command);
    }

    this->translate();
}

DialogCommandChangeEquipment::~DialogCommandChangeEquipment()
{
    delete ui;

    delete m_weaponsArmors;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeEquipment::initializePrimitives()
{
    if (m_object != nullptr)
    {
        m_properties = m_object->modelProperties();
    }

    ui->comboBoxTeam->addItems(RPM::ENUM_TO_STRING_TEAM);
    ui->comboBoxWeaponArmor->addItem(RPM::translate(Translations::WEAPON_ID));
    ui->comboBoxWeaponArmor->addItem(RPM::translate(Translations::ARMOR_ID));
    ui->panelPrimitiveEquipmentID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->battleSystemDatas()->modelCommonEquipment(),
        m_parameters, m_properties);
    ui->panelPrimitiveHeroEnemyInstanceID->initializeNumber(m_parameters,
        m_properties);
    ui->panelPrimitiveHeroEnemyInstanceID->showVariable();
    ui->panelPrimitiveHeroEnemyInstanceID->setNumberValue(1);
}

//-------------------------------------------------

void DialogCommandChangeEquipment::updateWeaponsArmors(int id)
{
    ui->panelPrimitiveWeaponArmorID->clear();
    m_weaponsArmors->clear();
    //delete m_weaponsArmors;
    if (ui->comboBoxWeaponArmor->currentIndex() == 0)
    {
        SuperListItem::getWeaponsList(m_weaponsArmors, id);
    } else
    {
        SuperListItem::getArmorsList(m_weaponsArmors, id);
    }
    ui->panelPrimitiveWeaponArmorID->initializeDataBaseCommandId(m_weaponsArmors
        , m_parameters, m_properties);
}

//-------------------------------------------------

void DialogCommandChangeEquipment::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_EQUIPMENT) + RPM
        ::DOT_DOT_DOT);
    ui->labelEquipmentID->setText(RPM::translate(Translations::EQUIMENT_ID) +
        RPM::COLON);
    ui->groupBoxSelection->setTitle(RPM::translate(Translations::SELECTION));
    ui->radioButtonHeroEnemyInstanceID->setText(RPM::translate(Translations
        ::HERO_ENEMY_INSTANCE_ID) + RPM::COLON);
    ui->radioButtonEntire->setText(RPM::translate(Translations::THE_ENTIRE));
    ui->checkBoxApply->setText(RPM::translate(Translations
        ::APPLY_ONLY_IF_IN_INVENTORY));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeEquipment::initialize(EventCommand *command)
{
    int i = 0;
    ui->panelPrimitiveEquipmentID->initializeCommand(command, i);
    ui->comboBoxWeaponArmor->setCurrentIndex(RPM::stringToBool(command
        ->valueCommandAt(i++)) ? 0 : 1);
    ui->panelPrimitiveWeaponArmorID->initializeCommand(command, i);
    switch (command->valueCommandAt(i++).toInt())
    {
    case 0:
        ui->radioButtonHeroEnemyInstanceID->setChecked(true);
        ui->panelPrimitiveHeroEnemyInstanceID->initializeCommand(command, i);
        break;
    case 1:
        ui->radioButtonEntire->setChecked(true);
        ui->comboBoxTeam->setCurrentIndex(command->valueCommandAt(i++).toInt());
        break;
    }
    ui->checkBoxApply->setChecked(RPM::stringToBool(command->valueCommandAt(i++)));
}

// -------------------------------------------------------

EventCommand * DialogCommandChangeEquipment::getCommand() const
{
    QVector<QString> command;

    ui->panelPrimitiveEquipmentID->getCommand(command);
    command.append(RPM::boolToString(ui->comboBoxWeaponArmor->currentIndex() ==
        0));
    ui->panelPrimitiveWeaponArmorID->getCommand(command);
    if (ui->radioButtonHeroEnemyInstanceID->isChecked())
    {
        command.append("0");
        ui->panelPrimitiveHeroEnemyInstanceID->getCommand(command);
    }
    if (ui->radioButtonEntire->isChecked())
    {
        command.append("1");
        command.append(QString::number(ui->comboBoxTeam->currentIndex()));
    }
    command.append(RPM::boolToString(ui->checkBoxApply->isChecked()));

    return new EventCommand(EventCommandKind::ChangeEquipment, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandChangeEquipment::onPanelPrimitiveEquipmentID_numberUpdated(int
    id)
{
    this->updateWeaponsArmors(id);

    // If result empty, automatically try to switch weapon or armor
    if (m_weaponsArmors->invisibleRootItem()->rowCount() == 0)
    {
        ui->comboBoxWeaponArmor->setCurrentIndex(ui->comboBoxWeaponArmor
            ->currentIndex() == 0 ? 1 : 0);
    }
}

// -------------------------------------------------------

void DialogCommandChangeEquipment::on_comboBoxWeaponArmor_currentIndexChanged(
    int)
{
    this->updateWeaponsArmors(ui->panelPrimitiveEquipmentID->model()
        ->numberValue());
}
