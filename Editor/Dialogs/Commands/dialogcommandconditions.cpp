/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandconditions.h"
#include "ui_dialogcommandconditions.h"
#include "rpm.h"
#include "conditionheroeskind.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandConditions::DialogCommandConditions(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters, bool hideElse,
    QWidget *parent) :
    DialogCommand(parent),
    m_properties(properties),
    m_parameters(parameters),
    ui(new Ui::DialogCommandConditions)
{
    ui->setupUi(this);

    if (hideElse) {
        ui->checkBox->hide();
    }

    this->initializePrimitives();

    if (command != nullptr) {
        initialize(command);
    }

    this->translate();
}

DialogCommandConditions::~DialogCommandConditions()
{
    delete ui;
    delete m_groupButtonMain;
    delete m_groupButtonHeroesMain;
    delete m_groupButtonHeroesEquiped;
    if (RPM::isInConfig && !RPM::isInObjectConfig)
    {
        SuperListItem::deleteModel(m_modelObjects);
    }
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandConditions::initializePrimitives() {
    // Radios groups
    m_groupButtonMain = new QButtonGroup;
    m_groupButtonMain->addButton(ui->radioButtonVariableParamProp);
    m_groupButtonMain->addButton(ui->radioButtonHeroes);
    m_groupButtonMain->addButton(ui->radioButtonCurrency);
    m_groupButtonMain->addButton(ui->radioButtonItem);
    m_groupButtonMain->addButton(ui->radioButtonWeapon);
    m_groupButtonMain->addButton(ui->radioButtonArmor);
    m_groupButtonMain->addButton(ui->radioButtonOthersKey);
    m_groupButtonMain->addButton(ui->radioButtonEscapedLastBattle);
    m_groupButtonMain->addButton(ui->radioButtonChronometerID);
    m_groupButtonMain->addButton(ui->radioButtonOthersScript);
    m_groupButtonMain->addButton(ui->radioButtonObjectIDLookingAt);
    m_groupButtonHeroesMain = new QButtonGroup;
    m_groupButtonHeroesMain->addButton(ui->radioButtonHeroesNamed);
    m_groupButtonHeroesMain->addButton(ui->radioButtonHeroesInTeam);
    m_groupButtonHeroesMain->addButton(ui->radioButtonHeroesSkill);
    m_groupButtonHeroesMain->addButton(ui->radioButtonHeroesEquiped);
    m_groupButtonHeroesMain->addButton(ui->radioButtonHeroesStatus);
    m_groupButtonHeroesMain->addButton(ui->radioButtonHeroesStatistic);
    m_groupButtonHeroesEquiped = new QButtonGroup;
    m_groupButtonHeroesEquiped->addButton(ui->radioButtonHeroesEquipedWeapon);
    m_groupButtonHeroesEquiped->addButton(ui->radioButtonHeroesEquipedArmor);
    ui->radioButtonHeroesNamed->setChecked(true);
    ui->radioButtonHeroesEquipedWeapon->setChecked(true);

    // Primitives
    ui->panelPrimitiveVariableParamPropValue->initializeVariableParamProp(
        m_parameters, m_properties);
    ui->panelPrimitiveVariableParamPropValue->showVariable();
    ui->comboBoxVariableOperation->addItems(RPM::ENUM_TO_STRING_OPERATION);
    ui->panelPrimitiveVariableParamPropTestValue->initializeProperty(
        m_parameters, m_properties);
    ui->panelPrimitiveVariableParamPropTestValue->showNumberDouble();

    // Heroes
    ui->comboBoxHeroes->addItems(RPM::ENUM_TO_STRING_CONDITION_HEROES);
    ui->panelPrimitiveHeroInstanceID->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveHeroInstanceID->showVariable();
    ui->panelPrimitiveHeroInstanceID->hide();
    ui->comboBoxHeroTeam->addItems(RPM::ENUM_TO_STRING_TEAM);
    ui->panelPrimitiveHeroesNamed->initializeMessage(false, m_parameters,
        m_properties);
    ui->comboBoxHeroInTeam->addItems(RPM::ENUM_TO_STRING_TEAM);
    ui->panelPrimitiveHeroesSkillID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->skillsDatas()->model(), m_parameters,
        m_properties);
    ui->panelPrimitiveHeroesEquipedWeaponID->initializeDataBaseCommandId(RPM
        ::get()->project()->gameDatas()->weaponsDatas()->model(), m_parameters,
        m_properties);
    ui->panelPrimitiveHeroesEquipedArmorID->initializeDataBaseCommandId(RPM
        ::get()->project()->gameDatas()->armorsDatas()->model(), m_parameters,
        m_properties);
    ui->panelPrimitiveHeroesStatusID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->statusDatas()->model(), m_parameters,
        m_properties);
    ui->panelPrimitiveHeroesStatisticID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->battleSystemDatas()->modelCommonStatistics(),
        m_parameters, m_properties);
    ui->comboBoxStatisticOperation->addItems(RPM::ENUM_TO_STRING_OPERATION);
    ui->panelPrimitiveHeroesStatisticValue->initializeProperty(m_parameters,
        m_properties);
    ui->panelPrimitiveHeroesStatisticValue->showNumberDouble();

    // Possessions
    ui->panelPrimitiveCurrencyID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelCurrencies(), m_parameters
        , m_properties);
    ui->comboBoxOperationCurrency->addItems(RPM::ENUM_TO_STRING_OPERATION);
    ui->panelPrimitiveCurrencyValue->initializeNumber(m_parameters, m_properties,
        false);
    ui->panelPrimitiveItemID->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->itemsDatas()->model(), m_parameters, m_properties);
    ui->comboBoxOperationItem->addItems(RPM::ENUM_TO_STRING_OPERATION);
    ui->panelPrimitiveItemValue->initializeNumber(m_parameters, m_properties,
        false);
    ui->panelPrimitiveWeaponID->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->weaponsDatas()->model(), m_parameters, m_properties);
    ui->comboBoxOperationWeapon->addItems(RPM::ENUM_TO_STRING_OPERATION);
    ui->panelPrimitiveWeaponValue->initializeNumber(m_parameters, m_properties,
        false);
    ui->panelPrimitiveArmorID->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->armorsDatas()->model(), m_parameters, m_properties);
    ui->comboBoxOperationArmor->addItems(RPM::ENUM_TO_STRING_OPERATION);
    ui->panelPrimitiveArmorValue->initializeNumber(m_parameters, m_properties,
        false);

    // Others
    ui->panelPrimitiveOthersKeyID->initializeDataBaseCommandId(RPM::get()
        ->project()->keyBoardDatas()->model(), m_parameters, m_properties);
    ui->panelPrimitiveOthersKeyValue->initializeSwitch(m_parameters, m_properties);
    ui->panelPrimitiveChronometerID->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveChronometerID->setKind(PrimitiveValueKind::Variable);
    ui->panelPrimitiveChronometerID->setNumberValue(1);
    ui->comboBoxChronometerOperation->addItems(RPM::ENUM_TO_STRING_OPERATION);
    ui->panelPrimitiveChronometerSeconds->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveOthersScript->initializeMessage(true, m_parameters,
        m_properties);

    // Model objects
    if (RPM::isInConfig && !RPM::isInObjectConfig)
    {
        m_modelObjects = new QStandardItemModel;
        Map::setModelObjects(m_modelObjects);
    } else
    {
        m_modelObjects = RPM::get()->project()->currentMap(true)->modelObjects();
    }
    ui->panelPrimitiveObjectID->initializeDataBaseCommandId(m_modelObjects,
        m_parameters, m_properties);
    ui->comboBoxObjectLookingAt->addItems(RPM::ENUM_TO_STRING_ORIENTATION_KIND);
    this->on_radioButtonHeroes_toggled(false);
}

