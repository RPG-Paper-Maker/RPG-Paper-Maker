/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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
#include <QNetworkAccessManager>
#include <QNetworkRequest>
#include <QNetworkReply>
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

    // Plugins
    ui->comboBoxCategory->addItems(RPM::ENUM_TO_STRING_PLUGIN_CATEGORY);
    m_widgetLineNumberSystem = new WidgetCodeLineNumberArea(ui->widgetCodeSystem);
    m_highlighterSystem = new CodeSyntaxHighlighter(ui->widgetCodeSystem
        ->document());
    m_widgetLineNumberLibs = new WidgetCodeLineNumberArea(ui->widgetCodeLibs);
    m_highlighterLibs = new CodeSyntaxHighlighter(ui->widgetCodeLibs->document());
    m_widgetLineNumberShaders = new WidgetCodeLineNumberArea(ui
        ->widgetCodeShaders);
    m_highlighterShaders = new CodeSyntaxHighlighter(ui->widgetCodeShaders
        ->document());
    m_widgetLineNumberPlugin = new WidgetCodeLineNumberArea(ui->widgetCodePlugin);
    m_highlighterPlugin = new CodeSyntaxHighlighter(ui->widgetCodePlugin
        ->document());
    ui->treeViewSystem->initializeNewItemInstance(new SystemScript);
    ui->treeViewSystem->setIndentation(15);
    ui->treeViewSystem->setCanMove(false);
    ui->treeViewSystem->setCanBeControled(false);
    ui->treeViewSystem->setCanCreateDelete(false);
    ui->treeViewLibs->initializeNewItemInstance(new SystemScript);
    ui->treeViewLibs->setIndentation(15);
    ui->treeViewLibs->setCanMove(false);
    ui->treeViewLibs->setCanBeControled(false);
    ui->treeViewLibs->setCanCreateDelete(false);
    ui->treeViewShaders->initializeNewItemInstance(new SystemScript);
    ui->treeViewShaders->setIndentation(15);
    ui->treeViewShaders->setCanMove(false);
    ui->treeViewShaders->setCanBeControled(false);
    ui->treeViewShaders->setCanCreateDelete(false);
    ui->treeViewPlugins->initializeNewItemInstance(new SystemPlugin);
    ui->treeViewPlugins->setUpdateId(true);
    ui->treeViewPlugins->setCanSameName(false);
    ui->treeViewEditParameter->setCanSameName(false);
    ui->treeViewEditParameter->initializeNewItemInstance(new
        SystemPluginParameter);
    ui->treeViewEditCommands->setCanSameName(false);
    ui->treeViewEditCommands->initializeNewItemInstance(new SystemPluginCommand);
    ui->treeViewEditCommands->setUpdateId(true);
    ui->treeViewSystem->header()->setStretchLastSection(false);
    ui->treeViewSystem->header()->setSectionResizeMode(QHeaderView
        ::ResizeToContents);
    ui->treeViewSystem->header()->setMinimumSectionSize(200);
    ui->treeViewLibs->header()->setStretchLastSection(false);
    ui->treeViewLibs->header()->setSectionResizeMode(QHeaderView
        ::ResizeToContents);
    ui->treeViewLibs->header()->setMinimumSectionSize(200);
    ui->treeViewShaders->header()->setStretchLastSection(false);
    ui->treeViewShaders->header()->setSectionResizeMode(QHeaderView
        ::ResizeToContents);
    ui->treeViewShaders->header()->setMinimumSectionSize(200);
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

    // Keep space when hiding widgets
    QSizePolicy sp_retain;
    QList<QWidget *> widgetList;
    widgetList << ui->widgetCodeSystem << ui->widgetCodeLibs << ui
        ->widgetCodeShaders << ui->tabWidgetPlugin;
    for (int i = 0; i < widgetList.size(); i++) {
        sp_retain = widgetList[i]->sizePolicy();
        sp_retain.setRetainSizeWhenHidden(true);
        widgetList[i]->setSizePolicy(sp_retain);
    }

    // Avoid focus because of scrollbar
    ui->comboBoxCategory->setFocusPolicy( Qt::StrongFocus );

    this->translate();
}

