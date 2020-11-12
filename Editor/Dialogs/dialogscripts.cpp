/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDesktopServices>
#include "dialogscripts.h"
#include "ui_dialogscripts.h"
#include "systemscript.h"
#include "systemplugin.h"
#include "common.h"
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

SystemScript * DialogScripts::getSelectedScript() const
{
    QStandardItem *selected = ui->treeViewSystem->getSelected();
    if (selected != nullptr)
    {
        return reinterpret_cast<SystemScript *>(selected->data().value<quintptr>());
    }
    return nullptr;
}

// -------------------------------------------------------

SystemPlugin * DialogScripts::getSelectedPlugin() const
{
    QStandardItem *selected = ui->treeViewPlugins->getSelected();
    if (selected != nullptr)
    {
        return reinterpret_cast<SystemPlugin *>(selected->data().value<quintptr>());
    }
    return nullptr;
}

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
    connect(ui->widgetCodeSystem, SIGNAL(needSave()), this, SLOT(
        on_scriptCodeNeedSave()));

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
    connect(ui->widgetCodePlugin, SIGNAL(needSave()), this, SLOT(
        on_pluginCodeNeedSave()));

    // Focus close button
    ui->pushButtonClose->setFocus();
}

// -------------------------------------------------------

void DialogScripts::updateScriptCodeSave()
{
    ui->treeViewSystem->updateAbsoluteAllNodesString();
    ui->tabWidget->setTabText(0, "System" + (RPM::get()->project()
        ->scriptsDatas()->allScriptsSaved() ? "" : RPM::SPACE + "*"));
}

// -------------------------------------------------------

void DialogScripts::updatePluginCodeSave()
{
    ui->tabWidgetPlugin->setTabText(1, "Code" + (this->getSelectedPlugin()
        ->changed() ? RPM::SPACE + "*" : ""));
    ui->treeViewPlugins->updateAbsoluteAllNodesString();
    ui->tabWidget->setTabText(1, "Plugins" + (RPM::get()->project()
        ->scriptsDatas()->allPluginsSaved() ? "" : RPM::SPACE + "*"));
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogScripts::keyPressEvent(QKeyEvent *event)
{
    // CTRL + S
    QKeySequence keys = Common::getKeySequence(event);
    QKeySequence ctrls(Qt::CTRL + Qt::Key_S);
    if (keys.matches(ctrls))
    {
        SystemScript *script;
        SystemPlugin *plugin;
        switch (ui->tabWidget->currentIndex())
        {
        case 0: // System
            script = this->getSelectedScript();
            script->setChanged(false);
            Common::write(script->getPath(), script->currentCode());
            this->updateScriptCodeSave();
            break;
        case 1: // Plugins
            switch (ui->tabWidgetPlugin->currentIndex())
            {
            case 1: // Code
                plugin = this->getSelectedPlugin();
                plugin->setChanged(false);
                Common::write(plugin->getPath(), plugin->currentCode());
                this->updatePluginCodeSave();
                break;
            default:
                break;
            }

            break;
        }
    }
    QDialog::keyPressEvent(event);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogScripts::on_scriptSystemSelected(QModelIndex, QModelIndex)
{
    SystemScript *script = this->getSelectedScript();
    if (script != nullptr)
    {
        ui->widgetCodeSystem->show();
        ui->widgetCodeSystem->initialize(script);
        this->updateScriptCodeSave();
        ui->widgetCodeSystem->setFocus();
    } else
    {
        ui->widgetCodeSystem->hide();
    }
}

// -------------------------------------------------------

void DialogScripts::on_scriptPluginSelected(QModelIndex, QModelIndex)
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    if (plugin != nullptr)
    {
        ui->tabWidgetPlugin->show();
        ui->panelPluginDetails->initialize(plugin);
        ui->widgetCodePlugin->initialize(plugin);
        this->updatePluginCodeSave();
        if (ui->tabWidgetPlugin->currentIndex() == 1)
        {
            ui->widgetCodePlugin->setFocus();
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

// -------------------------------------------------------

void DialogScripts::on_pushButtonOpenPluginFolder_clicked()
{
    QDesktopServices::openUrl(QUrl::fromLocalFile(this->getSelectedPlugin()
        ->getFolderPath()));
}

// -------------------------------------------------------

void DialogScripts::on_scriptCodeNeedSave()
{
    this->updateScriptCodeSave();
}

// -------------------------------------------------------

void DialogScripts::on_pluginCodeNeedSave()
{
    this->updatePluginCodeSave();
}
