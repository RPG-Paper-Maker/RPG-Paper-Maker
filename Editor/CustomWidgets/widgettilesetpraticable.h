/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    explicit WidgetTilesetPraticable(QWidget *parent = nullptr);
    virtual ~WidgetTilesetPraticable();
    const static int OFFSET;
    void updateImage(SystemPicture* picture, PictureKind kind);
    void updateImageSpecial(QImage& editedImage, SystemPicture* picture,
        PictureKind kind);
    void updateZoom(float zoom);
    void updateImageSize();

protected:
    QImage m_image;
    int m_pictureID;
    PictureKind m_kind;
    QPoint m_selectedPoint;
    QPoint m_hoveredPoint;
    CollisionResizeKind m_resizeKind;
    CollisionSquare* m_selectedCollision;
    ContextMenuList* m_contextMenu;
    bool m_isCreating;
    float m_zoom;
    QImage m_baseImage;
    QRectF m_fakeRect;
    bool m_firstResize;
    Qt::CursorShape m_lastCursorShape;

    void updateImageGeneral(SystemPicture* picture, PictureKind kind);
    void getMousePoint(QPoint& point, QMouseEvent *event);
    void getRectCollision(QRect& rect, const QPoint& localPoint,
                          CollisionSquare* collision);
    void getRect(QRect& rect, const QPoint& localPoint, QRectF& rectBefore);
    void getRectRepeatBot(QRect& rect) const;
    void getRectRepeatTop(QRect& rect) const;
    void getPointsRepeat(QHash<QPoint, CollisionSquare*>& list);
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
    bool canDraw(QPoint &mousePoint) const;
    void translate();

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
