/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETAUTOTILESSELECTOR_H
#define WIDGETAUTOTILESSELECTOR_H

#include <QWidget>
#include "systemautotile.h"
#include "widgetselectionrectangle.h"

// -------------------------------------------------------
//
//  CLASS WidgetAutotilesSelector
//
//  A widget representing autotiles selector.
//
// -------------------------------------------------------

class WidgetAutotilesSelector : public QWidget
{
    Q_OBJECT
public:
    explicit WidgetAutotilesSelector(QWidget *parent = nullptr);
    ~WidgetAutotilesSelector();

    void currentTexture(QRect &rect) const;
    void setImage(SystemAutotile *autotile);
    int getPreviewWidth() const;
    int getPreviewHeight() const;
    int getPreviewColumns() const;
    int getPreviewRows() const;

protected:
    QImage m_texture;
    WidgetSelectionRectangle *m_selectionRectangle;

    void makeSelection(int x, int y, float zoom = 1.0f);
    int getPreviewSize(int size) const;

    virtual void mousePressEvent(QMouseEvent *event);
    virtual void paintEvent(QPaintEvent *);
};

#endif // WIDGETAUTOTILESSELECTOR_H
