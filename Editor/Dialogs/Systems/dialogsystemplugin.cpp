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
    m_onlineList(nullptr)
{
    ui->setupUi(this);

    this->initialize();

    this->translate();
}

DialogSystemPlugin::~DialogSystemPlugin()
{
    delete ui;

    if (m_onlineList != nullptr)
    {
        SuperListItem::deleteModel(m_onlineList, true);
    }
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
    ui->comboBoxCategory->addItems(RPM::ENUM_TO_STRING_PLUGIN_CATEGORY);
    ui->comboBoxCategory->setCurrentIndex(static_cast<int>(category));
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
        break;
    }
}

// -------------------------------------------------------

void DialogSystemPlugin::refreshOnline()
{
    ui->pushButtonRefresh->setEnabled(false);
    ui->pushButtonRefresh->setText("Searching for plugins...");
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
    ui->pushButtonRefresh->setText("Refresh");
}

// -------------------------------------------------------

void DialogSystemPlugin::translate()
{
    // translate label import here
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
            ::WARNING) + RPM::COMMA + RPM::SPACE +
            "You will erase any progress in this plugin if you continue. Keep going?",
            QMessageBox::Yes | QMessageBox::No | QMessageBox::Cancel);
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
        m_plugin.setDefault();
        m_plugin.setType(PluginTypeKind::Empty);
        dirPlugins.mkdir(m_plugin.name());
        path = m_plugin.getFolderPath();
        QJsonObject json;
        m_plugin.write(json);
        Common::writeOtherJSON(Common::pathCombine(path, SystemPlugin
            ::NAME_JSON), json);
        QFile file(Common::pathCombine(path, SystemPlugin::NAME_CODE));
        file.open(QIODevice::ReadWrite);
        file.write(("(() => {\n    let pluginName = \"" + m_plugin.name() +
            "\";\n\n    // Start code here\n\n})();").toUtf8());
        file.close();
        break;
    }
    case PluginTypeKind::Local:
    {
        if (!m_isImportPluginLoaded)
        {
            QMessageBox::information(nullptr, RPM::translate(Translations
                ::INFORMATION), "You need to select a plugin to import" + RPM
                ::DOT);
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
                ::ERROR_MESSAGE), "Impossible to copy" + RPM::SPACE + src + RPM
                ::SPACE + RPM::translate(Translations::TO) + RPM::SPACE + dst);
            return;
        }

        // Read plugin and rewrite for type
        RPM::readJSON(m_plugin.getJSONPath(), m_plugin);
        m_plugin.setType(PluginTypeKind::Local);
        RPM::writeJSON(m_plugin.getJSONPath(), m_plugin);
        break;
    }
    case PluginTypeKind::Online:
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
    if (checked && m_onlineList == nullptr)
    {
        m_onlineList = new QStandardItemModel;
        this->refreshOnline();
    }
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
    this->refreshOnline();
}

// -------------------------------------------------------

void DialogSystemPlugin::on_pluginSelected(QModelIndex, QModelIndex)
{
    SystemPlugin *plugin = reinterpret_cast<SystemPlugin *>(ui->treeViewOnline
        ->getSelected()->data().value<quintptr>());
    if (plugin == nullptr)
    {
        ui->scrollArea->setVisible(false);
    } else
    {
        ui->scrollArea->setVisible(true);
        ui->panelPluginDetails->initialize(plugin);
    }
}
