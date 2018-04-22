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

#ifndef WIDGETTILESETPRATICABLE_H
#define WIDGETTILESETPRATICABLE_H

#include <QWidget>
#include "systempicture.h"
#include "collisionsquare.h"
#include "collisionresizekind.h"
#include "contextmenulist.h"

// -------------------------------------------------------
//
//  CLASS WidgetTilesetPraticable
//
//  Widget used for choosing a tileset praticable existing in the database.
//
// -------------------------------------------------------

class WidgetTilesetPraticable : public QWidget
{
    Q_OBJECT
public:
    explicit WidgetTilesetPraticable(QWidget *parent = 0);
    virtual ~WidgetTilesetPraticable();
    const static int OFFSET;
    void setSquares(QHash<QPoint, CollisionSquare*>* squares);
    void updateImage(SystemPicture* picture, PictureKind kind);
    void updateZoom(float zoom);
    void updateImageSize();

protected:
    QImage m_image;
    QHash<QPoint, CollisionSquare*>* m_squares;
    QPoint m_selectedPoint;
    QPoint m_hoveredPoint;
    CollisionResizeKind m_resizeKind;
    CollisionSquare* m_selectedCollision;
    ContextMenuList* m_contextMenu;
    bool m_isCreating;
    float m_zoom;
    QImage m_baseImage;

    void getMousePoint(QPoint& point, QMouseEvent *event);
    void getRect(QRect& rect, const QPoint& localPoint,
                 CollisionSquare *collision);
    void getBasicRect(QRect& rect, const QPoint& localPoint);
    bool isMouseOn(QRect& rect, QPoint point, QPoint& mousePoint) const;
    bool isMouseOnLeft(QRect& rect, QPoint& mousePoint) const;
    bool isMouseOnRight(QRect& rect, QPoint& mousePoint) const;
    bool isMouseOnTop(QRect& rect, QPoint &mousePoint) const;
    bool isMouseOnBot(QRect& rect, QPoint &mousePoint) const;
    void updateCursor(QRect &rect, QPoint& mousePoint);
    void updateRect(QRect &rect, QPoint& mousePoint, QPoint &localPoint,
                    CollisionSquare *collision);
    void updateRectLeft(QRect &rect, QPoint& mousePoint, QRect& rectBasic);
    void updateRectRight(QRect &rect, QPoint& mousePoint, QRect& rectBasic);
    void updateRectTop(QRect &rect, QPoint& mousePoint, QRect& rectBasic);
    void updateRectBot(QRect &rect, QPoint& mousePoint, QRect& rectBasic);
    int getRectValue(int mousePos, int left, int right);
    void drawCollision(QPainter &painter, const QPoint& localPoint,
                       CollisionSquare* collision, const QColor& color,
                       bool outline = true);
    int getOffset(QRect& rect) const;
    void editCollision();
    void deleteCollision();
    float getSquareProportion() const;

    virtual void keyPressEvent(QKeyEvent *event);
    virtual void mousePressEvent(QMouseEvent *event);
    virtual void mouseMoveEvent(QMouseEvent *event);
    virtual void mouseReleaseEvent(QMouseEvent *);
    virtual void paintEvent(QPaintEvent *);

private slots:
    void showContextMenu(const QPoint & p);
    void contextEdit();
    void contextDelete();
};

#endif // WIDGETTILESETPRATICABLE_H
