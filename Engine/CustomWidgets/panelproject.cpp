/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "panelproject.h"
#include "ui_panelproject.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelProject::PanelProject(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelProject),
    m_timerUpdate(new QTimer)
{
    ui->setupUi(this);

    // Set default proportion of splitters
    QList<int> sizesVertical;
    sizesVertical << 100 << 500;
    ui->splitter_2->setSizes(sizesVertical);
    QList<int> sizesHorizontal;
    sizesHorizontal << 250 << 200;
    ui->splitter->setSizes(sizesHorizontal);
    ui->openGLWidget->setMenuBar(ui->widgetMenuBar);
    ui->openGLWidget->setPanelTextures(ui->panelTextures);

    // Timer
    m_timerUpdate->start(0);
    connect(m_timerUpdate, SIGNAL(timeout()), this, SLOT(updateMenu()));

    // Menu bar
    initializeRightMenu();
}

PanelProject::PanelProject(QWidget *parent, Project* p) :
    PanelProject(parent)
{
    m_project = p;
    ui->treeViewLocalMaps->initializeWidgetMapEditor(ui->openGLWidget);
    ui->treeViewLocalMaps->initializeWidgetMenuBar(ui->widgetMenuBar);
    ui->treeViewLocalMaps->initializePanelTextures(ui->panelTextures);
    ui->treeViewLocalMaps->initializeProject(m_project);
    ui->treeViewLocalMaps->initializeModel(m_project->treeMapDatas()->model());
}

PanelProject::~PanelProject()
{
    delete m_timerUpdate;
    delete ui;
}

Project* PanelProject::project() const { return m_project; }

WidgetMapEditor* PanelProject::widgetMapEditor() const{
    return ui->openGLWidget;
}

WidgetTreeLocalMaps* PanelProject::widgetTreeLocalMaps() const{
    return ui->treeViewLocalMaps;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelProject::initializeRightMenu(){
    WidgetMenuBarMapEditor *bar = new WidgetMenuBarMapEditor(ui->widgetMenuBar,
                                                             false);
    QMenu* menu;
    QAction* action;
    bar->clear();

    menu = new QMenu("Pencil");
    menu->setIcon(QIcon(":/icons/Ressources/pencil.png"));
    action = new QAction(QIcon(":/icons/Ressources/pencil.png"), "Pencil");
    menu->addAction(action);
    action = new QAction(QIcon(":/icons/Ressources/pin.png"), "Pin of paint");
    menu->addAction(action);
    bar->addMenu(menu);

    ui->widgetMenuBar->setCornerWidget(bar);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelProject::updateMenu(){

    WidgetMenuBarMapEditor* bar;

    bar = ui->widgetMenuBar;
    if (!bar->rect().contains(bar->mapFromGlobal(QCursor::pos())) &&
        !bar->containsMenu())
    {
        if (bar->activeAction() != nullptr)
            bar->activeAction()->menu()->hide();
    }
    bar = (WidgetMenuBarMapEditor*) ui->widgetMenuBar->cornerWidget();
    if (!bar->rect().contains(bar->mapFromGlobal(QCursor::pos())) &&
        !bar->containsMenu())
    {
        if (bar->activeAction() != nullptr)
            bar->activeAction()->menu()->hide();
    }
}
