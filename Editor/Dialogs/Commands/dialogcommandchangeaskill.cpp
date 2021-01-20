/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangeaskill.h"
#include "ui_dialogcommandchangeaskill.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeASkill::DialogCommandChangeASkill(EventCommand *command,
    SystemCommonObject *object, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    m_object(object),
    m_parameters(parameters),
    ui(new Ui::DialogCommandChangeASkill)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        initialize(command);
    }

    this->translate();
}

DialogCommandChangeASkill::~DialogCommandChangeASkill()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeASkill::initializePrimitives()
{
    QStandardItemModel *properties = nullptr;
    if (m_object != nullptr)
    {
        properties = m_object->modelProperties();
    }

    ui->comboBoxTeam->addItems(RPM::ENUM_TO_STRING_TEAM);
    ui->panelPrimitiveSkillID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->skillsDatas()->model(), m_parameters,
        properties);
    ui->panelPrimitiveHeroEnemyInstanceID->initializeNumber(m_parameters,
        properties);
    ui->panelPrimitiveHeroEnemyInstanceID->showVariable();
    ui->panelPrimitiveHeroEnemyInstanceID->setNumberValue(1);
}

//-------------------------------------------------

void DialogCommandChangeASkill::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_A_SKILL) + RPM
        ::DOT_DOT_DOT);
    ui->labelSkillID->setText(RPM::translate(Translations::SKILL_ID) + RPM
        ::COLON);
    ui->groupBoxSelection->setTitle(RPM::translate(Translations::SELECTION));
    ui->radioButtonHeroEnemyInstanceID->setText(RPM::translate(Translations
        ::HERO_ENEMY_INSTANCE_ID) + RPM::COLON);
    ui->radioButtonEntire->setText(RPM::translate(Translations::THE_ENTIRE));
    ui->groupBoxOperation->setTitle(RPM::translate(Translations::OPERATION));
    ui->radioButtonLearn->setText(RPM::translate(Translations::LEARN));
    ui->radioButtonForget->setText(RPM::translate(Translations::FORGET));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeASkill::initialize(EventCommand *command) {
    int i = 0;
    ui->panelPrimitiveSkillID->initializeCommand(command, i);
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
        ui->radioButtonLearn->setChecked(true); break;
    case 1:
        ui->radioButtonForget->setChecked(true); break;
    }
}

// -------------------------------------------------------

EventCommand * DialogCommandChangeASkill::getCommand() const{
    QVector<QString> command;

    ui->panelPrimitiveSkillID->getCommand(command);
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
    if (ui->radioButtonLearn->isChecked()) {
        command.append("0");
    } else if (ui->radioButtonForget->isChecked()) {
        command.append("1");
    }

    return new EventCommand(EventCommandKind::ChangeASkill, command);
}
