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

#ifndef WIDGETTILESETDIRECTION_H
#define WIDGETTILESETDIRECTION_H

#include <QWidget>
#include "collisionsquare.h"
#include "systempicture.h"

// -------------------------------------------------------
//
//  CLASS WidgetTilesetDirection
//
//  Widget used for choosing a tileset direction existing in the database.
//
// -------------------------------------------------------

class WidgetTilesetDirection : public QWidget
{
    Q_OBJECT
public:
    explicit WidgetTilesetDirection(QWidget *parent = nullptr);
    void setSquares(QHash<QPoint, CollisionSquare*>* squares);
    void updateImage(SystemPicture* picture, PictureKind kind);
    void updateImageSpecial(QImage& editedImage);
    void getMousePoint(QPoint& point, QMouseEvent *event);
    void getCenterRect(QRect& rect, int i, int j);
    bool isInsideRect(int dx, int dy, int x, int y, QPoint& mousePoint) const;
    void updateHovered(QPoint& hovered, QPoint& point, int dx, int dy, int x,
                       int y, QPoint& mousePoint);
    CollisionSquare* activateHovered(QPoint& hovered);
    void checkStillExisting(QPoint& hovered, CollisionSquare* collision);
    void drawArrow(QPainter& painter, QPoint &hoveredPoint, bool arrow,
                   int angle, int dx, int dy, int i, int j);

protected:
    QImage m_image;
    QImage m_imageArrow;
    QImage m_imageArrowHover;
    QHash<QPoint, CollisionSquare*>* m_squares;
    QPoint m_hoveredPoint;
    QPoint m_hoveredLeft;
    QPoint m_hoveredRight;
    QPoint m_hoveredTop;
    QPoint m_hoveredBot;

    void updateImageGeneral();

    virtual void mousePressEvent(QMouseEvent *);
    virtual void mouseMoveEvent(QMouseEvent *event);
    virtual void paintEvent(QPaintEvent *);
};

#endif // WIDGETTILESETDIRECTION_H
