/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandtransformabattler.h"
#include "ui_dialogcommandtransformabattler.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandTransformABattler::DialogCommandTransformABattler(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters,
    QStandardItemModel *troopMonstersList, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandTransformABattler),
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

DialogCommandTransformABattler::~DialogCommandTransformABattler()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandTransformABattler::initializePrimitives()
{
    SuperListItem::fillComboBox(ui->comboBoxEnemies, m_troopMonstersList);
    ui->panelPrimitiveHeroEnemyInstanceID->initializeNumber(m_parameters,
        m_properties);
    ui->panelPrimitiveHeroEnemyInstanceID->showVariable();
    ui->panelPrimitiveHeroEnemyInstanceID->setNumberValue(1);
    ui->panelPrimitiveMonsterID->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->monstersDatas()->model(), m_parameters, m_properties);
    ui->panelPrimitiveLevel->initializeNumber(m_parameters, m_properties);
}

// -------------------------------------------------------

void DialogCommandTransformABattler::translate()
{
    this->setWindowTitle(RPM::translate(Translations::DISPLAY_HIDE_A_BATTLER) + RPM::DOT_DOT_DOT);
    ui->groupBoxBattler->setTitle(RPM::translate(Translations::BATTLER));
    ui->radioButtonEnemy->setText(RPM::translate(Translations::ENEMY) + RPM::COLON);
    ui->radioButtonHeroEnemyInstanceID->setText(RPM::translate(Translations
        ::HERO_ENEMY_INSTANCE_ID) + RPM::COLON);
    ui->labelMonsterID->setText(RPM::translate(Translations::MONSTER_ID) + RPM::COLON);
    ui->labelLevel->setText(RPM::translate(Translations::LEVEL) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandTransformABattler::getCommand() const
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
    ui->panelPrimitiveMonsterID->getCommand(command);
    ui->panelPrimitiveLevel->getCommand(command);
    return new EventCommand(EventCommandKind::TransformABattler, command);
}

// -------------------------------------------------------

void DialogCommandTransformABattler::initialize(EventCommand *command)
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
    ui->panelPrimitiveMonsterID->initializeCommand(command, i);
    ui->panelPrimitiveLevel->initializeCommand(command, i);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandTransformABattler::on_radioButtonEnemy_toggled(bool checked)
{
    ui->comboBoxEnemies->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandTransformABattler::on_radioButtonHeroEnemyInstanceID_toggled(bool checked)
{
    ui->panelPrimitiveHeroEnemyInstanceID->setEnabled(checked);
}

