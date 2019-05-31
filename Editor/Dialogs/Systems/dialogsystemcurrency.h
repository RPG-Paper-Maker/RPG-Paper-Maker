/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
};

#endif // DIALOGSYSTEMCURRENCY_H
