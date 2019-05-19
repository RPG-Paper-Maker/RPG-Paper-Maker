/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    void updateImage(SystemPicture* picture, PictureKind kind);
    void updateImageSpecial(QImage& editedImage, SystemPicture *picture,
        PictureKind kind);
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
    int m_pictureID;
    PictureKind m_kind;
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
