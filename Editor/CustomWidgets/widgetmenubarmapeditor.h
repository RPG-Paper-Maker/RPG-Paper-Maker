/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

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
    static const QColor COLOR_BACKGROUND_SELECTED;
    static const QColor COLOR_BACKGROUND_RIGHT_SELECTED;
    static const char* PROPERTY_SELECTION;
    explicit WidgetMenuBarMapEditor(QWidget *parent = nullptr, bool selection =
        true);
    ~WidgetMenuBarMapEditor();
    MapEditorSelectionKind selectionKind() const;
    MapEditorSubSelectionKind subSelectionKind();
    bool squareOn(bool detection = false) const;
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
    QAction * actionSquare() const;
    QAction * actionPixel() const;
    QAction * actionTranslate() const;
    QAction * actionRotate() const;
    QAction * actionScale() const;
    QAction * actionPencil() const;
    QAction * actionRectangle() const;
    QAction * actionPin() const;
    QAction * actionLayerNone() const;
    QAction * actionLayerOn() const;

    WidgetMenuBarMapEditor * getBarRight();
    bool containsMenu() const;
    int countSelectionKind() const;
    void initializeRightMenu(bool detection = false);
    void toggleSelection();
    void updateSelection(QAction *action);
    void updateMenutext(QMenu *menu, QAction *action);
    void updateSubSelection(QMenu *menu, QAction *menuAction, QAction *action);
    void updateRight(QAction *action);
    void forceSquare();
    void selectSquarePixel(bool square);
    void forceNoneLayer();
    void forceNoRotation();
    void forcePencil();
    void forceRight(int i);
    void enableAllRight();
    void setDetection();
    void translate();

private:
    Ui::WidgetMenuBarMapEditor *ui;
    MapEditorSelectionKind m_selectionKind;
    bool m_selection;
    QAction *m_actionHeight;
    QAction *m_actionHeightPlus;
    QAction *m_actionSquare;
    QAction *m_actionPixel;
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

private slots:
    void on_menuFloors_triggered(QAction *action);
    void on_menuFace_Sprite_triggered(QAction *action);
    void on_menuMountain_triggered(QAction *action);
    void on_menu3D_object_triggered(QAction *action);
    void on_menuEvents_triggered(QAction *action);
    void on_actionTranslateTriggered(bool);
    void on_actionRotateTriggered(bool);
    void on_actionScaleTriggered(bool);
    void on_actionDrawTriggered(bool);

signals:
    void selectionChanged();
    void squarePixelSelected(bool square);
};

#endif // WIDGETMENUBARMAPEDITOR_H
