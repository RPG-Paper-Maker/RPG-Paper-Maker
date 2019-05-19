/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
