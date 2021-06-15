/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangeexperiencecurve.h"
#include "ui_dialogcommandchangeexperiencecurve.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeExperienceCurve::DialogCommandChangeExperienceCurve(EventCommand
    *command, QStandardItemModel *properties, QStandardItemModel *parameters,
    QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandChangeExperienceCurve),
    m_properties(properties),
    m_parameters(parameters)
{
    ui->setupUi(this);
    this->initializePrimitives();
    if (command != nullptr)
    {
        this->initialize(command);
    }
    this->translate();
}

DialogCommandChangeExperienceCurve::~DialogCommandChangeExperienceCurve()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeExperienceCurve::initializePrimitives()
{
    ui->panelPrimitiveHeroEnemyInstanceID->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveHeroEnemyInstanceID->setKind(PrimitiveValueKind::Variable);
    ui->panelPrimitiveHeroEnemyInstanceID->setNumberValue(1);
    ui->comboBoxTeam->addItems(RPM::ENUM_TO_STRING_TEAM);
    ui->panelPrimitiveRange->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveRangeTo->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveTotalExperience->initializeNumber(m_parameters, m_properties);
}

// -------------------------------------------------------

void DialogCommandChangeExperienceCurve::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_EXPERIENCE_CURVE) +
        RPM::DOT_DOT_DOT);
    ui->groupBoxSelection->setTitle(RPM::translate(Translations::SELECTION));
    ui->radioButtonHeroEnemyInstanceID->setText(RPM::translate(Translations
        ::HERO_ENEMY_INSTANCE_ID) + RPM::COLON);
    ui->radioButtonEntire->setText(RPM::translate(Translations::THE_ENTIRE));
    ui->groupBoxLevel->setTitle(RPM::translate(Translations::LEVEL));
    ui->labelRange->setText(RPM::translate(Translations::RANGE) + RPM::COLON);
    ui->labelRangeTo->setText(RPM::translate(Translations::TO).toLower());
    ui->groupBoxOperation->setTitle(RPM::translate(Translations::OPERATION));
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
    ui->labelTotalExperience->setText(RPM::translate(Translations::TOTAL_EXPERIENCE) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandChangeExperienceCurve::getCommand() const
{
    QVector<QString> command;
    return new EventCommand(EventCommandKind::ChangeExperienceCurve, command);
}

// -------------------------------------------------------

void DialogCommandChangeExperienceCurve::initialize(EventCommand *command)
{
    int i = 0;
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandChangeExperienceCurve::on_radioButtonHeroEnemyInstanceID_toggled(bool checked)
{
    ui->panelPrimitiveHeroEnemyInstanceID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeExperienceCurve::on_radioButtonEntire_toggled(bool checked)
{
    ui->comboBoxTeam->setEnabled(checked);
}
