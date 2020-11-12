/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "panelplugindetails.h"
#include "ui_panelplugindetails.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelPluginDetails::PanelPluginDetails(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelPluginDetails),
    m_currentPlugin(nullptr)
{
    ui->setupUi(this);
}

PanelPluginDetails::~PanelPluginDetails()
{
    delete ui;

    this->removeCurrentPlugin();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelPluginDetails::removeCurrentPlugin()
{
    if (m_currentPlugin != nullptr)
    {
        delete m_currentPlugin;
    }
}

// -------------------------------------------------------

void PanelPluginDetails::initialize(SystemPlugin *plugin)
{
    m_plugin = plugin;
    this->removeCurrentPlugin();
    m_currentPlugin = reinterpret_cast<SystemPlugin *>(plugin->createCopy());
    ui->labelName->setText(RPM::TAG_OPEN_STRONG + RPM::translate(Translations
        ::NAME) + RPM::COLON + RPM::TAG_CLOSE_STRONG + RPM::SPACE + m_plugin
        ->name());
    if (m_plugin->author().isEmpty())
    {
        ui->labelAuthor->hide();
    } else
    {
        ui->labelName->show();
        ui->labelAuthor->setText(RPM::TAG_OPEN_STRONG + "Author" + RPM::COLON + RPM::TAG_CLOSE_STRONG + RPM::SPACE + m_plugin->author());
    }
    if (m_plugin->description().isEmpty())
    {
        ui->labelDescritpion->hide();
    } else
    {
        ui->labelDescritpion->show();
        ui->labelDescritpion->setText(RPM::TAG_OPEN_STRONG + RPM::translate(
            Translations::DESCRIPTION) + RPM::COLON + RPM::TAG_CLOSE_STRONG +
            RPM::SPACE + m_plugin->description());
    }
    if (m_plugin->version().isEmpty())
    {
        ui->labelVersion->hide();
    } else
    {
        ui->labelVersion->show();
        ui->labelVersion->setText(RPM::TAG_OPEN_STRONG + RPM::translate(
            Translations::VERSION) + RPM::COLON + RPM::TAG_CLOSE_STRONG + RPM
            ::SPACE + m_plugin->version());
    }
    if (m_plugin->website().isEmpty())
    {
        ui->labelWebsite->hide();
    } else
    {
        ui->labelWebsite->show();
        ui->labelWebsite->setText(RPM::TAG_OPEN_STRONG + "Website" + RPM::COLON
            + RPM::TAG_CLOSE_STRONG + RPM::SPACE + RPM::TAG_OPEN_A + m_plugin
            ->website() + RPM::TAG_MIDDLE_A + m_plugin->website() + RPM
            ::TAG_CLOSE_A);
    }
    if (m_plugin->tutorial().isEmpty())
    {
        ui->labelTutorial->hide();
    } else
    {
        ui->labelTutorial->show();
        ui->labelTutorial->setText(RPM::TAG_OPEN_STRONG + "Tutorial" + RPM
            ::COLON + RPM::TAG_CLOSE_STRONG + RPM::SPACE + RPM::TAG_OPEN_A +
            m_plugin->tutorial() + RPM::TAG_MIDDLE_A + m_plugin->tutorial() +
            RPM::TAG_CLOSE_A);
    }
    ui->groupBoxParameters->setVisible(m_plugin->parametersCount() == 0);
    ui->groupBoxCommands->setVisible(m_plugin->commandsCount() == 0);
}
