/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandmodifyteam.h"
#include "ui_dialogcommandmodifyteam.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandModifyTeam::DialogCommandModifyTeam(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters, QWidget
    *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandModifyTeam),
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

DialogCommandModifyTeam::~DialogCommandModifyTeam()
{
    delete ui;
    delete m_groupMain;
    delete m_groupHeroMonster;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandModifyTeam::initializePrimitives()
{
    m_groupMain = new QButtonGroup;
    m_groupMain->addButton(ui->radioButtonNewInstance);
    m_groupMain->addButton(ui->radioButtonAddEnemy);
    m_groupMain->addButton(ui->radioButtonModify);
    m_groupHeroMonster = new QButtonGroup;
    m_groupHeroMonster->addButton(ui->radioButtonHero);
    m_groupHeroMonster->addButton(ui->radioButtonMonster);
    ui->panelPrimitiveValueLevel->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveValueLevel->setNumberValue(1);
    ui->comboBoxInstanceTeam->addItems(RPM::ENUM_TO_STRING_TEAM);
    ui->panelPrimitiveHero->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->heroesDatas()->model(), m_parameters, m_properties);
    ui->panelPrimitiveMonster->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->monstersDatas()->model(), m_parameters, m_properties);
    ui->panelPrimitiveVariableStock->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveVariableStock->setKind(PrimitiveValueKind::Variable);
    ui->panelPrimitiveVariableStock->setNumberValue(1);
    ui->panelPrimitiveEnemyInstanceID->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveEnemyInstanceID->setKind(PrimitiveValueKind::Variable);
    ui->panelPrimitiveEnemyInstanceID->setNumberValue(1);
    ui->comboBoxInstanceTeamEnemy->addItems(RPM::ENUM_TO_STRING_TEAM);
    ui->comboBoxModify->addItem(RPM::translate(Translations::MOVE));
    ui->comboBoxModify->addItem(RPM::translate(Translations::REMOVE));
    ui->panelPrimitiveValueModify->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveValueModify->setKind(PrimitiveValueKind::Variable);
    ui->panelPrimitiveValueModify->setNumberValue(1);
    ui->comboBoxModifyIn->addItems(RPM::ENUM_TO_STRING_TEAM);
}

//-------------------------------------------------

