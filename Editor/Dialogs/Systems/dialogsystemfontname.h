/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMFONTNAME_H
#define DIALOGSYSTEMFONTNAME_H

#include <QDialog>
#include "systemfontname.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemFontName
//
//  A dialog used for editing the model of a system font name.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemFontName;
}

class DialogSystemFontName : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemFontName(SystemFontName &fontName, QWidget *parent =
        nullptr);
    ~DialogSystemFontName();

protected:
    SystemFontName &m_fontName;

private:
    Ui::DialogSystemFontName *ui;

    void initialize();
    void translate();

public slots:
    void on_lineEditName_textChanged(const QString &text);
};

#endif // DIALOGSYSTEMFONTNAME_H
