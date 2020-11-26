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
#include <QFileDialog>
#include <QMessageBox>
#include "dialogscripts.h"
#include "ui_dialogscripts.h"
#include "systemscript.h"
#include "systemplugin.h"
#include "systempluginparameter.h"
#include "systemplugincommand.h"
#include "common.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogScripts::DialogScripts(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogScripts),
    m_isSettingprogramatically(false)
{
    ui->setupUi(this);

    ui->comboBoxCategory->addItems(RPM::ENUM_TO_STRING_PLUGIN_CATEGORY);
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
    ui->treeViewEditCommands->initializeNewItemInstance(new SystemPluginCommand);
    ui->treeViewSystem->header()->setStretchLastSection(false);
    ui->treeViewSystem->header()->setSectionResizeMode(QHeaderView
        ::ResizeToContents);
    ui->treeViewSystem->header()->setMinimumSectionSize(200);
    ui->treeViewPlugins->header()->setStretchLastSection(false);
    ui->treeViewPlugins->header()->setSectionResizeMode(QHeaderView
        ::ResizeToContents);
    ui->treeViewPlugins->header()->setMinimumSectionSize(200);
    connect(ui->treeViewEditParameter, SIGNAL(beforeOpeningWindow()), this, SLOT
        (on_pluginParameterOpeningWindow()));
    connect(ui->treeViewEditCommands, SIGNAL(beforeOpeningWindow()), this, SLOT
        (on_pluginCommandOpeningWindow()));
    connect(ui->treeViewEditParameter, SIGNAL(keyPressed(QKeyEvent *)), this,
        SLOT(on_treeKeyPressed(QKeyEvent *)));
    connect(ui->treeViewEditCommands, SIGNAL(keyPressed(QKeyEvent *)), this,
        SLOT(on_treeKeyPressed(QKeyEvent *)));
    connect(ui->panelPluginDetails->treeViewParameters(), SIGNAL(keyPressed(
        QKeyEvent *)), this, SLOT(on_treeKeyPressed(QKeyEvent *)));

    // Export text
    ui->labelExport1->setText("<h2>Export this plugin localy and share it</h2>");
    ui->labelExport2->setText("<h2>Export to the online database</h2><strong>Check out the github wiki page in " + RPM::TAG_OPEN_A +  "https://github.com/RPG-Paper-Maker/RPG-Paper-Maker/wiki/Online-plugins-submission" + RPM::TAG_MIDDLE_A + "https://github.com/RPG-Paper-Maker/RPG-Paper-Maker/wiki/Online-plugins-submission" + RPM::TAG_CLOSE_A + "!</strong>");

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
    //this->translate();

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
    connect(ui->treeViewPlugins, SIGNAL(deletingItem(SuperListItem *, int)),
        this, SLOT(on_pluginListDeleted(SuperListItem *, int)));
    index = ui->treeViewPlugins->getModel()->index(0, 0);
    ui->treeViewPlugins->setCurrentIndex(index);
    on_scriptPluginSelected(index, index);
    connect(ui->widgetCodePlugin, SIGNAL(needSave()), this, SLOT(
        on_pluginCodeNeedSave()));
    connect(ui->treeViewPlugins->getModel(), SIGNAL(itemChanged(QStandardItem *)
        ), this, SLOT(on_treeViewPluginsItemChanged(QStandardItem *)));
    connect(ui->treeViewEditParameter, SIGNAL(modelUpdated()), this, SLOT(
        on_pluginDefaultParametersUpdated()));
    connect(ui->treeViewEditCommands, SIGNAL(modelUpdated()), this, SLOT(
        on_pluginCommandsUpdated()));
    connect(ui->panelPluginDetails->treeViewParameters(), SIGNAL(modelUpdated())
        , this, SLOT(on_pluginParametersUpdated()));

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

void DialogScripts::updatePluginsSave()
{
    ui->treeViewPlugins->updateAbsoluteAllNodesString();
    ui->tabWidget->setTabText(1, "Plugins" + (RPM::get()->project()
        ->scriptsDatas()->allPluginsSaved() ? "" : RPM::SPACE + "*"));
}

// -------------------------------------------------------

void DialogScripts::updatePluginCodeSave()
{
    ui->tabWidgetPlugin->setTabText(1, "Code" + (this->getSelectedPlugin()
        ->changed() ? RPM::SPACE + "*" : ""));
    this->updatePluginsSave();
}

// -------------------------------------------------------

void DialogScripts::updatePluginEditSave()
{
    ui->tabWidgetPlugin->setTabText(2, "Edit" + (this->getSelectedPlugin()
        ->editChanged() ? RPM::SPACE + "*" : ""));
    this->updatePluginsSave();
}

// -------------------------------------------------------

void DialogScripts::updatePluginDetailsSave()
{
    ui->tabWidgetPlugin->setTabText(0, "Details" + (this->getSelectedPlugin()
        ->editChanged() ? RPM::SPACE + "*" : ""));
    this->updatePluginsSave();
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
            case 0: // Details
            {
                plugin->setEditChanged(false);

                // Copy edited plugin and write
                plugin->clearParameters();
                SuperListItem::copy(plugin->parameters(), plugin->editedPlugin()
                    ->parameters());
                plugin->initializeHeaders();
                QJsonObject json;
                plugin->write(json);
                Common::writeOtherJSON(Common::pathCombine(plugin
                    ->getFolderPath(), SystemPlugin::NAME_JSON), json);
                RPM::get()->project()->writeScriptsDatas();
                this->updatePluginDetailsSave();
                ui->panelPluginDetails->initialize(plugin->editedPlugin());
                break;
            }
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

                // Set as not changed anymore
                plugin->setEditChanged(false);

                // Copy default parameters to current parameters values
                if (plugin->defaultParametersChanged())
                {
                    plugin->editedPlugin()->clearParameters();
                    SuperListItem::copy(plugin->editedPlugin()->parameters(),
                        plugin->editedPlugin()->defaultParameters());
                    SystemPluginParameter::setAllDefault(plugin->editedPlugin()
                        ->parameters(), false);
                    plugin->editedPlugin()->initializeHeaders();
                    plugin->setDefaultParametersChanged(false);
                }

                // Rename folder if necessary
                QDir(Common::pathCombine(RPM::get()->project()
                    ->pathCurrentProjectApp(), RPM::PATH_SCRIPTS_PLUGINS_DIR))
                    .rename(previousName, plugin->editedPlugin()->name());

                // Copy edited plugin and write
                plugin->setCopy(*plugin->editedPlugin());
                QJsonObject json;
                plugin->write(json);
                Common::writeOtherJSON(Common::pathCombine(plugin
                    ->getFolderPath(), SystemPlugin::NAME_JSON), json);
                RPM::get()->project()->writeScriptsDatas();
                this->updatePluginEditSave();
                ui->panelPluginDetails->initialize(plugin->editedPlugin());
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
        m_isSettingprogramatically = true;
        ui->comboBoxCategory->setCurrentIndex(static_cast<int>(plugin
            ->editedPlugin()->category()));
        m_isSettingprogramatically = false;
        ui->treeViewEditParameter->initializeModel(plugin->editedPlugin()
            ->defaultParameters());
        QModelIndex index = ui->treeViewEditParameter->getModel()->index(0, 0);
        ui->treeViewEditParameter->setCurrentIndex(index);
        ui->treeViewEditCommands->initializeModel(plugin->editedPlugin()
            ->commands());
        index = ui->treeViewEditCommands->getModel()->index(0, 0);
        ui->treeViewEditCommands->setCurrentIndex(index);
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
    this->updatePluginDetailsSave();
    this->updatePluginEditSave();
    this->updatePluginCodeSave();
}

// -------------------------------------------------------

void DialogScripts::on_pluginListDeleted(SuperListItem *super, int)
{
    QDir(reinterpret_cast<SystemPlugin *>(super)->getFolderPath())
        .removeRecursively();
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

// -------------------------------------------------------

void DialogScripts::on_lineEditWebsite_textEdited(const QString &text)
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    plugin->editedPlugin()->setWebsite(text);
    plugin->setEditChanged(true);
    this->updatePluginEditSave();
}

// -------------------------------------------------------

void DialogScripts::on_lineEditTutorial_textEdited(const QString &text)
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    plugin->editedPlugin()->setTutorial(text);
    plugin->setEditChanged(true);
    this->updatePluginEditSave();
}