void DialogCommandModifyTeam::translate()
{
    this->setWindowTitle(RPM::translate(Translations::MODIFY_TEAM) + RPM
        ::DOT_DOT_DOT);
    ui->labelInInstance->setText(RPM::translate(Translations::IN_MESSAGE));
    ui->labelInInstanceEnemy->setText(RPM::translate(Translations::IN_MESSAGE));
    ui->labelOfInstance->setText(RPM::translate(Translations::OF));
    ui->labelStockVariable->setText(RPM::translate(Translations
        ::STOCK_INSTANCE_ID_IN));
    ui->labelAddRemoveCharacter->setText(RPM::translate(Translations::CHARACTER_WITH_INSTANCE_ID));
    ui->labelAddRemoveTo->setText(RPM::translate(Translations::TO).toLower());
    ui->radioButtonHero->setText(RPM::translate(Translations::HERO_ID) + RPM::COLON);
    ui->radioButtonMonster->setText(RPM::translate(Translations::MONSTER_ID) + RPM::COLON);
    ui->radioButtonAddEnemy->setText(RPM::translate(Translations::ADD_ENEMY_INSTANCE_ID) + RPM::COLON);
    ui->radioButtonNewInstance->setText(RPM::translate(Translations
        ::CREATE_NEW_INSTANCE_WITH_LEVEL));
    ui->radioButtonModify->setText(RPM::translate(Translations::MODIFY) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandModifyTeam::initialize(EventCommand *command)
{
    int i = 0;
    int type = command->valueCommandAt(i++).toInt();
    int typeCharacter;
    switch(type)
    {
    case 0:
        ui->radioButtonNewInstance->setChecked(true);
        ui->panelPrimitiveValueLevel->initializeCommand(command, i);
        ui->comboBoxInstanceTeam->setCurrentIndex(command->valueCommandAt(i++).toInt());
        ui->panelPrimitiveVariableStock->initializeCommand(command, i);
        typeCharacter = command->valueCommandAt(i++).toInt();
        if (typeCharacter == 0)
        {
            ui->radioButtonHero->setChecked(true);
            ui->panelPrimitiveHero->initializeCommand(command, i);
        } else if (typeCharacter == 1)
        {
            ui->radioButtonMonster->setChecked(true);
            ui->panelPrimitiveMonster->initializeCommand(command, i);
        }
        break;
    case 1:
        ui->radioButtonAddEnemy->setChecked(true);
        ui->panelPrimitiveEnemyInstanceID->initializeCommand(command, i);
        ui->comboBoxInstanceTeamEnemy->setCurrentIndex(command->valueCommandAt(i++).toInt());
        break;
    case 2:
        ui->radioButtonModify->setChecked(true);
        ui->comboBoxModify->setCurrentIndex(command->valueCommandAt(i++).toInt());
        ui->panelPrimitiveValueModify->initializeCommand(command, i);
        ui->comboBoxModifyIn->setCurrentIndex(command->valueCommandAt(i++).toInt());
        break;
    }
}

// -------------------------------------------------------

EventCommand * DialogCommandModifyTeam::getCommand() const
{
    QVector<QString> command;
    if (ui->radioButtonNewInstance->isChecked())
    {
        command.append("0");
        ui->panelPrimitiveValueLevel->getCommand(command);
        command.append(QString::number(ui->comboBoxInstanceTeam->currentIndex()));
        ui->panelPrimitiveVariableStock->getCommand(command);
        if (ui->radioButtonHero->isChecked())
        {
            command.append("0");
            ui->panelPrimitiveHero->getCommand(command);
        } else if (ui->radioButtonMonster->isChecked())
        {
            command.append("1");
            ui->panelPrimitiveMonster->getCommand(command);
        }
    } else if (ui->radioButtonAddEnemy->isChecked())
    {
        command.append("1");
        ui->panelPrimitiveEnemyInstanceID->getCommand(command);
        command.append(QString::number(ui->comboBoxInstanceTeamEnemy->currentIndex()));
    } else if (ui->radioButtonModify->isChecked())
    {
        command.append("2");
        command.append(QString::number(ui->comboBoxModify->currentIndex()));
        ui->panelPrimitiveValueModify->getCommand(command);
        command.append(QString::number(ui->comboBoxModifyIn->currentIndex()));
    }
    return new EventCommand(EventCommandKind::ModifyTeam, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandModifyTeam::on_radioButtonNewInstance_toggled(bool checked)
{
    ui->panelPrimitiveValueLevel->setEnabled(checked);
    ui->labelInInstance->setEnabled(checked);
    ui->comboBoxInstanceTeam->setEnabled(checked);
    ui->labelOfInstance->setEnabled(checked);
    ui->labelStockVariable->setEnabled(checked);
    ui->panelPrimitiveVariableStock->setEnabled(checked);
    ui->radioButtonHero->setEnabled(checked);
    ui->radioButtonMonster->setEnabled(checked);
    ui->panelPrimitiveHero->setEnabled(checked && ui->radioButtonHero->isChecked());
    ui->panelPrimitiveMonster->setEnabled(checked && ui->radioButtonMonster->isChecked());
}

// -------------------------------------------------------

void DialogCommandModifyTeam::on_radioButtonHero_toggled(bool checked)
{
    ui->panelPrimitiveHero->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandModifyTeam::on_radioButtonMonster_toggled(bool checked)
{
    ui->panelPrimitiveMonster->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandModifyTeam::on_radioButtonAddEnemy_toggled(bool checked)
{
    ui->panelPrimitiveEnemyInstanceID->setEnabled(checked);
    ui->labelInInstanceEnemy->setEnabled(checked);
    ui->comboBoxInstanceTeamEnemy->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandModifyTeam::on_radioButtonModify_toggled(bool checked)
{
    ui->comboBoxModify->setEnabled(checked);
    ui->labelAddRemoveCharacter->setEnabled(checked);
    ui->panelPrimitiveValueModify->setEnabled(checked);
    this->on_comboBoxModify_currentIndexChanged(ui->comboBoxModify->currentIndex());
}

// -------------------------------------------------------

void DialogCommandModifyTeam::on_comboBoxModify_currentIndexChanged(int index)
{
    bool checked = ui->radioButtonModify->isChecked() && index == 0;
    ui->labelAddRemoveTo->setEnabled(checked);
    ui->comboBoxModifyIn->setEnabled(checked);
}
