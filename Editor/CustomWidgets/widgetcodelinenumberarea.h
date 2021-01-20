/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETCODELINENUMBERAREA_H
#define WIDGETCODELINENUMBERAREA_H

#include "widgetcode.h"

class WidgetCodeLineNumberArea : public QWidget
{
public:
    WidgetCodeLineNumberArea(WidgetCode *editor);
    QSize sizeHint() const override;

protected:
    void paintEvent(QPaintEvent *event) override;
private:
    WidgetCode *m_widgetCode;
};

#endif // WIDGETCODELINENUMBERAREA_H
