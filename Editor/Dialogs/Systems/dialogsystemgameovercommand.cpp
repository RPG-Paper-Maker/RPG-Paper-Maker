/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemgameovercommand.h"
#include "ui_dialogsystemgameovercommand.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemGameOverCommand::DialogSystemGameOverCommand(SystemGameOverCommand
    &model, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemGameOverCommand),
    m_model(model)
{
    ui->setupUi(this);

    // Keep space when hiding script widget
    QSizePolicy sp_retain = ui->plainTextEditScript->sizePolicy();
    sp_retain.setRetainSizeWhenHidden(true);
    ui->plainTextEditScript->setSizePolicy(sp_retain);
    ui->plainTextEditScript->hide();

    this->initialize();
    this->translate();
}

DialogSystemGameOverCommand::~DialogSystemGameOverCommand()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemGameOverCommand::initialize()
{
    ui->widgetTextLangName->initializeNamesLang(&m_model);
    ui->plainTextEditScript->insertPlainText(m_model.script());
    int index = static_cast<int>(m_model.kind());
    ui->comboBoxTypeCommand->addItems(RPM::ENUM_TO_STRING_GAME_OVER_COMMAND_KIND);
    ui->comboBoxTypeCommand->setCurrentIndex(index);
}

//-------------------------------------------------

void DialogSystemGameOverCommand::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_GAME_OVER_COMMAND) + RPM
        ::DOT_DOT_DOT);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->labelTypeCommand->setText(RPM::translate(Translations::TYPE_OF_COMMAND)
        + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemGameOverCommand::on_comboBoxTypeCommand_currentIndexChanged(int index)
{
    m_model.setKind(static_cast<GameOverCommandKind>(index));
    ui->plainTextEditScript->setVisible(index == static_cast<int>(GameOverCommandKind::Script));
}

// -------------------------------------------------------

void DialogSystemGameOverCommand::on_plainTextEditScript_textChanged()
{
    m_model.setScript(ui->plainTextEditScript->toPlainText());
}
