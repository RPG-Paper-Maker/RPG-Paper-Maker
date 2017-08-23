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
