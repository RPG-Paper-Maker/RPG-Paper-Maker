/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangeastatistic.h"
#include "ui_dialogcommandchangeastatistic.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeAStatistic::DialogCommandChangeAStatistic(EventCommand
    *command, QStandardItemModel *properties, QStandardItemModel *parameters,
    QWidget *parent) :
    DialogCommand(parent),
    m_properties(properties),
    m_parameters(parameters),
    ui(new Ui::DialogCommandChangeAStatistic)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        initialize(command);
    }

    this->translate();
}

DialogCommandChangeAStatistic::~DialogCommandChangeAStatistic()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeAStatistic::initializePrimitives()
{
    ui->comboBoxTeam->addItems(RPM::ENUM_TO_STRING_TEAM);
    ui->panelPrimitiveStatisticID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->battleSystemDatas()->modelCommonStatistics(),
        m_parameters, m_properties);
    ui->panelPrimitiveHeroEnemyInstanceID->initializeNumber(m_parameters,
        m_properties);
    ui->panelPrimitiveHeroEnemyInstanceID->showVariable();
    ui->panelPrimitiveHeroEnemyInstanceID->setNumberValue(1);
    ui->panelPrimiteValueNumber->initializeNumber(m_parameters, m_properties);
    ui->panelPrimiteValueFormula->initializeMessage(true, m_parameters,
        m_properties);
}

//-------------------------------------------------

void DialogCommandChangeAStatistic::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_A_STATISTIC) + RPM
        ::DOT_DOT_DOT);
    ui->labelStatisticID->setText(RPM::translate(Translations::STATISTIC_ID) +
        RPM::COLON);
    ui->groupBoxSelection->setTitle(RPM::translate(Translations::SELECTION));
    ui->radioButtonHeroEnemyInstanceID->setText(RPM::translate(Translations
        ::HERO_ENEMY_INSTANCE_ID) + RPM::COLON);
    ui->radioButtonEntire->setText(RPM::translate(Translations::THE_ENTIRE));
    ui->groupBoxOperation->setTitle(RPM::translate(Translations::OPERATION));
    ui->groupBoxValue->setTitle(RPM::translate(Translations::VALUE));
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
    ui->radioButtonValueMax->setText(RPM::translate(Translations
        ::MAXIMUM_STATISTIC_VALUE));
    ui->checkBoxCanAboveMax->setText(RPM::translate(Translations
        ::CAN_GO_ABOVE_MAXIMUM_VALUE));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeAStatistic::initialize(EventCommand *command) {
    int i = 0;
    ui->panelPrimitiveStatisticID->initializeCommand(command, i);
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
    switch (command->valueCommandAt(i++).toInt())
    {
    case 0:
        ui->radioButtonValueNumber->setChecked(true);
        ui->panelPrimiteValueNumber->initializeCommand(command, i);
        break;
    case 1:
        ui->radioButtonValueFormula->setChecked(true);
        ui->panelPrimiteValueFormula->initializeCommand(command, i);
        break;
    case 2:
        ui->radioButtonValueMax->setChecked(true);
        break;
    }
    ui->checkBoxCanAboveMax->setChecked(RPM::stringToBool(command
        ->valueCommandAt(i++)));
}

// -------------------------------------------------------

EventCommand * DialogCommandChangeAStatistic::getCommand() const{
    QVector<QString> command;

    ui->panelPrimitiveStatisticID->getCommand(command);
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
    if (ui->radioButtonValueNumber->isChecked())
    {
        command.append("0");
        ui->panelPrimiteValueNumber->getCommand(command);
    }
    if (ui->radioButtonValueFormula->isChecked())
    {
        command.append("1");
        ui->panelPrimiteValueFormula->getCommand(command);
    }
    if (ui->radioButtonValueMax->isChecked())
    {
        command.append("2");
    }
    command.append(RPM::boolToString(ui->checkBoxCanAboveMax->isChecked()));

    return new EventCommand(EventCommandKind::ChangeAStatistic, command);
}
