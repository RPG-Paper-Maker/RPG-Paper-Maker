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
#include <QDebug>
#include "widgetmenubarmapeditor.h"
#include "ui_widgetmenubarmapeditor.h"

QColor WidgetMenuBarMapEditor::colorBackgroundSelected(95,158,160);

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetMenuBarMapEditor::WidgetMenuBarMapEditor(QWidget *parent) :
    QMenuBar(parent),
    ui(new Ui::WidgetMenuBarMapEditor),
    m_selectionKind(MapEditorSelectionKind::Land)
{
    ui->setupUi(this);

    for (int i = 0; i < this->actions().size(); i++){
        actions().at(i)->setProperty("selection",false);
    }
    actions().at((int) m_selectionKind)->setProperty("selection",true);
}

WidgetMenuBarMapEditor::~WidgetMenuBarMapEditor()
{
    delete ui;
}

MapEditorSelectionKind WidgetMenuBarMapEditor::selectionKind() const {
    return m_selectionKind;
}

MapEditorSubSelectionKind WidgetMenuBarMapEditor::subSelectionKind() const {
    return m_subSelectionKind;
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
    QAction* action = this->actionAt(event->pos());
    if (action != nullptr){
        // Deselect previous selected action
        actions().at((int) m_selectionKind)->setProperty("selection",false);

        // Select the pressed action
        m_selectionKind = static_cast<MapEditorSelectionKind>(actions()
                                                              .indexOf(action));

        action->setProperty("selection",true);
    }

    // Repaint
    QMenuBar::mousePressEvent(event);
    this->repaint();
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

void WidgetMenuBarMapEditor::on_menuFloors_triggered(QAction*){

}
