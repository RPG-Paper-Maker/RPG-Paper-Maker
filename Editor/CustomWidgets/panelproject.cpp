/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    ui->widgetMenuBar->initializeRightMenu();
}

PanelProject::PanelProject(QWidget *parent, Project *p) :
    PanelProject(parent)
{
    m_project = p;
    ui->treeViewLocalMaps->initializeWidgetMapEditor(ui->openGLWidget);
    ui->treeViewLocalMaps->initializeWidgetMenuBar(ui->widgetMenuBar);
    ui->treeViewLocalMaps->initializePanelTextures(ui->panelTextures);
    ui->treeViewLocalMaps->initializeProject(m_project);
    ui->treeViewLocalMaps->initializeModel(m_project->treeMapDatas()->model());

    connect(ui->widgetMenuBar, SIGNAL(selectionChanged()), this, SLOT(
        on_menuBarPressed()));
    connect(ui->widgetMenuBar, SIGNAL(triggered(QAction *)), this, SLOT(
        on_menuBarPressed()));
    connect(ui->splitter, SIGNAL(splitterMoved(int, int)), ui->panelTextures,
        SLOT(onSplitterMoved(int, int)));
    connect(ui->splitter_2, SIGNAL(splitterMoved(int, int)), ui->panelTextures,
        SLOT(onSplitterMoved(int, int)));

    ui->panelTextures->initializeWidgetTreeLocalMaps(ui->treeViewLocalMaps);
}

PanelProject::~PanelProject()
{
    delete m_timerUpdate;
    delete ui;
}

Project* PanelProject::project() const {
    return m_project;
}

WidgetMapEditor * PanelProject::widgetMapEditor() const {
    return ui->openGLWidget;
}

WidgetTreeLocalMaps * PanelProject::widgetTreeLocalMaps() const {
    return ui->treeViewLocalMaps;
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelProject::updateMenu() {
    WidgetMenuBarMapEditor *bar;

    bar = ui->widgetMenuBar;
    if (!bar->rect().contains(bar->mapFromGlobal(QCursor::pos())) && !bar
        ->containsMenu())
    {
        if (bar->activeAction() != nullptr && bar->activeAction()->menu() !=
            nullptr)
        {
            bar->activeAction()->menu()->hide();
        }
    }
    bar = reinterpret_cast<WidgetMenuBarMapEditor *>(ui->widgetMenuBar
        ->cornerWidget());
    if (!bar->rect().contains(bar->mapFromGlobal(QCursor::pos())) && !bar
        ->containsMenu())
    {
        if (bar->activeAction() != nullptr && bar->activeAction()->menu() !=
            nullptr)
        {
            bar->activeAction()->menu()->hide();
        }
    }
}

// -------------------------------------------------------

void PanelProject::on_menuBarPressed() {
    SystemTileset *tileset = m_project->currentMap()->mapProperties()->tileset();

    // Remove preview elements stuff
    ui->openGLWidget->removePreviewElements();

    // Update panel textures
    switch (ui->widgetMenuBar->subSelectionKind()) {
    case MapEditorSubSelectionKind::Autotiles:
        ui->panelTextures->showAutotiles(tileset);
        break;
    case MapEditorSubSelectionKind::SpritesWall:
        ui->panelTextures->showSpriteWalls(tileset);
        break;
    case MapEditorSubSelectionKind::Mountains:
        ui->panelTextures->showMountains(tileset);
        break;
    case MapEditorSubSelectionKind::Object3D:
        ui->panelTextures->showObjects3D(tileset);
        break;
    default:
        ui->panelTextures->showTileset();
        ui->panelTextures->setTilesetImage(tileset->picture()->getPath(
            PictureKind::Tilesets));
        break;
    }
}
