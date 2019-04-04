/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

    SystemPicture* getPicture();
    PictureKind getPictureKind();

protected:
    SystemState* m_state;
    bool m_selected;
    int m_borderOffset;

    void mousePressEvent(QMouseEvent*);
    void mouseDoubleClickEvent(QMouseEvent*);
    void paintEvent(QPaintEvent*event);
};

#endif // WIDGETGRAPHICS_H
