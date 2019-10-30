/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
    SystemCommonObject *object, QStandardItemModel *parameters, bool hideElse,
    QWidget *parent) :
    DialogCommand(parent),
    m_object(object),
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
}

DialogCommandConditions::~DialogCommandConditions()
{
    delete ui;
    delete m_groupButtonMain;
    delete m_groupButtonHeroesMain;
    delete m_groupButtonHeroesEquiped;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandConditions::initializePrimitives() {
    QStandardItemModel *properties;

    properties = nullptr;
    if (m_object != nullptr){
        properties = m_object->modelProperties();
    }

    // Radios groups
    m_groupButtonMain = new QButtonGroup;
    m_groupButtonMain->addButton(ui->radioButtonVariableParamProp);
    m_groupButtonMain->addButton(ui->radioButtonHeroes);
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
        m_parameters, properties);
    ui->panelPrimitiveVariableParamPropValue->showVariable();
    ui->comboBoxVariableOperation->addItems(RPM::ENUM_TO_STRING_OPERATION);
    ui->panelPrimitiveVariableParamPropTestValue->initializeProperty(
        m_parameters, properties);
    ui->panelPrimitiveVariableParamPropTestValue->showNumberDouble();
    ui->comboBoxHeroes->addItems(RPM::ENUM_TO_STRING_CONDITION_HEROES);
    ui->panelPrimitiveHeroInstanceID->initializeNumber(m_parameters, properties);
    ui->panelPrimitiveHeroInstanceID->showVariable();
    ui->panelPrimitiveHeroInstanceID->hide();
    ui->comboBoxHeroTeam->addItems(RPM::ENUM_TO_STRING_TEAM);
    ui->panelPrimitiveHeroesNamed->initializeMessage(false, m_parameters,
        properties);
    ui->comboBoxHeroInTeam->addItems(RPM::ENUM_TO_STRING_TEAM);
    ui->panelPrimitiveHeroesSkillID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->skillsDatas()->model(), m_parameters,
        properties);
    ui->panelPrimitiveHeroesEquipedWeaponID->initializeDataBaseCommandId(RPM
        ::get()->project()->gameDatas()->weaponsDatas()->model(), m_parameters,
        properties);
    ui->panelPrimitiveHeroesEquipedArmorID->initializeDataBaseCommandId(RPM
        ::get()->project()->gameDatas()->armorsDatas()->model(), m_parameters,
        properties);
    ui->panelPrimitiveHeroesStatusID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->statusDatas()->model(), m_parameters,
        properties);
    ui->panelPrimitiveHeroesStatisticID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->battleSystemDatas()->modelCommonStatistics(),
        m_parameters, properties);
    ui->comboBoxStatisticOperation->addItems(RPM::ENUM_TO_STRING_OPERATION);
    ui->panelPrimitiveHeroesStatisticValue->initializeProperty(m_parameters,
        properties);
    ui->panelPrimitiveHeroesStatisticValue->showNumberDouble();

    this->on_radioButtonHeroes_toggled(false);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandConditions::initialize(EventCommand *command) {
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
    case 1:
    {
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
    default:
        break;
    }
    ui->tabWidget->setCurrentIndex(tabIndex);
}

// -------------------------------------------------------

EventCommand* DialogCommandConditions::getCommand() const {
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
    }

    return new EventCommand(EventCommandKind::If, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandConditions::on_radioButtonVariableParamProp_clicked(bool
    checked)
{
    // Impossible to uncheck manually
    if (!checked) {
        ui->radioButtonVariableParamProp->setChecked(true);
    }
}

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

void DialogCommandConditions::on_radioButtonHeroes_clicked(bool checked) {
    // Impossible to uncheck manually
    if (!checked) {
        ui->radioButtonHeroes->setChecked(true);
    }
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
    //ui->radioButtonHeroesStatus->setEnabled(checked);
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
