/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandenteranamemenu.h"
#include "ui_dialogcommandenteranamemenu.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandEnterANameMenu::DialogCommandEnterANameMenu(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    m_properties(properties),
    m_parameters(parameters),
    ui(new Ui::DialogCommandEnterANameMenu)
{
    ui->setupUi(this);
    this->initializePrimitives();
    if (command != nullptr) {
        initialize(command);
    }
    this->translate();
}

DialogCommandEnterANameMenu::~DialogCommandEnterANameMenu()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandEnterANameMenu::translate()
{
    this->setWindowTitle(RPM::translate(Translations::ENTER_A_NAME_MENU) + RPM
        ::DOT_DOT_DOT);
    ui->labelHeroInstanceID->setText(RPM::translate(Translations
        ::HERO_WITH_INSTANCE_ID) + RPM::COLON);
    ui->labelMaxCharacters->setText(RPM::translate(Translations::MAX_CHARACTERS)
        + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

//-------------------------------------------------

void DialogCommandEnterANameMenu::initializePrimitives()
{
    ui->panelPrimitiveHeroInstanceID->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveHeroInstanceID->setKind(PrimitiveValueKind::Variable);
    ui->panelPrimitiveMaxCharacters->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveMaxCharacters->setNumberValue(6);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandEnterANameMenu::initialize(EventCommand *command)
{
    int i = 0;
    ui->panelPrimitiveHeroInstanceID->initializeCommand(command, i);
    ui->panelPrimitiveMaxCharacters->initializeCommand(command, i);
}

// -------------------------------------------------------

EventCommand * DialogCommandEnterANameMenu::getCommand() const
{
    QVector<QString> command;
    ui->panelPrimitiveHeroInstanceID->getCommand(command);
    ui->panelPrimitiveMaxCharacters->getCommand(command);
    return new EventCommand(EventCommandKind::EnterANameMenu, command);
}
