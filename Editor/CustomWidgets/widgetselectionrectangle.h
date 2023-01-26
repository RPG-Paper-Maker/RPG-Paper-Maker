/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
        int m_initX;
        int m_initY;
};

#endif // WIDGETSELECTIONRECTANGLE_H
