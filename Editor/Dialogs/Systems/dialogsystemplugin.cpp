/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QMessageBox>
#include <QDir>
#include <QFileDialog>
#include <QNetworkAccessManager>
#include <QNetworkRequest>
#include <QNetworkReply>
#include <QEventLoop>
#include <QUrl>
#include "dialogsystemplugin.h"
#include "ui_dialogsystemplugin.h"
#include "controlnewproject.h"
#include "common.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemPlugin::DialogSystemPlugin(SystemPlugin &plugin, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemPlugin),
    m_plugin(plugin),
    m_previousName(plugin.name()),
    m_previousKind(plugin.type()),
    m_isImportPluginLoaded(false),
    m_onlineList(new QStandardItemModel),
    m_isOnlinePluginLoaded(false),
    m_isSettingprogramatically(false),
    m_isFirstCheckOnline(true)
{
    ui->setupUi(this);

    this->initialize();

    this->translate();
}

DialogSystemPlugin::~DialogSystemPlugin()
{
    delete ui;

    SuperListItem::deleteModel(m_onlineList, true);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemPlugin::initialize()
{
    // Keep space when hiding widgets
    QSizePolicy sp_retain;
    sp_retain = ui->scrollArea->sizePolicy();
    sp_retain.setRetainSizeWhenHidden(true);
    ui->scrollArea->setSizePolicy(sp_retain);

    // Some widgets config
    PluginCategoryKind category = m_plugin.category();
    m_isSettingprogramatically = true;
    ui->comboBoxCategory->addItems(RPM::ENUM_TO_STRING_PLUGIN_CATEGORY);
    ui->comboBoxCategory->setCurrentIndex(static_cast<int>(category));
    m_isSettingprogramatically = false;
    ui->scrollArea->setVisible(false);
    ui->treeViewOnline->setCanMove(false);
    ui->treeViewOnline->setCanBeControled(false);
    ui->treeViewOnline->setCanBeEmpty(true);
    ui->treeViewOnline->setCanCreateDelete(false);
    ui->treeViewOnline->initializeModel(m_onlineList);
    connect(ui->treeViewOnline->selectionModel(), SIGNAL(currentChanged(
        QModelIndex, QModelIndex)), this, SLOT(on_pluginSelected(QModelIndex,
        QModelIndex)));

    // Initialize according to plugin infos
    QString name = m_plugin.name();
    SuperListItem *super;
    switch (m_plugin.type())
    {
    case PluginTypeKind::Empty:
        ui->radioButtonEmpty->setChecked(true);
        ui->lineEditName->setText(name);
        ui->lineEditName->setFocus();
        break;
    case PluginTypeKind::Local:
        ui->radioButtonLocal->setChecked(true);
        break;
    case PluginTypeKind::Online:
        ui->radioButtonOnline->setChecked(true);
        for (int i = 0, l = m_onlineList->invisibleRootItem()->rowCount(); i < l
            ; i++)
        {
             super = SuperListItem::getItemModelAt(m_onlineList, i);
             if (super->name() == name)
             {
                 QModelIndex index = ui->treeViewOnline->getModel()->index(i, 0);
                 ui->treeViewOnline->setCurrentIndex(index);
                 this->on_pluginSelected(index, index);
             }
        }
        break;
    }
}

// -------------------------------------------------------

void DialogSystemPlugin::refreshOnline()
{
    ui->pushButtonRefresh->setEnabled(false);
    ui->pushButtonRefresh->setText(RPM::translate(Translations
        ::SEARCHING_FOR_PLUGINS) + RPM::DOT_DOT_DOT);
    SuperListItem::deleteModel(m_onlineList, false);
    QNetworkAccessManager manager;
    QString pluginsFolder = "https://raw.githubusercontent.com/RPG-Paper-Maker/"
        "RPG-Paper-Maker/develop/Plugins/";
    QNetworkReply *reply = manager.get(QNetworkRequest(QUrl(pluginsFolder +
        "package.json")));
    QEventLoop loop;
    QObject::connect(reply, SIGNAL(finished()), &loop, SLOT(quit()));
    loop.exec();
    QJsonObject doc;
    QJsonDocument json;
    if (reply->error() == QNetworkReply::NetworkError::NoError)
    {
        doc = QJsonDocument::fromJson(reply->readAll()).object();
    }
    QString pathPlugin;
    QJsonArray pluginNames = doc[m_plugin.getJSONCategory()].toArray();
    SystemPlugin *plugin;
    for (int i = 0, l = pluginNames.size(); i < l; i++)
    {
        pathPlugin = pluginsFolder + pluginNames.at(i).toString();
        reply = manager.get(QNetworkRequest(QUrl(pathPlugin + "/" + SystemPlugin
            ::NAME_JSON)));
        QObject::connect(reply, SIGNAL(finished()), &loop, SLOT(quit()));
        loop.exec();
        if (reply->error() != QNetworkReply::NetworkError::NoError)
        {
            continue;
        }
        doc = QJsonDocument::fromJson(reply->readAll()).object();
        plugin = new SystemPlugin;
        plugin->setIsOnline(true);
        plugin->read(doc);
        plugin->setDisplayID(false);
        plugin->setDisplayIsOn(false);
        reply = manager.get(QNetworkRequest(QUrl(pathPlugin + "/" + SystemPlugin
            ::NAME_CODE)));
        QObject::connect(reply, SIGNAL(finished()), &loop, SLOT(quit()));
        loop.exec();
        if (reply->error() != QNetworkReply::NetworkError::NoError)
        {
            continue;
        }
        plugin->setCurrentCode(reply->readAll());
        m_onlineList->appendRow(plugin->getModelRow());
    }
    ui->pushButtonRefresh->setEnabled(true);
    ui->pushButtonRefresh->setText(RPM::translate(Translations::REFRESH));
}

// -------------------------------------------------------

void DialogSystemPlugin::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_PLUGIN) + RPM
        ::DOT_DOT_DOT);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->labelCategory->setText(RPM::translate(Translations::CATEGORY) +
        RPM::COLON);
    ui->labelLocalPlugin->setText(RPM::translate(Translations
        ::NO_PLUGIN_SELECTED) + RPM::COLON);
    ui->radioButtonEmpty->setText(RPM::translate(Translations::CREATE_EMPTY));
    ui->radioButtonLocal->setText(RPM::translate(Translations
        ::IMPORT_FROM_LOCAL_PLUGIN));
    ui->radioButtonOnline->setText(RPM::translate(Translations
        ::ADD_FROM_ONLINE_PLUGINS_LIST));
    ui->pushButtonRefresh->setText(RPM::translate(Translations::REFRESH));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTION
