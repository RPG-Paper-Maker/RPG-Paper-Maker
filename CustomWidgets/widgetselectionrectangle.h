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

#ifndef WIDGETSELECTIONRECTANGLE_H
#define WIDGETSELECTIONRECTANGLE_H

#include <QWidget>
#include <QPainter>

// -------------------------------------------------------
//
//  CLASS WidgetSelectionRectangle
//
//  A widget representing a reactangle for selection (tileset selector, image..)
//
// -------------------------------------------------------

class WidgetSelectionRectangle  : public QWidget
{
    Q_OBJECT

    public:
        explicit WidgetSelectionRectangle(QWidget *parent = 0);
        ~WidgetSelectionRectangle();
        void setSquareWidth(int s);
        void setSquareHeight(int s);
        void getCoefRect(QRect &rect) const;
        void setRectangle(int x, int y, int width, int height);
        void setRealPosition();
        void makeFirstSelection(int x, int y, float zoom);
        void makeSelection(int x, int y, int w, int h, float zoom);
        void selectNone();
        void draw(QPainter& painter, float zoom = 1.0f);

    protected:
        static const int BORDER_SIZE;
        QImage m_textureCursor;
        QRect m_rect;
        int m_squareWidth;
        int m_squareHeight;
        int m_realX;
        int m_realY;

        void drawSquare(QPainter& painter, int x, int y, float zoom);
};

#endif // WIDGETSELECTIONRECTANGLE_H
