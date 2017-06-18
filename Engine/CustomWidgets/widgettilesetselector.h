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

#ifndef WIDGETTILESETSELECTOR_H
#define WIDGETTILESETSELECTOR_H

#include <QWidget>
#include <QPainter>
#include <widgetselectionrectangle.h>

// -------------------------------------------------------
//
//  CLASS WidgetTilesetSelector
//
//  A widget representing tileset selector.
//
// -------------------------------------------------------

class WidgetTilesetSelector : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetTilesetSelector(QWidget *parent = 0);
    ~WidgetTilesetSelector();

protected:
    QImage m_textureTileset;
    WidgetSelectionRectangle* m_selectionRectangle;

    virtual void paintEvent(QPaintEvent *event);
};

#endif // WIDGETTILESETSELECTOR_H
