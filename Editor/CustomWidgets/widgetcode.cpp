/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QPainter>
#include <QTextBlock>
#include "widgetcode.h"
#include "widgetcodelinenumberarea.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetCode::WidgetCode(QWidget *parent) :
    QPlainTextEdit(parent)
{
    lineNumberArea = new WidgetCodeLineNumberArea(this);
    connect(this, &WidgetCode::blockCountChanged, this, &WidgetCode
        ::updateLineNumberAreaWidth);
    connect(this, &WidgetCode::updateRequest, this, &WidgetCode
        ::updateLineNumberArea);
    connect(this, &WidgetCode::cursorPositionChanged, this, &WidgetCode
        ::highlightCurrentLine);
    updateLineNumberAreaWidth(0);
    highlightCurrentLine();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

int WidgetCode::lineNumberAreaWidth()
{
    return 3 + fontMetrics().width(QLatin1Char('9')) * 5;
}

// -------------------------------------------------------

void WidgetCode::updateLineNumberAreaWidth(int)
{
    setViewportMargins(lineNumberAreaWidth(), 0, 0, 0);
}

// -------------------------------------------------------

void WidgetCode::updateLineNumberArea(const QRect &rect, int dy)
{
    if (dy)
        lineNumberArea->scroll(0, dy);
    else
        lineNumberArea->update(0, rect.y(), lineNumberArea->width(), rect.height());
    if (rect.contains(viewport()->rect()))
        updateLineNumberAreaWidth(0);
}

// -------------------------------------------------------

void WidgetCode::resizeEvent(QResizeEvent *e)
{
    QPlainTextEdit::resizeEvent(e);
    QRect cr = contentsRect();
    lineNumberArea->setGeometry(QRect(cr.left(), cr.top(), lineNumberAreaWidth()
        , cr.height()));
}

// -------------------------------------------------------

void WidgetCode::highlightCurrentLine()
{
    QList<QTextEdit::ExtraSelection> extraSelections;
    if (!isReadOnly())
    {
        QTextEdit::ExtraSelection selection;
        QColor lineColor = RPM::COLOR_MENU_SELECTION_BLUE;
        lineColor.setAlpha(30);
        selection.format.setBackground(lineColor);
        selection.format.setProperty(QTextFormat::FullWidthSelection, true);
        selection.cursor = textCursor();
        selection.cursor.clearSelection();
        extraSelections.append(selection);
    }
    setExtraSelections(extraSelections);
}

// -------------------------------------------------------

void WidgetCode::lineNumberAreaPaintEvent(QPaintEvent *event)
{
    QPainter painter(lineNumberArea);
    QColor lineColor = RPM::COLOR_MENU_SELECTION_BLUE;
    lineColor.setAlpha(50);
    painter.fillRect(event->rect(), lineColor);
    QTextBlock block = this->firstVisibleBlock();
    int blockNumber = block.blockNumber();
    int top = qRound(blockBoundingGeometry(block).translated(contentOffset())
        .top());
    int bottom = top + qRound(blockBoundingRect(block).height());
    while (block.isValid() && top <= event->rect().bottom())
    {
        if (block.isVisible() && bottom >= event->rect().top())
        {
            QString number = QString::number(blockNumber + 1);
            painter.setPen(Qt::white);
            painter.drawText(0, top, lineNumberArea->width(), fontMetrics()
                .height(), Qt::AlignRight, number);
        }
        block = block.next();
        top = bottom;
        bottom = top + qRound(blockBoundingRect(block).height());
        ++blockNumber;
    }
}
