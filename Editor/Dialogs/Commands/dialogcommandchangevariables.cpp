/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangevariables.h"
#include "ui_dialogcommandchangevariables.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeVariables::DialogCommandChangeVariables(EventCommand *command
    , QStandardItemModel *properties, QStandardItemModel *parameters,
    QStandardItemModel *troopMonstersList, QWidget *parent) :
    DialogCommand(parent),
    m_properties(properties),
    m_parameters(parameters),
    m_troopMonstersList(troopMonstersList),
    m_modelObjects(nullptr),
    ui(new Ui::DialogCommandChangeVariables)
{
    ui->setupUi(this);
    this->initializePrimitives();
    if (command != nullptr)
    {
        this->initialize(command);
    }
    this->translate();
}

DialogCommandChangeVariables::~DialogCommandChangeVariables()
{
    delete ui;
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

void DialogCommandChangeVariables::initializePrimitives()
{
    ui->widgetVariableOne->initialize();
    ui->panelPrimitiveValueNumber->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveValueRandom1->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveValueRandom2->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveMessage->initializeMessage(false, m_parameters, m_properties);
    ui->panelPrimitiveSwitch->initializeSwitch(m_parameters, m_properties);
    ui->comboBoxNumberItem->addItem(RPM::translate(Translations::ITEM));
    ui->comboBoxNumberItem->addItem(RPM::translate(Translations::WEAPON));
    ui->comboBoxNumberItem->addItem(RPM::translate(Translations::ARMOR));
    ui->comboBoxCurrency->addItem(RPM::translate(Translations::OWNED));
    ui->comboBoxCurrency->addItem(RPM::translate(Translations::EARNED));
    ui->comboBoxCurrency->addItem(RPM::translate(Translations::USED));
    ui->panelPrimitiveTotalCurrency->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelCurrencies(), m_parameters,
        m_properties);
    ui->panelPrimitiveInstanceID->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveInstanceID->setKind(PrimitiveValueKind::Variable);
    ui->panelPrimitiveInstanceID->setNumberValue(1);
    ui->panelPrimitiveStatisticID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->battleSystemDatas()->modelCommonStatistics(),
        m_parameters, m_properties);
    if (RPM::isInConfig && !RPM::isInObjectConfig)
    {
        m_modelObjects = new QStandardItemModel;
        Map::setModelObjects(m_modelObjects);
    } else
    {
        m_modelObjects = RPM::get()->project()->currentMap(true)->modelObjects();
    }
    ui->panelPrimitiveValueObjectsMap->initializeDataBaseCommandId(m_modelObjects,
        m_parameters, m_properties);
    ui->comboBoxObjectMapCharacteristics->addItems(RPM::ENUM_TO_STRING_VARIABLE_MAP_OBJECT_CHARACTERISTIC);
    SuperListItem::fillComboBox(ui->comboBoxEnemy, m_troopMonstersList);
    ui->comboBoxOtherCharacteristics->addItems(RPM::ENUM_TO_STRING_CHANGE_VARIABLES_OTHER_CHARACTERISTICS);
}

//-------------------------------------------------

