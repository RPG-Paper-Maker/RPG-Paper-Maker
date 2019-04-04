/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
