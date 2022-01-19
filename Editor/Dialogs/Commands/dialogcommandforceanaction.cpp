/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandforceanaction.h"
#include "ui_dialogcommandforceanaction.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandForceAnAction::DialogCommandForceAnAction(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters,
    QStandardItemModel *troopMonstersList, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandForceAnAction),
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

DialogCommandForceAnAction::~DialogCommandForceAnAction()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandForceAnAction::initializePrimitives()
{
    SuperListItem::fillComboBox(ui->comboBoxEnemies, m_troopMonstersList);
    ui->panelPrimitiveHeroEnemyInstanceID->initializeNumber(m_parameters,
        m_properties);
    ui->panelPrimitiveHeroEnemyInstanceID->showVariable();
    ui->panelPrimitiveHeroEnemyInstanceID->setNumberValue(1);
    ui->panelPrimitiveValueSkillID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->skillsDatas()->model(), m_parameters, m_properties);
    ui->panelPrimitiveValueItemID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->itemsDatas()->model(), m_parameters, m_properties);
    ui->comboBoxTarget->addItem(RPM::translate(Translations::RANDOM));
    ui->comboBoxTarget->addItem(RPM::translate(Translations::LAST_TARGET));
    ui->comboBoxTarget->addItem(RPM::translate(Translations::CUSTOM));
    SuperListItem::fillComboBox(ui->comboBoxEnemiesTarget, m_troopMonstersList);
    ui->panelPrimitiveHeroEnemyInstanceIDTarget->initializeNumber(m_parameters,
        m_properties);
    ui->panelPrimitiveHeroEnemyInstanceIDTarget->showVariable();
    ui->panelPrimitiveHeroEnemyInstanceIDTarget->setNumberValue(1);

    // Keep space when hiding widgets
    QSizePolicy sp_retain;
    QList<QWidget *> widgetList = QList<QWidget*>({ui->radioButtonEnemyTarget,
        ui->comboBoxTarget, ui->radioButtonHeroEnemyInstanceIDTarget, ui->
        panelPrimitiveHeroEnemyInstanceIDTarget});
    for (int i = 0; i < widgetList.size(); i++)
    {
        sp_retain = widgetList[i]->sizePolicy();
        sp_retain.setRetainSizeWhenHidden(true);
        widgetList[i]->setSizePolicy(sp_retain);
    }
}

// -------------------------------------------------------

void DialogCommandForceAnAction::translate()
{
    this->setWindowTitle(RPM::translate(Translations::FORCE_AN_ACTION) + RPM::DOT_DOT_DOT);
    ui->groupBoxBattler->setTitle(RPM::translate(Translations::BATTLER));
    ui->radioButtonEnemy->setText(RPM::translate(Translations::ENEMY) + RPM::COLON);
    ui->radioButtonHeroEnemyInstanceID->setText(RPM::translate(Translations
        ::HERO_ENEMY_INSTANCE_ID) + RPM::COLON);
    ui->groupBoxAction->setTitle(RPM::translate(Translations::ACTION));
    ui->radioButtonUseSkillID->setText(RPM::translate(Translations::USE_SKILL_ID) + RPM::COLON);
    ui->radioButtonUseItemID->setText(RPM::translate(Translations::USE_ITEM_ID) + RPM::COLON);
    ui->radioButtonDoNothing->setText(RPM::translate(Translations::DO_NOTHING));
    ui->groupBoxTarget->setTitle(RPM::translate(Translations::TARGET));
    ui->radioButtonEnemyTarget->setText(RPM::translate(Translations::ENEMY) + RPM::COLON);
    ui->radioButtonHeroEnemyInstanceIDTarget->setText(RPM::translate(Translations
        ::HERO_ENEMY_INSTANCE_ID) + RPM::COLON);
    ui->checkBoxUseBattlerTurn->setText(RPM::translate(Translations::USE_BATTLER_TURN));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandForceAnAction::getCommand() const
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
    if (ui->radioButtonUseSkillID->isChecked())
    {
        command.append("0");
        ui->panelPrimitiveValueSkillID->getCommand(command);
    } else if (ui->radioButtonUseItemID->isChecked())
    {
        command.append("1");
        ui->panelPrimitiveValueItemID->getCommand(command);
    } else if (ui->radioButtonDoNothing->isChecked())
    {
        command.append("2");
    }
    command.append(QString::number(ui->comboBoxTarget->currentIndex()));
    if (ui->comboBoxTarget->currentIndex() == 2)
    {
        if (ui->radioButtonEnemyTarget->isChecked())
        {
            command.append("0");
            command.append(QString::number(ui->comboBoxEnemiesTarget->currentIndex()));
        } else if (ui->radioButtonHeroEnemyInstanceIDTarget->isChecked())
        {
            command.append("1");
            ui->panelPrimitiveHeroEnemyInstanceIDTarget->getCommand(command);
        }
    }
    command.append(RPM::boolToString(ui->checkBoxUseBattlerTurn->isChecked()));
    return new EventCommand(EventCommandKind::ForceAnAction, command);
}

