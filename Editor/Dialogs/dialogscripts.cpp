/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDesktopServices>
#include <QDir>
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
    ui->treeViewEditParameter->initializeNewItemInstance(new
        SystemPluginParameter);

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
    delete m_widgetLineNumberPlugin;
    delete m_highlighterPlugin;
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
    connect(ui->treeViewPlugins->getModel(), SIGNAL(itemChanged(QStandardItem *)
        ), this, SLOT(on_treeViewPluginsItemChanged(QStandardItem *)));

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

void DialogScripts::updatePluginEditSave()
{
    ui->tabWidgetPlugin->setTabText(2, "Edit" + (this->getSelectedPlugin()
        ->editChanged() ? RPM::SPACE + "*" : ""));
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
            plugin = this->getSelectedPlugin();
            switch (ui->tabWidgetPlugin->currentIndex())
            {
            case 1: // Code
                plugin->setChanged(false);
                Common::write(plugin->getPath(), plugin->currentCode());
                this->updatePluginCodeSave();
                break;
            case 2: // Edit
            {
                plugin = this->getSelectedPlugin();
                QString previousName = plugin->name();

                // Check plugin name
                if (!plugin->editedPlugin()->checkPluginName(previousName))
                {
                    return;
                }
                plugin->setEditChanged(false);
                QDir(Common::pathCombine(RPM::get()->project()
                    ->pathCurrentProjectApp(), RPM::PATH_SCRIPTS_PLUGINS_DIR))
                    .rename(previousName, plugin->editedPlugin()->name());
                plugin->setCopy(*plugin->editedPlugin());
                QJsonObject json;
                plugin->write(json);
                Common::writeOtherJSON(Common::pathCombine(plugin
                    ->getFolderPath(), SystemPlugin::NAME_JSON), json);
                RPM::get()->project()->writeScriptsDatas();
                this->updatePluginEditSave();
                ui->panelPluginDetails->initialize(plugin);
                break;
            }
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
        plugin->initializeEditedPlugin();
        ui->panelPluginDetails->initialize(plugin->editedPlugin());
        ui->widgetCodePlugin->initialize(plugin);
        this->updatePluginCodeSave();
        ui->lineEditName->setText(plugin->editedPlugin()->name());
        ui->lineEditAuthor->setText(plugin->editedPlugin()->author());
        ui->plainTextEditDescription->blockSignals(true);
        ui->plainTextEditDescription->setPlainText(plugin->editedPlugin()
            ->description());
        ui->plainTextEditDescription->blockSignals(false);
        ui->lineEditVersion->setText(plugin->editedPlugin()->version());
        ui->lineEditWebsite->setText(plugin->editedPlugin()->website());
        ui->lineEditTutorial->setText(plugin->editedPlugin()->tutorial());
        ui->treeViewEditParameter->initializeModel(plugin->editedPlugin()
            ->parameters());
        QModelIndex index = ui->treeViewEditParameter->getModel()->index(0, 0);
        ui->treeViewEditParameter->setCurrentIndex(index);
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

// -------------------------------------------------------

void DialogScripts::on_treeViewPluginsItemChanged(QStandardItem *item)
{
    // Handle check / uncheck plugin
    SystemPlugin *plugin = reinterpret_cast<SystemPlugin *>(item->data()
        .value<quintptr>());
    if (plugin != nullptr)
    {
        plugin->setIsON(item->checkState() == Qt::Checked);
        plugin->editedPlugin()->setIsON(plugin->isON());
        RPM::writeJSON(plugin->getJSONPath(), *plugin);
    }
}

// -------------------------------------------------------

void DialogScripts::on_lineEditName_textEdited(const QString &text)
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    plugin->editedPlugin()->setName(text);
    plugin->setEditChanged(true);
    this->updatePluginEditSave();
}

// -------------------------------------------------------

void DialogScripts::on_lineEditAuthor_textEdited(const QString &text)
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    plugin->editedPlugin()->setAuthor(text);
    plugin->setEditChanged(true);
    this->updatePluginEditSave();
}

// -------------------------------------------------------

void DialogScripts::on_plainTextEditDescription_textChanged()
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    plugin->editedPlugin()->setDescription(ui->plainTextEditDescription
        ->toPlainText());
    plugin->setEditChanged(true);
    this->updatePluginEditSave();
}

// -------------------------------------------------------

void DialogScripts::on_lineEditVersion_textEdited(const QString &text)
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    plugin->editedPlugin()->setVersion(text);
    plugin->setEditChanged(true);
    this->updatePluginEditSave();
}

void DialogScripts::on_lineEditWebsite_textEdited(const QString &text)
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    plugin->editedPlugin()->setWebsite(text);
    plugin->setEditChanged(true);
    this->updatePluginEditSave();
}

void DialogScripts::on_lineEditTutorial_textEdited(const QString &text)
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    plugin->editedPlugin()->setTutorial(text);
    plugin->setEditChanged(true);
    this->updatePluginEditSave();
}
