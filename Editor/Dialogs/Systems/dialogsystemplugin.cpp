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
    m_isImportPluginLoaded(false)
{
    ui->setupUi(this);

    // Keep space when hiding widgets
    QSizePolicy sp_retain;
    QWidget *widget = ui->scrollArea;
    sp_retain = widget->sizePolicy();
    sp_retain.setRetainSizeWhenHidden(true);
    widget->setSizePolicy(sp_retain);

    this->initialize();

    this->translate();
}

DialogSystemPlugin::~DialogSystemPlugin()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemPlugin::initialize()
{
    ui->comboBoxCategory->addItems(RPM::ENUM_TO_STRING_PLUGIN_CATEGORY);
    ui->scrollArea->setVisible(false);
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

    // Enable widgets
    ui->labelCategory->setEnabled(checked);
    ui->treeViewOnline->setEnabled(checked);
    ui->pushButtonRefresh->setEnabled(checked);
    ui->scrollArea->setEnabled(checked);
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
