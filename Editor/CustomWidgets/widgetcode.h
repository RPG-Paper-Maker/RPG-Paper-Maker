/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETCODE_H
#define WIDGETCODE_H

#include <QPlainTextEdit>

// -------------------------------------------------------
//
//  CLASS WidgetCode
//
//  Widget used for editing code.
//
// -------------------------------------------------------

class WidgetCode : public QPlainTextEdit
{
    Q_OBJECT

public:
    WidgetCode(QWidget *parent = nullptr);

    void lineNumberAreaPaintEvent(QPaintEvent *event);
    int lineNumberAreaWidth();

protected:
    void resizeEvent(QResizeEvent *event) override;

private slots:
    void updateLineNumberAreaWidth(int newBlockCount);
    void highlightCurrentLine();
    void updateLineNumberArea(const QRect &rect, int dy);
    void onTextChanged();

private:
    QWidget *lineNumberArea;
};

#endif // WIDGETCODE_H
