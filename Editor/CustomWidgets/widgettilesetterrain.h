/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETTILESETTERRAIN_H
#define WIDGETTILESETTERRAIN_H

#include <QWidget>
#include "systempicture.h"

class WidgetTilesetTerrain : public QWidget
{
    Q_OBJECT
public:
    explicit WidgetTilesetTerrain(QWidget *parent = nullptr);

    void updateImage(SystemPicture* picture, PictureKind kind);
    void updateImageSpecial(QImage& editedImage, SystemPicture *picture,
        PictureKind kind);
    void updateImageGeneral();
    void getMousePoint(QPoint& point, QMouseEvent *event);
    void getCenterRect(QRect& rect, int i, int j);
    bool isInsideRect(int dx, int dy, int x, int y, QPoint& mousePoint) const;
    void updateHovered(QPoint& hovered, QPoint& point, int dx, int dy, int x,
                       int y, QPoint& mousePoint);
    CollisionSquare* activateHovered(QPoint& hovered);
    void checkStillExisting(QPoint& hovered, CollisionSquare* collision);

protected:
    QImage m_image;
    int m_pictureID;
    PictureKind m_kind;

    virtual void mousePressEvent(QMouseEvent *event);
    virtual void paintEvent(QPaintEvent *);
};

#endif // WIDGETTILESETTERRAIN_H