//-------------------------------------------------

void DialogCommandConditions::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CONDITION) + RPM
        ::DOT_DOT_DOT);
    ui->labelVariable->setText(RPM::translate(Translations::IS));
    ui->labelOthersKey->setText(RPM::translate(Translations::IS));
    ui->labelCurrencyIs->setText(RPM::translate(Translations::IS));
    ui->labelItemInventory->setText(RPM::translate(Translations
        ::NUMBER_IN_INVENTORY_IS));
    ui->labelArmorInventory->setText(RPM::translate(Translations
        ::NUMBER_IN_INVENTORY_IS));
    ui->labelWeaponInventory->setText(RPM::translate(Translations
        ::NUMBER_IN_INVENTORY_IS));
    ui->radioButtonItem->setText(RPM::translate(Translations::ITEM_ID) + RPM
        ::COLON);
    ui->radioButtonArmor->setText(RPM::translate(Translations::ARMOR_ID) + RPM
        ::COLON);
    ui->radioButtonHeroes->setText(RPM::translate(Translations::HERO_MAYBE_MORE));
    ui->radioButtonWeapon->setText(RPM::translate(Translations::WEAPON_ID) + RPM
        ::COLON);
    ui->radioButtonCurrency->setText(RPM::translate(Translations::CURRENCY_ID) +
        RPM::COLON);
    ui->radioButtonOthersKey->setText(RPM::translate(Translations::KEY_ID) + RPM
        ::COLON);
    ui->radioButtonHeroesNamed->setText(RPM::translate(Translations::ARE_NAMED));
    ui->radioButtonHeroesSkill->setText(RPM::translate(Translations
        ::ARE_ABLE_SKILL_ID));
    ui->radioButtonHeroesInTeam->setText(RPM::translate(Translations::ARE_IN));
    ui->radioButtonHeroesStatus->setText(RPM::translate(Translations
        ::ARE_UNDER_EFFECT_STATUS_ID));
    ui->radioButtonOthersScript->setText(RPM::translate(Translations::SCRIPT) +
        RPM::COLON);
    ui->radioButtonHeroesEquiped->setText(RPM::translate(Translations
        ::ARE_EQUIPED_WITH));
    ui->radioButtonHeroesStatistic->setText(RPM::translate(Translations
        ::HAVE_STATISTIC_ID));
    ui->radioButtonVariableParamProp->setText(RPM::translate(Translations::THIS_MESSAGE));
    ui->radioButtonHeroesEquipedArmor->setText(RPM::translate(Translations
        ::ARMOR_ID) + RPM::COLON);
    ui->radioButtonHeroesEquipedWeapon->setText(RPM::translate(Translations
        ::WEAPON_ID) + RPM::COLON);
    ui->radioButtonEscapedLastBattle->setText(RPM::translate(Translations
        ::ESCAPED_LAST_BATTLE));
    ui->tabWidget->setTabText(0, RPM::translate(Translations
        ::VARIABLES_PARAM_PROP));
    ui->tabWidget->setTabText(1, RPM::translate(Translations::HEROES));
    ui->tabWidget->setTabText(2, RPM::translate(Translations::POSSESSIONS));
    ui->tabWidget->setTabText(3, RPM::translate(Translations::OTHERS));
    ui->checkBox->setText(RPM::translate(Translations
        ::ADD_ELSE_CONDITIONS_NOT_APPLY));
    ui->checkBoxInTeam->setText(RPM::translate(Translations::IN_MESSAGE));
    ui->checkBoxArmorEquiped->setText(RPM::translate(Translations
        ::CHECK_ARMORS_EQUIPED_TOO));
    ui->checkBoxWeaponEquiped->setText(RPM::translate(Translations
        ::CHECK_WEAPONS_EQUIPED_TOO));
    ui->radioButtonObjectIDLookingAt->setText(RPM::translate(Translations
        ::OBJECT_ID) + RPM::COLON);
    ui->labelIsLookingAt->setText(RPM::translate(Translations::IS_LOOKING_AT).toLower());
    ui->radioButtonChronometerID->setText(RPM::translate(Translations::CHRONOMETER_ID) + RPM::COLON);
    ui->labelSeconds->setText(RPM::translate(Translations::SECONDS).toLower());
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandConditions::initialize(EventCommand *command)
{
    int i, tabIndex;

    i = 0;
    ui->checkBox->setChecked(RPM::stringToBool(command->valueCommandAt(i++)));
    tabIndex = 0;
    switch (command->valueCommandAt(i++).toInt()) {
    case 0:
        ui->radioButtonVariableParamProp->setChecked(true);
        ui->panelPrimitiveVariableParamPropValue->initializeCommand(command, i);
        ui->comboBoxVariableOperation->setCurrentIndex(command->valueCommandAt(
            i++).toInt());
        ui->panelPrimitiveVariableParamPropTestValue->initializeCommand(command,
            i);
        break;
    case 1: {
        ui->radioButtonHeroes->setChecked(true);
        ui->comboBoxHeroes->setCurrentIndex(command->valueCommandAt(i++).toInt());
        if (ui->comboBoxHeroes->currentIndex() == static_cast<int>(
            ConditionHeroesKind::TheHeroeWithInstanceID))
        {
            ui->panelPrimitiveHeroInstanceID->initializeCommand(command, i);
        }
        ui->checkBoxInTeam->setChecked(RPM::stringToBool(command->valueCommandAt
            (i++)));
        if (ui->checkBoxInTeam->isChecked()) {
            ui->comboBoxHeroTeam->setCurrentIndex(command->valueCommandAt(i++)
                .toInt());
        }
        switch (command->valueCommandAt(i++).toInt()) {
        case 0:
            ui->radioButtonHeroesNamed->setChecked(true);
            ui->panelPrimitiveHeroesNamed->initializeCommand(command, i);
            break;
        case 1:
            ui->radioButtonHeroesInTeam->setChecked(true);
            ui->comboBoxHeroInTeam->setCurrentIndex(command->valueCommandAt(i++)
                .toInt());
            break;
        case 2:
            ui->radioButtonHeroesSkill->setChecked(true);
            ui->panelPrimitiveHeroesSkillID->initializeCommand(command, i);
            break;
        case 3:
            ui->radioButtonHeroesEquiped->setChecked(true);
            switch (command->valueCommandAt(i++).toInt()) {
            case 0:
                ui->radioButtonHeroesEquipedWeapon->setChecked(true);
                ui->panelPrimitiveHeroesEquipedWeaponID->initializeCommand(
                    command, i);
                break;
            case 1:
                ui->radioButtonHeroesEquipedArmor->setChecked(true);
                ui->panelPrimitiveHeroesEquipedArmorID->initializeCommand(
                    command, i);
                break;
            }
            break;
        case 4:
            ui->radioButtonHeroesStatus->setChecked(true);
            ui->panelPrimitiveHeroesStatusID->initializeCommand(command, i);
            break;
        case 5:
            ui->radioButtonHeroesStatistic->setChecked(true);
            ui->panelPrimitiveHeroesStatisticID->initializeCommand(command, i);
            ui->comboBoxStatisticOperation->setCurrentIndex(command
                ->valueCommandAt(i++).toInt());
            ui->panelPrimitiveHeroesStatisticValue->initializeCommand(command, i);
            break;
        }
        tabIndex = 1;
        break;
    }
    case 2: {
        ui->radioButtonCurrency->setChecked(true);
        ui->panelPrimitiveCurrencyID->initializeCommand(command, i);
        ui->comboBoxOperationCurrency->setCurrentIndex(command->valueCommandAt(
            i++).toInt());
        ui->panelPrimitiveCurrencyValue->initializeCommand(command, i);
        tabIndex = 2;
        break;
    }
    case 3: {
        ui->radioButtonItem->setChecked(true);
        ui->panelPrimitiveItemID->initializeCommand(command, i);
        ui->comboBoxOperationItem->setCurrentIndex(command->valueCommandAt(
            i++).toInt());
        ui->panelPrimitiveItemValue->initializeCommand(command, i);
        tabIndex = 2;
        break;
    }
    case 4: {
        ui->radioButtonWeapon->setChecked(true);
        ui->panelPrimitiveWeaponID->initializeCommand(command, i);
        ui->comboBoxOperationWeapon->setCurrentIndex(command->valueCommandAt(
            i++).toInt());
        ui->panelPrimitiveWeaponValue->initializeCommand(command, i);
        ui->checkBoxWeaponEquiped->setChecked(RPM::stringToBool(command
            ->valueCommandAt(i++)));
        tabIndex = 2;
        break;
    }
    case 5: {
        ui->radioButtonArmor->setChecked(true);
        ui->panelPrimitiveArmorID->initializeCommand(command, i);
        ui->comboBoxOperationArmor->setCurrentIndex(command->valueCommandAt(
            i++).toInt());
        ui->panelPrimitiveArmorValue->initializeCommand(command, i);
        ui->checkBoxArmorEquiped->setChecked(RPM::stringToBool(command
            ->valueCommandAt(i++)));
        tabIndex = 2;
        break;
    }
    case 6: {
        ui->radioButtonOthersKey->setChecked(true);
        ui->panelPrimitiveOthersKeyID->initializeCommand(command, i);
        ui->panelPrimitiveOthersKeyValue->initializeCommand(command, i);
        tabIndex = 3;
        break;
    }
    case 7: {
        ui->radioButtonOthersScript->setChecked(true);
        ui->panelPrimitiveOthersScript->initializeCommand(command, i);
        tabIndex = 3;
        break;
    }
    case 8: {
        ui->radioButtonEscapedLastBattle->setChecked(true);
        tabIndex = 3;
        break;
    }
    case 9: {
        ui->radioButtonObjectIDLookingAt->setChecked(true);
        ui->panelPrimitiveObjectID->initializeCommand(command, i);
        ui->comboBoxObjectLookingAt->setCurrentIndex(command->valueCommandAt(i++)
            .toInt());
        tabIndex = 3;
        break;
    }
    case 10: {
        ui->radioButtonChronometerID->setChecked(true);
        ui->panelPrimitiveChronometerID->initializeCommand(command, i);
        ui->comboBoxChronometerOperation->setCurrentIndex(command->valueCommandAt(i++).toInt());
        ui->panelPrimitiveChronometerSeconds->initializeCommand(command, i);
        tabIndex = 3;
        break;
    }
    default:
        break;
    }
    ui->tabWidget->setCurrentIndex(tabIndex);
}