DialogScripts::~DialogScripts()
{
    ui->widgetCodeSystem->removeScript();
    ui->widgetCodePlugin->removeScript();
    delete m_widgetLineNumberSystem;
    delete m_highlighterSystem;
    delete m_widgetLineNumberLibs;
    delete m_highlighterLibs;
    delete m_widgetLineNumberShaders;
    delete m_highlighterShaders;
    delete m_widgetLineNumberPlugin;
    delete m_highlighterPlugin;
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
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
    // Refresh scripts
    RPM::get()->project()->readScriptsDatas();

    // System
    ui->treeViewSystem->initializeModel(RPM::get()->project()->scriptsDatas()
        ->modelSystem());
    ui->treeViewSystem->expandAll();
    connect(ui->treeViewSystem->selectionModel(), SIGNAL(currentChanged(
        QModelIndex, QModelIndex)), this, SLOT(on_scriptSystemSelected(
        QModelIndex, QModelIndex)));
    QModelIndex index = ui->treeViewSystem->getModel()->index(0, 0);
    ui->treeViewSystem->setCurrentIndex(index);
    on_scriptSystemSelected(index, index);

    // Libs
    ui->treeViewLibs->initializeModel(RPM::get()->project()->scriptsDatas()
        ->modelLibs());
    ui->treeViewLibs->expandAll();
    connect(ui->treeViewLibs->selectionModel(), SIGNAL(currentChanged(
        QModelIndex, QModelIndex)), this, SLOT(on_scriptLibsSelected(
        QModelIndex, QModelIndex)));
    index = ui->treeViewLibs->getModel()->index(0, 0);
    ui->treeViewLibs->setCurrentIndex(index);
    on_scriptLibsSelected(index, index);

    // Shaders
    ui->treeViewShaders->initializeModel(RPM::get()->project()->scriptsDatas()
        ->modelShaders());
    ui->treeViewShaders->expandAll();
    connect(ui->treeViewShaders->selectionModel(), SIGNAL(currentChanged(
        QModelIndex, QModelIndex)), this, SLOT(on_scriptShadersSelected(
        QModelIndex, QModelIndex)));
    index = ui->treeViewShaders->getModel()->index(0, 0);
    ui->treeViewShaders->setCurrentIndex(index);
    on_scriptShadersSelected(index, index);

    // Plugins
    ui->treeViewPlugins->initializeModel(RPM::get()->project()->scriptsDatas()
        ->modelPlugins());
    connect(ui->treeViewPlugins->selectionModel(), SIGNAL(currentChanged(
        QModelIndex, QModelIndex)), this, SLOT(on_scriptPluginSelected(
        QModelIndex, QModelIndex)));
    connect(ui->treeViewPlugins, SIGNAL(modelUpdated()), this, SLOT(
        on_pluginListUpdated()));
    connect(ui->treeViewPlugins, SIGNAL(deletingItem(SuperListItem*, int)),
        this, SLOT(on_pluginListDeleted(SuperListItem *, int)));
    connect(ui->treeViewPlugins, SIGNAL(pastingItem(SuperListItem*,
        SuperListItem*, int)), this, SLOT(on_pluginListPasted(SuperListItem*,
        SuperListItem*, int)));
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

    // Check updates
    this->checkUpdates();
}

// -------------------------------------------------------

void DialogScripts::updatePluginsSave()
{
    ui->treeViewPlugins->updateAbsoluteAllNodesString();
    ui->tabWidget->setTabText(0, "Plugins" + RPM::SPACE + (RPM::get()->project()
        ->scriptsDatas()->allPluginsSaved() ? RPM::SPACE : "*"));
}

// -------------------------------------------------------

