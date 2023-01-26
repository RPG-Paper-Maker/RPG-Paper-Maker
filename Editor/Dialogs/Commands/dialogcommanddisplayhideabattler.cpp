/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommanddisplayhideabattler.h"
#include "ui_dialogcommanddisplayhideabattler.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandDisplayHideABattler::DialogCommandDisplayHideABattler(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters,
    QStandardItemModel *troopMonstersList, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandDisplayHideABattler),
    m_properties(properties),
    m_parameters(parameters),
    m_troopMonstersList(troopMonstersList)
{
    ui->setupUi(this);
    this->initializePrimitives();
    if (command != nullptr)
    {
        this->initialize(command);
    }
    this->translate();
}

DialogCommandDisplayHideABattler::~DialogCommandDisplayHideABattler()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandDisplayHideABattler::initializePrimitives()
{
    SuperListItem::fillComboBox(ui->comboBoxEnemies, m_troopMonstersList);
    ui->panelPrimitiveHeroEnemyInstanceID->initializeNumber(m_parameters,
        m_properties);
    ui->panelPrimitiveHeroEnemyInstanceID->showVariable();
    ui->panelPrimitiveHeroEnemyInstanceID->setNumberValue(1);
    ui->panelPrimitiveHidden->initializeSwitch(m_parameters, m_properties);
}

// -------------------------------------------------------

void DialogCommandDisplayHideABattler::translate()
{
    this->setWindowTitle(RPM::translate(Translations::DISPLAY_HIDE_A_BATTLER) + RPM::DOT_DOT_DOT);
    ui->groupBoxBattler->setTitle(RPM::translate(Translations::BATTLER));
    ui->radioButtonEnemy->setText(RPM::translate(Translations::ENEMY) + RPM::COLON);
    ui->radioButtonHeroEnemyInstanceID->setText(RPM::translate(Translations
        ::HERO_ENEMY_INSTANCE_ID) + RPM::COLON);
    ui->labelHidden->setText(RPM::translate(Translations::HIDDEN) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandDisplayHideABattler::getCommand() const
{
    QVector<QString> command;
    if (ui->radioButtonEnemy->isChecked())
    {
        command.append("0");
        command.append(QString::number(ui->comboBoxEnemies->currentIndex()));
    } else if (ui->radioButtonHeroEnemyInstanceID->isChecked())
    {
        command.append("1");
        ui->panelPrimitiveHeroEnemyInstanceID->getCommand(command);
    }
    ui->panelPrimitiveHidden->getCommand(command);
    return new EventCommand(EventCommandKind::DisplayHideABattler, command);
}

// -------------------------------------------------------

void DialogCommandDisplayHideABattler::initialize(EventCommand *command)
{
    int i = 0;
    switch(command->valueCommandAt(i++).toInt())
    {
    case 0:
        ui->radioButtonEnemy->setChecked(true);
        ui->comboBoxEnemies->setCurrentIndex(command->valueCommandAt(i++).toInt());
        break;
    case 1:
        ui->radioButtonHeroEnemyInstanceID->setChecked(true);
        ui->panelPrimitiveHeroEnemyInstanceID->initializeCommand(command, i);
        break;
    }
    ui->panelPrimitiveHidden->initializeCommand(command, i);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandDisplayHideABattler::on_radioButtonEnemy_toggled(bool checked)
{
    ui->comboBoxEnemies->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandDisplayHideABattler::on_radioButtonHeroEnemyInstanceID_toggled(bool checked)
{
    ui->panelPrimitiveHeroEnemyInstanceID->setEnabled(checked);
}