// -------------------------------------------------------

EventCommand * DialogCommandConditions::getCommand() const {
    QVector<QString> command;
    command.append(RPM::boolToString(ui->checkBox->isChecked()));
    if (ui->radioButtonVariableParamProp->isChecked()) {
        command.append("0");
        ui->panelPrimitiveVariableParamPropValue->getCommand(command);
        command.append(QString::number(ui->comboBoxVariableOperation->currentIndex()));
        ui->panelPrimitiveVariableParamPropTestValue->getCommand(command);
    } else if (ui->radioButtonHeroes->isChecked()) {
        command.append("1");
        command.append(QString::number(ui->comboBoxHeroes->currentIndex()));
        if (ui->comboBoxHeroes->currentIndex() == static_cast<int>(
            ConditionHeroesKind::TheHeroeWithInstanceID))
        {
            ui->panelPrimitiveHeroInstanceID->getCommand(command);
        }
        command.append(RPM::boolToString(ui->checkBoxInTeam->isChecked()));
        if (ui->checkBoxInTeam->isChecked()) {
            command.append(QString::number(ui->comboBoxHeroTeam->currentIndex()));
        }
        if (ui->radioButtonHeroesNamed->isChecked()) {
            command.append("0");
            ui->panelPrimitiveHeroesNamed->getCommand(command);
        } else if (ui->radioButtonHeroesInTeam->isChecked()) {
            command.append("1");
            command.append(QString::number(ui->comboBoxHeroInTeam->currentIndex()));
        } else if (ui->radioButtonHeroesSkill->isChecked()) {
            command.append("2");
            ui->panelPrimitiveHeroesSkillID->getCommand(command);
        } else if (ui->radioButtonHeroesEquiped->isChecked()) {
            command.append("3");
            if (ui->radioButtonHeroesEquipedWeapon->isChecked()) {
                command.append("0");
                ui->panelPrimitiveHeroesEquipedWeaponID->getCommand(command);
            } else if (ui->radioButtonHeroesEquipedArmor->isChecked()) {
                command.append("1");
                ui->panelPrimitiveHeroesEquipedArmorID->getCommand(command);
            }
        } else if (ui->radioButtonHeroesStatus->isChecked()) {
            command.append("4");
            ui->panelPrimitiveHeroesStatusID->getCommand(command);
        } else if (ui->radioButtonHeroesStatistic->isChecked()) {
            command.append("5");
            ui->panelPrimitiveHeroesStatisticID->getCommand(command);
            command.append(QString::number(ui->comboBoxStatisticOperation
                ->currentIndex()));
            ui->panelPrimitiveHeroesStatisticValue->getCommand(command);
        }
    } else if (ui->radioButtonCurrency->isChecked()) {
        command.append("2");
        ui->panelPrimitiveCurrencyID->getCommand(command);
        command.append(QString::number(ui->comboBoxOperationCurrency
            ->currentIndex()));
        ui->panelPrimitiveCurrencyValue->getCommand(command);
    } else if (ui->radioButtonItem->isChecked()) {
        command.append("3");
        ui->panelPrimitiveItemID->getCommand(command);
        command.append(QString::number(ui->comboBoxOperationItem
            ->currentIndex()));
        ui->panelPrimitiveItemValue->getCommand(command);
    } else if (ui->radioButtonWeapon->isChecked()) {
        command.append("4");
        ui->panelPrimitiveWeaponID->getCommand(command);
        command.append(QString::number(ui->comboBoxOperationWeapon
            ->currentIndex()));
        ui->panelPrimitiveWeaponValue->getCommand(command);
        command.append(RPM::boolToString(ui->checkBoxWeaponEquiped->isChecked()));
    } else if (ui->radioButtonArmor->isChecked()) {
        command.append("5");
        ui->panelPrimitiveArmorID->getCommand(command);
        command.append(QString::number(ui->comboBoxOperationArmor
            ->currentIndex()));
        ui->panelPrimitiveArmorValue->getCommand(command);
        command.append(RPM::boolToString(ui->checkBoxArmorEquiped->isChecked()));
    } else if (ui->radioButtonOthersKey->isChecked()) {
        command.append("6");
        ui->panelPrimitiveOthersKeyID->getCommand(command);
        ui->panelPrimitiveOthersKeyValue->getCommand(command);
    } else if (ui->radioButtonOthersScript->isChecked()) {
        command.append("7");
        ui->panelPrimitiveOthersScript->getCommand(command);
    } else if (ui->radioButtonEscapedLastBattle->isChecked()) {
        command.append("8");
    } else if (ui->radioButtonObjectIDLookingAt->isChecked()) {
        command.append("9");
        ui->panelPrimitiveObjectID->getCommand(command);
        command.append(QString::number(ui->comboBoxObjectLookingAt->currentIndex()));
    } else if (ui->radioButtonChronometerID->isChecked()) {
        command.append("10");
        ui->panelPrimitiveChronometerID->getCommand(command);
        command.append(QString::number(ui->comboBoxChronometerOperation->currentIndex()));
        ui->panelPrimitiveChronometerSeconds->getCommand(command);
    }
    return new EventCommand(EventCommandKind::If, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonVariableParamProp_toggled(bool
    checked)
{
    ui->panelPrimitiveVariableParamPropValue->setEnabled(checked);
    ui->labelVariable->setEnabled(checked);
    ui->comboBoxVariableOperation->setEnabled(checked);
    ui->panelPrimitiveVariableParamPropTestValue->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonHeroes_toggled(bool checked) {
    ui->comboBoxHeroes->setEnabled(checked);
    ui->panelPrimitiveHeroInstanceID->setEnabled(checked);
    ui->checkBoxInTeam->setEnabled(checked);
    ui->comboBoxHeroTeam->setEnabled(checked);
    ui->radioButtonHeroesNamed->setEnabled(checked);
    this->on_radioButtonHeroesNamed_toggled(checked && ui
        ->radioButtonHeroesNamed->isChecked());
    ui->radioButtonHeroesInTeam->setEnabled(checked);
    this->on_radioButtonHeroesInTeam_toggled(checked && ui
        ->radioButtonHeroesInTeam->isChecked());
    ui->radioButtonHeroesSkill->setEnabled(checked);
    this->on_radioButtonHeroesSkill_toggled(checked && ui
        ->radioButtonHeroesSkill->isChecked());
    ui->radioButtonHeroesEquiped->setEnabled(checked);
    this->on_radioButtonHeroesEquiped_toggled(checked && ui
        ->radioButtonHeroesEquiped->isChecked());
    ui->radioButtonHeroesStatus->setEnabled(checked);
    this->on_radioButtonHeroesStatus_toggled(checked && ui
        ->radioButtonHeroesStatus->isChecked());
    ui->radioButtonHeroesStatistic->setEnabled(checked);
    this->on_radioButtonHeroesStatistic_toggled(checked && ui
        ->radioButtonHeroesStatistic->isChecked());
}

// -------------------------------------------------------

void DialogCommandConditions::on_comboBoxHeroes_currentIndexChanged(int index) {
    ui->panelPrimitiveHeroInstanceID->setVisible(index == static_cast<int>(
        ConditionHeroesKind::TheHeroeWithInstanceID));
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonHeroesNamed_toggled(bool checked) {
    ui->panelPrimitiveHeroesNamed->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonHeroesInTeam_toggled(bool checked) {
    ui->comboBoxHeroInTeam->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonHeroesSkill_toggled(bool checked) {
    ui->panelPrimitiveHeroesSkillID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonHeroesEquiped_toggled(bool checked)
{
    ui->radioButtonHeroesEquipedWeapon->setEnabled(checked);
    ui->radioButtonHeroesEquipedArmor->setEnabled(checked);
    this->on_radioButtonHeroesEquipedWeapon_toggled(checked && ui
        ->radioButtonHeroesEquipedWeapon->isChecked());
    this->on_radioButtonHeroesEquipedArmor_toggled(checked && ui
        ->radioButtonHeroesEquipedArmor->isChecked());
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonHeroesEquipedWeapon_toggled(bool
    checked)
{
    ui->panelPrimitiveHeroesEquipedWeaponID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonHeroesEquipedArmor_toggled(bool
    checked)
{
    ui->panelPrimitiveHeroesEquipedArmorID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonHeroesStatus_toggled(bool checked) {
    ui->panelPrimitiveHeroesStatusID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonHeroesStatistic_toggled(bool checked)
{
    ui->panelPrimitiveHeroesStatisticID->setEnabled(checked);
    ui->comboBoxStatisticOperation->setEnabled(checked);
    ui->panelPrimitiveHeroesStatisticValue->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonCurrency_toggled(bool checked) {
    ui->panelPrimitiveCurrencyID->setEnabled(checked);
    ui->labelCurrencyIs->setEnabled(checked);
    ui->comboBoxOperationCurrency->setEnabled(checked);
    ui->panelPrimitiveCurrencyValue->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonItem_toggled(bool checked) {
    ui->panelPrimitiveItemID->setEnabled(checked);
    ui->labelItemInventory->setEnabled(checked);
    ui->comboBoxOperationItem->setEnabled(checked);
    ui->panelPrimitiveItemValue->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonWeapon_toggled(bool checked) {
    ui->panelPrimitiveWeaponID->setEnabled(checked);
    ui->labelWeaponInventory->setEnabled(checked);
    ui->comboBoxOperationWeapon->setEnabled(checked);
    ui->panelPrimitiveWeaponValue->setEnabled(checked);
    ui->checkBoxWeaponEquiped->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonArmor_toggled(bool checked) {
    ui->panelPrimitiveArmorID->setEnabled(checked);
    ui->labelArmorInventory->setEnabled(checked);
    ui->comboBoxOperationArmor->setEnabled(checked);
    ui->panelPrimitiveArmorValue->setEnabled(checked);
    ui->checkBoxArmorEquiped->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonOthersKey_toggled(bool checked) {
    ui->panelPrimitiveOthersKeyID->setEnabled(checked);
    ui->labelOthersKey->setEnabled(checked);
    ui->panelPrimitiveOthersKeyValue->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonObjectIDLookingAt_toggled(bool checked)
{
    ui->panelPrimitiveObjectID->setEnabled(checked);
    ui->labelIsLookingAt->setEnabled(checked);
    ui->comboBoxObjectLookingAt->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonChronometerID_toggled(bool checked)
{
    ui->panelPrimitiveChronometerID->setEnabled(checked);
    ui->comboBoxChronometerOperation->setEnabled(checked);
    ui->panelPrimitiveChronometerSeconds->setEnabled(checked);
    ui->labelSeconds->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonOthersScript_toggled(bool checked) {
    ui->panelPrimitiveOthersScript->setEnabled(checked);
}