void DialogScripts::updatePluginCodeSave()
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    if (plugin != nullptr)
    {
        ui->tabWidgetPlugin->setTabText(1, RPM::translate(Translations::CODE) +
            RPM::SPACE + (plugin->changed() ? "*" : RPM::SPACE));
        this->updatePluginsSave();
    }
}

// -------------------------------------------------------

void DialogScripts::updatePluginEditSave()
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    if (plugin != nullptr)
    {
        ui->tabWidgetPlugin->setTabText(2, RPM::translate(Translations::EDIT) +
            RPM::SPACE + (plugin->editChanged() ? "*" : RPM::SPACE));
        this->updatePluginsSave();
    }
}

// -------------------------------------------------------

void DialogScripts::updatePluginDetailsSave()
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    if (plugin != nullptr)
    {
        ui->tabWidgetPlugin->setTabText(0, RPM::translate(Translations::DETAILS)
            + RPM::SPACE + (plugin->detailsChanged() ? "*" : RPM::SPACE));
        this->updatePluginsSave();
    }
}

// -------------------------------------------------------

void DialogScripts::checkUpdates()
{
    QStandardItemModel *model = RPM::get()->project()->scriptsDatas()
        ->modelPlugins();
    SystemPlugin *plugin, *newPlugin;
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++)
    {
        plugin = reinterpret_cast<SystemPlugin *>(SuperListItem::getItemModelAt(
            model, i));
        if (plugin != nullptr && plugin->type() == PluginTypeKind::Online)
        {
            // Load current plugins
            QNetworkAccessManager manager;
            QString pathPlugin = "https://raw.githubusercontent.com/"
                "RPG-Paper-Maker/RPG-Paper-Maker/develop/Plugins/" + plugin
                ->name();
            QEventLoop loop;
            QNetworkReply *reply = manager.get(QNetworkRequest(QUrl(pathPlugin +
                "/" + SystemPlugin::NAME_JSON)));
            QObject::connect(reply, SIGNAL(finished()), &loop, SLOT(quit()));
            QJsonObject doc;
            QJsonDocument json;
            loop.exec();
            if (reply->error() != QNetworkReply::NetworkError::NoError)
            {
                continue;
            }
            doc = QJsonDocument::fromJson(reply->readAll()).object();
            newPlugin = new SystemPlugin;
            newPlugin->read(doc);
            if (Common::versionDifferent(plugin->version(), newPlugin->version()
                ) == -1)
            {
                QMessageBox box(QMessageBox::Question, RPM::translate(Translations
                    ::WARNING), RPM::translate(Translations::THERE_IS_NEW_VERSION_PLUGIN)
                    .arg(plugin->name()), QMessageBox::Yes | QMessageBox::No |
                    QMessageBox::Cancel);
                box.setButtonText(QMessageBox::Yes, RPM::translate(Translations::YES));
                box.setButtonText(QMessageBox::No, RPM::translate(Translations::NO));
                box.setButtonText(QMessageBox::Cancel, RPM::translate(Translations::CANCEL));
                if (box.exec() == QMessageBox::Yes)
                {
                    newPlugin->setIsOnline(true);
                    newPlugin->setType(PluginTypeKind::Online);
                    plugin->setCopy(*newPlugin);
                    reply = manager.get(QNetworkRequest(QUrl(pathPlugin + "/" +
                        SystemPlugin::NAME_CODE)));
                    QObject::connect(reply, SIGNAL(finished()), &loop, SLOT(
                        quit()));
                    loop.exec();
                    if (reply->error() != QNetworkReply::NetworkError::NoError)
                    {
                        QMessageBox::critical(nullptr, RPM::translate(
                            Translations::ERROR_MESSAGE), RPM::translate(
                            Translations::ERROR_WHILE_DOWNLOAD_PLUGIN).arg(
                            plugin->name()) + RPM::DOT);
                        continue;
                    }
                    plugin->setCurrentCode(reply->readAll());
                    Common::write(plugin->getPath(), plugin->currentCode());
                    doc[SystemPlugin::JSON_TYPE] = static_cast<int>(
                        PluginTypeKind::Online);
                    Common::writeOtherJSON(Common::pathCombine(plugin
                        ->getFolderPath(), SystemPlugin::NAME_JSON), doc);
                    RPM::get()->project()->writeScriptsDatas();
                    QMessageBox::information(nullptr, RPM::translate(
                        Translations::SUCCESS), RPM::translate(Translations
                        ::SUCCESSFULLY_DOWNLOADED_PLUGIN).arg(plugin->name()) +
                        RPM::DOT);
                }
            }
            delete newPlugin;
        }
    }
}

