/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemplugin.h"
#include "ui_dialogsystemplugin.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemPlugin::DialogSystemPlugin(SystemPlugin &plugin, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemPlugin),
    m_plugin(plugin)
{
    ui->setupUi(this);
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
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemPlugin::on_lineEditName_textChanged(const QString &text)
{
    m_plugin.setName(text);
}
