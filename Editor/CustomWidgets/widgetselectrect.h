/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETSELECTRECT_H
#define WIDGETSELECTRECT_H

#include "widgetshowpicture.h"

// -------------------------------------------------------
//
//  CLASS WidgetSelectRect
//
//  Widget used for choosing a rect on a picture (ex: windowSkins).
//
// -------------------------------------------------------

namespace Ui {
class WidgetSelectRect;
}

class WidgetSelectRect : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetSelectRect(QWidget *parent = nullptr);
    ~WidgetSelectRect();
    void setWidgetShowPicture(WidgetShowPicture *w);
    void setRect(QRectF *rect);

    void updateLabel(QString label);

    virtual void enterEvent(QEvent *);

private:
    Ui::WidgetSelectRect *ui;
    WidgetShowPicture *m_widgetShowPicture;
    QRectF *m_rect;
    bool m_dialogOpened;
    bool m_selecting;

    void translate();

public slots:
    void on_pushButtonEnter_clicked();
    void on_pushButtonSelect_clicked();
    void on_rectDrawn();

signals:
    void selecting();
};

#endif // WIDGETSELECTRECT_H
