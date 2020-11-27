/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QMessageBox>
#include "dialogcommandplugin.h"
#include "ui_dialogcommandplugin.h"
#include "systemplugin.h"
#include "systempluginparameter.h"
#include "systemplugincommand.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandPlugin::DialogCommandPlugin(EventCommand *command,
    SystemCommonObject *object, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    m_properties(object == nullptr ? nullptr : object->modelProperties()),
    m_parameters(parameters),
    m_currentParameters(new QStandardItemModel),
    ui(new Ui::DialogCommandPlugin)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr)
    {
        initialize(command);
    }

    this->translate();
}

DialogCommandPlugin::~DialogCommandPlugin()
{
    delete ui;

    SuperListItem::deleteModel(m_currentParameters);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandPlugin::initializePrimitives()
{
    SuperListItem::fillComboBox(ui->comboBoxPlugin, RPM::get()->project()
        ->scriptsDatas()->modelPlugins(), false);
    if (ui->comboBoxPlugin->count() == 0)
    {
        ui->comboBoxCommand->setEnabled(false);
        ui->treeViewEditParameter->setEnabled(false);
    }
    ui->treeViewEditParameter->setCanMove(false);
    ui->treeViewEditParameter->setCanCreateDelete(false);
    ui->treeViewEditParameter->initializeModel(m_currentParameters);
}

//-------------------------------------------------

void DialogCommandPlugin::initializeHeader()
{
    m_currentParameters->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::NAME), RPM::translate(Translations::VALUE)}));
}

//-------------------------------------------------

void DialogCommandPlugin::translate()
{
    this->setWindowTitle(RPM::translate(Translations::PLUGIN) + RPM
        ::DOT_DOT_DOT);
    ui->labelPlugin->setText(RPM::translate(Translations::PLUGIN) + RPM::COLON);
    ui->labelCommand->setText(RPM::translate(Translations::COMMAND) + RPM::COLON);
    ui->groupBoxParameters->setTitle(RPM::translate(Translations::PARAMETERS));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandPlugin::accept()
{
    if (ui->comboBoxCommand->currentIndex() == -1)
    {
        QMessageBox::information(this, RPM::translate(Translations::WARNING),
            "You have to select a command to execute" + RPM::DOT);
        return;
    }
    DialogCommand::accept();
}

// -------------------------------------------------------

void DialogCommandPlugin::initialize(EventCommand *command)
{
    int i = 0;
    ui->comboBoxPlugin->setCurrentIndex(command->valueCommandAt(i++).toInt());
    ui->comboBoxCommand->setCurrentIndex(command->valueCommandAt(i++).toInt());
    SystemPluginParameter *param;
    for (int j = 0, l = m_currentParameters->invisibleRootItem()->rowCount(); j
        < l; j++)
    {
        param = reinterpret_cast<SystemPluginParameter *>(SuperListItem
            ::getItemModelAt(m_currentParameters, j));
        if (i < command->commandsCount() - 1)
        {
            param->defaultValue()->initializeCommandParameter(command, i);
        }
    }
    ui->treeViewEditParameter->updateAbsoluteAllNodesString();
}

// -------------------------------------------------------

EventCommand * DialogCommandPlugin::getCommand() const
{
    QVector<QString> command;
    command.append(QString::number(ui->comboBoxPlugin->currentIndex()));
    command.append(QString::number(ui->comboBoxCommand->currentIndex()));
    SystemPluginParameter *param;
    for (int i = 0, l = m_currentParameters->invisibleRootItem()->rowCount(); i
        < l; i++)
    {
        param = reinterpret_cast<SystemPluginParameter *>(SuperListItem
            ::getItemModelAt(m_currentParameters, i));
        param->defaultValue()->getCommandParameter(command);
    }
    return new EventCommand(EventCommandKind::Plugin, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandPlugin::on_comboBoxPlugin_currentIndexChanged(int index)
{
    SystemPlugin *plugin = reinterpret_cast<SystemPlugin *>(SuperListItem
        ::getByIndex(RPM::get()->project()->scriptsDatas()->modelPlugins(),
        index));
    ui->comboBoxCommand->clear();
    if (plugin == nullptr || plugin->commands()->invisibleRootItem()->rowCount()
        == 1)
    {
        ui->labelCommand->setEnabled(false);
        ui->comboBoxCommand->setEnabled(false);
        ui->groupBoxParameters->setEnabled(false);
    } else
    {
        ui->labelCommand->setEnabled(true);
        ui->comboBoxCommand->setEnabled(true);
        SuperListItem::fillComboBox(ui->comboBoxCommand, plugin->commands(),
            false);
    }
}

// -------------------------------------------------------

void DialogCommandPlugin::on_comboBoxCommand_currentIndexChanged(int index)
{
    SystemPlugin *plugin = reinterpret_cast<SystemPlugin *>(SuperListItem
        ::getByIndex(RPM::get()->project()->scriptsDatas()->modelPlugins(),
        ui->comboBoxPlugin->currentIndex()));
    SuperListItem::deleteModel(m_currentParameters, false);
    m_currentParameters->clear();
    if (plugin != nullptr)
    {
        SystemPluginCommand *command = reinterpret_cast<SystemPluginCommand *>(
            SuperListItem::getByIndex(plugin->commands(), index));
        if (command != nullptr)
        {
            SuperListItem::copy(m_currentParameters, command->defaultParameters());
            SuperListItem::removeEmptyInTree(m_currentParameters);
            SystemPluginParameter::setAllDefault(m_currentParameters, false);
        }
    }
    ui->groupBoxParameters->setEnabled(m_currentParameters->invisibleRootItem()
        ->rowCount() > 0);
    this->initializeHeader();
}
