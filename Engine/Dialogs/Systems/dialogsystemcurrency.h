/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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
    explicit DialogSystemCurrency(SystemCurrency &currency,
                                  QWidget *parent = 0);
    ~DialogSystemCurrency();
    SystemCurrency& currency() const;

private:
    Ui::DialogSystemCurrency *ui;
    SystemCurrency& m_currency;
    void initialize();
};

#endif // DIALOGSYSTEMCURRENCY_H