// -------------------------------------------------------

void DialogScripts::save(SystemPlugin *plugin, int indexPlugins, int index)
{
    if (plugin->editedPlugin() == nullptr)
    {
        return;
    }
    switch (index)
    {
    case 0: // Plugins
        switch (indexPlugins)
        {
        case 0: // Details
        {
            plugin->setDetailsChanged(false);

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

            // Force format for version
            QStringList list = plugin->editedPlugin()->version().split(RPM
                ::DOT);
            int size = list.size();
            int nb1 = 0, nb2 = 0, nb3 = 0;
            if (size >= 1)
            {
                nb1 = list.at(0).toInt();
            }
            if (size >= 2)
            {
                nb2 = list.at(1).toInt();
            }
            if (size >= 3)
            {
                nb3 = list.at(2).toInt();
            }
            plugin->editedPlugin()->setVersion(QString::number(nb1) + RPM
                ::DOT + QString::number(nb2) + RPM::DOT + QString::number(
                nb3));
            ui->lineEditVersion->setText(plugin->editedPlugin()->version());

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

// -------------------------------------------------------

void DialogScripts::saveAll()
{
    SystemPlugin *plugin;
    for (int i = 0, l = ui->treeViewPlugins->getModel()->invisibleRootItem()
         ->rowCount(); i < l; i++)
    {
        plugin = reinterpret_cast<SystemPlugin *>(SuperListItem::getItemModelAt(
            ui->treeViewPlugins->getModel(), i));
        if (plugin != nullptr)
        {
            this->save(plugin, 0);
            this->save(plugin, 1);
            this->save(plugin, 2);
        }
    }
}

// -------------------------------------------------------

void DialogScripts::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SCRIPTS_MANAGER) + RPM
        ::DOT_DOT_DOT);
    ui->tabWidgetPlugin->setTabText(0, RPM::translate(Translations::DETAILS));
    ui->tabWidgetPlugin->setTabText(1, RPM::translate(Translations::CODE));
    ui->tabWidgetPlugin->setTabText(2, RPM::translate(Translations::EDIT));
    ui->tabWidgetPlugin->setTabText(3, RPM::translate(Translations::EXPORT));
    ui->pushButtonOpenPluginFolder->setText(RPM::translate(Translations
        ::OPEN_PLUGIN_FOLDER));
    ui->labelPicture->setText(RPM::translate(Translations::PICTURE) + RPM::COLON);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->labelAuthor->setText(RPM::translate(Translations::AUTHOR) + RPM::COLON);
    ui->labelDescritpion->setText(RPM::translate(Translations::DESCRIPTION) + RPM::COLON);
    ui->labelVersion->setText(RPM::translate(Translations::VERSION) + RPM::COLON);
    ui->labelWebsite->setText(RPM::translate(Translations::WEBSITE) + RPM::COLON);
    ui->labelTutorial->setText(RPM::translate(Translations::TUTORIAL) + RPM::COLON);
    ui->labelCategory->setText(RPM::translate(Translations::CATEGORY) + RPM::COLON);
    ui->groupBoxParameters->setTitle(RPM::translate(Translations::PARAMETERS));
    ui->groupBoxCommands->setTitle(RPM::translate(Translations::COMMANDS));
    ui->labelExport1->setText("<h2>" + RPM::translate(Translations
        ::EXPORT_THIS_PLUGIN_LOCALLY) + "</h2>");
    ui->labelExport2->setText("<h2>" + RPM::translate(Translations
        ::EXPORT_TO_ONLINE_DATABASE) + "</h2><strong>" + RPM::translate(
        Translations::CHECK_OUT_GITHUB_WIKI).arg(RPM::TAG_OPEN_A +
        "https://github.com/RPG-Paper-Maker/RPG-Paper-Maker/wiki/"
        "Online-plugins-submission" + RPM::TAG_MIDDLE_A + "https://github.com/"
        "RPG-Paper-Maker/RPG-Paper-Maker/wiki/Online-plugins-submission" + RPM
        ::TAG_CLOSE_A) + "</strong>");
    ui->pushButtonExport->setText(RPM::translate(Translations::EXPORT) + RPM
        ::DOT_DOT_DOT);
    ui->pushButtonClose->setText(RPM::translate(Translations::CLOSE));
    ui->pushButtonRefresh->setText(RPM::translate(Translations::REFRESH));
    ui->pushButtonSave->setText(RPM::translate(Translations::SAVE));
    ui->pushButtonSaveAndClose->setText(RPM::translate(Translations::SAVE_AND_CLOSE));
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
        this->save(this->getSelectedPlugin(), ui->tabWidgetPlugin->currentIndex(),
            ui->tabWidget->currentIndex());
    }
    QDialog::keyPressEvent(event);
    if (ui->tabWidgetPlugin->currentIndex() == 2) {
        ui->treeViewEditParameter->forceKeyPress(event);
        ui->treeViewEditCommands->forceKeyPress(event);
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogScripts::on_scriptSystemSelected(QModelIndex index, QModelIndex)
{
    QStandardItem *item = ui->treeViewSystem->getModel()->itemFromIndex(index);
    if (item != nullptr)
    {
        SystemScript *script = reinterpret_cast<SystemScript *>(item->data()
            .value<quintptr>());
        if (script != nullptr)
        {
            ui->widgetCodeSystem->show();
            ui->widgetCodeSystem->initialize(script);
        } else
        {
            ui->widgetCodeSystem->hide();
        }
    }
}

// -------------------------------------------------------

void DialogScripts::on_scriptLibsSelected(QModelIndex index, QModelIndex)
{
    QStandardItem *item = ui->treeViewLibs->getModel()->itemFromIndex(index);
    if (item != nullptr)
    {
        SystemScript *script = reinterpret_cast<SystemScript *>(item->data()
            .value<quintptr>());
        if (script != nullptr)
        {
            ui->widgetCodeLibs->show();
            ui->widgetCodeLibs->initialize(script);
        } else
        {
            ui->widgetCodeLibs->hide();
        }
    }
}

// -------------------------------------------------------

void DialogScripts::on_scriptShadersSelected(QModelIndex index, QModelIndex)
{
    QStandardItem *item = ui->treeViewShaders->getModel()->itemFromIndex(index);
    if (item != nullptr)
    {
        SystemScript *script = reinterpret_cast<SystemScript *>(item->data()
            .value<quintptr>());
        if (script != nullptr)
        {
            ui->widgetCodeShaders->show();
            ui->widgetCodeShaders->initialize(script);
        } else
        {
            ui->widgetCodeShaders->hide();
        }
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
        this->updatePluginDetailsSave();
        this->updatePluginEditSave();
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
    this->updatePluginsSave();
}

// -------------------------------------------------------

void DialogScripts::on_pluginListPasted(SuperListItem *previous, SuperListItem
    *after, int)
{
    Common::copyPath(reinterpret_cast<SystemPlugin *>(previous)->getFolderPath()
        , reinterpret_cast<SystemPlugin *>(after)->getFolderPath());
}

// -------------------------------------------------------

void DialogScripts::on_pushButtonOpenPluginFolder_clicked()
{
    QDesktopServices::openUrl(QUrl::fromLocalFile(this->getSelectedPlugin()
        ->getFolderPath()));
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
        plugin->initializeEditedPlugin();
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
    this->updatePluginDetailsSave();
    this->updatePluginEditSave();
}

// -------------------------------------------------------

void DialogScripts::on_lineEditAuthor_textEdited(const QString &text)
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    plugin->editedPlugin()->setAuthor(text);
    plugin->setEditChanged(true);
    this->updatePluginDetailsSave();
    this->updatePluginEditSave();
}

// -------------------------------------------------------

void DialogScripts::on_plainTextEditDescription_textChanged()
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    plugin->editedPlugin()->setDescription(ui->plainTextEditDescription
        ->toPlainText());
    plugin->setEditChanged(true);
    this->updatePluginDetailsSave();
    this->updatePluginEditSave();
}

// -------------------------------------------------------

void DialogScripts::on_lineEditVersion_textEdited(const QString &text)
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    plugin->editedPlugin()->setVersion(text);
    plugin->setEditChanged(true);
    this->updatePluginDetailsSave();
    this->updatePluginEditSave();
}

