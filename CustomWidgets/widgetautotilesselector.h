/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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