// -------------------------------------------------------

void DialogCommandForceAnAction::initialize(EventCommand *command)
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
    switch(command->valueCommandAt(i++).toInt())
    {
    case 0:
        ui->radioButtonUseSkillID->setChecked(true);
        ui->panelPrimitiveValueSkillID->initializeCommand(command, i);
        break;
    case 1:
        ui->radioButtonUseItemID->setChecked(true);
        ui->panelPrimitiveValueItemID->initializeCommand(command, i);
        break;
    case 2:
        ui->radioButtonDoNothing->setChecked(true);
        break;
    }
    ui->comboBoxTarget->setCurrentIndex(command->valueCommandAt(i++).toInt());
    if (ui->comboBoxTarget->currentIndex() == 2)
    {
        switch(command->valueCommandAt(i++).toInt())
        {
        case 0:
            ui->radioButtonEnemyTarget->setChecked(true);
            ui->comboBoxEnemiesTarget->setCurrentIndex(command->valueCommandAt(i++).toInt());
            break;
        case 1:
            ui->radioButtonHeroEnemyInstanceIDTarget->setChecked(true);
            ui->panelPrimitiveHeroEnemyInstanceIDTarget->initializeCommand(command, i);
            break;
        }
    }
    ui->checkBoxUseBattlerTurn->setChecked(RPM::stringToBool(command->valueCommandAt(i++)));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandForceAnAction::on_radioButtonEnemy_toggled(bool checked)
{
    ui->comboBoxEnemies->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandForceAnAction::on_radioButtonHeroEnemyInstanceID_toggled(bool checked)
{
    ui->panelPrimitiveHeroEnemyInstanceID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandForceAnAction::on_radioButtonUseSkillID_toggled(bool checked)
{
    ui->panelPrimitiveValueSkillID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandForceAnAction::on_radioButtonUseItemID_toggled(bool checked)
{
    ui->panelPrimitiveValueItemID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandForceAnAction::on_comboBoxTarget_currentIndexChanged(int index)
{
    bool show = index == 2;
    ui->radioButtonEnemyTarget->setVisible(show);
    ui->comboBoxEnemiesTarget->setVisible(show);
    ui->radioButtonHeroEnemyInstanceIDTarget->setVisible(show);
    ui->panelPrimitiveHeroEnemyInstanceIDTarget->setVisible(show);
}

// -------------------------------------------------------

void DialogCommandForceAnAction::on_radioButtonEnemyTarget_toggled(bool checked)
{
    ui->comboBoxEnemiesTarget->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandForceAnAction::on_radioButtonHeroEnemyInstanceIDTarget_toggled(bool checked)
{
    ui->panelPrimitiveHeroEnemyInstanceIDTarget->setEnabled(checked);
}
