/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "panelplugindetails.h"
#include "ui_panelplugindetails.h"
#include "systemplugincommand.h"
#include "systempluginparameter.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelPluginDetails::PanelPluginDetails(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelPluginDetails)
{
    ui->setupUi(this);
    ui->widgetShowPicture->setActivateCoef(false);
    ui->treeViewEditParameter->initializeNewItemInstance(new
        SystemPluginParameter);
    ui->treeViewEditParameter->setCanMove(false);
    ui->treeViewEditParameter->setCanCreateDelete(false);

    this->translate();
}

PanelPluginDetails::~PanelPluginDetails()
{
    delete ui;
}

QTreeView * PanelPluginDetails::treeViewParameters() const
{
    return ui->treeViewEditParameter;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelPluginDetails::initialize(SystemPlugin *plugin)
{
    m_plugin = plugin;
    ui->labelName->setText(RPM::TAG_OPEN_STRONG + RPM::translate(Translations
        ::NAME) + RPM::COLON + RPM::TAG_CLOSE_STRONG + RPM::SPACE + m_plugin
        ->name());
    if (m_plugin->author().isEmpty())
    {
        ui->labelAuthor->hide();
    } else
    {
        ui->labelAuthor->show();
        ui->labelAuthor->setText(RPM::TAG_OPEN_STRONG + RPM::translate(
            Translations::AUTHOR) + RPM::COLON + RPM::TAG_CLOSE_STRONG + RPM
            ::SPACE + m_plugin->author());
    }
    if (m_plugin->description().isEmpty())
    {
        ui->labelDescritpion->hide();
    } else
    {
        ui->labelDescritpion->show();
        ui->labelDescritpion->setText(RPM::TAG_OPEN_STRONG + RPM::translate(
            Translations::DESCRIPTION) + RPM::COLON + RPM::TAG_CLOSE_STRONG +
            RPM::SPACE + m_plugin->description().replace("\n", "<br />"));
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
        ui->labelWebsite->setText(RPM::TAG_OPEN_STRONG + RPM::translate(
            Translations::WEBSITE) + RPM::COLON + RPM::TAG_CLOSE_STRONG + RPM
            ::SPACE + RPM::TAG_OPEN_A + m_plugin->website() + RPM::TAG_MIDDLE_A
            + m_plugin->website() + RPM::TAG_CLOSE_A);
    }
    if (m_plugin->tutorial().isEmpty())
    {
        ui->labelTutorial->hide();
    } else
    {
        ui->labelTutorial->show();
        ui->labelTutorial->setText(RPM::TAG_OPEN_STRONG + RPM::translate(
            Translations::TUTORIAL) + RPM::COLON + RPM::TAG_CLOSE_STRONG + RPM
            ::SPACE + RPM::TAG_OPEN_A + m_plugin->tutorial() + RPM::TAG_MIDDLE_A
            + m_plugin->tutorial() + RPM::TAG_CLOSE_A);
    }
    SuperListItem::removeEmptyInTree(m_plugin->parameters());
    ui->groupBoxParameters->setVisible(m_plugin->parameters()
        ->invisibleRootItem()->rowCount() > 0);
    ui->treeViewEditParameter->initializeModel(m_plugin->parameters());
    ui->groupBoxCommands->setVisible(m_plugin->commands()->invisibleRootItem()
        ->rowCount() > 1);
    QString strCommands;
    SystemPluginCommand *command;
    for (int i = 0, l = m_plugin->commands()->invisibleRootItem()->rowCount(); i
        < l; i++)
    {
        command = reinterpret_cast<SystemPluginCommand *>(SuperListItem
            ::getItemModelAt(m_plugin->commands(), i));
        if (command != nullptr)
        {
            strCommands += command->getStringDetails();
        }
    }
    ui->labelCommands->setText(strCommands);
    this->updatePicture();
}

// -------------------------------------------------------

void PanelPluginDetails::updatePicture()
{
    ui->widgetShowPicture->updatePictureByName(m_plugin->getPicPath());
}

// -------------------------------------------------------

void PanelPluginDetails::translate()
{
    ui->groupBoxCommands->setTitle(RPM::translate(Translations::COMMANDS));
    ui->groupBoxParameters->setTitle(RPM::translate(Translations::PARAMETERS));
}
