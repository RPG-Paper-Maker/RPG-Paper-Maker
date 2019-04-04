/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

private slots:
    void on_lineEditColor_textChanged(const QString &text);
    void on_pushButtonColor_clicked(bool = false);
};

#endif // DIALOGSYSTEMCOLOR_H
