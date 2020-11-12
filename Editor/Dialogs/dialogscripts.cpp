/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogscripts.h"
#include "ui_dialogscripts.h"
#include "systemscript.h"
#include "systemplugin.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogScripts::DialogScripts(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogScripts)
{
    ui->setupUi(this);

    m_widgetLineNumber = new WidgetCodeLineNumberArea(ui->widgetCodeSystem);
    m_highlighterSystem = new CodeSyntaxHighlighter(ui->widgetCodeSystem
        ->document());
    m_widgetLineNumberPlugin = new WidgetCodeLineNumberArea(ui->widgetCodePlugin);
    m_highlighterPlugin = new CodeSyntaxHighlighter(ui->widgetCodePlugin
        ->document());
    ui->treeViewSystem->initializeNewItemInstance(new SystemScript);
    ui->treeViewPlugins->initializeNewItemInstance(new SystemPlugin);
    ui->treeViewPlugins->setUpdateId(true);

    // Keep space when hiding widgets
    QSizePolicy sp_retain;
    QList<QWidget *> widgetList;
    widgetList << ui->widgetCodeSystem << ui->tabWidgetPlugin;
    for (int i = 0; i < widgetList.size(); i++) {
        sp_retain = widgetList[i]->sizePolicy();
        sp_retain.setRetainSizeWhenHidden(true);
        widgetList[i]->setSizePolicy(sp_retain);
    }
}

DialogScripts::~DialogScripts()
{
    delete ui;
    delete m_widgetLineNumber;
    delete m_highlighterSystem;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogScripts::initialize()
{
    // System
    ui->treeViewSystem->initializeModel(RPM::get()->project()->scriptsDatas()
        ->modelSystem());
    connect(ui->treeViewSystem->selectionModel(), SIGNAL(currentChanged(
        QModelIndex, QModelIndex)), this, SLOT(on_scriptSystemSelected(
        QModelIndex, QModelIndex)));
    QModelIndex index = ui->treeViewSystem->getModel()->index(0, 0);
    ui->treeViewSystem->setCurrentIndex(index);
    on_scriptSystemSelected(index, index);

    // Plugins
    ui->treeViewPlugins->initializeModel(RPM::get()->project()->scriptsDatas()
        ->modelPlugins());
    connect(ui->treeViewPlugins->selectionModel(), SIGNAL(currentChanged(
        QModelIndex, QModelIndex)), this, SLOT(on_scriptPluginSelected(
        QModelIndex, QModelIndex)));
    connect(ui->treeViewPlugins, SIGNAL(modelUpdated()), this, SLOT(
        on_pluginListUpdated()));
    index = ui->treeViewPlugins->getModel()->index(0, 0);
    ui->treeViewPlugins->setCurrentIndex(index);
    on_scriptPluginSelected(index, index);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogScripts::on_scriptSystemSelected(QModelIndex index, QModelIndex)
{
    QStandardItem *selected = ui->treeViewSystem->getModel()->itemFromIndex(
        index);
    if (selected != nullptr)
    {
        SystemScript *script = reinterpret_cast<SystemScript *>(selected->data()
            .value<quintptr>());
        if (script != nullptr)
        {
            ui->widgetCodeSystem->show();
            ui->widgetCodeSystem->setPlainText(script->getCode());
        } else
        {
            ui->widgetCodeSystem->hide();
        }
    } else
    {
        ui->widgetCodeSystem->hide();
    }
}

// -------------------------------------------------------

void DialogScripts::on_scriptPluginSelected(QModelIndex index, QModelIndex)
{
    QStandardItem *selected = ui->treeViewPlugins->getModel()->itemFromIndex(
        index);
    if (selected != nullptr)
    {
        SystemPlugin *plugin = reinterpret_cast<SystemPlugin *>(selected->data()
            .value<quintptr>());
        if (plugin != nullptr)
        {
            ui->tabWidgetPlugin->show();
            ui->widgetCodePlugin->setPlainText(plugin->getCode());
        } else
        {
            ui->tabWidgetPlugin->hide();
        }
    } else
    {
        ui->tabWidgetPlugin->hide();
    }
}

// -------------------------------------------------------

void DialogScripts::on_pluginListUpdated()
{
    RPM::get()->project()->writeScriptsDatas();
}
