/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandplugin.h"
#include "ui_dialogcommandplugin.h"
#include "systemplugin.h"
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
}

//-------------------------------------------------

void DialogCommandPlugin::translate()
{
    /*
    this->setWindowTitle(RPM::translate(Translations::CHANGE_A_SKILL) + RPM
        ::DOT_DOT_DOT);*/
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandPlugin::initialize(EventCommand *command)
{

}

// -------------------------------------------------------

EventCommand * DialogCommandPlugin::getCommand() const
{
    QVector<QString> command;

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
        == 0)
    {
        ui->comboBoxCommand->setEnabled(false);
    } else
    {
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
    SystemPluginCommand *command = reinterpret_cast<SystemPluginCommand *>(
        SuperListItem::getByIndex(plugin->commands(), index));
    SuperListItem::deleteModel(m_currentParameters, false);
    m_currentParameters->clear();
    SuperListItem::copy(m_currentParameters, command->defaultParameters());
    ui->treeViewEditParameter->initializeModel(m_currentParameters);
}
