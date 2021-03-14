/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMLANG_H
#define DIALOGSYSTEMLANG_H

#include <QDialog>
#include "systemlang.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemLang
//
//  A dialog used for editing the model of a system lang.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemLang;
}

class DialogSystemLang : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemLang(SystemLang& model, QWidget *parent = 0);
    ~DialogSystemLang();

private:
    Ui::DialogSystemLang *ui;
    SystemLang& m_model;

    void initialize();
    void translate();

public slots:
    void on_lineEditAll_textEdited(const QString &text);
};

#endif // DIALOGSYSTEMLANG_H
