/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

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
    , SystemCommonObject *object, QStandardItemModel *parameters, QWidget
    *parent) :
    DialogCommand(parent),
    m_object(object),
    m_parameters(parameters),
    m_modelObjects(nullptr),
    ui(new Ui::DialogCommandChangeVariables)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        this->initialize(command);
    }

    this->translate();
}

DialogCommandChangeVariables::~DialogCommandChangeVariables()
{
    delete ui;

    if (RPM::isInConfig && !RPM::isInObjectConfig) {
        SuperListItem::deleteModel(m_modelObjects);
    }
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeVariables::initializePrimitives() {
    QStandardItemModel *properties;

    properties = nullptr;
    if (m_object != nullptr){
        properties = m_object->modelProperties();
    }

    ui->widgetVariableOne->initialize();
    ui->panelPrimitiveValueNumber->initializeNumber(m_parameters, properties);
    ui->panelPrimitiveValueRandom1->initializeNumber(m_parameters, properties);
    ui->panelPrimitiveValueRandom2->initializeNumber(m_parameters, properties);
    ui->panelPrimitiveMessage->initializeMessage(false, m_parameters, properties);
    ui->panelPrimitiveSwitch->initializeSwitch(m_parameters, properties);
    ui->panelPrimitiveValueInstanceID->initializeNumber(m_parameters, properties);
    ui->panelPrimitiveValueNumberItem->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->weaponsDatas()->model(), m_parameters,
        properties);
    ui->panelPrimitiveValueStatisticID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->battleSystemDatas()->modelCommonStatistics(),
        m_parameters, properties);
    ui->panelPrimitiveValueTotalCurrency->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelCurrencies(), m_parameters
        , properties);
    if (RPM::isInConfig && !RPM::isInObjectConfig) {
        m_modelObjects = new QStandardItemModel;
        Map::setModelObjects(m_modelObjects);
    } else {
        m_modelObjects = RPM::get()->project()->currentMap(true)->modelObjects();
    }
    ui->panelPrimitiveValueObjectsMap->initializeDataBaseCommandId(
        m_modelObjects, m_parameters, properties);
    ui->comboBoxObjectMapCharacteristics->addItems(RPM
        ::ENUM_TO_STRING_VARIABLE_MAP_OBJECT_CHARACTERISTIC);
}

//-------------------------------------------------

void DialogCommandChangeVariables::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_VARIABLES) + RPM
        ::DOT_DOT_DOT);
    ui->labelRange->setText(RPM::translate(Translations::TO).toLower());
    ui->labelRandom->setText(RPM::translate(Translations::RANDOM) + RPM::COLON);
    ui->labelObjectMapCharacteristic->setText(RPM::translate(Translations
        ::CHARACTERISTIC).toLower() + RPM::COLON);
    ui->radioButtonRange->setText(RPM::translate(Translations::RANGE) + RPM
        ::COLON);
    ui->radioButtonNumber->setText(RPM::translate(Translations::NUMBER) + RPM
        ::COLON);
    ui->radioButtonRandom->setText(RPM::translate(Translations::RANDOM) + RPM
        ::COLON);
    ui->radioButtonMessage->setText(RPM::translate(Translations::MESSAGE) + RPM
        ::COLON);
    ui->radioButtonOneVariable->setText(RPM::translate(Translations
        ::ONE_VARIABLE) + RPM::COLON);
    ui->radioButtonObjectInMap->setText(RPM::translate(Translations
        ::AN_OBJECT_IN_MAP) + RPM::COLON);
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

void DialogCommandChangeVariables::initialize(EventCommand *command) {
    int i = 0;

    switch(command->valueCommandAt(i++).toInt()) {
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
    switch (command->valueCommandAt(i++).toInt()) {
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
    switch(command->valueCommandAt(i++).toInt()) {
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
    }
}

// -------------------------------------------------------

EventCommand* DialogCommandChangeVariables::getCommand() const{
    QVector<QString> command;

    if (ui->radioButtonOneVariable->isChecked()) {
        command.append("0");
        command.append(QString::number(ui->widgetVariableOne->currentId()));
    } else if (ui->radioButtonRange->isChecked()) {
        command.append("1");
        command.append(ui->spinBoxRange1->text());
        command.append(ui->spinBoxRange2->text());
    }
    if (ui->radioButtonEquals->isChecked()) {
        command.append("0");
    } else if (ui->radioButtonPlus->isChecked()) {
        command.append("1");
    } else if (ui->radioButtonMinus->isChecked()) {
        command.append("2");
    } else if (ui->radioButtonTimes->isChecked()) {
        command.append("3");
    } else if (ui->radioButtonDivided->isChecked()) {
        command.append("4");
    } else if (ui->radioButtonModulo->isChecked()) {
        command.append("5");
    }
    if (ui->radioButtonNumber->isChecked()) {
        command.append("0");
        ui->panelPrimitiveValueNumber->getCommand(command);
    } else if (ui->radioButtonRandom->isChecked()) {
        command.append("1");
        ui->panelPrimitiveValueRandom1->getCommand(command);
        ui->panelPrimitiveValueRandom2->getCommand(command);
    } else if (ui->radioButtonMessage->isChecked()) {
        command.append("2");
        ui->panelPrimitiveMessage->getCommand(command);
    } else if (ui->radioButtonSwitch->isChecked()) {
        command.append("3");
        ui->panelPrimitiveSwitch->getCommand(command);
    } else if (ui->radioButtonObjectInMap->isChecked()) {
        command.append("4");
        ui->panelPrimitiveValueObjectsMap->getCommand(command);
        command.append(QString::number(ui->comboBoxObjectMapCharacteristics
            ->currentIndex()));
    }

    return new EventCommand(EventCommandKind::ChangeVariables, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonOneVariable_toggled(bool
    checked)
{
    ui->widgetVariableOne->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonRange_toggled(bool checked) {
    ui->spinBoxRange1->setEnabled(checked);
    ui->labelRange->setEnabled(checked);
    ui->spinBoxRange2->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonNumber_toggled(bool checked) {
    ui->panelPrimitiveValueNumber->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonRandom_toggled(bool checked) {
    ui->panelPrimitiveValueRandom1->setEnabled(checked);
    ui->labelRandom->setEnabled(checked);
    ui->panelPrimitiveValueRandom2->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonMessage_toggled(bool checked) {
    ui->panelPrimitiveMessage->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonSwitch_toggled(bool checked) {
    ui->panelPrimitiveSwitch->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonObjectInMap_toggled(bool
    checked)
{
    ui->panelPrimitiveValueObjectsMap->setEnabled(checked);
    ui->labelObjectMapCharacteristic->setEnabled(checked);
    ui->comboBoxObjectMapCharacteristics->setEnabled(checked);
}
