/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QMessageBox>
#include "dialogsystemplugincommand.h"
#include "ui_dialogsystemplugincommand.h"
#include "systempluginparameter.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemPluginCommand::DialogSystemPluginCommand(SystemPluginCommand
    &command, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemPluginCommand),
    m_command(command),
    m_previousName(command.name()),
    m_completeList(RPM::get()->selectedList())
{
    ui->setupUi(this);
    this->initialize();
    this->translate();
}

DialogSystemPluginCommand::~DialogSystemPluginCommand()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemPluginCommand::initialize()
{
    ui->lineEditName->setText(m_command.name());
    ui->lineEditDescription->setText(m_command.description());
    ui->lineEditName->setFocus();
    ui->treeView->initializeNewItemInstance(new SystemPluginParameter);
    ui->treeView->initializeModel(m_command.defaultParameters());
    connect(ui->treeView, SIGNAL(windowClosed()), this, SLOT(
        on_treeViewWindowClosed()));
    connect(ui->treeView, SIGNAL(beforeOpeningWindow()), this, SLOT
        (on_pluginParameterOpeningWindow()));
}

// -------------------------------------------------------

void DialogSystemPluginCommand::translate()
{
    this->setWindowTitle(RPM::translate(Translations::COMMAND) + RPM
        ::DOT_DOT_DOT);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->labelDescription->setText(RPM::translate(Translations::DESCRIPTION) +
        RPM::COLON);
    ui->groupBox->setTitle(RPM::translate(Translations::PARAMETERS));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemPluginCommand::accept()
{
    if (m_command.name().isEmpty())
    {
        QMessageBox::information(nullptr, RPM::translate(Translations
            ::WARNING), RPM::translate(Translations
            ::THE_PLUGIN_COMMAND_NAME_EMPTY) + RPM::DOT);
        return;
    }
    if (m_previousName != m_command.name() && SuperListItem::containsName(RPM
        ::get()->selectedList(), m_command.name()))
    {
        QMessageBox::information(nullptr, RPM::translate(Translations
            ::WARNING), RPM::translate(Translations
            ::THIS_PLUGIN_COMMAND_NAME_ALREADY_EXISTS) + RPM::DOT);
        return;
    }
    QDialog::accept();
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemPluginCommand::on_lineEditName_textEdited(const QString &text)
{
    m_command.setName(text);
}

// -------------------------------------------------------

void DialogSystemPluginCommand::on_lineEditDescription_textEdited(const
    QString &text)
{
    m_command.setDescription(text);
}

// -------------------------------------------------------

void DialogSystemPluginCommand::on_treeViewWindowClosed()
{
    RPM::get()->setSelectedList(m_completeList);
}

// -------------------------------------------------------

void DialogSystemPluginCommand::on_pluginParameterOpeningWindow()
{
    RPM::get()->setSelectedList(ui->treeView->getModel());
}
