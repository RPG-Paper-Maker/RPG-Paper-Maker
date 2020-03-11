/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMCOLOR_H
#define DIALOGSYSTEMCOLOR_H

#include <QDialog>
#include "systemcolor.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemColor
//
//  A dialog used for editing the model of a system color.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemColor;
}

class DialogSystemColor : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemColor(SystemColor& color, QWidget *parent = nullptr);
    ~DialogSystemColor();

    SystemColor& color() const;

    void setBackgroundColor(QColor& color);

private:
    Ui::DialogSystemColor *ui;
    SystemColor& m_color;

    void initialize();
    void translate();

private slots:
    void on_lineEditColor_textChanged(const QString &text);
    void on_pushButtonColor_clicked(bool = false);
};

#endif // DIALOGSYSTEMCOLOR_H
