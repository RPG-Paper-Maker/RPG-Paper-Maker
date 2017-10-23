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

#include <QPainter>
#include "widgetmenubarmapeditor.h"
#include "ui_widgetmenubarmapeditor.h"

QColor WidgetMenuBarMapEditor::colorBackgroundSelected(95,158,160);

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetMenuBarMapEditor::WidgetMenuBarMapEditor(QWidget *parent,
                                               bool selection) :
    QMenuBar(parent),
    ui(new Ui::WidgetMenuBarMapEditor),
    m_selectionKind(MapEditorSelectionKind::Land),
    m_selection(selection),
    m_menuPencil(nullptr),
    m_menuLayer(nullptr)
{
    ui->setupUi(this);

    if (m_selection){
        for (int i = 0; i < this->actions().size(); i++)
            actions().at(i)->setProperty("selection",false);
        actions().at((int) m_selectionKind)->setProperty("selection",true);
    }
}

WidgetMenuBarMapEditor::~WidgetMenuBarMapEditor()
{
    if (this->cornerWidget() != nullptr)
        delete this->cornerWidget();
    if (m_menuPencil != nullptr) {
        delete m_menuPencil;
        delete m_actionPencil;
        delete m_actionRectangle;
        delete m_actionPin;
    }
    if (m_menuLayer != nullptr) {
        delete m_menuLayer;
        delete m_actionLayerNone;
        delete m_actionLayerOn;
    }

    delete ui;
}

MapEditorSelectionKind WidgetMenuBarMapEditor::selectionKind() const {
    return m_selectionKind;
}

MapEditorSubSelectionKind WidgetMenuBarMapEditor::subSelectionKind() const {
    QString text = this->actions().at((int) m_selectionKind)->text();

    if (text == ui->actionFloors->text())
        return MapEditorSubSelectionKind::Floors;
    else if (text == ui->actionFace_Sprite->text())
        return MapEditorSubSelectionKind::SpritesFace;
    else if (text == ui->actionFix_Sprite->text())
        return MapEditorSubSelectionKind::SpritesFix;
    else if (text == ui->actionDouble_Sprite->text())
        return MapEditorSubSelectionKind::SpritesDouble;
    else if (text == ui->actionQuadra_Sprite->text())
        return MapEditorSubSelectionKind::SpritesQuadra;
    else if (text == ui->actionWall_Sprite->text())
        return MapEditorSubSelectionKind::SpritesWall;
    else if (text == ui->actionEvents->text())
        return MapEditorSubSelectionKind::Object;

    return MapEditorSubSelectionKind::None;
}

DrawKind WidgetMenuBarMapEditor::drawKind() const{
    WidgetMenuBarMapEditor* bar =
            (WidgetMenuBarMapEditor*) this->cornerWidget();
    QAction* action = bar->actions().at((int) MapEditorModesKind::Draw);
    QString text = action->text();
    QList<QAction*> list = action->menu()->actions();

    if (text == list.at((int) DrawKind::Pencil)->text())
        return DrawKind::Pencil;
    else if (text == list.at((int) DrawKind::Rectangle)->text())
        return DrawKind::Rectangle;
    else if (text == list.at((int) DrawKind::Pin)->text())
        return DrawKind::Pin;

    return DrawKind::Pencil;
}