//
// -------------------------------------------------------

void DialogSystemPlugin::accept()
{
    QString pathPlugins = Common::pathCombine(RPM::get()->project()
        ->pathCurrentProjectApp(), RPM::PATH_SCRIPTS_PLUGINS_DIR);
    QDir dirPlugins(pathPlugins);

    // If online, check if a plugin is selected
    if (m_plugin.type() == PluginTypeKind::Online && !m_isOnlinePluginLoaded)
    {
        QMessageBox::information(nullptr, RPM::translate(Translations
            ::INFORMATION), RPM::translate(Translations
            ::YOU_NEED_SELECT_PLUGIN_IMPORT) + RPM::DOT);
    }

    // Check plugin name
    if (!m_plugin.checkPluginName(m_previousName))
    {
        return;
    }

    // Delete previous plugin
    if (!m_previousName.isEmpty())
    {
        QMessageBox::StandardButton box = QMessageBox::question(this, RPM
            ::translate(Translations::WARNING), RPM::translate(Translations
            ::WARNING) + RPM::COMMA + RPM::SPACE + RPM::translate(Translations
            ::YOU_WILL_ERASE_PROGRESS_PLUGIN), QMessageBox::Yes | QMessageBox
            ::No | QMessageBox::Cancel);
        if (box != QMessageBox::Yes)
        {
            return;
        }
        QDir(Common::pathCombine(pathPlugins, m_previousName)).removeRecursively();
    }

    // Check according to type
    QString path;
    switch (m_plugin.type())
    {
    case PluginTypeKind::Empty:
    {
        dirPlugins.mkdir(m_plugin.name());
        path = m_plugin.getFolderPath();
        QJsonObject json;
        m_plugin.write(json);
        Common::writeOtherJSON(Common::pathCombine(path, SystemPlugin
            ::NAME_JSON), json);
        QFile file(Common::pathCombine(path, SystemPlugin::NAME_CODE));
        file.open(QIODevice::ReadWrite);
        file.write(("let pluginName = \"" + m_plugin.name() + "\";\n\n// Start code here").toUtf8());
        file.close();
        break;
    }
    case PluginTypeKind::Local:
    {
        if (!m_isImportPluginLoaded)
        {
            QMessageBox::information(nullptr, RPM::translate(Translations
                ::INFORMATION), RPM::translate(Translations
                ::YOU_NEED_SELECT_PLUGIN_IMPORT) + RPM::DOT);
            return;
        }
        QString src = ui->labelLocalPlugin->text();
        QString dst = Common::pathCombine(RPM::get()->project()
            ->pathCurrentProjectApp(), RPM::PATH_SCRIPTS_PLUGINS_DIR);

        // Copy plugin
        QDir(dst).mkdir(m_plugin.name());
        if (!Common::copyPath(src, Common::pathCombine(dst, m_plugin.name())))
        {
            QMessageBox::critical(nullptr, RPM::translate(Translations
                ::ERROR_MESSAGE), RPM::translate(Translations
                ::IMPOSSIBLE_TO_COPY) + RPM::SPACE + src + RPM::SPACE + RPM
                ::translate(Translations::TO) + RPM::SPACE + dst);
            return;
        }

        // Read plugin and rewrite for type
        RPM::readJSON(m_plugin.getJSONPath(), m_plugin);
        m_plugin.setType(PluginTypeKind::Local);
        RPM::writeJSON(m_plugin.getJSONPath(), m_plugin);
        break;
    }
    case PluginTypeKind::Online:
        dirPlugins.mkdir(m_plugin.name());
        path = m_plugin.getFolderPath();
        QJsonObject json;
        m_plugin.write(json);
        Common::writeOtherJSON(Common::pathCombine(path, SystemPlugin
            ::NAME_JSON), json);
        QFile file(Common::pathCombine(path, SystemPlugin::NAME_CODE));
        file.open(QIODevice::ReadWrite);
        file.write(m_plugin.currentCode().toUtf8());
        file.close();
        m_plugin.setDisplayID(true);
        m_plugin.setDisplayIsOn(true);
        break;
    }

    // Accept if everything is ok
    QDialog::accept();
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemPlugin::on_radioButtonEmpty_toggled(bool checked)
{
    m_plugin.setDefault();
    m_plugin.setType(PluginTypeKind::Empty);
    m_plugin.setName(ui->lineEditName->text());

    // Enable widgets
    ui->labelName->setEnabled(checked);
    ui->lineEditName->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemPlugin::on_radioButtonLocal_toggled(bool checked)
{
    m_plugin.setDefault();
    m_plugin.setType(PluginTypeKind::Local);

    // Enable widgets
    ui->labelLocalPlugin->setEnabled(checked);
    ui->pushButtonImport->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemPlugin::on_radioButtonOnline_toggled(bool checked)
{
    m_plugin.setDefault();
    m_plugin.setType(PluginTypeKind::Online);
    m_plugin.setCategory(static_cast<PluginCategoryKind>(ui->comboBoxCategory
        ->currentIndex()));

    // Enable widgets
    ui->labelCategory->setEnabled(checked);
    ui->comboBoxCategory->setEnabled(checked);
    ui->treeViewOnline->setEnabled(checked);
    ui->pushButtonRefresh->setEnabled(checked);
    ui->scrollArea->setEnabled(checked);
    ui->panelPluginDetails->setEnabled(checked);

    // First search
    if (checked && m_isFirstCheckOnline)
    {
        this->refreshOnline();
    }
    m_isFirstCheckOnline = false;
}

// -------------------------------------------------------

void DialogSystemPlugin::on_lineEditName_textChanged(const QString &text)
{
    QString filteredText = ControlNewproject::filterDirectoryName(text, true);
    ui->lineEditName->setText(filteredText);
    m_plugin.setName(filteredText);
}

// -------------------------------------------------------

void DialogSystemPlugin::on_pushButtonImport_clicked()
{
    QString src = QFileDialog::getExistingDirectory(this, RPM::translate(
        Translations::CHOOSE_LOCATION) + RPM::DOT_DOT_DOT);
    if (!src.isEmpty())
    {
        ui->labelLocalPlugin->setText(src);
        m_plugin.setName(QFileInfo(src).fileName());
        m_isImportPluginLoaded = true;
    }
}

// -------------------------------------------------------

void DialogSystemPlugin::on_pushButtonRefresh_clicked()
{
    this->refreshOnline();
}

// -------------------------------------------------------

void DialogSystemPlugin::on_comboBoxCategory_currentIndexChanged(int index)
{
    m_plugin.setCategory(static_cast<PluginCategoryKind>(index));
    if (!m_isSettingprogramatically)
    {
        this->refreshOnline();
    }
}

// -------------------------------------------------------

void DialogSystemPlugin::on_pluginSelected(QModelIndex, QModelIndex)
{
    SystemPlugin *plugin = reinterpret_cast<SystemPlugin *>(ui->treeViewOnline
        ->getSelected()->data().value<quintptr>());
    if (plugin == nullptr)
    {
        ui->scrollArea->setVisible(false);
        m_isOnlinePluginLoaded = false;
    } else
    {
        ui->scrollArea->setVisible(true);
        ui->panelPluginDetails->initialize(plugin);
        m_plugin.setCopy(*plugin);
        m_plugin.setType(PluginTypeKind::Online);
        m_plugin.setCurrentCode(plugin->currentCode());
        m_isOnlinePluginLoaded = true;
    }
}
