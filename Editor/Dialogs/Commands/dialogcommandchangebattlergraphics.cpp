/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangebattlergraphics.h"
#include "ui_dialogcommandchangebattlergraphics.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeBattlerGraphics::DialogCommandChangeBattlerGraphics(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters,
    QStandardItemModel *troopMonstersList, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandChangeBattlerGraphics),
    m_properties(properties),
    m_parameters(parameters),
    m_troopMonstersList(troopMonstersList),
    m_facesetID(new PrimitiveValue(-1)),
    m_battlerID(new PrimitiveValue(-1))
{
    ui->setupUi(this);
    this->initializePrimitives();
    if (command != nullptr)
    {
        this->initialize(command);
    }
    this->translate();
}

DialogCommandChangeBattlerGraphics::~DialogCommandChangeBattlerGraphics()
{
    delete ui;
    delete m_facesetID;
    delete m_battlerID;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeBattlerGraphics::initializePrimitives()
{
    SuperListItem::fillComboBox(ui->comboBoxEnemies, m_troopMonstersList);
    ui->panelPrimitiveHeroEnemyInstanceID->initializeNumber(m_parameters,
        m_properties);
    ui->panelPrimitiveHeroEnemyInstanceID->showVariable();
    ui->panelPrimitiveHeroEnemyInstanceID->setNumberValue(1);
    ui->widgetPictureFaceset->setKind(PictureKind::Facesets);
    ui->widgetPictureFaceset->initializePrimitive(m_facesetID, m_properties,
        m_parameters);
    ui->widgetPictureBattler->setKind(PictureKind::Battlers);
    ui->widgetPictureBattler->initializePrimitive(m_battlerID, m_properties,
        m_parameters);
}

// -------------------------------------------------------

void DialogCommandChangeBattlerGraphics::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_BATTLER_GRAPHICS) + RPM::DOT_DOT_DOT);
    ui->groupBoxBattler->setTitle(RPM::translate(Translations::BATTLER));
    ui->radioButtonEnemy->setText(RPM::translate(Translations::ENEMY) + RPM::COLON);
    ui->radioButtonHeroEnemyInstanceID->setText(RPM::translate(Translations
        ::HERO_ENEMY_INSTANCE_ID) + RPM::COLON);
    ui->checkBoxFaceset->setText(RPM::translate(Translations::FACESET) + RPM::COLON);
    ui->checkBoxBattler->setText(RPM::translate(Translations::BATTLER) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandChangeBattlerGraphics::getCommand() const
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
    command.append(RPM::boolToString(ui->checkBoxFaceset->isChecked()));
    if (ui->checkBoxFaceset->isChecked())
    {
        m_facesetID->getCommandParameter(command, true);
        command.append(QString::number(ui->widgetPictureFaceset->pictureIndexX()));
        command.append(QString::number(ui->widgetPictureFaceset->pictureIndexY()));
    }
    command.append(RPM::boolToString(ui->checkBoxBattler->isChecked()));
    if (ui->checkBoxBattler->isChecked())
    {
        m_battlerID->getCommandParameter(command, true);
    }
    return new EventCommand(EventCommandKind::ChangeBattlerGraphics, command);
}

// -------------------------------------------------------

void DialogCommandChangeBattlerGraphics::initialize(EventCommand *command)
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
    if (RPM::stringToBool(command->valueCommandAt(i++)))
    {
        ui->checkBoxFaceset->setChecked(true);
        m_facesetID->initializeCommandParameter(command, i, true);
        ui->widgetPictureFaceset->initializePrimitive(m_facesetID, m_properties,
            m_parameters);
        ui->widgetPictureFaceset->setPictureIndexX(command->valueCommandAt(i++).toInt());
        ui->widgetPictureFaceset->setPictureIndexY(command->valueCommandAt(i++).toInt());
    }
    if (RPM::stringToBool(command->valueCommandAt(i++)))
    {
        ui->checkBoxBattler->setChecked(true);
        m_battlerID->initializeCommandParameter(command, i, true);
        ui->widgetPictureBattler->initializePrimitive(m_battlerID, m_properties,
            m_parameters);
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandChangeBattlerGraphics::on_radioButtonEnemy_toggled(bool checked)
{
    ui->comboBoxEnemies->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeBattlerGraphics::on_radioButtonHeroEnemyInstanceID_toggled(bool checked)
{
    ui->panelPrimitiveHeroEnemyInstanceID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeBattlerGraphics::on_checkBoxFaceset_toggled(bool checked)
{
    ui->widgetPictureFaceset->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeBattlerGraphics::on_checkBoxBattler_toggled(bool checked)
{
    ui->widgetPictureBattler->setEnabled(checked);
}
