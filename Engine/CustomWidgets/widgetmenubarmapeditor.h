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

#ifndef WIDGETMENUBARMAPEDITOR_H
#define WIDGETMENUBARMAPEDITOR_H

#include <QMenuBar>
#include <QMouseEvent>
#include <QPaintEvent>
#include <QColor>
#include "mapeditorselectionkind.h"
#include "mapeditorsubselectionkind.h"
#include "drawkind.h"
#include "mapeditormodeskind.h"

// -------------------------------------------------------
//
//  CLASS WidgetMenuBarMapEditor
//
//  A widget drawing the menu bar for the map editor.
//
// -------------------------------------------------------

namespace Ui {
class WidgetMenuBarMapEditor;
}

class WidgetMenuBarMapEditor : public QMenuBar
{
    Q_OBJECT

public:
    explicit WidgetMenuBarMapEditor(QWidget *parent = 0, bool selection = true);
    ~WidgetMenuBarMapEditor();
    static QColor colorBackgroundSelected;
    static QColor colorBackgroundRightSelected;
    MapEditorSelectionKind selectionKind() const;
    MapEditorSubSelectionKind subSelectionKind() const;
    DrawKind drawKind() const;
    bool layerOn() const;
    bool containsMenu() const;
    void initializeRightMenu();

private:
    Ui::WidgetMenuBarMapEditor *ui;
    MapEditorSelectionKind m_selectionKind;
    bool m_selection;
    QAction* m_actionPencil;
    QAction* m_actionRectangle;
    QAction* m_actionPin;
    QAction* m_actionLayerNone;
    QAction* m_actionLayerOn;

protected:
    void mouseMoveEvent(QMouseEvent* event);
    void mousePressEvent(QMouseEvent* event);
    void paintEvent(QPaintEvent *e);

    void updateSelection(QAction* action);
    void updateMenutext(QMenu* menu, QAction *action);
    void updateSubSelection(QMenu* menu, QAction* menuAction, QAction *action);
    void updateRight(QAction* action);

private slots:
    void on_menuFloors_triggered(QAction* action);
    void on_menuFace_Sprite_triggered(QAction* action);

signals:
    void selectionChanged();
};

#endif // WIDGETMENUBARMAPEDITOR_H