void DialogCommandChangeVariables::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_VARIABLES) + RPM
        ::DOT_DOT_DOT);
    ui->labelRange->setText(RPM::translate(Translations::TO).toLower());
    ui->labelRandom->setText(RPM::translate(Translations::TO).toLower());
    ui->labelInInventory->setText(RPM::translate(Translations::IN_INVENTORY).toLower());
    ui->labelStatisticID->setText(RPM::translate(Translations::STATISTIC_ID));
    ui->labelWithID->setText(RPM::translate(Translations::WITH_ID));
    ui->labelObjectMapCharacteristic->setText(RPM::translate(Translations
        ::CHARACTERISTIC).toLower() + RPM::COLON);
    ui->labelEnemyInstanceID->setText(RPM::translate(Translations::INSTANCE_ID));
    ui->radioButtonRange->setText(RPM::translate(Translations::RANGE) + RPM::COLON);
    ui->radioButtonNumber->setText(RPM::translate(Translations::NUMBER) + RPM::COLON);
    ui->radioButtonRandom->setText(RPM::translate(Translations::RANDOM) + RPM::COLON);
    ui->radioButtonSwitch->setText(RPM::translate(Translations::SWITCH) + RPM::COLON);
    ui->radioButtonMessage->setText(RPM::translate(Translations::MESSAGE) + RPM::COLON);
    ui->radioButtonOneVariable->setText(RPM::translate(Translations::ONE_VARIABLE) + RPM::COLON);
    ui->radioButtonNumberItem->setText(RPM::translate(Translations::NUMBER_OF));
    ui->radioButtonTotalCurrency->setText(RPM::translate(Translations::TOTAL_CURRENCY));
    ui->radioButtonNumberStat->setText(RPM::translate(Translations::HERO_ENEMY_INSTANCE_ID) + RPM::COLON);
    ui->radioButtonObjectInMap->setText(RPM::translate(Translations::AN_OBJECT_IN_MAP) + RPM::COLON);
    ui->radioButtonEnemy->setText(RPM::translate(Translations::ENEMY) + RPM::COLON);
    ui->radioButtonOtherCharacteristics->setText(RPM::translate(Translations::OTHER_CHARACTERISTICS) + RPM::COLON);
    ui->groupBoxValue->setTitle(RPM::translate(Translations::VALUE));
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

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeVariables::initialize(EventCommand *command)
{
    int i = 0;
    switch(command->valueCommandAt(i++).toInt())
    {
    case 0:
        ui->radioButtonOneVariable->setChecked(true);
        ui->widgetVariableOne->setCurrentId(command->valueCommandAt(i++).toInt());
        break;
    case 1:
        ui->radioButtonRange->setChecked(true);
        ui->spinBoxRange1->setValue(command->valueCommandAt(i++).toInt());
        ui->spinBoxRange2->setValue(command->valueCommandAt(i++).toInt());
        break;
    }
    switch (command->valueCommandAt(i++).toInt())
    {
    case 0:
        ui->radioButtonEquals->setChecked(true); break;
    case 1:
        ui->radioButtonPlus->setChecked(true); break;
    case 2:
        ui->radioButtonMinus->setChecked(true); break;
    case 3:
        ui->radioButtonTimes->setChecked(true); break;
    case 4:
        ui->radioButtonDivided->setChecked(true); break;
    case 5:
        ui->radioButtonModulo->setChecked(true); break;
    }
    switch(command->valueCommandAt(i++).toInt())
    {
    case 0:
        ui->radioButtonNumber->setChecked(true);
        ui->panelPrimitiveValueNumber->initializeCommand(command, i);
        break;
    case 1:
        ui->radioButtonRandom->setChecked(true);
        ui->panelPrimitiveValueRandom1->initializeCommand(command, i);
        ui->panelPrimitiveValueRandom2->initializeCommand(command, i);
        break;
    case 2:
        ui->radioButtonMessage->setChecked(true);
        ui->panelPrimitiveMessage->initializeCommand(command, i);
        break;
    case 3:
        ui->radioButtonSwitch->setChecked(true);
        ui->panelPrimitiveSwitch->initializeCommand(command, i);
        break;
    case 4:
        ui->radioButtonObjectInMap->setChecked(true);
        ui->panelPrimitiveValueObjectsMap->initializeCommand(command, i);
        ui->comboBoxObjectMapCharacteristics->setCurrentIndex(command
            ->valueCommandAt(i++).toInt());
        break;
    case 5:
        ui->radioButtonNumberItem->setChecked(true);
        ui->comboBoxNumberItem->setCurrentIndex(command->valueCommandAt(i++).toInt());
        ui->panelPrimitiveNumberItem->initializeCommand(command, i);
        break;
    case 6:
        ui->radioButtonTotalCurrency->setChecked(true);
        ui->comboBoxCurrency->setCurrentIndex(command->valueCommandAt(i++).toInt());
        ui->panelPrimitiveTotalCurrency->initializeCommand(command, i);
        break;
    case 7:
        ui->radioButtonNumberStat->setChecked(true);
        ui->panelPrimitiveInstanceID->initializeCommand(command, i);
        ui->panelPrimitiveStatisticID->initializeCommand(command, i);
        break;
    case 8:
        ui->radioButtonEnemy->setChecked(true);
        ui->comboBoxEnemy->setCurrentIndex(command->valueCommandAt(i++).toInt());
        break;
    case 9:
        ui->radioButtonOtherCharacteristics->setChecked(true);
        ui->comboBoxOtherCharacteristics->setCurrentIndex(command->valueCommandAt(i++).toInt());
        break;
    }
}

// -------------------------------------------------------

