/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgetcodelinenumberarea.h"

WidgetCodeLineNumberArea::WidgetCodeLineNumberArea(WidgetCode *editor) :
    QWidget(editor),
    m_widgetCode(editor)
{

}

QSize WidgetCodeLineNumberArea::sizeHint() const
{
    return QSize(m_widgetCode->lineNumberAreaWidth(), 0);
}

void WidgetCodeLineNumberArea::paintEvent(QPaintEvent *event)
{
    m_widgetCode->lineNumberAreaPaintEvent(event);
}
