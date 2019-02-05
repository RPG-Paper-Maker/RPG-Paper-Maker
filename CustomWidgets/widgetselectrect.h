/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

public slots:
    void on_pushButtonEnter_clicked();
    void on_pushButtonSelect_clicked();
    void on_rectDrawn();

signals:
    void selecting();
};

#endif // WIDGETSELECTRECT_H
