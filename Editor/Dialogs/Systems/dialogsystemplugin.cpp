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
#include "dialogsystemplugin.h"
#include "ui_dialogsystemplugin.h"
#include "Quazip/quazip.h"
#include "Quazip/quazipfile.h"
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
    m_previousName(plugin.name())
{
    ui->setupUi(this);

    ui->comboBoxCategory->addItems(RPM::ENUM_TO_STRING_PLUGIN_CATEGORY);

    this->initialize();
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
    switch (m_plugin.type())
    {
    case PluginTypeKind::Empty:
        ui->radioButtonEmpty->setChecked(true);
        ui->lineEditName->setText(m_plugin.name());
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
//
//  VIRTUAL FUNCTION
//
// -------------------------------------------------------

void DialogSystemPlugin::accept()
{
    QString pathPlugins = Common::pathCombine(RPM::get()->project()
        ->pathCurrentProjectApp(), RPM::PATH_SCRIPTS_PLUGINS_DIR);
    QDir dirPlugins(pathPlugins);
    QString path;

    // Delete previous plugin
    if (!m_previousName.isEmpty())
    {
        QDir(Common::pathCombine(pathPlugins, m_previousName)).removeRecursively();
    }

    // Check plugin name
    if (m_plugin.name().isEmpty())
    {
        QMessageBox::information(this, RPM::translate(Translations
            ::WARNING), "The plugin name can't be empty.");
        return;
    }
    if (RPM::get()->project()->scriptsDatas()->containsPluginName(m_plugin
        .name()))
    {
        QMessageBox::information(this, RPM::translate(Translations
            ::WARNING), "This plugin name already exists in your project.");
        return;
    }

    // Check according to type
    switch (m_plugin.type())
    {
    case PluginTypeKind::Empty:
    {
        dirPlugins.mkdir(m_plugin.name());
        path = m_plugin.getFolderPath();
        QJsonObject json;
        m_plugin.write(json);
        Common::writeOtherJSON(Common::pathCombine(path, SystemPlugin::NAME_JSON
            ), json);
        QFile file(Common::pathCombine(path, SystemPlugin::NAME_CODE));
        file.open(QIODevice::ReadWrite);
        file.write(("(() => {\n    let pluginName = \"" + m_plugin.name() +
            "\"\n\n    // Start code here\n\n})();").toUtf8());
        file.close();
        break;
    }
    case PluginTypeKind::Local:
        break;
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
    ui->pushButtonImport->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemPlugin::on_radioButtonOnline_toggled(bool checked)
{
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
