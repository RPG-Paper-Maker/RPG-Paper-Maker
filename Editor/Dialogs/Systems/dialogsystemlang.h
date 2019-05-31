/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
};

#endif // DIALOGSYSTEMLANG_H
