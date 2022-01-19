/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETSHOWPICTURE_H
#define WIDGETSHOWPICTURE_H

#include <QWidget>
#include <QPainter>
#include "systempicture.h"

// -------------------------------------------------------
//
//  CLASS WidgetShowPicture
//
//  A widget that just shows a picture.
//
// -------------------------------------------------------

class WidgetShowPicture : public QWidget
{
    Q_OBJECT
public:
    explicit WidgetShowPicture(QWidget *parent = nullptr);
    void setActivateCoef(bool b);
    void setCover(bool b);
    void setCoef(float coef);
    void setRect(QRectF *rect);
    void setDrawBackground(bool b);
    void setRectSubImage(const QRectF &rect);

    void updatePicture(SystemPicture* picture);
    void updatePictureByName(QString path);
    void updatePictureSize();
    void activateCanDrawRect();
    bool isInsideImage(QPoint& pos) const;
    void updateToRectBefore();
    void updateSizePosition();

protected:
    QImage m_image;
    QImage m_baseImage;
    bool m_activateCoef;
    bool m_cover;
    float m_coef;
    QRectF* m_rect;
    QRectF m_rectBefore;
    QRectF m_rectSubImage;
    bool m_isSubImage;
    bool m_canDrawRect;
    bool m_firstPresure;
    int m_width;
    int m_height;
    bool m_drawBackgorund;

    virtual void paintEvent(QPaintEvent *);
    virtual void mouseMoveEvent(QMouseEvent *event);
    virtual void mouseReleaseEvent(QMouseEvent *);
    virtual void leaveEvent(QEvent *);

signals:
    void rectDrawn();
};

#endif // WIDGETSHOWPICTURE_H