// -------------------------------------------------------

void DialogScripts::on_comboBoxCategory_currentIndexChanged(int index)
{
    if (ui->treeViewPlugins->getModel() != nullptr)
    {
        SystemPlugin *plugin = this->getSelectedPlugin();
        if (plugin != nullptr)
        {
            plugin->editedPlugin()->setCategory(static_cast<PluginCategoryKind>(
                index));
            if (!m_isSettingprogramatically)
            {
                plugin->setEditChanged(true);
                this->updatePluginEditSave();
            }
        }
    }
}

// -------------------------------------------------------

void DialogScripts::on_pluginDefaultParametersUpdated()
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    plugin->setEditChanged(true);
    plugin->setDefaultParametersChanged(true);
    this->updatePluginEditSave();
}

// -------------------------------------------------------

void DialogScripts::on_pluginCommandsUpdated()
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    plugin->setEditChanged(true);
    this->updatePluginEditSave();
}

// -------------------------------------------------------

void DialogScripts::on_pluginParametersUpdated()
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    plugin->setEditChanged(true);
    this->updatePluginDetailsSave();
    SuperListItem::removeEmptyInTree(plugin->editedPlugin()->parameters());
}

// -------------------------------------------------------

void DialogScripts::on_pluginParameterOpeningWindow()
{
    RPM::get()->setSelectedList(ui->treeViewEditParameter->getModel());
}

// -------------------------------------------------------

void DialogScripts::on_pluginCommandOpeningWindow()
{
    RPM::get()->setSelectedList(ui->treeViewEditCommands->getModel());
}

// -------------------------------------------------------

void DialogScripts::on_treeKeyPressed(QKeyEvent *)
{
    ui->tabWidgetPlugin->setFocus();
}

// -------------------------------------------------------

void DialogScripts::on_pushButtonExport_clicked()
{
    QString folder = QFileDialog::getExistingDirectory(this, RPM::translate(
        Translations::CHOOSE_LOCATION) + RPM::DOT_DOT_DOT);
    if (!folder.isEmpty())
    {
        SystemPlugin *plugin = this->getSelectedPlugin();
        QString src = Common::pathCombine(Common::pathCombine(RPM::get()
            ->project()->pathCurrentProjectApp(), RPM::PATH_SCRIPTS_PLUGINS_DIR)
            , plugin->name());
        QString dst = Common::pathCombine(folder, plugin->name());
        QDir(folder).mkdir(plugin->name());
        if (Common::copyPath(src, dst))
        {
            QMessageBox::information(nullptr, RPM::translate(Translations
                ::INFORMATION), "Sucessfully copied" + RPM::SPACE + src + RPM
                ::SPACE + RPM::translate(Translations::TO) + RPM::SPACE + dst);
        } else
        {
            QMessageBox::critical(nullptr, RPM::translate(Translations
                ::ERROR_MESSAGE), "Impossible to copy" + RPM::SPACE + src + RPM
                ::SPACE + RPM::translate(Translations::TO) + RPM::SPACE + dst);
        }
    }
}
