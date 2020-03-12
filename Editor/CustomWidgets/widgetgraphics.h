/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETGRAPHICS_H
#define WIDGETGRAPHICS_H

#include <QFrame>
#include <QPainter>
#include "systemstate.h"
#include "systempicture.h"

// -------------------------------------------------------
//
//  CLASS WidgetGraphics
//
//  A widget graphics of an object.
//
// -------------------------------------------------------

class WidgetGraphics : public QFrame
{
    Q_OBJECT
public:
    explicit WidgetGraphics(QWidget *parent = nullptr);
    void setState(SystemState *s);

    SystemPicture* getPicture(bool check = false);
    PictureKind getPictureKind(bool check = false);

protected:
    SystemState* m_state;
    bool m_selected;
    int m_borderOffset;

    virtual void mousePressEvent(QMouseEvent*);
    virtual void mouseDoubleClickEvent(QMouseEvent*);
    virtual void paintEvent(QPaintEvent*event);
};

#endif // WIDGETGRAPHICS_H
