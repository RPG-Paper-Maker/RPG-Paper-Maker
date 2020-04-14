/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    static QColor colorBackgroundSelected;
    static QColor colorBackgroundRightSelected;

    explicit WidgetMenuBarMapEditor(QWidget *parent = nullptr, bool selection =
        true);
    ~WidgetMenuBarMapEditor();

    MapEditorSelectionKind selectionKind() const;
    MapEditorSubSelectionKind subSelectionKind();
    DrawKind drawKind();
    bool layerOn() const;
    QAction * actionFloors() const;
    QAction * actionAutotiles() const;
    QAction * actionFaceSprite() const;
    QAction * actionFixSprite() const;
    QAction * actionDoubleSprite() const;
    QAction * actionQuadraSprite() const;
    QAction * actionWallSprite() const;
    QAction * actionMountain() const;
    QAction * actionObject3D() const;
    QAction * actionEvents() const;
    QAction * actionTranslate() const;
    QAction * actionRotate() const;
    QAction * actionScale() const;
    QAction * actionPencil() const;
    QAction * actionRectangle() const;
    QAction * actionPin() const;
    QAction * actionLayerNone() const;
    QAction * actionLayerOn() const;

    bool containsMenu() const;
    void initializeRightMenu();
    void toggleSelection();
    int countSelectionKind() const;

    void translate();

private:
    Ui::WidgetMenuBarMapEditor *ui;
    MapEditorSelectionKind m_selectionKind;
    bool m_selection;
    QAction *m_actionHeight;
    QAction *m_actionHeightPlus;
    QAction *m_actionTranslate;
    QAction *m_actionRotate;
    QAction *m_actionScale;
    QAction *m_actionPencil;
    QAction *m_actionRectangle;
    QAction *m_actionPin;
    QAction *m_actionLayerNone;
    QAction *m_actionLayerOn;

protected:
    virtual void mouseMoveEvent(QMouseEvent *event);
    virtual void mousePressEvent(QMouseEvent *event);
    virtual void paintEvent(QPaintEvent *e);

    void updateSelection(QAction *action);
    void updateMenutext(QMenu *menu, QAction *action);
    void updateSubSelection(QMenu *menu, QAction *menuAction, QAction *action);
    void updateRight(QAction *action);
    void forceNoneLayer();
    void forceNoRotation();
    void forcePencil();
    void forceRight(int i);
    void enableAllRight();
    WidgetMenuBarMapEditor * getBarRight();

private slots:
    void on_menuFloors_triggered(QAction *action);
    void on_menuFace_Sprite_triggered(QAction *action);
    void on_menuMountain_triggered(QAction *action);
    void on_menu3D_object_triggered(QAction *action);
    void on_menuEvents_triggered(QAction *action);
    void on_actionRotateTriggered(bool);
    void on_actionDrawTriggered(bool);

signals:
    void selectionChanged();
};

#endif // WIDGETMENUBARMAPEDITOR_H
