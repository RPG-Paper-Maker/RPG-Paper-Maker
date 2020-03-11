/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMCURRENCY_H
#define DIALOGSYSTEMCURRENCY_H

#include <QDialog>
#include "systemcurrency.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemCurrency
//
//  A dialog used for editing the model of a system currency.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemCurrency;
}

class DialogSystemCurrency : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemCurrency(SystemCurrency &currency, QWidget *parent =
        nullptr);
    ~DialogSystemCurrency();

private:
    Ui::DialogSystemCurrency *ui;
    SystemCurrency& m_currency;

    void initialize();
    void translate();
};

#endif // DIALOGSYSTEMCURRENCY_H
