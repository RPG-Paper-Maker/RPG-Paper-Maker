/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemtitlecommand.h"
#include "ui_dialogsystemtitlecommand.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemTitleCommand::DialogSystemTitleCommand(SystemTitleCommand &tc,
    QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemTitleCommand),
    m_titleCommand(tc)
{
    QSizePolicy sp_retain;

    ui->setupUi(this);

    // Keep space when hiding script widget
    sp_retain = ui->plainTextEditScript->sizePolicy();
    sp_retain.setRetainSizeWhenHidden(true);
    ui->plainTextEditScript->setSizePolicy(sp_retain);
    ui->plainTextEditScript->hide();

    this->initialize();

    this->translate();
}

DialogSystemTitleCommand::~DialogSystemTitleCommand() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemTitleCommand::initialize() {
    int index;

    ui->widgetTextLangName->initializeNamesTrans(m_titleCommand.names());
    ui->plainTextEditScript->insertPlainText(m_titleCommand.script());
    index = static_cast<int>(m_titleCommand.kind());
    ui->comboBoxTypeCommand->addItems(RPM::ENUM_TO_STRING_TITLE_COMMAND_KIND);
    ui->comboBoxTypeCommand->setCurrentIndex(index);
}

//-------------------------------------------------

void DialogSystemTitleCommand::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_TITLE_COMMAND) + RPM
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

void DialogSystemTitleCommand::on_comboBoxTypeCommand_currentIndexChanged(int
    index)
{
    m_titleCommand.setKind(static_cast<TitleCommandKind>(index));
    ui->plainTextEditScript->setVisible(index == static_cast<int>(
        TitleCommandKind::Script));
}

// -------------------------------------------------------

void DialogSystemTitleCommand::on_plainTextEditScript_textChanged() {
    m_titleCommand.setScript(ui->plainTextEditScript->toPlainText());
}
