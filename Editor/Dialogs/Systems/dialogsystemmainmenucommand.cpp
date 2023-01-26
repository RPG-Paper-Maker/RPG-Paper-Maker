/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemmainmenucommand.h"
#include "ui_dialogsystemmainmenucommand.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemMainMenuCommand::DialogSystemMainMenuCommand(SystemMainMenuCommand
    &mainMenuCommand, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemMainMenuCommand),
    m_mainMenuCommand(mainMenuCommand)
{
    ui->setupUi(this);
    this->initialize();
    this->translate();
}

DialogSystemMainMenuCommand::~DialogSystemMainMenuCommand()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemMainMenuCommand::initialize()
{
    this->setVisibleScript(false);
    ui->widgetTextLangName->initializeNamesLang(&m_mainMenuCommand);
    int index = static_cast<int>(m_mainMenuCommand.kind());
    ui->comboBoxKind->addItems(RPM::ENUM_TO_STRING_MAIN_MENU_COMMAND_KIND);
    ui->comboBoxKind->setCurrentIndex(index);
    if (m_mainMenuCommand.kind() == MainMenuCommandKind::Script) {
        this->setVisibleScript(true);
    }
    ui->plainTextScript->setPlainText(m_mainMenuCommand.script());
}

// -------------------------------------------------------

void DialogSystemMainMenuCommand::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_MAIN_MENU_COMMAND) + RPM
        ::DOT_DOT_DOT);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->labelKind->setText(RPM::translate(Translations::KIND) + RPM::COLON);
    ui->labelScript->setText(RPM::translate(Translations::SCRIPT) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------

void DialogSystemMainMenuCommand::setVisibleScript(bool b)
{
    ui->labelScript->setVisible(b);
    ui->plainTextScript->setVisible(b);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemMainMenuCommand::on_comboBoxKind_currentIndexChanged(int index)
{
    m_mainMenuCommand.setKind(static_cast<MainMenuCommandKind>(index));
    this->setVisibleScript(m_mainMenuCommand.kind() == MainMenuCommandKind::Script);
}

// -------------------------------------------------------

void DialogSystemMainMenuCommand::on_plainTextScript_textChanged()
{
    m_mainMenuCommand.setScript(ui->plainTextScript->toPlainText());
}