EventCommand* DialogCommandChangeVariables::getCommand() const
{
    QVector<QString> command;
    if (ui->radioButtonOneVariable->isChecked())
    {
        command.append("0");
        command.append(QString::number(ui->widgetVariableOne->currentId()));
    } else if (ui->radioButtonRange->isChecked())
    {
        command.append("1");
        command.append(ui->spinBoxRange1->text());
        command.append(ui->spinBoxRange2->text());
    }
    if (ui->radioButtonEquals->isChecked())
    {
        command.append("0");
    } else if (ui->radioButtonPlus->isChecked())
    {
        command.append("1");
    } else if (ui->radioButtonMinus->isChecked())
    {
        command.append("2");
    } else if (ui->radioButtonTimes->isChecked())
    {
        command.append("3");
    } else if (ui->radioButtonDivided->isChecked())
    {
        command.append("4");
    } else if (ui->radioButtonModulo->isChecked())
    {
        command.append("5");
    }
    if (ui->radioButtonNumber->isChecked())
    {
        command.append("0");
        ui->panelPrimitiveValueNumber->getCommand(command);
    } else if (ui->radioButtonRandom->isChecked())
    {
        command.append("1");
        ui->panelPrimitiveValueRandom1->getCommand(command);
        ui->panelPrimitiveValueRandom2->getCommand(command);
    } else if (ui->radioButtonMessage->isChecked())
    {
        command.append("2");
        ui->panelPrimitiveMessage->getCommand(command);
    } else if (ui->radioButtonSwitch->isChecked())
    {
        command.append("3");
        ui->panelPrimitiveSwitch->getCommand(command);
    } else if (ui->radioButtonObjectInMap->isChecked())
    {
        command.append("4");
        ui->panelPrimitiveValueObjectsMap->getCommand(command);
        command.append(QString::number(ui->comboBoxObjectMapCharacteristics
            ->currentIndex()));
    } else if (ui->radioButtonNumberItem->isChecked())
    {
        command.append("5");
        command.append(QString::number(ui->comboBoxNumberItem->currentIndex()));
        ui->panelPrimitiveNumberItem->getCommand(command);
    }  else if (ui->radioButtonTotalCurrency->isChecked())
    {
        command.append("6");
        command.append(QString::number(ui->comboBoxCurrency->currentIndex()));
        ui->panelPrimitiveTotalCurrency->getCommand(command);
    }  else if (ui->radioButtonNumberStat->isChecked())
    {
        command.append("7");
        ui->panelPrimitiveInstanceID->getCommand(command);
        ui->panelPrimitiveStatisticID->getCommand(command);
    }  else if (ui->radioButtonEnemy->isChecked())
    {
        command.append("8");
        command.append(QString::number(ui->comboBoxEnemy->currentIndex()));
    }  else if (ui->radioButtonOtherCharacteristics->isChecked())
    {
        command.append("9");
        command.append(QString::number(ui->comboBoxOtherCharacteristics->currentIndex()));
    }
    return new EventCommand(EventCommandKind::ChangeVariables, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonOneVariable_toggled(bool checked)
{
    ui->widgetVariableOne->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonRange_toggled(bool checked)
{
    ui->spinBoxRange1->setEnabled(checked);
    ui->labelRange->setEnabled(checked);
    ui->spinBoxRange2->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonNumber_toggled(bool checked)
{
    ui->panelPrimitiveValueNumber->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonRandom_toggled(bool checked)
{
    ui->panelPrimitiveValueRandom1->setEnabled(checked);
    ui->labelRandom->setEnabled(checked);
    ui->panelPrimitiveValueRandom2->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonMessage_toggled(bool checked)
{
    ui->panelPrimitiveMessage->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonSwitch_toggled(bool checked)
{
    ui->panelPrimitiveSwitch->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonNumberItem_toggled(bool checked)
{
    ui->comboBoxNumberItem->setEnabled(checked);
    ui->panelPrimitiveNumberItem->setEnabled(checked);
    ui->labelInInventory->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonTotalCurrency_toggled(bool checked)
{
    ui->comboBoxCurrency->setEnabled(checked);
    ui->labelWithID->setEnabled(checked);
    ui->panelPrimitiveTotalCurrency->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonNumberStat_toggled(bool checked)
{
    ui->panelPrimitiveInstanceID->setEnabled(checked);
    ui->labelStatisticID->setEnabled(checked);
    ui->panelPrimitiveStatisticID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonObjectInMap_toggled(bool checked)
{
    ui->panelPrimitiveValueObjectsMap->setEnabled(checked);
    ui->labelObjectMapCharacteristic->setEnabled(checked);
    ui->comboBoxObjectMapCharacteristics->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonEnemy_toggled(bool checked)
{
    ui->comboBoxEnemy->setEnabled(checked);
    ui->labelEnemyInstanceID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonOtherCharacteristics_toggled(bool checked)
{
    ui->comboBoxOtherCharacteristics->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_comboBoxNumberItem_currentIndexChanged(int index)
{
    QStandardItemModel *model = nullptr;
    switch (index) {
    case 0:
        model = RPM::get()->project()->gameDatas()->itemsDatas()->model();
        break;
    case 1:
        model = RPM::get()->project()->gameDatas()->weaponsDatas()->model();
        break;
    case 2:
        model = RPM::get()->project()->gameDatas()->armorsDatas()->model();
        break;
    }
    ui->panelPrimitiveNumberItem->clear();
    ui->panelPrimitiveNumberItem->initializeDataBaseCommandId(model, m_parameters,
        m_properties);
}
