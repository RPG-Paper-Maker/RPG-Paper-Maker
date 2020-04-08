/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDesktopServices>
#include "mainwindow.h"
#include "panelmainmenu.h"
#include "ui_panelmainmenu.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelMainMenu::PanelMainMenu(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelMainMenu)
{
    ui->setupUi(this);

    ui->pushButtonNewProject->setAutoFillBackground(true);
    ui->widgetPatreon->updateImage(":/images/Ressources/become-patreon.png", 0.5);
    ui->labelCommercial->setTextFormat(Qt::RichText);
    ui->labelCommercial->setTextInteractionFlags(Qt::TextBrowserInteraction);
    ui->labelCommercial->setOpenExternalLinks(true);
    this->connect(ui->panelRecentProjects, SIGNAL(openingProject(QString)), this
        , SLOT(openRecentProject(QString)));

    this->translate();
}

PanelMainMenu::~PanelMainMenu()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelMainMenu::translate()
{
    ui->pushButtonNewProject->setText(RPM::translate(Translations::NEW_PROJECT)
        + RPM::DOT_DOT_DOT);
    ui->pushButtonOpenProject->setText(RPM::translate(Translations::OPEN_PROJECT
        ) + RPM::DOT_DOT_DOT);
    ui->labelCommercial->setText("<a href=\"https://store.steampowered.com/app/1118650/RPG_Paper_Maker__Commercial_edition/\" style=\"color: tomato;\">Buy the commercial edition here!</a> Or...");
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelMainMenu::on_pushButtonNewProject_clicked()
{
    reinterpret_cast<MainWindow *>(parent()->parent())->newProject();
}

// -------------------------------------------------------

void PanelMainMenu::on_pushButtonOpenProject_clicked()
{
    reinterpret_cast<MainWindow *>(parent()->parent())->openExistingProject();
}

// -------------------------------------------------------

void PanelMainMenu::openRecentProject(QString path)
{
    emit openingProject(path);
}

// -------------------------------------------------------

void PanelMainMenu::on_widgetPatreon_clicked()
{
    QDesktopServices::openUrl(QUrl("https://www.patreon.com/bePatron?u=14575421"));
}
