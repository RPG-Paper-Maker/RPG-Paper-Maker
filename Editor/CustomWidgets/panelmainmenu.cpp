/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "mainwindow.h"
#include "panelmainmenu.h"
#include "ui_panelmainmenu.h"

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

    connect(ui->panelRecentProjects, SIGNAL(openingProject(QString)), this,
        SLOT(openRecentProject(QString)));
}

PanelMainMenu::~PanelMainMenu()
{
    delete ui;
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelMainMenu::on_pushButtonNewProject_clicked() {
    reinterpret_cast<MainWindow *>(parent()->parent())->newProject();
}

// -------------------------------------------------------

void PanelMainMenu::on_pushButtonOpenProject_clicked() {
    reinterpret_cast<MainWindow *>(parent()->parent())->openExistingProject();
}

// -------------------------------------------------------

void PanelMainMenu::openRecentProject(QString path) {
    emit openingProject(path);
}
