/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

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
    if (true)
    {
        ui->lineEditName->setText(m_command.name());
        ui->lineEditDescription->setText(m_command.description());
        ui->labelNameValue->hide();
        ui->labelDescriptionValue->hide();
        ui->lineEditName->setFocus();
    } else
    {
        ui->labelNameValue->setText(m_command.name());
        ui->labelDescriptionValue->setText(m_command.description());
        ui->lineEditName->hide();
        ui->lineEditDescription->hide();
    }
    ui->treeView->initializeNewItemInstance(new SystemPluginParameter);
    ui->treeView->initializeModel(m_command.defaultParameters());
    connect(ui->treeView, SIGNAL(windowClosed()), this, SLOT(
        on_treeViewWindowClosed()));
    connect(ui->treeView, SIGNAL(beforeOpeningWindow()), this, SLOT
        (on_pluginParameterOpeningWindow()));
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
            ::WARNING), "The plugin command name can't be empty.");
        return;
    }
    if (m_previousName != m_command.name() && SuperListItem::containsName(RPM
        ::get()->selectedList(), m_command.name()))
    {
        QMessageBox::information(nullptr, RPM::translate(Translations
            ::WARNING), "This plugin command name already exists in your commands list.");
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