// -------------------------------------------------------

void DialogScripts::on_lineEditWebsite_textEdited(const QString &text)
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    plugin->editedPlugin()->setWebsite(text);
    plugin->setEditChanged(true);
    this->updatePluginDetailsSave();
    this->updatePluginEditSave();
}

// -------------------------------------------------------

void DialogScripts::on_lineEditTutorial_textEdited(const QString &text)
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    plugin->editedPlugin()->setTutorial(text);
    plugin->setEditChanged(true);
    this->updatePluginDetailsSave();
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
                this->updatePluginDetailsSave();
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
    this->updatePluginDetailsSave();
    this->updatePluginEditSave();
}

// -------------------------------------------------------

void DialogScripts::on_pluginCommandsUpdated()
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    plugin->setEditChanged(true);
    this->updatePluginDetailsSave();
    this->updatePluginEditSave();
}

// -------------------------------------------------------

void DialogScripts::on_pluginParametersUpdated()
{
    SystemPlugin *plugin = this->getSelectedPlugin();
    plugin->setDetailsChanged(true);
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
                ::SUCCESS), RPM::translate(Translations::SUCCESSFULLY_COPIED) +
                RPM::SPACE + src + RPM::SPACE + RPM::translate(Translations::TO)
                + RPM::SPACE + dst);
        } else
        {
            QMessageBox::critical(nullptr, RPM::translate(Translations
                ::ERROR_MESSAGE), RPM::translate(Translations
                ::IMPOSSIBLE_TO_COPY) + RPM::SPACE + src + RPM::SPACE + RPM
                ::translate(Translations::TO) + RPM::SPACE + dst);
        }
    }
}

// -------------------------------------------------------

void DialogScripts::on_pushButtonRefresh_clicked()
{
    this->initialize();
}

// -------------------------------------------------------

void DialogScripts::on_pushButtonSave_clicked()
{
    this->saveAll();
}

// -------------------------------------------------------

void DialogScripts::on_pushButtonSaveAndClose_clicked()
{
    this->saveAll();
    QDialog::close();
}

// -------------------------------------------------------

void DialogScripts::on_pushButtonPicture_clicked()
{
    // Open dialog box
    QString file = QFileDialog::getOpenFileName(this, RPM::translate(
        Translations::ADD_NEW_CONTENTS), "", "Image (*.png)");

    // Copy the image
    SystemPlugin *plugin = this->getSelectedPlugin();
    if (!file.isEmpty() && !QFile::copy(file, plugin->getPicPath()))
    {
        QMessageBox::warning(this, RPM::translate(Translations::WARNING),
            RPM::translate(Translations::COULD_NOT_COPY_FILE_AT) + RPM
            ::SPACE + file + RPM::DOT);
    }
    ui->panelPluginDetails->updatePicture();
}
