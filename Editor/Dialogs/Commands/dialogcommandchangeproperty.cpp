/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangeproperty.h"
#include "ui_dialogcommandchangeproperty.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeProperty::DialogCommandChangeProperty(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    m_properties(properties),
    m_parameters(parameters),
    ui(new Ui::DialogCommandChangeProperty)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        this->initialize(command);
    }

    this->translate();
}

DialogCommandChangeProperty::~DialogCommandChangeProperty() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeProperty::initializePrimitives() {
    ui->panelPrimitivePropertyIDValue->initializeDataBaseCommandId(m_properties,
        m_parameters, nullptr);
    ui->panelPrimitiveNewValue->initializeProperty(m_parameters, m_properties);
    ui->panelPrimitiveNewValue->showNumberDouble();
}

// -------------------------------------------------------

void DialogCommandChangeProperty::initialize(EventCommand *command) {
    int i;

    i = 0;
    ui->panelPrimitivePropertyIDValue->initializeCommand(command,i);

    // Operation
    switch(command->valueCommandAt(i++).toInt()) {
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

    ui->panelPrimitiveNewValue->initializeCommand(command, i);
}

//-------------------------------------------------

void DialogCommandChangeProperty::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_PROPERTY) + RPM
        ::DOT_DOT_DOT);
    ui->labelNewValue->setText(RPM::translate(Translations::NEW_VALUE) + RPM
        ::COLON);
    ui->labelPropertyID->setText(RPM::translate(Translations::PROPERTY_ID) + RPM
        ::COLON);
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

EventCommand* DialogCommandChangeProperty::getCommand() const{
    QVector<QString> command;

    ui->panelPrimitivePropertyIDValue->getCommand(command);
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
    ui->panelPrimitiveNewValue->getCommand(command);

    return new EventCommand(EventCommandKind::ChangeProperty, command);
}