bool WidgetMenuBarMapEditor::layerOn() const {
    WidgetMenuBarMapEditor* bar =
            (WidgetMenuBarMapEditor*) this->cornerWidget();
    QAction* action = bar->actions().at((int) MapEditorModesKind::Layer);
    QString text = action->text();
    QList<QAction*> list = action->menu()->actions();

    return text == list.at(1)->text();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool WidgetMenuBarMapEditor::containsMenu() const{
    QAction* action = this->activeAction();
    if (action != nullptr){
        return action->menu()->rect().contains(
                    action->menu()->mapFromGlobal(QCursor::pos()));
    }

    return false;
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::initializeRightMenu(){
    WidgetMenuBarMapEditor *bar = new WidgetMenuBarMapEditor(this, false);
    bar->clear();

    // Draw mode
    m_menuPencil = new QMenu("Pencil");
    m_menuPencil->setIcon(QIcon(":/icons/Ressources/pencil.png"));
    m_actionPencil = new QAction(QIcon(":/icons/Ressources/pencil.png"),
                                 "Pencil");
    m_menuPencil->addAction(m_actionPencil);
    m_actionRectangle = new QAction(QIcon(":/icons/Ressources/rectangle.png"),
                         "Rectangle");
    m_actionRectangle->setEnabled(false);
    m_menuPencil->addAction(m_actionRectangle);
    m_actionPin = new QAction(QIcon(":/icons/Ressources/pin.png"),
                              "Pin of paint");
    m_menuPencil->addAction(m_actionPin);
    connect(m_menuPencil, SIGNAL(triggered(QAction*)),
            this, SLOT(on_menuDrawTriggered(QAction*)));
    bar->addMenu(m_menuPencil);

    // Layer
    m_menuLayer = new QMenu("Normal");
    m_menuLayer->setIcon(QIcon(":/icons/Ressources/layer_none.png"));
    m_actionLayerNone = new QAction(QIcon(":/icons/Ressources/layer_none.png"),
                                    "Normal");
    m_menuLayer->addAction(m_actionLayerNone);
    m_actionLayerOn = new QAction(QIcon(":/icons/Ressources/layer_on.png"),
                         "On top");
    m_menuLayer->addAction(m_actionLayerOn);
    connect(m_menuLayer, SIGNAL(triggered(QAction*)),
            this, SLOT(on_menuLayerTriggered(QAction*)));
    bar->addMenu(m_menuLayer);

    this->setCornerWidget(bar);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::updateSelection(QAction* action){

    // Deselect previous selected action
    actions().at((int) m_selectionKind)->setProperty("selection",false);

    // Select the pressed action
    m_selectionKind =
         static_cast<MapEditorSelectionKind>(actions().indexOf(action));

    action->setProperty("selection",true);

    // Repaint
    this->repaint();
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::updateMenutext(QMenu* menu, QAction *action){
    menu->setTitle(action->text());
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::updateSubSelection(QMenu *menu,
                                                QAction* menuAction,
                                                QAction* action)
{
    updateMenutext(menu, action);
    updateSelection(menuAction);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::updateMode(MapEditorModesKind mode,
                                        QAction* action)
{
    WidgetMenuBarMapEditor* bar =
            (WidgetMenuBarMapEditor*) this->cornerWidget();
    QMenu* menu = bar->actions().at((int) mode)->menu();
    updateMenutext(menu, action);
    menu->setIcon(action->icon());
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetMenuBarMapEditor::mouseMoveEvent(QMouseEvent* event){
    this->setActiveAction(this->actionAt(event->pos()));
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::mousePressEvent(QMouseEvent* event){

    if (m_selection){
        QAction* action = this->actionAt(event->pos());
        if (action != nullptr) {
            updateSelection(action);
            emit selectionChanged();
        }

        QMenuBar::mousePressEvent(event);
    }
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::paintEvent(QPaintEvent *e){
    QPainter p(this);
    QRegion emptyArea(rect());

    // Draw the items
    for (int i = 0; i < actions().size(); ++i) {
        QAction *action = actions().at(i);
        QRect adjustedActionRect = this->actionGeometry(action);

        // Fill by the magic color the selected item
        if (action->property("selection") == true)
            p.fillRect(adjustedActionRect, colorBackgroundSelected);

        // Draw all the other stuff (text, special background..)
        if (adjustedActionRect.isEmpty() || !action->isVisible())
            continue;
        if(!e->rect().intersects(adjustedActionRect))
            continue;
        emptyArea -= adjustedActionRect;

        QStyleOptionMenuItem opt;
        initStyleOption(&opt, action);
        opt.rect = adjustedActionRect;

        style()->drawControl(QStyle::CE_MenuBarItem, &opt, &p, this);
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_menuFloors_triggered(QAction* action){
    updateSubSelection(ui->menuFloors,
                       this->actions().at((int)MapEditorSelectionKind::Land),
                       action);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_menuFace_Sprite_triggered(QAction* action){
    updateSubSelection(ui->menuFace_Sprite,
                       this->actions().at((int)MapEditorSelectionKind::Sprites),
                       action);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_menuDrawTriggered(QAction* action){
    updateMode(MapEditorModesKind::Draw, action);
}

// -------------------------------------------------------

void WidgetMenuBarMapEditor::on_menuLayerTriggered(QAction* action){
    updateMode(MapEditorModesKind::Layer, action);
}
