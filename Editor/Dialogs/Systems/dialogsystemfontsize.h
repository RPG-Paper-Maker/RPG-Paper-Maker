/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMFONTSIZE_H
#define DIALOGSYSTEMFONTSIZE_H

#include <QDialog>
#include "systemfontsize.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemFontSize
//
//  A dialog used for editing the model of a system font size.
//
// -------------------------------------------------------


namespace Ui {
class DialogSystemFontSize;
}

class DialogSystemFontSize : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemFontSize(SystemFontSize &fontSize, QWidget *parent =
        nullptr);
    ~DialogSystemFontSize();

protected:
    SystemFontSize &m_fontSize;

private:
    Ui::DialogSystemFontSize *ui;

    void initialize();
    void translate();
};

#endif // DIALOGSYSTEMFONTSIZE_H
