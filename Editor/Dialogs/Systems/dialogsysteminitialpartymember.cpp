/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsysteminitialpartymember.h"
#include "ui_dialogsysteminitialpartymember.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemInitialPartyMember::DialogSystemInitialPartyMember(
    SystemInitialPartyMember &model, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemInitialPartyMember),
    m_model(model)
{
    ui->setupUi(this);
    this->initialize();
    this->translate();
}

DialogSystemInitialPartyMember::~DialogSystemInitialPartyMember()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemInitialPartyMember::initialize()
{
    ui->panelPrimitiveValueLevel->initializeNumberAndUpdate(m_model.level());
    int index = static_cast<int>(m_model.teamKind());
    ui->comboBoxInstanceTeam->addItems(RPM::ENUM_TO_STRING_TEAM);
    ui->comboBoxInstanceTeam->setCurrentIndex(index);
    if (!m_model.isHero())
    {
        ui->radioButtonMonster->setChecked(true);
    }
    ui->panelPrimitiveHero->initializeDataBaseAndUpdate(m_model.heroID());
    ui->panelPrimitiveMonster->initializeDataBaseAndUpdate(m_model.monsterID());
    ui->panelPrimitiveVariableStock->initializeNumberAndUpdate(m_model.variableInstanceID());
}

//-------------------------------------------------

void DialogSystemInitialPartyMember::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_INITIAL_PARTY_MEMBERS)
        + RPM::DOT_DOT_DOT);
    ui->labelCreateNewInstance->setText(RPM::translate(Translations
        ::CREATE_NEW_INSTANCE_WITH_LEVEL));
    ui->labelInInstance->setText(RPM::translate(Translations::IN_MESSAGE));
    ui->labelOfInstance->setText(RPM::translate(Translations::OF));
    ui->labelStockVariable->setText(RPM::translate(Translations
        ::STOCK_INSTANCE_ID_IN));
    ui->radioButtonHero->setText(RPM::translate(Translations::HERO_ID) + RPM::COLON);
    ui->radioButtonMonster->setText(RPM::translate(Translations::MONSTER_ID) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemInitialPartyMember::on_comboBoxInstanceTeam_currentIndexChanged(int index)
{
    m_model.setTeamKind(static_cast<TeamKind>(index));
}

// -------------------------------------------------------

void DialogSystemInitialPartyMember::on_radioButtonHero_toggled(bool checked)
{
    m_model.setIsHero(checked);
    ui->panelPrimitiveHero->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemInitialPartyMember::on_radioButtonMonster_toggled(bool checked)
{
    m_model.setIsHero(!checked);
    ui->panelPrimitiveMonster->setEnabled(checked);
}
